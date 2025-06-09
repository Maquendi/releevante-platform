import { executePost, executeGet, executePatch, executePut, isServerReachable } from '../src/htttp-client/http-client';
import { ApiRequest, ApiResponse } from '../src/htttp-client/model';
import * as utils from '../src/htttp-client/utils';

// Mock the utils functions
jest.mock('../src/htttp-client/utils', () => ({
  buildRequestUrl: jest.fn(),
  buildHttpHeaders: jest.fn(),
}));

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('HTTP Client', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Default mock implementations
    (utils.buildRequestUrl as jest.Mock).mockReturnValue('https://test-api.com/resource');
    (utils.buildHttpHeaders as jest.Mock).mockReturnValue({ 'Content-Type': 'application/json' });
    
    // Default fetch response
    mockFetch.mockResolvedValue({
      json: async () => ({
        statusCode: 200,
        context: {
          data: { id: '123', name: 'Test' }
        }
      }),
    });
  });

  describe('executePost', () => {
    it('should make a POST request with the correct parameters', async () => {
      // Arrange
      const request: ApiRequest = {
        resource: 'users',
        token: 'test-token',
        body: { name: 'John Doe' },
      };

      // Act
      const response = await executePost(request);

      // Assert
      expect(utils.buildRequestUrl).toHaveBeenCalledWith(request);
      expect(utils.buildHttpHeaders).toHaveBeenCalledWith(request);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/resource',
        {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'John Doe' }),
        }
      );
      expect(response).toEqual({
        statusCode: 200,
        context: {
          data: { id: '123', name: 'Test' }
        }
      });
    });

    it('should handle API errors', async () => {
      // Arrange
      const request: ApiRequest = {
        resource: 'users',
        body: { name: 'John Doe' },
      };

      mockFetch.mockResolvedValue({
        json: async () => ({
          statusCode: 400,
          context: {
            data: { error: 'Bad Request' }
          }
        }),
      });

      // Act
      const response = await executePost(request);

      // Assert
      expect(response).toEqual({
        statusCode: 400,
        context: {
          data: { error: 'Bad Request' }
        }
      });
    });
  });

  describe('executeGet', () => {
    it('should make a GET request with the correct parameters', async () => {
      // Arrange
      const request: ApiRequest = {
        resource: 'users/123',
        token: 'test-token',
      };

      // Act
      const response = await executeGet(request);

      // Assert
      expect(utils.buildRequestUrl).toHaveBeenCalledWith(request);
      expect(utils.buildHttpHeaders).toHaveBeenCalledWith(request);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/resource',
        {
          method: 'get',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      expect(response).toEqual({
        statusCode: 200,
        context: {
          data: { id: '123', name: 'Test' }
        }
      });
    });
  });

  describe('executePatch', () => {
    it('should make a PATCH request with the correct parameters', async () => {
      // Arrange
      const request: ApiRequest = {
        resource: 'users/123',
        token: 'test-token',
      };

      // Act
      const response = await executePatch(request);

      // Assert
      expect(utils.buildRequestUrl).toHaveBeenCalledWith(request);
      expect(utils.buildHttpHeaders).toHaveBeenCalledWith(request);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/resource',
        {
          method: 'patch',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      expect(response).toEqual({
        statusCode: 200,
        context: {
          data: { id: '123', name: 'Test' }
        }
      });
    });
  });

  describe('executePut', () => {
    it('should make a PUT request with the correct parameters', async () => {
      // Arrange
      const request: ApiRequest = {
        resource: 'users/123',
        token: 'test-token',
        body: { name: 'Updated Name' },
      };

      // Act
      const response = await executePut(request);

      // Assert
      expect(utils.buildRequestUrl).toHaveBeenCalledWith(request);
      expect(utils.buildHttpHeaders).toHaveBeenCalledWith(request);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/resource',
        {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Updated Name' }),
        }
      );
      expect(response).toEqual({
        statusCode: 200,
        context: {
          data: { id: '123', name: 'Test' }
        }
      });
    });
  });

  describe('isServerReachable', () => {
    it('should return true', async () => {
      // Act
      const result = await isServerReachable();

      // Assert
      expect(result).toBe(true);
    });
  });
});