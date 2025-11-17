import { NextRequest, NextResponse } from 'next/server'
import { JWTPayload, verifyJWT } from './jwt'

/**
 * Cookie 名称常量
 */
const AUTH_COOKIE_NAME = 'auth-token'

/**
 * 从请求中提取 JWT Token
 * 优先级: Cookie > Authorization Header
 * @param request - Next.js Request 对象
 * @returns Token 字符串或 null
 */
export function extractTokenFromRequest(request: NextRequest): string | null {
  // 1. 优先从 Cookie 中提取 Token
  const cookieToken = request.cookies.get(AUTH_COOKIE_NAME)?.value
  if (cookieToken) {
    return cookieToken
  }

  // 2. 从 Authorization header 提取 Token (格式: Bearer xxx)
  const authHeader = request.headers.get('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7) // 去掉 "Bearer " 前缀
    return token
  }

  // 3. Token 不存在
  return null
}

/**
 * 扩展的 User 类型（包含 JWT Payload 信息）
 * 用于传递给受保护的 API Route Handler
 */
export interface AuthenticatedUser {
  userId: string
  email: string | null
  membershipTier: string
}

/**
 * 高阶函数：保护 API Route
 * 验证 JWT Token，成功后将 user 信息注入 handler
 *
 * @param handler - 需要保护的 API Route Handler
 * @returns 包装后的 Handler
 *
 * @example
 * // app/api/protected/route.ts
 * import { withAuth } from '@/lib/auth/middleware'
 *
 * export const GET = withAuth(async (request, user) => {
 *   return Response.json({
 *     message: 'Protected data',
 *     user: {
 *       id: user.userId,
 *       email: user.email,
 *       tier: user.membershipTier,
 *     },
 *   })
 * })
 */
export function withAuth(
  handler: (request: NextRequest, user: AuthenticatedUser) => Promise<Response>
): (request: NextRequest) => Promise<Response> {
  return async (request: NextRequest): Promise<Response> => {
    try {
      // 1. 提取 Token
      const token = extractTokenFromRequest(request)

      if (!token) {
        return NextResponse.json(
          {
            success: false,
            error: 'Unauthorized',
            message: 'No authentication token provided',
          },
          { status: 401 }
        )
      }

      // 2. 验证 Token
      const payload = verifyJWT(token)

      if (!payload) {
        return NextResponse.json(
          {
            success: false,
            error: 'Unauthorized',
            message: 'Invalid or expired token',
          },
          { status: 401 }
        )
      }

      // 3. 构造 User 对象
      const user: AuthenticatedUser = {
        userId: payload.userId,
        email: payload.email,
        membershipTier: payload.membershipTier,
      }

      // 4. 调用原始 handler，传递 user 信息
      return await handler(request, user)
    } catch (error) {
      // 5. 处理异步错误
      console.error('Authentication error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Internal Server Error',
          message: 'Authentication failed due to server error',
        },
        { status: 500 }
      )
    }
  }
}
