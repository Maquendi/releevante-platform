import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';
import { AsyncLocalStorage } from 'async_hooks';
import fs from 'fs';
import path from 'path';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create a context store for trace IDs
const traceIdStorage = new AsyncLocalStorage<{ traceId: string }>();

// Create a custom format that includes the trace ID
const traceIdFormat = winston.format((info) => {
  const context = traceIdStorage.getStore();
  if (context) {
    info.traceId = context.traceId;
  }
  return info;
});

// Create a custom format that matches the requested pattern
const customFormat = winston.format.printf(({ level, message, timestamp, traceId, service, ...metadata }) => {
  // Format: %d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] [%X{X-Trace-Id:-NO_TRACE_ID}] %-5level %logger{36} - %msg%n
  let formattedTimestamp = '';
  if (timestamp) {
    // @ts-ignore
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
    formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }
  const thread = process.pid || 'main';
  const traceIdValue = traceId || 'NO_TRACE_ID';
  const logger = service || 'aggregator';

  // Format the metadata
  const metaStr = Object.keys(metadata).length > 0 
    ? ' ' + JSON.stringify(metadata) 
    : '';

  return `${formattedTimestamp} [${thread}] [${traceIdValue}] ${level.padEnd(5)} ${logger} - ${message}${metaStr}`;
});

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    traceIdFormat(),
    winston.format.timestamp(),
    customFormat
  ),
  defaultMeta: { service: 'aggregator' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        customFormat
      ),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Generate a new trace ID
export function generateTraceId(): string {
  return uuidv4();
}

// Run a function with a trace ID context
export function withTraceId<T>(traceId: string | undefined, fn: () => T): T {
  const actualTraceId = traceId || generateTraceId();
  return traceIdStorage.run({ traceId: actualTraceId }, fn);
}

// Get the current trace ID
export function getTraceId(): string | undefined {
  const context = traceIdStorage.getStore();
  return context?.traceId;
}

/**
 * LoggerUtil - A utility wrapper for the logger that automatically includes trace_id
 * This eliminates the need to call getTraceId() everywhere in the code
 */
class LoggerUtil {
  private logger: winston.Logger;
  public static TRACE_HEADER = "X-Trace-Id";
  constructor(logger: winston.Logger) {
    this.logger = logger;
  }

  /**
   * Add trace ID to log metadata if not already present
   */
  private addTraceId(meta: Record<string, any> = {}): Record<string, any> {
    if (!meta.traceId) {
      const traceId = getTraceId();
      if (traceId) {
        meta.traceId = traceId;
      }
    }
    return meta;
  }

  /**
   * Log an info message
   */
  info(message: string, meta: Record<string, any> = {}): void {
    this.logger.info(message, this.addTraceId(meta));
  }

  /**
   * Log an error message
   */
  error(message: string, meta: Record<string, any> = {}): void {
    this.logger.error(message, this.addTraceId(meta));
  }

  /**
   * Log a warning message
   */
  warn(message: string, meta: Record<string, any> = {}): void {
    this.logger.warn(message, this.addTraceId(meta));
  }

  /**
   * Log a debug message
   */
  debug(message: string, meta: Record<string, any> = {}): void {
    this.logger.debug(message, this.addTraceId(meta));
  }

  /**
   * Log a verbose message
   */
  verbose(message: string, meta: Record<string, any> = {}): void {
    this.logger.verbose(message, this.addTraceId(meta));
  }
}

// Create an instance of LoggerUtil with our configured logger
const loggerUtil = new LoggerUtil(logger);

// Export the LoggerUtil instance as the default export
// @ts-ignore
export default loggerUtil;
