/**
 * Sentry Edge Runtime 配置
 *
 * 用于 Edge Runtime (Middleware, Edge API Routes) 错误追踪
 */

import * as Sentry from '@sentry/nextjs'
import { redactSensitiveData } from '@/lib/logger'

Sentry.init({
  // Sentry DSN
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

    // Edge Runtime 特定处理
    if (process.env.NODE_ENV === 'development') {
      console.error('[Sentry Edge]', event, hint)
      // return null // 可选: 开发环境不上报
    }

    return event
  },

  // 自定义标签
  initialScope: {
    tags: {
      runtime: 'edge',
    },
  },
})
