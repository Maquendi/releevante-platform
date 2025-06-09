import { getCredential } from '../src/auth/authenticator';
import logger from '../src/logger';

async function testGetCredential() {
  try {
    logger.info('Testing getCredential function');
    const token = await getCredential();
    logger.info(`Successfully obtained token: ${token.substring(0, 10)}...`);
    return true;
  } catch (error) {
    logger.error('Error getting credential', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    return false;
  }
}

(async () => {
  const success = await testGetCredential();
  logger.info(`Test result: ${success ? 'SUCCESS' : 'FAILURE'}`);
  process.exit(success ? 0 : 1);
})();