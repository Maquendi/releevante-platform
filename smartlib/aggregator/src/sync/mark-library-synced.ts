import { executePut } from "../htttp-client/http-client";
import { ApiRequest } from "../htttp-client/model";
import logger from "../logger";

const slid = process.env.slid;
/**
 * Mark the library as synchronized with the server
 * @param token Authentication token
 */
export const markLibrarySynchronized = async (token: string) => {
  logger.info('Marking library as synchronized');

  const request: ApiRequest = {
    token,
    resource: `sl/${slid}/synchronized`,
  };

  try {
    logger.debug('Sending request to mark library as synchronized');
    const response = await executePut<boolean>(request);

    logger.info('Library synchronization status updated', { 
      synchronized: response.context.data 
    });
  } catch (error) {
    logger.error('Error marking library as synchronized', {
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
