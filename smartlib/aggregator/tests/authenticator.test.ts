import { getCredential, credentialVerified, loadFromServer, loadFromCache, resetCache } from '../src/auth/authenticator';
import * as httpClient from '../src/htttp-client/http-client';
import { ApiCredential } from '../src/model/client';

// Mock the HTTP client to avoid actual API calls
jest.mock('../src/htttp-client/http-client', () => ({
  executePost: jest.fn(),
}));

describe('Authenticator', () => {
  const mockToken = 'mock-token-12345';
  const mockCredentials = {
    slid: process.env.slid || 'test-slid',
    token: mockToken,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Reset the cache to ensure each test starts with a clean state
    resetCache();

    // Mock the HTTP client response
    (httpClient.executePost as jest.Mock).mockResolvedValue({
      statusCode: 200,
      context: {
        data: mockToken
      }
    });
  });

  afterEach(() => {
    // No cleanup needed for in-memory cache
  });

  describe('getCredential', () => {
    it('should fetch and cache credentials when no cached credentials exist', async () => {
      // Call getCredential which should fetch from server and cache
      const token = await getCredential();

      // Verify token is returned correctly
      expect(token).toBe(mockToken);

      // Verify HTTP client was called (server request made)
      expect(httpClient.executePost).toHaveBeenCalled();
    });

    it('should use cached credentials when they exist and are valid', async () => {
      // First call to cache credentials
      await getCredential();

      // Reset mock to verify it's not called again
      jest.clearAllMocks();

      // Second call should use cached credentials
      const token = await getCredential();

      // Verify token is returned correctly
      expect(token).toBe(mockToken);

      // Verify HTTP client was NOT called (using cache)
      expect(httpClient.executePost).not.toHaveBeenCalled();
    });

    it('should reload credentials from server when cached credentials are expired', async () => {
      // Mock credentialVerified to return false to simulate expired credentials
      const spy = jest.spyOn(require('../src/auth/authenticator'), 'credentialVerified');
      spy.mockReturnValueOnce(false);

      // Reset HTTP client mock to verify it's called
      jest.clearAllMocks();

      // Call getCredential which should reload from server due to expired credentials
      const token = await getCredential();

      // Verify token is returned correctly
      expect(token).toBe(mockToken);

      // Verify HTTP client was called (server request made)
      expect(httpClient.executePost).toHaveBeenCalled();

      // Restore original credentialVerified
      spy.mockRestore();
    });
  });

  describe('credentialVerified', () => {
    const originalSlid = process.env.slid;

    beforeEach(() => {
      // Set test slid
      process.env.slid = 'test-slid';
    });

    afterEach(() => {
      // Restore original slid
      process.env.slid = originalSlid;
    });

    it('should return true for valid credentials', () => {
      // Create valid credentials (not expired, matching slid)
      const validCredentials: ApiCredential = {
        slid: 'test-slid',
        token: 'valid-token',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      };

      const result = credentialVerified(validCredentials);
      expect(result).toBe(true);
    });

    it('should return false for credentials with missing token', () => {
      const invalidCredentials: ApiCredential = {
        slid: 'test-slid',
        token: '',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      const result = credentialVerified(invalidCredentials);
      expect(result).toBe(false);
    });

    it('should return false for credentials with non-matching slid', () => {
      const invalidCredentials: ApiCredential = {
        slid: 'wrong-slid',
        token: 'valid-token',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      const result = credentialVerified(invalidCredentials);
      expect(result).toBe(false);
    });

    it('should return false for expired credentials', () => {
      const expiredCredentials: ApiCredential = {
        slid: 'test-slid',
        token: 'valid-token',
        expiresAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      };

      const result = credentialVerified(expiredCredentials);
      expect(result).toBe(false);
    });

    it('should return false for credentials expiring soon (less than 2 hours)', () => {
      const expiringCredentials: ApiCredential = {
        slid: 'test-slid',
        token: 'valid-token',
        expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
      };

      const result = credentialVerified(expiringCredentials);
      expect(result).toBe(false);
    });
  });

  describe('loadFromServer', () => {
    const originalSlid = process.env.slid;

    beforeEach(() => {
      // Set test slid
      process.env.slid = 'test-slid';

      // Mock the HTTP client response
      (httpClient.executePost as jest.Mock).mockResolvedValue({
        statusCode: 200,
        context: {
          data: mockToken
        }
      });
    });

    afterEach(() => {
      // Restore original slid
      process.env.slid = originalSlid;
    });

    it('should fetch credentials from server and cache them', async () => {
      const credentials = await loadFromServer();

      // Verify the HTTP client was called with correct parameters
      expect(httpClient.executePost).toHaveBeenCalledWith({
        resource: 'auth/m2m/token',
        body: { clientId: 'test-slid' }
      });

      // Verify returned credentials
      expect(credentials).toHaveProperty('token', mockToken);
      expect(credentials).toHaveProperty('slid', 'test-slid');
      expect(credentials).toHaveProperty('expiresAt');

      // Verify credentials are cached by calling loadFromCache
      jest.clearAllMocks(); // Clear HTTP client mock
      const cachedCredentials = await loadFromCache();

      // Verify cached credentials match what was returned from server
      expect(cachedCredentials).toEqual(credentials);

      // Verify HTTP client was not called again
      expect(httpClient.executePost).not.toHaveBeenCalled();
    });

    it('should throw error when server returns non-200 status', async () => {
      // Mock error response
      (httpClient.executePost as jest.Mock).mockResolvedValue({
        statusCode: 401,
        context: {
          data: 'Unauthorized'
        }
      });

      // Expect the function to throw an error
      await expect(loadFromServer()).rejects.toThrow('Failed to load credentials from server');
    });

    it('should return credentials with null token when server returns 200 but no token', async () => {
      // Mock response with missing token
      (httpClient.executePost as jest.Mock).mockResolvedValue({
        statusCode: 200,
        context: {
          data: null
        }
      });

      // The function should still work but return credentials with null token
      const credentials = await loadFromServer();
      expect(credentials.token).toBeNull();
    });
  });

  describe('loadFromCache', () => {
    const originalSlid = process.env.slid;

    beforeEach(() => {
      // Set test slid
      process.env.slid = 'test-slid';

      // Mock the HTTP client response for loadFromServer fallback
      (httpClient.executePost as jest.Mock).mockResolvedValue({
        statusCode: 200,
        context: {
          data: mockToken
        }
      });
    });

    afterEach(() => {
      // Restore original slid
      process.env.slid = originalSlid;
    });

    it('should return cached credentials when they exist', async () => {
      // First call to loadFromServer to cache credentials
      const serverCredentials = await loadFromServer();

      // Clear HTTP client mock
      jest.clearAllMocks();

      // Load credentials from cache
      const cachedCredentials = await loadFromCache();

      // Verify credentials were loaded from cache, not server
      expect(cachedCredentials).toEqual(serverCredentials);
      expect(httpClient.executePost).not.toHaveBeenCalled();
    });

    it('should fall back to loadFromServer when no cached credentials exist', async () => {
      // Reset cache to ensure no cached credentials exist
      resetCache();

      // Load credentials from cache (should fall back to server)
      const credentials = await loadFromCache();

      // Verify loadFromServer was called
      expect(httpClient.executePost).toHaveBeenCalled();
      expect(credentials).toHaveProperty('token', mockToken);
    });
  });
});
