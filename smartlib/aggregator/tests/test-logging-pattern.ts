import logger, { withTraceId, generateTraceId } from '../src/logger';

// Test logging with default trace ID
console.log('Testing logging with default trace ID:');
logger.info('This is an info message');
logger.debug('This is a debug message');
logger.warn('This is a warning message');
logger.error('This is an error message', { someError: 'details' });

// Test logging with custom trace ID
console.log('\nTesting logging with custom trace ID:');
const traceId = generateTraceId();
withTraceId(traceId, () => {
  logger.info('This is an info message with custom trace ID');
  logger.debug('This is a debug message with custom trace ID');
  logger.warn('This is a warning message with custom trace ID');
  logger.error('This is an error message with custom trace ID', { someError: 'details' });
});

// Test logging without trace ID
console.log('\nTesting logging without trace ID:');
withTraceId(undefined, () => {
  logger.info('This is an info message without trace ID');
});

console.log('\nCheck the logs/combined.log file for the complete log output.');