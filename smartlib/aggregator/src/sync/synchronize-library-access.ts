import { dbConnection } from "../config/db.js";
import { executeGet, executePut } from "../htttp-client/http-client.js";
import { ApiRequest } from "../htttp-client/model.js";
import { LibraryAccess } from "../model/client.js";
import logger from "../logger";

const slid = process.env.slid;

export const synchronizeLibraryAccess = async (token: string) => {
  logger.info('Starting library access synchronization');

  let totalRecordsSynced = 0;
  let completedNoError = false;

  const request: ApiRequest = {
    resource: `sl/${slid}/accesses?status=not_synced`,
    token,
  };

  logger.debug('Fetching library access data from server');
  const response = await executeGet<LibraryAccess[]>(request);
  const accesses = response.context.data || [];

  logger.debug('Received library access data', { count: accesses.length });

  if (accesses.length) {
    try {
      logger.debug('Inserting user records');
      totalRecordsSynced += await insertUsers(accesses);
      completedNoError = true;
    } catch (error: any) {
      logger.error('Error inserting user records', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      completedNoError = false;
    }
  } else {
    logger.debug('No library access records to synchronize');
  }

  logger.info('Library access synchronization completed', { totalRecordsSynced });

  if (completedNoError) {
    logger.debug('Updating library access synchronization status');
    const request: ApiRequest = {
      token,
      resource: `sl/${slid}/accesses`,
    };
    const response = await executePut<Boolean>(request);

    logger.info('Library users set synchronized', { 
      success: response?.context?.data 
    });
  }

  return totalRecordsSynced;
};

const insertUsers = async (accesses: LibraryAccess[]) => {
  logger.debug('Preparing database statements for user insertion');

  const create_stmt = dbConnection.prepare(
    "INSERT INTO user(id, credential, is_active, expires_at, contact_less) VALUES (@id, @credential, @is_active, @expires_at, @contact_less)"
  );

  const update_stmt = dbConnection.prepare(
    "UPDATE user SET credential=?, is_active=?, expires_at=?, contact_less=? WHERE id=?"
  );

  let dbChanges = 0;
  let insertCount = 0;
  let updateCount = 0;

  logger.debug('Processing user records', { count: accesses.length });

  accesses.forEach((access) => {
    try {
      dbChanges += create_stmt.run({
        id: access.accessId,
        credential: access.credential,
        is_active: (access.isActive && 1) || 0,
        expires_at: access.expiresAt,
        contact_less: access.contactless,
      }).changes;
      insertCount++;
    } catch (error: any) {
      logger.debug('Record already exists, updating instead', { 
        accessId: access.accessId,
        error: error.message 
      });

      dbChanges += update_stmt.run(
        access.credential,
        (access.isActive && 1) || 0,
        access.expiresAt,
        access.contactless,
        access.accessId
      ).changes;
      updateCount++;
    }
  });

  logger.debug('User records processing completed', { 
    inserted: insertCount,
    updated: updateCount,
    totalChanges: dbChanges
  });

  return dbChanges;
};
