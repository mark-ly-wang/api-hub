import { withAuth } from '@/lib/auth/middleware'

/**
 * 示例受保护的 API Route
 * 需要有效的 JWT Token 才能访问
 *
 * 测试方式:
 * 1. 有效 Token (Cookie):
 *    curl http://localhost:3000/api/protected \
 *      -H "Cookie: auth-token=<valid_jwt_token>"
 *
 * 2. 有效 Token (Authorization Header):
 *    curl http://localhost:3000/api/protected \
 *      -H "Authorization: Bearer <valid_jwt_token>"
 *
 * 3. 无 Token (应返回 401):
 *    curl http://localhost:3000/api/protected
 *
 * 4. 无效 Token (应返回 401):
 *    curl http://localhost:3000/api/protected \
 *      -H "Authorization: Bearer invalid_token"
 */
export const GET = withAuth(async (request, user) => {
  // user 对象已通过 JWT 验证，可以直接使用
  return Response.json({
    success: true,
    message: 'Protected data accessed successfully',
    user: {
      id: user.userId,
      email: user.email,
      membershipTier: user.membershipTier,
    },
    timestamp: new Date().toISOString(),
  })
})

/**
 * POST 方法示例 - 同样使用 withAuth 保护
 */
export const POST = withAuth(async (request, user) => {
  const body = await request.json()

  return Response.json({
    success: true,
    message: 'Data received',
    user: {
      id: user.userId,
      email: user.email,
      membershipTier: user.membershipTier,
    },
    receivedData: body,
  })
})
