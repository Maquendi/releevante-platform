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
      `select bts.*, bt.client_id, bt.external_id from book_transaction_status bts join book_transactions bt on bt.id=bts.transaction_id where bts.is_synced=0`
    )
    .all()
    .map((status: any) => {
      return {
        id: status.id,
        clientId: status.client_id,
        transactionId: status.external_id,
        status: status.status,
        createdAt: new Date(status.created_at),
      };
    });

  const transactionItemStatusDto = dbConnection
    .prepare(
      `select btis.*, bti.transaction_id, bt.client_id, bt.external_id from book_transaction_item_status btis join book_transaction_items bti on bti.id=btis.item_id join book_transactions bt on bt.id=bti.transaction_id where btis.is_synced=0`
    )
    .all()
    .map((itemStatus: any) => {
      return {
        id: itemStatus.id,
        itemId: itemStatus.item_id,
        clientId: itemStatus.client_id,
        status: itemStatus.status,
        createdAt: new Date(itemStatus.created_at),
      };
    });

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

  const response = await createTransactionStatusApi(token, {
    clients,
  });

  if (response.statusCode === 200) {
    const statuses = response.context.data.clients.map((client) => ({
      transactionStatusIds: client.transactionStatus?.map(
        (status) => status.id
      ),
      transactionItemStatusIds: client.transactionItemStatus?.map(
        (status) => status.id
      ),
    }));

    const clientTransactionStatusIds = statuses
      .flatMap((client) => client.transactionStatusIds)
      .map((str) => `'${str}'`)
      .join(",");

    const clientTransactionItemStatusIds = statuses
      .flatMap((client) => client.transactionItemStatusIds)
      .map((str) => `'${str}'`)
      .join(",");

    let changes = 0;

    if (clientTransactionStatusIds) {
      changes = dbConnection
        .prepare(
          `UPDATE book_transaction_status SET is_synced=1 where id in (${clientTransactionStatusIds})`
        )
        .run().changes;
    }

    if (clientTransactionItemStatusIds) {
      changes += dbConnection
        .prepare(
          `UPDATE book_transaction_item_status SET is_synced=1 where id in (${clientTransactionItemStatusIds})`
        )
        .run().changes;
    }

    return changes;
  }

  return 0;
}

async function createNewTransactions(token: string): Promise<number> {
  const transactions = dbConnection
    .prepare(
      `select * from book_transactions where external_id is NULL or external_id = '';`
    )
    .all();

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

  const {
    statusCode: transactionCreateStatusCode,
    context: { data },
  } = await createTransactionApi(token, request);

  if (transactionCreateStatusCode === 200) {
    return (
      data.clients
        .flatMap((client) => {
          return client.transactions?.map((transaction) => {
            return dbConnection
              .prepare(`UPDATE book_transactions SET external_id=? where id=?`)
              .run(transaction.id, transaction.externalId).changes;
          });
        })
        .reduce((current = 0, next = 0) => current + next, 0) || 0
    );
  }

  return 0;
}

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
