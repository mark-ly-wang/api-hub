import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Kubernetes 环境连接池优化配置
const prismaOptions = {
  log: process.env.LOG_LEVEL === 'debug'
    ? ['query', 'error', 'warn']
    : ['error'],

  // 连接池配置（Kubernetes 多副本场景优化）
  // 每个 Pod 限制连接数，避免总连接数过多导致数据库拒绝连接
  // 默认: connection_limit = 10, pool_timeout = 10s
  //
  // 计算公式:
  //   总连接数 = Pod数量 × connection_limit
  //   例如: 5 个 Pod × 10 连接 = 50 个总连接
  //
  // Supabase Free Tier 限制: 50 个连接
  // Supabase Pro Tier: 200 个连接
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
} as const

export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaOptions)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export type {
  User,
  ApiKey,
  Api,
  ApiCall,
  Transaction,
  Membership,
  Subscription,
} from '@prisma/client'
