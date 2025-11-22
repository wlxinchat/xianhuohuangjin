/**
 * 配置管理模块
 * 集中管理应用配置，支持环境变量和默认值
 */

import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

// 加载环境变量
dotenvConfig({ path: resolve(__dirname, '../../.env') });

/**
 * 服务器配置接口
 */
export interface ServerConfig {
  port: number;
  host: string;
  nodeEnv: string;
  corsOrigin: string[];
}

/**
 * 数据配置接口
 */
export interface DataConfig {
  updateInterval: number;
  historyLimit: number;
  priceSimulation: {
    basePrice: number;
    volatility: number;
  };
}

/**
 * 日志配置接口
 */
export interface LogConfig {
  level: string;
  format: string;
  datePattern: string;
  maxFiles: string;
  maxSize: string;
}

/**
 * 数据库配置接口
 */
export interface DatabaseConfig {
  type: string;
  filename: string;
  logging: boolean;
}

/**
 * 应用配置接口
 */
export interface AppConfig {
  server: ServerConfig;
  data: DataConfig;
  log: LogConfig;
  database: DatabaseConfig;
}

/**
 * 获取环境变量，支持默认值
 */
function getEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * 获取环境变量（数字类型），支持默认值
 */
function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  return value ? parseInt(value, 10) : defaultValue;
}

/**
 * 获取环境变量（布尔类型），支持默认值
 */
function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * 解析CORS来源
 */
function parseCorsOrigin(origin: string): string[] {
  return origin.split(',').map((o) => o.trim());
}

/**
 * 应用配置对象
 */
export const config: AppConfig = {
  // 服务器配置
  server: {
    port: getEnvNumber('PORT', 3012),
    host: getEnv('HOST', '0.0.0.0'),
    nodeEnv: getEnv('NODE_ENV', 'development'),
    corsOrigin: parseCorsOrigin(getEnv('CORS_ORIGIN', 'http://localhost:3011,http://localhost:5173')),
  },

  // 数据配置
  data: {
    updateInterval: getEnvNumber('UPDATE_INTERVAL', 10000),
    historyLimit: getEnvNumber('HISTORY_LIMIT', 1000),
    priceSimulation: {
      basePrice: getEnvNumber('BASE_PRICE', 2000),
      volatility: getEnvNumber('VOLATILITY', 5),
    },
  },

  // 日志配置
  log: {
    level: getEnv('LOG_LEVEL', 'info'),
    format: getEnv('LOG_FORMAT', 'json'),
    datePattern: getEnv('LOG_DATE_PATTERN', 'YYYY-MM-DD'),
    maxFiles: getEnv('LOG_MAX_FILES', '14d'),
    maxSize: getEnv('LOG_MAX_SIZE', '20m'),
  },

  // 数据库配置
  database: {
    type: getEnv('DB_TYPE', 'sqlite'),
    filename: getEnv('DB_FILENAME', 'data/gold_trading.db'),
    logging: getEnvBoolean('DB_LOGGING', false),
  },
};

/**
 * 验证配置
 */
export function validateConfig(): void {
  const errors: string[] = [];

  // 验证端口号
  if (config.server.port < 1 || config.server.port > 65535) {
    errors.push(`Invalid port: ${config.server.port}. Port must be between 1 and 65535.`);
  }

  // 验证更新间隔
  if (config.data.updateInterval < 1000) {
    errors.push(`Invalid update interval: ${config.data.updateInterval}. Must be at least 1000ms.`);
  }

  // 验证历史记录限制
  if (config.data.historyLimit < 10) {
    errors.push(`Invalid history limit: ${config.data.historyLimit}. Must be at least 10.`);
  }

  // 验证日志级别
  const validLogLevels = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'];
  if (!validLogLevels.includes(config.log.level)) {
    errors.push(`Invalid log level: ${config.log.level}. Must be one of: ${validLogLevels.join(', ')}`);
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
}

/**
 * 打印配置信息（隐藏敏感信息）
 */
export function printConfig(): void {
  console.log('=== Application Configuration ===');
  console.log('Server:');
  console.log(`  Port: ${config.server.port}`);
  console.log(`  Host: ${config.server.host}`);
  console.log(`  Environment: ${config.server.nodeEnv}`);
  console.log(`  CORS Origin: ${config.server.corsOrigin.join(', ')}`);
  console.log('Data:');
  console.log(`  Update Interval: ${config.data.updateInterval}ms`);
  console.log(`  History Limit: ${config.data.historyLimit}`);
  console.log(`  Base Price: $${config.data.priceSimulation.basePrice}`);
  console.log(`  Volatility: ±${config.data.priceSimulation.volatility}`);
  console.log('Logging:');
  console.log(`  Level: ${config.log.level}`);
  console.log(`  Format: ${config.log.format}`);
  console.log('Database:');
  console.log(`  Type: ${config.database.type}`);
  console.log(`  File: ${config.database.filename}`);
  console.log('=================================');
}

// 默认导出配置对象
export default config;
