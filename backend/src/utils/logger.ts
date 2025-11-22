/**
 * 专业日志系统
 * 使用Winston提供结构化日志记录
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { config } from '../config';
import { resolve } from 'path';

// 日志级别
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 日志颜色
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// 添加颜色配置
winston.addColors(colors);

// 自定义日志格式
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// 控制台日志格式（开发环境）
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...args } = info;
    const ts = timestamp as string;
    const argsStr = Object.keys(args).length ? JSON.stringify(args, null, 2) : '';
    return `${ts} [${level}]: ${message} ${argsStr}`;
  })
);

// 文件传输配置 - 错误日志
const errorFileTransport = new DailyRotateFile({
  filename: resolve(__dirname, '../../logs/error-%DATE%.log'),
  datePattern: config.log.datePattern,
  level: 'error',
  maxFiles: config.log.maxFiles,
  maxSize: config.log.maxSize,
  format: customFormat,
});

// 文件传输配置 - 所有日志
const combinedFileTransport = new DailyRotateFile({
  filename: resolve(__dirname, '../../logs/combined-%DATE%.log'),
  datePattern: config.log.datePattern,
  maxFiles: config.log.maxFiles,
  maxSize: config.log.maxSize,
  format: customFormat,
});

// 创建logger实例
const logger = winston.createLogger({
  level: config.log.level,
  levels,
  format: customFormat,
  transports: [
    errorFileTransport,
    combinedFileTransport,
  ],
  // 处理未捕获的异常
  exceptionHandlers: [
    new DailyRotateFile({
      filename: resolve(__dirname, '../../logs/exceptions-%DATE%.log'),
      datePattern: config.log.datePattern,
      maxFiles: config.log.maxFiles,
      maxSize: config.log.maxSize,
    }),
  ],
  // 处理未处理的Promise rejection
  rejectionHandlers: [
    new DailyRotateFile({
      filename: resolve(__dirname, '../../logs/rejections-%DATE%.log'),
      datePattern: config.log.datePattern,
      maxFiles: config.log.maxFiles,
      maxSize: config.log.maxSize,
    }),
  ],
});

// 开发环境添加控制台输出
if (config.server.nodeEnv !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

/**
 * HTTP请求日志中间件
 */
export const httpLogger = (req: any, res: any, next: any) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  });

  next();
};

/**
 * 性能监控日志
 */
export function logPerformance(operation: string, duration: number, metadata?: any) {
  logger.info({
    type: 'performance',
    operation,
    duration: `${duration}ms`,
    ...metadata,
  });
}

/**
 * 业务事件日志
 */
export function logEvent(event: string, metadata?: any) {
  logger.info({
    type: 'event',
    event,
    ...metadata,
  });
}

/**
 * 错误日志（带上下文）
 */
export function logError(error: Error, context?: any) {
  logger.error({
    type: 'error',
    message: error.message,
    stack: error.stack,
    context,
  });
}

/**
 * WebSocket事件日志
 */
export function logWebSocket(event: string, clientId?: string, metadata?: any) {
  logger.debug({
    type: 'websocket',
    event,
    clientId,
    ...metadata,
  });
}

/**
 * 数据库操作日志
 */
export function logDatabase(operation: string, table: string, duration?: number, metadata?: any) {
  logger.debug({
    type: 'database',
    operation,
    table,
    duration: duration ? `${duration}ms` : undefined,
    ...metadata,
  });
}

// 导出logger实例
export default logger;
