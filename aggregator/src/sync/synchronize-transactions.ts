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
const slid = process.env.slid || "";

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
      `select bts.*, bt.client_id, bt.external_id AS transaction_id from book_transaction_status bts join book_transactions bt on bt.id=bts.transaction_id where bts.is_synced=0`
    )
    .all()
    .map((status: any) => {
      return {
        id: status.id,
        clientId: status.client_id,
        transactionId: status.transaction_id,
        status: status.status,
        createdAt: new Date(status.created_at),
      } as TransactionStatus;
    });

  console.log("Transaction status to create " + transactionStatusDto.length);

  const transactionItemStatusDto = dbConnection
    .prepare(
      `select btis.*, 
      bt.client_id, 
      bti.external_id 
      from book_transaction_item_status btis 
      join book_transaction_items bti 
        on bti.id = btis.item_id 
      join book_transactions bt 
        on bt.id = bti.transaction_id 
      where btis.is_synced = 0`
    )
    .all()
    .map((itemStatus: any) => {
      return {
        id: itemStatus.id,
        itemId: itemStatus.external_id,
        clientId: itemStatus.client_id,
        status: itemStatus.status,
        createdAt: new Date(itemStatus.created_at),
      } as TransactionItemStatus;
    });

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

  const transactionStatusSyncDto = iterator.map((clientId) => {
    const transactionItemStatus: TransactionItemStatus[] =
      clientTransactionItemStatuses[clientId];
    const transactionStatus: TransactionStatus[] =
      clientTransactionStatuses[clientId];

    return {
      clientId,
      transactionStatus,
      transactionItemStatus,
    };
  });

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

  return handleCreateTransactionStatusApiResponse(apiResponse);
}

function handleCreateTransactionStatusApiResponse(
  apiResponse: ApiResponse<TransactionStatusSyncResponse>
): number {
  const {
    statusCode: transactionCreateStatusCode,
    context: { data },
  } = apiResponse;

  if (transactionCreateStatusCode === 200) {
    const transactionStatusIdSet = data.transactionStatusIdSet
      .map((str) => `'${str}'`)
      .join(",");

    const transactionItemStatusIdSet = data.transactionItemStatusIdSet
      .map((str) => `'${str}'`)
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
      `select id as transactionId, clientId, transaction_type, created_at from book_transactions where external_id is NULL;`
    )
    .all();

  console.log("Transactions to create " + transactions.length);

  const transactionDtoList = transactions.map((transaction: any) => {
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

  if (transactionDtoList.length == 0) {
    return 0;
  }

  const apiResponse = await createTransactionApi(token, transactionDtoList);

  return handleCreateTransactionApiResponse(apiResponse);
}

/**
 *
 * @param apiResponse
 * @returns
 */
function handleCreateTransactionApiResponse(
  apiResponse: ApiResponse<TransactionSyncResponse[]>
): number {
  const {
    statusCode: transactionCreateStatusCode,
    context: { data: createTransactionResponse },
  } = apiResponse;

  let changes = 0;

  if (transactionCreateStatusCode === 200) {
    const updateTransaction = dbConnection.prepare(
      `UPDATE book_transactions SET external_id=? where id=?`
    );
    const updateTransactionItem = dbConnection.prepare(
      `UPDATE book_transaction_items SET external_id=? where id=?`
    );

    createTransactionResponse.map((response) => {
      const executeDbTransation = dbConnection.transaction(() => {
        changes += updateTransaction.run(
          response.transaction.externalId,
          response.transaction.id
        ).changes;

        response.items.map(
          (item) => updateTransactionItem.run(item.externalId, item.id).changes
        );
      });

      try {
        executeDbTransation();
      } catch (error: any) {
        console.log(
          `Update book transaction ${response.transaction.id} failed with error: ${error.message}`
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
    resource: `sl/${slid}/transactions`,
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
    resource: `sl/${slid}/transactionStatus`,
    body,
  };

  return executePost<TransactionStatusSyncResponse>(request);
}
