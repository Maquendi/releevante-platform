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
import logger from "../logger";

export const synchronizeTransactions = async (token: string) => {
  logger.info('Starting transaction synchronization');

  try {
    logger.debug('Creating new transactions');
    const data = await createNewTransactions(token).then(
      async (transactionsCreated) => {
        logger.debug('Creating new transaction statuses');
        const transactionStatusesCreated = await createNewTransactionStatuses(
          token
        );

        return {
          transactionsCreated,
          transactionStatusesCreated,
        };
      }
    );

    logger.info('Transaction synchronization completed', {
      transactionsCreated: data.transactionsCreated,
      transactionStatusesCreated: data.transactionStatusesCreated,
      totalSynced: data.transactionStatusesCreated + data.transactionsCreated
    });

    return data.transactionStatusesCreated + data.transactionsCreated;
  } catch (error) {
    logger.error('Error during transaction synchronization', {
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};

async function createNewTransactionStatuses(token: string): Promise<number> {
  logger.debug('Fetching transaction statuses that need synchronization');

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

  logger.debug('Transaction statuses to create', { count: transactionStatusDto.length });

  logger.debug('Fetching transaction item statuses that need synchronization');

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

  logger.debug('Transaction item statuses to create', { count: transactionItemStatusDto.length });

  logger.debug('Grouping transaction statuses by client ID');
  const clientTransactionStatuses = arrayGroupinBy(
    transactionStatusDto,
    "clientId"
  );

  logger.debug('Grouping transaction item statuses by client ID');
  const clientTransactionItemStatuses = arrayGroupinBy(
    transactionItemStatusDto,
    "clientId"
  );

  const clientTransactionStatusesKeys = Object.keys(clientTransactionStatuses);
  const clientTransactionItemStatusesKeys = Object.keys(
    clientTransactionItemStatuses
  );

  logger.debug('Client transaction status keys', { 
    statusKeysCount: clientTransactionStatusesKeys.length,
    itemStatusKeysCount: clientTransactionItemStatusesKeys.length
  });

  let iterator = clientTransactionStatusesKeys;

  if (clientTransactionItemStatusesKeys.length > iterator.length) {
    logger.debug('Using item status keys as iterator (larger set)');
    iterator = clientTransactionItemStatusesKeys;
  } else {
    logger.debug('Using transaction status keys as iterator (larger set)');
  }

  logger.debug('Creating transaction status sync DTOs');
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
    logger.debug('No transaction statuses to synchronize');
    return 0;
  }

  logger.info('Posting transaction/item statuses to API', { 
    count: transactionStatusSyncDto.length 
  });

  try {
    const apiResponse = await createTransactionStatusApi(
      token,
      transactionStatusSyncDto
    );

    return handleCreateTransactionStatusApiResponse(
      apiResponse,
      transactionStatusSyncDto
    );
  } catch (error) {
    logger.error('Error posting transaction statuses to API', {
      error: error instanceof Error ? error.message : String(error)
    });
    return 0;
  }
}

function handleCreateTransactionStatusApiResponse(
  apiResponse: ApiResponse<TransactionStatusSyncResponse>,
  data: TransactionStatusSyncDto[]
): number {
  const { statusCode: transactionCreateStatusCode } = apiResponse;

  logger.debug('Handling transaction status API response', { statusCode: transactionCreateStatusCode });

  if (transactionCreateStatusCode === 200) {
    logger.debug('Transaction status API response successful, updating local records');

    const transactionStatusIdSet: string = data
      .flatMap((t) => t.transactionStatus?.map((s) => s.id))
      ?.map((str) => `'${str}'`)
      .join(",");

    const transactionItemStatusIdSet: string = data
      .flatMap((t) => t.transactionItemStatus?.map((s) => s.id))
      ?.map((str) => `'${str}'`)
      .join(",");

    logger.debug('Transaction status IDs to update', { 
      transactionStatusCount: transactionStatusIdSet ? transactionStatusIdSet.split(',').length : 0,
      transactionItemStatusCount: transactionItemStatusIdSet ? transactionItemStatusIdSet.split(',').length : 0
    });

    let changes = 0;

    if (transactionStatusIdSet) {
      logger.debug('Updating transaction status records');
      changes = dbConnection
        .prepare(
          `UPDATE book_transaction_status SET is_synced=1 where id in (${transactionStatusIdSet})`
        )
        .run().changes;
      logger.debug('Updated transaction status records', { count: changes });
    }

    if (transactionItemStatusIdSet) {
      logger.debug('Updating transaction item status records');
      const itemChanges = dbConnection
        .prepare(
          `UPDATE book_transaction_item_status SET is_synced=1 where id in (${transactionItemStatusIdSet})`
        )
        .run().changes;
      changes += itemChanges;
      logger.debug('Updated transaction item status records', { count: itemChanges });
    }

    logger.info('Transaction status synchronization completed', { totalChanges: changes });
    return changes;
  } else {
    logger.warn('Transaction status API response unsuccessful', { statusCode: transactionCreateStatusCode });
    return 0;
  }
}

/**
 * Create new transactions by synchronizing unsynchronized transactions with the server
 * @param token Authentication token
 * @returns Number of transactions synchronized
 */
async function createNewTransactions(token: string): Promise<number> {
  logger.debug('Fetching transactions that need synchronization');

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

  logger.debug('Transactions to create', { count: transactions.length });

  if (transactions.length === 0) {
    logger.debug('No transactions to synchronize');
    return 0;
  }

  logger.debug('Preparing transaction DTOs with their items');
  const transactionDto = transactions.map((transaction: any) => {
    const transactionItemsDto = dbConnection
      .prepare(
        `select id, book_copy_id as cpy from book_transaction_items where transaction_id = ?`
      )
      .all(transaction.transactionId);

    logger.debug('Transaction items for transaction', { 
      transactionId: transaction.transactionId, 
      itemCount: transactionItemsDto.length 
    });

    return {
      ...transaction,
      items: transactionItemsDto,
    } as TransactionSyncDto;
  });

  if (transactionDto.length == 0) {
    logger.debug('No transaction DTOs to synchronize');
    return 0;
  }

  logger.info(`Posting ${transactions.length} transactions to API`);

  try {
    const apiResponse = await createTransactionApi(token, transactionDto);
    return handleCreateTransactionApiResponse(apiResponse, transactionDto);
  } catch (error) {
    logger.error('Error posting transactions to API', {
      error: error instanceof Error ? error.message : String(error)
    });
    return 0;
  }
}

/**
 * Handle the API response for creating transactions
 * @param apiResponse Response from the API
 * @param transactions Transactions that were sent to the API
 * @returns Number of transactions updated
 */
function handleCreateTransactionApiResponse(
  apiResponse: ApiResponse<TransactionSyncResponse[]>,
  transactions: TransactionSyncDto[]
): number {
  const { statusCode: transactionCreateStatusCode } = apiResponse;

  logger.debug('Handling transaction API response', { 
    statusCode: transactionCreateStatusCode,
    responseData: JSON.stringify(apiResponse)
  });

  let changes = 0;

  if (transactionCreateStatusCode === 200) {
    logger.debug('Transaction API response successful, updating local records');

    const updateTransaction = dbConnection.prepare(
      `UPDATE book_transactions SET is_synced=1 where id=?`
    );
    const updateTransactionItem = dbConnection.prepare(
      `UPDATE book_transaction_items SET is_synced=1 where id=?`
    );

    let successCount = 0;
    let errorCount = 0;

    transactions.forEach((transaction) => {
      logger.debug('Updating transaction record', { transactionId: transaction.transactionId });

      const executeDbTransation = dbConnection.transaction(() => {
        changes += updateTransaction.run(transaction.transactionId).changes;

        transaction.items.forEach(item => {
          updateTransactionItem.run(item.id);
          logger.debug('Updated transaction item', { itemId: item.id });
        });
      });

      try {
        executeDbTransation();
        successCount++;
      } catch (error: any) {
        logger.error('Failed to update transaction', {
          transactionId: transaction.transactionId,
          error: error.message
        });
        errorCount++;
      }
    });

    logger.info('Transaction update completed', { 
      successCount,
      errorCount,
      totalChanges: changes
    });
  } else {
    logger.warn('Transaction API response unsuccessful', { statusCode: transactionCreateStatusCode });
  }

  return changes;
}

/**
 * Create transactions via API
 * @param token Authentication token
 * @param body Transaction data to send
 * @returns API response
 */
export async function createTransactionApi(
  token: string,
  body: TransactionSyncDto[]
): Promise<ApiResponse<TransactionSyncResponse[]>> {
  logger.debug('Creating API request for transactions', { 
    transactionCount: body.length 
  });

  const request: ApiRequest = {
    token,
    resource: `clients/transactions`,
    body,
  };

  logger.debug('Executing POST request to create transactions');
  try {
    const response = await executePost<TransactionSyncResponse[]>(request);
    logger.debug('Transaction API request completed', { statusCode: response.statusCode });
    return response;
  } catch (error) {
    logger.error('Error executing transaction API request', {
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}

/**
 * Create transaction statuses via API
 * @param token Authentication token
 * @param body Transaction status data to send
 * @returns API response
 */
export async function createTransactionStatusApi(
  token: string,
  body: TransactionStatusSyncDto[]
): Promise<ApiResponse<TransactionStatusSyncResponse>> {
  logger.debug('Creating API request for transaction statuses', { 
    clientCount: body.length 
  });

  const request: ApiRequest = {
    token,
    resource: `clients/transaction-status`,
    body,
  };

  logger.debug('Executing POST request to create transaction statuses');
  try {
    const response = await executePost<TransactionStatusSyncResponse>(request);
    logger.debug('Transaction status API request completed', { statusCode: response.statusCode });
    return response;
  } catch (error) {
    logger.error('Error executing transaction status API request', {
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}
