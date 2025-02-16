import { dbConnection } from "../config/db";
import { executePost } from "../htttp-client/http-client";
import { ApiRequest, ApiResponse } from "../htttp-client/model";
import {
  ClientSyncDto,
  LibrarySyncDto,
  LibrarySyncResponse,
} from "../model/library-sync";
import { arrayGroupinBy } from "../utils";
const slid = process.env.slid || "";

export const synchronizeTransactions = async (token: string) => {
  return await createNewTransactions(token).then(
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
      };
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
      };
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

  const clients = iterator.map((clientId) => {
    const transactionItemStatus: any[] =
      clientTransactionItemStatuses[clientId];
    const transactionStatus: any[] = clientTransactionStatuses[clientId];

    return {
      id: clientId,
      transactionItemStatus,
      transactionStatus,
    };
  });

  if (clients.length == 0) {
    return 0;
  }

  console.log("POSTING Transaction/item status " + clients.length);

  return handleCreateTransactionStatusApiResponse(
    await createTransactionStatusApi(token, {
      clients,
    })
  );
}

function handleCreateTransactionStatusApiResponse(
  apiResponse: ApiResponse<LibrarySyncResponse>
): number {
  const {
    statusCode: transactionCreateStatusCode,
    context: { data },
  } = apiResponse;

  if (transactionCreateStatusCode === 200) {
    const statusIdSet = data.clients.map((client) => ({
      transactionStatusIdSet: client.transactionStatus?.map(
        (status) => status.externalId
      ),
      transactionItemStatusIdSet: client.transactionItemStatus?.map(
        (status) => status.externalId
      ),
    }));

    const transactionStatusIdSet = statusIdSet
      .flatMap((client) => client.transactionStatusIdSet)
      .map((str) => `'${str}'`)
      .join(",");

    const transactionItemStatusIdSet = statusIdSet
      .flatMap((client) => client.transactionItemStatusIdSet)
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
    .prepare(`select * from book_transactions where external_id is NULL;`)
    .all();

  console.log("Transactions to create " + transactions.length);

  const transactionsByClient = arrayGroupinBy(transactions, "client_id");

  const clients = Object.keys(transactionsByClient).map((clientId) => {
    const clientTransactions: any[] = transactionsByClient[clientId];

    const transactions = clientTransactions.map((transaction: any) => {
      const transactionId = transaction.id;
      const transactionItemsDto = dbConnection
        .prepare(
          `select * from book_transaction_items where transaction_id = ?`
        )
        .all(transactionId)
        .map((transactionItem: any) => {
          const itemId = transactionItem.id;
          return {
            id: itemId,
            cpy: transactionItem.book_copy_id,
          };
        });

      return {
        id: transactionId,
        transactionType: transaction.transaction_type,
        createdAt: new Date(transaction.created_at),
        items: transactionItemsDto,
      };
    });

    return {
      id: clientId,
      transactions,
    };
  });

  if (clients.length == 0) {
    return 0;
  }

  var request: LibrarySyncDto = {
    clients,
  };

  return handleCreateTransactionApiResponse(
    await createTransactionApi(token, request)
  );
}

/**
 *
 * @param apiResponse
 * @returns
 */
function handleCreateTransactionApiResponse(
  apiResponse: ApiResponse<LibrarySyncResponse>
): number {
  const {
    statusCode: transactionCreateStatusCode,
    context: { data },
  } = apiResponse;

  let changes = 0;

  if (transactionCreateStatusCode === 200) {
    const bookTransactions = data.clients.flatMap(
      (client) => client.transactions || []
    );

    const updateTransaction = dbConnection.prepare(
      `UPDATE book_transactions SET external_id=? where id=?`
    );
    const updateTransactionItem = dbConnection.prepare(
      `UPDATE book_transaction_items SET external_id=? where id=?`
    );

    bookTransactions.map((bookTransaction) => {
      const executeDbTransation = dbConnection.transaction(() => {
        changes += updateTransaction.run(
          bookTransaction.id,
          bookTransaction.externalId
        ).changes;

        bookTransaction.items.map(
          (item) => updateTransactionItem.run(item.id, item.externalId).changes
        );
      });

      try {
        executeDbTransation();
      } catch (error: any) {
        console.log(
          `Update book transaction ${bookTransaction.externalId} failed with error: ${error.message}`
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
  body: LibrarySyncDto
): Promise<ApiResponse<LibrarySyncResponse>> {
  const request: ApiRequest = {
    token,
    resource: `sl/${slid}/transactions`,
    body,
  };

  return executePost<LibrarySyncResponse>(request);
}

async function createTransactionStatusApi(
  token: string,
  body: {
    clients: ClientSyncDto[];
  }
): Promise<ApiResponse<LibrarySyncResponse>> {
  const request: ApiRequest = {
    token,
    resource: `sl/${slid}/transactionStatus`,
    body,
  };

  return executePost<LibrarySyncResponse>(request);
}
