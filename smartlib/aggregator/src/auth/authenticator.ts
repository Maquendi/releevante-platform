import { executePost } from "../htttp-client/http-client";
import { ApiCredential } from "../model/client";
import logger from "../logger";

// In-memory cache for credentials
let cachedCredential: ApiCredential | null = null;

const loadFromCache = async (): Promise<ApiCredential> => {
  // Check if credentials are cached in memory
  if (!cachedCredential) {
    logger.info('No cached credentials found');
    // Get credentials from server and cache them
    return await loadFromServer();
  }

  logger.debug('Using cached credentials');
  return cachedCredential;
};

const loadFromServer = async (): Promise<ApiCredential> => {
  const slid = process.env.slid;

  logger.info('Loading credentials from server');

  const request = {
    resource: `auth/m2m/token`,
    body: { clientId: slid }
  };
    logger.debug('Sending authentication request');

    const response = await executePost<string>(request);

    if (response.statusCode == 200) {
      const now = new Date();
      now.setHours(now.getHours() + 24);

      const credentials = {
        slid,
        token: response?.context?.data,
        expiresAt: now.toISOString(),
      };

      logger.debug('Received credentials from server', {
        expiresAt: credentials.expiresAt
      });

      // Cache credentials in memory
      cachedCredential = credentials;
      logger.info('Successfully loaded and cached credentials from server');

      return credentials;
    }

   throw new Error(`Failed to load credentials from server with details: ${JSON.stringify(response.context?.data)}`);
};

const credentialVerified = (credentials: ApiCredential): boolean => {
  const slid = process.env.slid;
  if (!credentials?.token || credentials.slid !== slid) {
    logger.debug('Credentials invalid: missing token or incorrect slid');
    return false;
  }

  const expiresAt = new Date(credentials?.expiresAt as string);
  const now = new Date();
  const diffInHours = (expiresAt.getTime() - now.getTime()) / 3600000;

  logger.debug('Checking credential expiration', { 
    diffInHours, 
    expiresAt: expiresAt.toISOString(), 
    now: now.toISOString() 
  });

  const isValid = diffInHours > 2;
  logger.debug(`Credentials ${isValid ? 'valid' : 'expired'}`, { diffInHours });

  return isValid;
};

const getCredential = async (): Promise<string> => {
  logger.debug('Getting credentials');

  let credential = null;
  try {
    credential = await loadFromCache();
    logger.debug('Loaded credentials from cache');
  } catch (error) {
    logger.error('Error loading credentials', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    throw error;
  }

  const credentialIsVerified = credentialVerified(credential);

  if (!credentialIsVerified) {
    logger.info('Credentials expired or invalid, reloading from server');
    credential = await loadFromServer();

    // Verify the newly loaded credential
    if (!credentialVerified(credential)) {
      throw new Error('Failed to obtain valid credentials from server');
    }
  } else {
    logger.debug('Using existing valid credentials');
  }

  if (!credential?.token) {
    throw new Error('No valid token found in credentials');
  }

  return credential.token;
};

// Function to reset the cache for testing purposes
const resetCache = (): void => {
  cachedCredential = null;
};

export { getCredential, credentialVerified, loadFromServer, loadFromCache, resetCache };
