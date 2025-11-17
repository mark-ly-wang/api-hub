#!/usr/bin/env tsx

/**
 * JWT 功能测试脚本
 * 用于验证 JWT 生成、验证和过期机制
 *
 * 运行方式:
 * npx tsx scripts/test-jwt.ts
 */

// 加载环境变量（必须在其他导入之前）
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { generateJWT, verifyJWT, JWTPayload } from '../lib/auth/jwt'
import { MembershipTier } from '@prisma/client'

// ANSI 颜色代码
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function assert(condition: boolean, message: string) {
  if (condition) {
    log(`✅ ${message}`, 'green')
  } else {
    log(`❌ ${message}`, 'red')
    throw new Error(`Assertion failed: ${message}`)
  }
}

async function runTests() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('JWT 功能测试', 'cyan')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan')

  // 测试 1: generateJWT 生成有效 Token
  log('测试 1: generateJWT() 生成有效 Token', 'blue')
  const testPayload: JWTPayload = {
    userId: 'test-user-123',
    email: 'test@example.com',
    membershipTier: MembershipTier.FREE,
  }

  const token = generateJWT(testPayload)
  assert(typeof token === 'string', 'Token 应该是字符串类型')
  assert(token.length > 0, 'Token 不应为空')
  assert(token.split('.').length === 3, 'JWT 应该包含 3 个部分 (Header.Payload.Signature)')
  log(`生成的 Token: ${token.substring(0, 50)}...\n`, 'yellow')

  // 测试 2: verifyJWT 验证有效 Token
  log('测试 2: verifyJWT() 验证有效 Token', 'blue')
  const decoded = verifyJWT(token)
  assert(decoded !== null, '有效 Token 应该能够验证成功')
  assert(decoded!.userId === testPayload.userId, 'userId 应该匹配')
  assert(decoded!.email === testPayload.email, 'email 应该匹配')
  assert(
    decoded!.membershipTier === testPayload.membershipTier,
    'membershipTier 应该匹配'
  )
  assert(typeof decoded!.iat === 'number', 'iat (issued at) 应该存在')
  assert(typeof decoded!.exp === 'number', 'exp (expires at) 应该存在')
  log(`解析的 Payload: ${JSON.stringify(decoded, null, 2)}\n`, 'yellow')

  // 测试 3: verifyJWT 拒绝无效 Token
  log('测试 3: verifyJWT() 拒绝无效 Token', 'blue')
  const invalidToken1 = 'invalid.token.signature'
  const result1 = verifyJWT(invalidToken1)
  assert(result1 === null, '无效 Token 应该返回 null')

  const invalidToken2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature'
  const result2 = verifyJWT(invalidToken2)
  assert(result2 === null, '签名无效的 Token 应该返回 null\n')

  // 测试 4: 验证 Token 结构
  log('测试 4: 验证 Token 结构', 'blue')
  const parts = token.split('.')
  assert(parts.length === 3, 'Token 应该有 3 个部分')
  assert(parts[0].length > 0, 'Header 不应为空')
  assert(parts[1].length > 0, 'Payload 不应为空')
  assert(parts[2].length > 0, 'Signature 不应为空\n')

  // 测试 5: 测试不同的 MembershipTier
  log('测试 5: 测试不同的 MembershipTier', 'blue')
  const tiers: MembershipTier[] = [
    MembershipTier.FREE,
    MembershipTier.VIP,
    MembershipTier.ENTERPRISE,
  ]

  for (const tier of tiers) {
    const payload: JWTPayload = {
      userId: `user-${tier}`,
      email: `${tier.toLowerCase()}@example.com`,
      membershipTier: tier,
    }
    const t = generateJWT(payload)
    const d = verifyJWT(t)
    assert(d !== null, `${tier} 会员 Token 应该有效`)
    assert(d!.membershipTier === tier, `${tier} 会员等级应该匹配`)
  }
  log('')

  // 测试 6: 验证 exp 时间（应该是 7 天后）
  log('测试 6: 验证 Token 有效期 (7 天)', 'blue')
  const now = Math.floor(Date.now() / 1000)
  const sevenDays = 7 * 24 * 60 * 60 // 7 天的秒数
  assert(
    decoded!.exp! > now,
    'exp (过期时间) 应该在未来'
  )
  const expiresIn = decoded!.exp! - now
  assert(
    expiresIn >= sevenDays - 10 && expiresIn <= sevenDays + 10,
    `Token 有效期应该约为 7 天 (实际: ${Math.floor(expiresIn / 86400)} 天)`
  )
  log(`Token 将在 ${Math.floor(expiresIn / 86400)} 天后过期\n`, 'yellow')

  // 测试 7: 测试 email 为 null 的情况
  log('测试 7: 测试 email 为 null 的情况', 'blue')
  const payloadWithoutEmail: JWTPayload = {
    userId: 'user-no-email',
    email: null,
    membershipTier: MembershipTier.FREE,
  }
  const tokenNoEmail = generateJWT(payloadWithoutEmail)
  const decodedNoEmail = verifyJWT(tokenNoEmail)
  assert(decodedNoEmail !== null, 'email 为 null 的 Token 应该有效')
  assert(decodedNoEmail!.email === null, 'email 应该为 null\n')

  // 总结
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('✅ 所有测试通过！JWT 功能正常工作', 'green')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan')

  log('下一步测试建议:', 'blue')
  log('1. 启动开发服务器: npm run dev', 'yellow')
  log('2. 测试受保护的 API Route:', 'yellow')
  log('   curl http://localhost:3000/api/protected \\', 'yellow')
  log(`     -H "Authorization: Bearer ${token.substring(0, 50)}..."`, 'yellow')
  log('3. 测试无效 Token (应返回 401):', 'yellow')
  log('   curl http://localhost:3000/api/protected', 'yellow')
}

// 运行测试
runTests().catch((error) => {
  log(`\n❌ 测试失败: ${error.message}`, 'red')
  console.error(error)
  process.exit(1)
})
