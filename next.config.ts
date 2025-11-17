import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"

const nextConfig: NextConfig = {
  /* config options here */
  // 注意: instrumentation.ts 在 Next.js 16 中默认启用，无需配置
}

// Sentry 配置选项
const sentryWebpackPluginOptions = {
  // 自动注入 Sentry 配置到构建中
  // 这会自动上传 Source Maps 到 Sentry
  silent: true, // 构建时不输出 Sentry 日志

  // 组织和项目标识 (需要在 Sentry 创建项目后填写)
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Auth token (用于上传 Source Maps)
  // 从 Sentry 设置中生成: Settings -> Auth Tokens
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Source Maps 配置
  widenClientFileUpload: true, // 上传更多客户端文件的 Source Maps
  hideSourceMaps: true, // 生产环境隐藏 Source Maps
  disableLogger: true, // 禁用 Sentry SDK 的 debug logger
}

// 使用 Sentry 配置包装 Next.js 配置
export default withSentryConfig(nextConfig, sentryWebpackPluginOptions)
