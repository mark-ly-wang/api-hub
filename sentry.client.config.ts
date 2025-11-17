/**
 * Sentry 客户端配置
 *
 * 用于浏览器端错误追踪和性能监控
 */

import * as Sentry from '@sentry/nextjs'
import { redactSensitiveData } from '@/lib/logger'

Sentry.init({
  // Sentry DSN - 从环境变量读取
  // 获取方式: https://sentry.io -> Settings -> Projects -> Client Keys (DSN)
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 环境标识
  environment: process.env.NODE_ENV || 'development',

  // 性能追踪采样率 (0.0 - 1.0)
  // 10% 的请求会被追踪,控制成本
  tracesSampleRate: 0.1,

  // 会话重放采样率 (可选)
  // replaysSessionSampleRate: 0.1,
  // replaysOnErrorSampleRate: 1.0,

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

    // 开发环境可以选择不上报,或者打印到控制台
    if (process.env.NODE_ENV === 'development') {
      console.error('[Sentry Client]', event, hint)
      // 可选: 开发环境不上报
      // return null
    }

    return event
  },

  // 忽略特定错误
  ignoreErrors: [
    // 常见的浏览器扩展错误
    'top.GLOBALS',
    // 网络错误
    'Network request failed',
    'NetworkError',
    // 取消的请求
    'AbortError',
  ],

  // 集成配置
  integrations: [
    // Browser Tracing (性能监控)
    Sentry.browserTracingIntegration({
      // 追踪路由变化
      enableInp: true,
    }),

    // Session Replay (可选,需要额外配额)
    // Sentry.replayIntegration({
    //   maskAllText: true,
    //   blockAllMedia: true,
    // }),
  ],

  // 禁用自动性能监控 (可选)
  // autoSessionTracking: false,

  // 自定义标签
  initialScope: {
    tags: {
      runtime: 'browser',
    },
  },
})
