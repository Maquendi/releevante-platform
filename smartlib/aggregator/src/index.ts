import { synchronizeBooks } from "./sync/synchronize-books";
import { synchronizeSettings } from "./sync/synchronize-settings";
import { synchronizeLibraryAccess } from "./sync/synchronize-library-access";
import { getCredential } from "./auth/authenticator";
import { synchronizeTransactions } from "./sync/synchronize-transactions";
import { isServerReachable } from "./htttp-client/http-client";
import dotenv from 'dotenv';
import logger, { withTraceId, generateTraceId } from './logger';
dotenv.config();

const executeTasks = async (traceId?: string) => {
  // Use the provided trace ID or generate a new one
  return withTraceId(traceId, async () => {
    try {
      logger.info('Starting execution of tasks');
      let token = await getCredential();
      logger.info(`retrieved token: ${token}`)
      await synchronizeTransactions(token);
      await synchronizeBooks(token);
      await synchronizeLibraryAccess(token);
      await synchronizeSettings(token);
      logger.info('All tasks completed successfully');
    } catch (error) {
      logger.error('Error executing tasks', { error: error instanceof Error ? error.message : String(error) });
    }
  });
};


(() => {
  logger.info("Aggregator application started !!")
})()

setInterval(async () => {
  // Generate a new trace ID for each interval execution
  const traceId = generateTraceId();

  try {
    // Use withTraceId to ensure the trace ID is set in the context
    return withTraceId(traceId, async () => {
     // logger.info('Checking if server is reachable');
      if (await isServerReachable()) {
       // logger.info('Server is reachable, executing tasks');
        await executeTasks(traceId);
      } else {
        logger.warn('Server is unreachable, skipping tasks');
      }
    });
  } catch (error) {
    // Use withTraceId to ensure the trace ID is set in the context for error logging
    return withTraceId(traceId, async () => {
      logger.error('Error in scheduled task execution', { 
        error: error instanceof Error ? error.message : String(error)
      });
    });
  }
}, 60*500);
