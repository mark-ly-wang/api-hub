# 日志和监控使用指南

本文档介绍如何在 API Hub 项目中使用 Sentry 错误监控和结构化日志系统。

## 目录

- [Sentry 错误监控](#sentry-错误监控)
- [结构化日志 (Pino)](#结构化日志-pino)
- [敏感信息脱敏](#敏感信息脱敏)
- [测试和验证](#测试和验证)

---

## Sentry 错误监控

### 1. 创建 Sentry 账户

1. 访问 [https://sentry.io](https://sentry.io) 并注册账户
2. 创建新项目，选择 **Next.js** 模板
3. 复制项目 DSN (Data Source Name)

### 2. 配置环境变量

在 `.env.local` 文件中添加以下配置：

```bash
# Sentry 错误监控
NEXT_PUBLIC_SENTRY_DSN="https://your-public-key@o0.ingest.sentry.io/your-project-id"
SENTRY_DSN="https://your-public-key@o0.ingest.sentry.io/your-project-id"

# Source Maps 上传 (构建时使用)
SENTRY_AUTH_TOKEN="your-sentry-auth-token"
SENTRY_ORG="your-organization-slug"
SENTRY_PROJECT="api-hub"
```

**获取 Auth Token 步骤:**
1. 登录 Sentry Dashboard
2. Settings → Auth Tokens
3. Create New Token
4. 权限: `project:releases`, `project:write`

### 3. Sentry 配置说明

项目已配置以下 Sentry 文件：

- **`sentry.client.config.ts`** - 浏览器端错误追踪
- **`sentry.server.config.ts`** - Node.js 服务端错误追踪
- **`sentry.edge.config.ts`** - Edge Runtime 错误追踪
- **`instrumentation.ts`** - Sentry 初始化 hook（Next.js 16+ 必需）

**关键特性:**
- ✅ 10% 性能追踪采样率 (控制成本)
- ✅ 敏感数据自动脱敏 (`beforeSend` 钩子)
- ✅ 开发环境日志输出到控制台
- ✅ 生产环境自动上报到 Sentry

### 4. Source Maps 上传

构建时自动上传 Source Maps 到 Sentry：

```bash
npm run build
```

**验证 Source Maps:**
1. 触发错误后，在 Sentry Dashboard 查看 stack trace
2. 应该显示 TypeScript 源文件名 (`.ts`) 而非编译后的 `.js`
3. 行号应准确指向源代码位置

---

## 结构化日志 (Pino)

### 1. 导入日志工具

```typescript
import { logger } from '@/lib/logger'
```

### 2. 使用示例

#### 基本日志记录

```typescript
// 记录信息
logger.info('User logged in', {
  userId: 'user-123',
  email: 'user@example.com',
  timestamp: new Date().toISOString(),
})

// 记录警告
logger.warn('Slow query detected', {
  query: 'SELECT * FROM users',
  duration: 1500, // ms
})

// 记录错误
logger.error('API call failed', error, {
  apiName: 'upstream-service',
  statusCode: 500,
})

// 调试信息 (仅开发环境)
logger.debug('Cache hit', {
  key: 'user:123',
  value: { /* ... */ },
})
```

#### API Route 中使用

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 记录 API 调用
    logger.info('API called', {
      path: '/api/example',
      method: 'POST',
      userId: body.userId,
    })

    // 业务逻辑...

    return NextResponse.json({ success: true })
  } catch (error) {
    // 记录错误
    logger.error('API error', error instanceof Error ? error : undefined, {
      path: '/api/example',
      method: 'POST',
    })

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 3. 日志级别说明

| 级别 | 用途 | 示例场景 |
|------|------|----------|
| `debug` | 调试信息 (仅开发环境) | 缓存命中、函数参数 |
| `info` | 关键业务事件 | 用户登录、API 调用、计费事件 |
| `warn` | 潜在问题 (不影响功能) | 慢查询、资源占用高 |
| `error` | 功能失败的错误 | API 调用失败、数据库错误 |

### 4. 日志输出格式

**开发环境 (Pretty Print):**
```
[2025-11-16 15:00:00] INFO: User logged in
    userId: "user-123"
    email: "u***@example.com"  // 脱敏
    timestamp: "2025-11-16T15:00:00.000Z"
```

**生产环境 (JSON):**
```json
{
  "level": "info",
  "timestamp": "2025-11-16T15:00:00.000Z",
  "message": "User logged in",
  "userId": "user-123",
  "email": "u***@example.com",
  "pid": 12345,
  "hostname": "server-01"
}
```

---

## 敏感信息脱敏

### 自动脱敏的字段

日志系统会自动脱敏以下敏感字段：

| 字段类型 | 原始值 | 脱敏后 |
|---------|--------|--------|
| `password`, `secret`, `token` | `myPassword123` | `***REDACTED***` |
| `apiKey`, `key` | `sk_live_1234567890abcdef` | `sk_***...cdef` |
| `phone` | `13812345678` | `138****5678` |
| `email` | `testuser@example.com` | `t***@example.com` |

### 脱敏函数

可以手动调用脱敏函数：

```typescript
import { redactSensitiveData } from '@/lib/logger'

const userData = {
  id: 'user-123',
  email: 'test@example.com',
  password: 'secret123',
  apiKey: 'sk_live_abc123',
  phone: '13812345678',
}

const redacted = redactSensitiveData(userData)
// {
//   id: 'user-123',
//   email: 't***@example.com',
//   password: '***REDACTED***',
//   apiKey: 'sk_***...c123',
//   phone: '138****5678',
// }
```

---

## 测试和验证

### 1. 测试 Sentry 错误上报

访问测试 API 端点：

```bash
# 正常请求
curl http://localhost:3000/api/test-sentry

# 触发测试错误
curl "http://localhost:3000/api/test-sentry?error=true"
```

然后在 Sentry Dashboard 查看错误报告：
- Issues → 应该看到新的错误事件
- 点击错误查看 Stack Trace
- 验证文件名显示为 `.ts` 文件
- 验证行号准确指向源代码

### 2. 测试敏感信息脱敏

```bash
curl -X POST http://localhost:3000/api/test-sentry \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "should-be-redacted"
  }'
```

检查控制台日志，确认敏感字段被脱敏。

### 3. 测试结构化日志

在开发服务器运行时，访问任何 API 端点都会在控制台看到格式化的日志输出。

**验证要点:**
- ✅ 开发环境: 彩色、易读的格式化输出
- ✅ 日志包含时间戳、级别、消息和元数据
- ✅ 敏感字段被正确脱敏

---

## 生产环境配置

### Zeabur 环境变量配置

在 Zeabur Dashboard → Environment Variables 添加：

```
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=...
SENTRY_ORG=your-org
SENTRY_PROJECT=api-hub
LOG_LEVEL=info
```

### 查看生产日志

**Zeabur 日志:**
1. Zeabur Dashboard → Logs 标签页
2. 查看实时日志流
3. JSON 格式输出

**Sentry 错误:**
1. Sentry Dashboard → Issues
2. 实时错误告警
3. 邮件/Slack/Discord 通知

---

## 最佳实践

### 1. 日志记录原则

✅ **应该记录:**
- 关键业务事件 (登录、API 调用、计费)
- 错误和异常
- 性能瓶颈 (慢查询、超时)
- 安全相关事件 (认证失败、权限拒绝)

❌ **不应该记录:**
- 敏感数据明文 (密码、API Key)
- 高频无意义日志 (每秒数千条)
- 个人隐私信息 (完整手机号、邮箱)

### 2. 错误处理

```typescript
try {
  // 业务逻辑
} catch (error) {
  // 记录错误日志
  logger.error('Operation failed', error instanceof Error ? error : undefined, {
    operation: 'user-registration',
    userId: 'user-123',
  })

  // 手动上报到 Sentry (可选,通常自动捕获)
  if (error instanceof Error) {
    Sentry.captureException(error, {
      tags: {
        operation: 'user-registration',
      },
      extra: {
        userId: 'user-123',
      },
    })
  }

  // 返回用户友好的错误消息
  return { error: 'Registration failed. Please try again.' }
}
```

### 3. 性能监控

```typescript
import * as Sentry from '@sentry/nextjs'

// 使用 Sentry Transaction 追踪性能
const transaction = Sentry.startTransaction({
  op: 'api-call',
  name: 'POST /api/users',
})

try {
  // 业务逻辑
  const result = await createUser(userData)
  transaction.setStatus('ok')
  return result
} catch (error) {
  transaction.setStatus('internal_error')
  throw error
} finally {
  transaction.finish()
}
```

---

## 故障排查

### 问题: Sentry 错误未上报

**检查:**
1. 环境变量 `NEXT_PUBLIC_SENTRY_DSN` 是否正确
2. Sentry 项目状态是否激活
3. 开发环境是否在 `beforeSend` 中返回了 `null`
4. 网络连接是否正常

### 问题: Sentry 在 Next.js 16 中不工作

**原因:**
Next.js 16 不会自动加载 `sentry.*.config.ts` 文件。

**解决:**
确保项目根目录存在 `instrumentation.ts` 文件：
```typescript
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}
```

重启开发服务器后，日志中应该出现 `[Sentry Server]` 输出。

### 问题: Source Maps 未生效

**检查:**
1. `SENTRY_AUTH_TOKEN` 是否配置
2. `SENTRY_ORG` 和 `SENTRY_PROJECT` 是否正确
3. 构建时是否有上传错误提示
4. Token 权限是否包含 `project:releases` 和 `project:write`

### 问题: 日志未输出

**检查:**
1. `LOG_LEVEL` 环境变量设置 (默认: `info`)
2. 日志级别是否低于设置的级别 (例如 `debug` 日志在 `info` 级别不会输出)
3. 生产环境确认使用 JSON 格式输出

---

## 相关资源

- [Sentry Next.js 文档](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Pino 文档](https://getpino.io/)
- [Zeabur 日志查看](https://zeabur.com/docs/logs)

---

**最后更新:** 2025-11-16
**维护者:** Development Team
