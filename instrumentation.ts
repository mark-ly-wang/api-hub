/**
 * Next.js Instrumentation Hook
 *
 * 用于在应用启动时初始化 Sentry SDK
 * 这在 Next.js 15 中是必需的，因为 sentry.*.config.ts 不会自动加载
 *
 * 文档: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // 服务端 (Node.js) 运行时
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }

  // Edge 运行时
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }

  // 注意: 客户端 (浏览器) Sentry 配置会通过 next.config.ts 自动注入
}
