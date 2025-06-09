import { executePost } from '../src/htttp-client/http-client';
import logger from '../src/logger';
import { TransactionSyncDto, TransactionStatusSyncDto, TransactionStatus, TransactionItemStatus } from '../src/model/library-sync';

// Import the functions we want to test
// Note: We need to use require here because the functions are not exported as default
import {createTransactionApi, createTransactionStatusApi} from '../src/sync/synchronize-transactions';

// Mock the dependencies
jest.mock('../src/htttp-client/http-client', () => ({
  executePost: jest.fn(),
}));

jest.mock('../src/logger', () => ({
  debug: jest.fn(),
  error: jest.fn(),
}));

describe('Synchronize Transactions', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Default mock implementation for executePost
    (executePost as jest.Mock).mockResolvedValue({
      statusCode: 200,
      context: {
        data: [{ id: '123', status: 'success' }]
      }
    });
  });

  describe('createTransactionApi', () => {
    it('should create a transaction via API', async () => {
      // Arrange
      const token = 'test-token';
      const transactions: TransactionSyncDto[] = [
        { 
          transactionId: '123', 
          clientId: 'client1',
          createdAt: new Date(),
          items: [{ id: 'item1', cpy: 'copy1' }],
          transactionType: 'RENT'
        }
      ];
      // Act
      const result = await createTransactionApi(token, transactions);

      // Assert
      expect(executePost).toHaveBeenCalledWith({
        token,
        resource: 'clients/transactions',
        body: transactions,
      });

      expect(result).toEqual({
        statusCode: 200,
        context: {
          data: [{ id: '123', status: 'success' }]
        }
      });

      expect(logger.debug).toHaveBeenCalledWith('Creating API request for transactions', { 
        transactionCount: 1 
      });
      expect(logger.debug).toHaveBeenCalledWith('Executing POST request to create transactions');
      expect(logger.debug).toHaveBeenCalledWith('Transaction API request completed', { statusCode: 200 });
    });

    it('should handle API errors', async () => {
      // Arrange
      const token = 'test-token';
      const transactions: TransactionSyncDto[] = [{ 
        transactionId: '123', 
        clientId: 'client1', 
        createdAt: new Date(),
        items: [{ id: 'item1', cpy: 'copy1' }],
        transactionType: 'RENT'
      }];
      const error = new Error('API error');

      (executePost as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(createTransactionApi(token, transactions)).rejects.toThrow('API error');

      expect(logger.error).toHaveBeenCalledWith('Error executing transaction API request', {
        error: 'API error'
      });
    });
  });

  describe('createTransactionStatusApi', () => {
    it('should create transaction statuses via API', async () => {
      // Arrange
      const token = 'test-token';
      const statuses: TransactionStatusSyncDto[] = [
        { 
          clientId: 'client1',
          transactionStatus: [
            {
              id: 'status1',
              transactionId: 'transaction1',
              status: 0, // Using enum value for RETURNED_ON_TIME
              createdAt: new Date()
            }
          ],
          transactionItemStatus: [
            {
              id: 'itemStatus1',
              itemId: 'item1',
              status: 7, // Using enum value for BORROWED
              createdAt: new Date()
            }
          ]
        }
      ];

      // Act
      const result = await createTransactionStatusApi(token, statuses);

      // Assert
      expect(executePost).toHaveBeenCalledWith({
        token,
        resource: 'clients/transaction-status',
        body: statuses,
      });

      expect(result).toEqual({
        statusCode: 200,
        context: {
          data: [{ id: '123', status: 'success' }]
        }
      });

      expect(logger.debug).toHaveBeenCalledWith('Creating API request for transaction statuses', { 
        clientCount: 1 
      });
      expect(logger.debug).toHaveBeenCalledWith('Executing POST request to create transaction statuses');
      expect(logger.debug).toHaveBeenCalledWith('Transaction status API request completed', { statusCode: 200 });
    });

    it('should handle API errors', async () => {
      // Arrange
      const token = 'test-token';
      const statuses: TransactionStatusSyncDto[] = [{ 
        clientId: 'client1',
        transactionStatus: [
          {
            id: 'status1',
            transactionId: 'transaction1',
            status: 0, // Using enum value for RETURNED_ON_TIME
            createdAt: new Date()
          }
        ],
        transactionItemStatus: [
          {
            id: 'itemStatus1',
            itemId: 'item1',
            status: 7, // Using enum value for BORROWED
            createdAt: new Date()
          }
        ]
      }];
      const error = new Error('API error');

      (executePost as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(createTransactionStatusApi(token, statuses)).rejects.toThrow('API error');

      expect(logger.error).toHaveBeenCalledWith('Error executing transaction status API request', {
        error: 'API error'
      });
    });
  });
});
