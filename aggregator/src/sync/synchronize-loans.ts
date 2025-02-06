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
  let recordsUploaded = await createTransactions(token);

  // recordsUploaded += await createTransactionStatuses(token);
};

async function createTransactionStatuses(token: string): Promise<number> {
  const transactionStatusDto = dbConnection
    .prepare(
      `select bts.*, bt.client_id, bt.external_id from book_transaction_status bts join book_transactions bt on bt.id=bts.transaction_id where bts.is_synced = false`
    )
    .all()
    .map((status: any) => {
      return {
        id: status.id,
        clientId: status.client_id,
        transactionId: status.external_id,
        status: status.status,
        createdAt: status.created_at,
      };
    });

  const transactionItemStatusDto = dbConnection
    .prepare(
      `select btis.*, bti.transaction_id, bt.client_id, bt.external_id from book_transaction_item_status btis join book_transaction_items bti on bti.id=btis.item_id join book_transactions bt on bt.id=bti.transaction_id where btis.is_synced = false`
    )
    .all()
    .map((itemStatus: any) => {
      return {
        id: itemStatus.id,
        itemId: itemStatus.item_id,
        clientId: itemStatus.client_id,
        status: itemStatus.status,
        createdAt: itemStatus.created_at,
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

  const clients = Object.keys(clientTransactionStatuses).map((key) => {
    const transactionStatuses: any[] = clientTransactionStatuses[key];
    const transactionItemStatuses: any[] = clientTransactionItemStatuses[key];
    const clientId = key;

    return {
      id: clientId,
      transactionItemStatus: transactionItemStatuses,
      transactionStatus: transactionStatuses,
    };
  });

  if (clients.length == 0) {
    return 0;
  }

  const response = await createTransactionStatusApi(token, {
    clients,
  });

  if (response.statusCode == 200) {
    const statuses = Object.keys(clientTransactionStatuses).map((key) => {
      const transactionStatuses: any[] = clientTransactionStatuses[key];
      const transactionItemStatuses: any[] = clientTransactionItemStatuses[key];

      const transactionStatusIds: string[] = transactionStatuses.map(
        (status) => status.id
      );

      const transactionItemStatusIds: string[] = transactionItemStatuses.map(
        (status) => status.id
      );

      return {
        transactionStatusIds,
        transactionItemStatusIds,
      };
    });

    const clientTransactionStatusIds = statuses.flatMap(
      (client) => client.transactionStatusIds
    );

    const clientTransactionItemStatusIds = statuses.flatMap(
      (client) => client.transactionItemStatusIds
    );

    let changes = dbConnection
      .prepare(
        `UPDATE book_transaction_status SET is_synced=true where id in (${clientTransactionStatusIds})`
      )
      .run().changes;

    changes += dbConnection
      .prepare(
        `UPDATE book_transaction_item_status SET is_synced=true where id in (${clientTransactionItemStatusIds})`
      )
      .run().changes;

    return changes;
  }

  return 0;
}

async function createTransactions(token: string): Promise<number> {
  const transactions = dbConnection
    .prepare(
      `select * from book_transactions where external_id is NULL or external_id = '';`
    )
    .all();

  //console.log(transactions)

  const transactionsGrouped = arrayGroupinBy(transactions, "client_id");

  const clients = Object.keys(transactionsGrouped).map((clientId) => {
    const clientTransactions: any[] = transactionsGrouped[clientId];
    const transactions = clientTransactions.map((transaction: any) => {
      const transactionId = transaction.id;

      const transactionStatusDto = dbConnection
        .prepare(
          `select * from book_transaction_status where transaction_id = ?`
        )
        .all(transactionId)
        .map((status: any) => {
          return {
            id: status.id,
            status: status.status,
            createdAt: status.created_at,
          };
        });

      const transactionItemsDto = dbConnection
        .prepare(
          `select * from book_transaction_items where transaction_id = ?`
        )
        .all(transactionId)
        .map((transactionItem: any) => {
          const itemId = transactionItem.id;

          const transactionItemStatuses = dbConnection
            .prepare(
              `select * from book_transaction_item_status where item_id = ?`
            )
            .all(itemId)
            .map(({ id, status, created_at }: any) => {
              return {
                id: id,
                status: status,
                createdAt: created_at,
              };
            });

          return {
            id: itemId,
            cpy: transactionItem.book_copy_id,
            statuses: transactionItemStatuses,
          };
        });

      return {
        id: transactionId,
        transactionType: transaction.transaction_type,
        createdAt: transaction.created_at,
        status: transactionStatusDto,
        items: transactionItemsDto,
      };
    });

    return {
      id: clientId,
      transactions,
    };
  });

 // console.log(JSON.stringify(clients));

  //console.log(clients)
  if (clients.length == 0) {
    return 0;
  }

  var request: LibrarySyncDto = {
    clients,
  };

  const response = await createTransactionApi(token, request);

  if (response.statusCode == 200) {
    const syncResponse = response.context.data;

    syncResponse.clients.forEach((client) => {
      client.transactions?.forEach((transaction) => {
        const stmt = dbConnection.prepare(
          `UPDATE book_transactions SET external_id=? where id=?`
        );

        return stmt.run({
          external_id: transaction.id,
          id: transaction.externalId,
        }).changes;
      });
    });

    return clients.length;
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
