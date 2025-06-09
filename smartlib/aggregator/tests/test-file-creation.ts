import { promises as fs } from 'fs';
import { getCredential } from '../src/auth/authenticator';
import logger from '../src/logger';

const credentialFileName = './credentials.json';

async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function testFileCreation() {
  try {
    // Check if credentials.json exists
    const existsBefore = await fileExists(credentialFileName);
    logger.info(`Credentials file exists before test: ${existsBefore}`);
    
    // If it exists, rename it temporarily for testing
    if (existsBefore) {
      await fs.rename(credentialFileName, `${credentialFileName}.bak`);
      logger.info('Renamed existing credentials file for testing');
    }
    
    // Try to get credentials, which should create the file if it doesn't exist
    logger.info('Testing getCredential function');
    const token = await getCredential();
    logger.info(`Successfully obtained token: ${token.substring(0, 10)}...`);
    
    // Check if credentials.json exists now
    const existsAfter = await fileExists(credentialFileName);
    logger.info(`Credentials file exists after test: ${existsAfter}`);
    
    // Restore the original file if it existed
    if (existsBefore) {
      await fs.unlink(credentialFileName);
      await fs.rename(`${credentialFileName}.bak`, credentialFileName);
      logger.info('Restored original credentials file');
    }
    
    return existsAfter;
  } catch (error) {
    logger.error('Error in test', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    
    // Restore the original file if it existed
    const backupExists = await fileExists(`${credentialFileName}.bak`);
    if (backupExists) {
      await fs.rename(`${credentialFileName}.bak`, credentialFileName);
      logger.info('Restored original credentials file after error');
    }
    
    return false;
  }
}

(async () => {
  const success = await testFileCreation();
  logger.info(`Test result: ${success ? 'SUCCESS' : 'FAILURE'}`);
  process.exit(success ? 0 : 1);
})();