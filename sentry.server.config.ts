/**
 * Sentry 服务端配置
 *
 * 用于 Node.js 服务端错误追踪和性能监控
 */

import * as Sentry from '@sentry/nextjs'
import { redactSensitiveData } from '@/lib/logger'

Sentry.init({
  // Sentry DSN - 从环境变量读取
  // 注意: 服务端使用 SENTRY_DSN (不是 NEXT_PUBLIC_)
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 环境标识
  environment: process.env.NODE_ENV || 'development',

  // 性能追踪采样率
  tracesSampleRate: 0.1,

  // 错误过滤和数据脱敏
  beforeSend(event, hint) {
    // 过滤敏感数据
    if (event.request) {
      event.request = redactSensitiveData(event.request as any) as any
    }

    if (event.contexts) {
      event.contexts = redactSensitiveData(event.contexts as any) as any
    }

    if (event.extra) {
      event.extra = redactSensitiveData(event.extra as any)
    }

    // 脱敏请求体
    if (event.request?.data) {
      event.request.data = redactSensitiveData(event.request.data as any)
    }

    // 开发环境可以选择不上报
    if (process.env.NODE_ENV === 'development') {
      console.error('[Sentry Server]', event, hint)
      // 可选: 开发环境不上报
      // return null
    }

    return event
  },

  // 忽略特定错误
  ignoreErrors: [
    // 数据库连接错误 (这些应该通过监控告警,不需要上报 Sentry)
    'ECONNREFUSED',
    'ETIMEDOUT',
    // 客户端中断请求
    'ECONNRESET',
  ],

  // 自定义标签
  initialScope: {
    tags: {
      runtime: 'node',
    },
  },
})
