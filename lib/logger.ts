/**
 * 结构化日志工具 - 使用 Pino
 *
 * 功能:
 * - 开发环境: 使用 pino-pretty 格式化输出
 * - 生产环境: 输出 JSON 格式日志
 * - 敏感信息自动脱敏
 *
 * 使用示例:
 * ```typescript
 * import { logger } from '@/lib/logger'
 *
 * logger.info('API called', { userId: 'test', path: '/api/test' })
 * logger.error('Database error', error, { query: 'SELECT ...' })
 * ```
 */

import pino from 'pino'

/**
 * 敏感字段列表 - 需要脱敏的字段名
 */
const SENSITIVE_KEYS = [
  'password',
  'apiKey',
  'key',
  'phone',
  'email',
  'token',
  'secret',
  'authorization',
  'passwordHash',
  'upstreamKey',
]

/**
 * 敏感信息脱敏函数
 *
 * 规则:
 * - password, token, secret: 完全替换为 ***REDACTED***
 * - apiKey, key: 保留前缀和后4位 (sk_***...abc1)
 * - phone: 保留前3位和后4位 (138****5678)
 * - email: 保留用户名首字母和域名 (t***@example.com)
 *
 * @param data - 需要脱敏的数据对象
 * @returns 脱敏后的数据
 */
export function redactSensitiveData(data: any): any {
  if (!data || typeof data !== 'object') {
    return data
  }

  // 数组处理
  if (Array.isArray(data)) {
    return data.map(item => redactSensitiveData(item))
  }

  // 对象处理
  const redacted: any = {}

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase()

    // 检查是否为敏感字段
    const isSensitive = SENSITIVE_KEYS.some(
      sensitiveKey => lowerKey.includes(sensitiveKey.toLowerCase())
    )

    if (isSensitive && typeof value === 'string') {
      // 不同类型的脱敏策略
      if (lowerKey.includes('phone')) {
        // 手机号: 138****5678
        redacted[key] = value.length >= 11
          ? `${value.substring(0, 3)}****${value.substring(value.length - 4)}`
          : '***REDACTED***'
      } else if (lowerKey.includes('email')) {
        // 邮箱: t***@example.com
        const [username, domain] = value.split('@')
        redacted[key] = username && domain
          ? `${username.charAt(0)}***@${domain}`
          : '***REDACTED***'
      } else if (lowerKey.includes('key') || lowerKey.includes('apikey')) {
        // API Key: sk_***...abc1
        redacted[key] = value.length >= 8
          ? `${value.substring(0, 3)}***...${value.substring(value.length - 4)}`
          : '***REDACTED***'
      } else {
        // 默认完全脱敏
        redacted[key] = '***REDACTED***'
      }
    } else if (typeof value === 'object' && value !== null) {
      // 递归处理嵌套对象
      redacted[key] = redactSensitiveData(value)
    } else {
      redacted[key] = value
    }
  }

  return redacted
}

/**
 * 创建 Pino logger 实例
 */
const createLogger = () => {
  const isDevelopment = process.env.NODE_ENV === 'development'

  // 开发环境配置 - 使用简化的 JSON 格式，便于阅读
  if (isDevelopment) {
    return pino({
      level: process.env.LOG_LEVEL || 'debug',
      formatters: {
        level: (label) => {
          return { level: label }
        },
      },
      timestamp: pino.stdTimeFunctions.isoTime,
      // 开发环境使用 pretty 格式，但不使用 transport (避免 worker thread 问题)
      // 可选: 如果想要彩色输出，可以手动通过 pino-pretty CLI 管道输出
      // 例如: npm run dev | npx pino-pretty
    })
  }

  // 生产环境配置 - 输出 JSON
  return pino({
    level: process.env.LOG_LEVEL || 'info',
    formatters: {
      level: (label) => {
        return { level: label }
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  })
}

const pinoLogger = createLogger()

/**
 * 结构化日志工具
 *
 * 提供四个日志级别:
 * - debug: 调试信息 (仅开发环境)
 * - info: 关键业务事件 (如用户登录、API 调用)
 * - warn: 潜在问题 (如慢查询)
 * - error: 功能失败的错误 (如 API 调用失败)
 */
export const logger = {
  /**
   * 记录调试信息 (仅开发环境)
   * @param message - 日志消息
   * @param meta - 元数据对象
   */
  debug(message: string, meta?: object) {
    if (meta) {
      pinoLogger.debug(redactSensitiveData(meta), message)
    } else {
      pinoLogger.debug(message)
    }
  },

  /**
   * 记录关键业务事件
   * @param message - 日志消息
   * @param meta - 元数据对象
   */
  info(message: string, meta?: object) {
    if (meta) {
      pinoLogger.info(redactSensitiveData(meta), message)
    } else {
      pinoLogger.info(message)
    }
  },

  /**
   * 记录警告信息
   * @param message - 日志消息
   * @param meta - 元数据对象
   */
  warn(message: string, meta?: object) {
    if (meta) {
      pinoLogger.warn(redactSensitiveData(meta), message)
    } else {
      pinoLogger.warn(message)
    }
  },

  /**
   * 记录错误信息
   * @param message - 日志消息
   * @param error - Error 对象
   * @param meta - 额外的元数据
   */
  error(message: string, error?: Error | unknown, meta?: object) {
    const errorData: any = {
      ...meta,
    }

    if (error instanceof Error) {
      errorData.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    } else if (error) {
      errorData.error = error
    }

    pinoLogger.error(redactSensitiveData(errorData), message)
  },
}

/**
 * 导出类型
 */
export type Logger = typeof logger
