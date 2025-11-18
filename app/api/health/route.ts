import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

// 强制动态路由，不使用缓存
export const dynamic = 'force-dynamic'

/**
 * 健康检查端点
 *
 * 用于 Kubernetes Liveness 和 Readiness Probes
 *
 * 检查项:
 * 1. API 服务是否正常运行
 * 2. 数据库连接是否正常
 *
 * 返回格式:
 * - 200: 服务健康
 * - 503: 服务不健康（数据库连接失败等）
 */
export async function GET() {
  try {
    // 检查数据库连接（执行简单查询）
    await prisma.$queryRaw`SELECT 1 as health_check`

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        api: 'ok',
        database: 'connected',
      },
    })
  } catch (error) {
    // 数据库连接失败
    console.error('[Health Check] Database connection failed:', error)

    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: {
        api: 'ok',
        database: 'disconnected',
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    }, {
      status: 503  // Service Unavailable
    })
  }
}
