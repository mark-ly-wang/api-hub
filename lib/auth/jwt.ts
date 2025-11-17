import jwt from 'jsonwebtoken'
import { MembershipTier } from '@prisma/client'
import { env } from '@/lib/env'

/**
 * JWT Payload 类型定义
 * 包含用户身份信息和元数据
 */
export interface JWTPayload {
  userId: string
  email: string | null
  membershipTier: MembershipTier
  iat?: number // issued at (自动添加)
  exp?: number // expires at (自动添加)
}

/**
 * JWT 配置常量
 */
const JWT_SECRET = env.NEXTAUTH_SECRET
const JWT_EXPIRES_IN = '7d' // 7 天有效期
const JWT_ALGORITHM = 'HS256' // HMAC-SHA256 对称加密

/**
 * 生成 JWT Token
 * @param payload - 用户信息 Payload
 * @returns JWT Token 字符串
 * @example
 * const token = generateJWT({
 *   userId: 'user123',
 *   email: 'user@example.com',
 *   membershipTier: 'FREE'
 * })
 */
export function generateJWT(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    expiresIn: JWT_EXPIRES_IN,
  })
}

/**
 * 验证 JWT Token 并提取 Payload
 * @param token - JWT Token 字符串
 * @returns 解析后的 Payload，验证失败返回 null
 * @example
 * const payload = verifyJWT(token)
 * if (payload) {
 *   console.log('User ID:', payload.userId)
 * }
 */
export function verifyJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: [JWT_ALGORITHM],
    }) as JWTPayload

    return decoded
  } catch (error) {
    // Token 验证失败（签名无效、已过期等）
    return null
  }
}
