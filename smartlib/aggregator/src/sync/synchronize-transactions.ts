import { dbConnection } from "../config/db";
import { executePost } from "../htttp-client/http-client";
import { ApiRequest, ApiResponse } from "../htttp-client/model";
import {
  TransactionSyncResponse,
  TransactionSyncDto,
  TransactionStatusSyncDto,
  TransactionStatusSyncResponse,
  TransactionItemStatus,
  TransactionStatus,
} from "../model/library-sync";
import { arrayGroupinBy } from "../utils";

export const synchronizeTransactions = async (token: string) => {
  const data = await createNewTransactions(token).then(
    async (transactionsCreated) => {
      const transactionStatusesCreated = await createNewTransactionStatuses(
        token
      );

      return {
        transactionsCreated,
        transactionStatusesCreated,
      };
    }
  );

  console.log("New transactions synchronized " + data.transactionsCreated);

  console.log(
    "New Transaction Status/Item status synchronized " +
    data.transactionStatusesCreated
  );

  return data.transactionStatusesCreated + data.transactionsCreated;
};

async function createNewTransactionStatuses(token: string): Promise<number> {
  const transactionStatusDto = dbConnection
    .prepare(
      `select bts.id, bts.status, 
         bts.created_at as createdAt,
         bt.client_id as clientId, 
         bt.id AS transactionId 
       from book_transaction_status bts 
         join book_transactions bt 
         on bt.id=bts.transaction_id 
       where bts.is_synced=0 
       and bt.is_synced=1 
       order by bts.created_at asc limit 100`
    )
    .all()
    .map((status) => status as TransactionStatus);

  console.log("Transaction status to create " + transactionStatusDto.length);

  const transactionItemStatusDto = dbConnection
    .prepare(
      `select btis.id, btis.status,
        btis.created_at as createdAt, 
        bt.client_id as clientId, 
        bti.id as itemId
      from book_transaction_item_status btis 
        join book_transaction_items bti 
        on bti.id = btis.item_id 
        join book_transactions bt 
        on bt.id = bti.transaction_id 
      where btis.is_synced=0
      and bti.is_synced=1 
      order by btis.created_at asc limit 100`
    )
    .all()
    .map((status) => status as TransactionItemStatus);

  console.log(
    "Transaction item status to create " + transactionItemStatusDto.length
  );

  const clientTransactionStatuses = arrayGroupinBy(
    transactionStatusDto,
    "clientId"
  );

  const clientTransactionItemStatuses = arrayGroupinBy(
    transactionItemStatusDto,
    "clientId"
  );

  const clientTransactionStatusesKeys = Object.keys(clientTransactionStatuses);

  const clientTransactionItemStatusesKeys = Object.keys(
    clientTransactionItemStatuses
  );

  let iterator = clientTransactionStatusesKeys;

  if (clientTransactionItemStatusesKeys.length > iterator.length) {
    iterator = clientTransactionItemStatusesKeys;
  }

  const transactionStatusSyncDto: TransactionStatusSyncDto[] = iterator.map(
    (clientId) => {
      const transactionItemStatus: TransactionItemStatus[] =
        clientTransactionItemStatuses[clientId];
      const transactionStatus: TransactionStatus[] =
        clientTransactionStatuses[clientId];

      return {
        clientId,
        transactionStatus,
        transactionItemStatus,
      };
    }
  );

  if (transactionStatusSyncDto.length == 0) {
    return 0;
  }

  console.log(
    "POSTING Transaction/item status " + transactionStatusSyncDto.length
  );

  const apiResponse = await createTransactionStatusApi(
    token,
    transactionStatusSyncDto
  );

  return handleCreateTransactionStatusApiResponse(
    apiResponse,
    transactionStatusSyncDto
  );
}

function handleCreateTransactionStatusApiResponse(
  apiResponse: ApiResponse<TransactionStatusSyncResponse>,
  data: TransactionStatusSyncDto[]
): number {
  const { statusCode: transactionCreateStatusCode } = apiResponse;

  if (transactionCreateStatusCode === 200) {
    const transactionStatusIdSet: string = data
      .flatMap((t) => t.transactionStatus?.map((s) => s.id))
      ?.map((str) => `'${str}'`)
      .join(",");

    const transactionItemStatusIdSet: string = data
      .flatMap((t) => t.transactionItemStatus?.map((s) => s.id))
      ?.map((str) => `'${str}'`)
      .join(",");

    let changes = 0;

    if (transactionStatusIdSet) {
      changes = dbConnection
        .prepare(
          `UPDATE book_transaction_status SET is_synced=1 where id in (${transactionStatusIdSet})`
        )
        .run().changes;
    }

    if (transactionItemStatusIdSet) {
      changes += dbConnection
        .prepare(
          `UPDATE book_transaction_item_status SET is_synced=1 where id in (${transactionItemStatusIdSet})`
        )
        .run().changes;
    }

    return changes;
  }

  return 0;
}

/**
 *
 * @param token
 * @returns
 */
async function createNewTransactions(token: string): Promise<number> {
  const transactions = dbConnection
    .prepare(
      `select id as transactionId,
       client_id as clientId, 
       transaction_type as transactionType, 
       created_at as createdAt 
       from book_transactions 
       where is_synced=0 
       order by created_at asc limit 50;`
    )
    .all();

  console.log("Transactions to create " + transactions.length);

  const transactionDto = transactions.map((transaction: any) => {
    const transactionItemsDto = dbConnection
      .prepare(
        `select id, book_copy_id as cpy from book_transaction_items where transaction_id = ?`
      )
      .all(transaction.transactionId);

    return {
      ...transaction,
      items: transactionItemsDto,
    } as TransactionSyncDto;
  });

  if (transactionDto.length == 0) {
    return 0;
  }

  const apiResponse = await createTransactionApi(token, transactionDto);

  return handleCreateTransactionApiResponse(apiResponse, transactionDto);
}

/**
 *
 * @param apiResponse
 * @returns
 */
function handleCreateTransactionApiResponse(
  apiResponse: ApiResponse<TransactionSyncResponse[]>,
  transactions: TransactionSyncDto[]
): number {
  const { statusCode: transactionCreateStatusCode } = apiResponse;

  let changes = 0;

  console.log(JSON.stringify(apiResponse))

  if (transactionCreateStatusCode === 200) {
    const updateTransaction = dbConnection.prepare(
      `UPDATE book_transactions SET is_synced=1 where id=?`
    );
    const updateTransactionItem = dbConnection.prepare(
      `UPDATE book_transaction_items SET is_synced=1 where id=?`
    );

    transactions.map((transaction) => {
      const executeDbTransation = dbConnection.transaction(() => {
        changes += updateTransaction.run(transaction.transactionId).changes;

        transaction.items.map(
          (item) => updateTransactionItem.run(item.id).changes
        );
      });

      try {
        executeDbTransation();
      } catch (error: any) {
        console.log(
          `Update book transaction ${transaction.transactionId} failed with error: ${error.message}`
        );
      }
    });
  }

  return changes;
}

/**
 *
 * @param token
 * @param body
 * @returns
 */
async function createTransactionApi(
  token: string,
  body: TransactionSyncDto[]
): Promise<ApiResponse<TransactionSyncResponse[]>> {
  const request: ApiRequest = {
    token,
    resource: `clients/transactions`,
    body,
  };

  return executePost<TransactionSyncResponse[]>(request);
}

async function createTransactionStatusApi(
  token: string,
  body: TransactionStatusSyncDto[]
): Promise<ApiResponse<TransactionStatusSyncResponse>> {
  const request: ApiRequest = {
    token,
    resource: `clients/transaction-status`,
    body,
  };

  return executePost<TransactionStatusSyncResponse>(request);
}
