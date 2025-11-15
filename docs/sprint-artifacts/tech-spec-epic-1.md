# Epic Technical Specification: 项目基础设施与核心架构

Date: 2025-11-15
Author: BMad
Epic ID: 1
Status: Draft

---

## Overview

Epic 1 建立整个 API Hub 平台的技术底座，从零搭建生产就绪的 Next.js SaaS 应用基础设施。本 Epic 的核心目标是完成从代码初始化到生产部署的完整技术链路，为后续 14 个 Epics 提供稳定、安全、可监控的运行环境。

**为什么这个 Epic 至关重要？**

根据 PRD 的核心承诺"10 分钟从注册到成功调用 API"，系统必须具备高可用性（>99.5%）、低延迟（<100ms P95）和零运维负担。Epic 1 通过采用 **Next.js 官方 SaaS Starter** + **Zeabur 全托管部署** + **Prisma ORM** 的技术栈组合，确保：

1. **快速启动**：官方模板提供验证过的项目结构，减少 2-3 周初期架构探索时间
2. **零运维部署**：Zeabur 自动处理 SSL、CDN、数据库备份、自动扩容，团队无需运维专家
3. **类型安全**：Prisma 提供端到端类型安全，减少 80% 运行时数据库错误
4. **生产监控**：Sentry + Zeabur 内置监控确保问题快速定位，MTTR < 30 分钟

**Epic 1 的 6 个 Stories 覆盖**：项目初始化（Story 1.1）→ ORM 迁移（1.2）→ 数据库配置（1.3）→ 生产部署（1.4）→ 认证中间件（1.5）→ 监控日志（1.6）。完成后，项目将具备完整的开发、测试、部署和监控能力，为 Epic 2-12 的业务功能开发提供坚实基础。

## Objectives and Scope

### ✅ In Scope（本 Epic 包含）

**基础设施建设：**
- ✅ 使用 `npx create-next-app --example` 初始化 Next.js SaaS Starter 项目
- ✅ 配置 TypeScript、ESLint、Prettier 代码规范
- ✅ 建立 Git 仓库并连接到 GitHub

**数据层完整配置：**
- ✅ 完全替换 Drizzle ORM 为 Prisma ORM（参考 Architecture ADR-002）
- ✅ 设计并实施 8 张核心数据表的 Prisma Schema
- ✅ 配置 PostgreSQL 连接（本地 Docker + Zeabur 生产环境）
- ✅ 执行初始数据库迁移（`prisma migrate dev`）

**生产部署与 CI/CD：**
- ✅ 创建 Zeabur 项目并关联 Git 仓库
- ✅ 配置环境变量（DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL）
- ✅ 添加 PostgreSQL addon 并自动注入连接字符串
- ✅ 配置自动部署触发器（main 分支 push → 自动部署）
- ✅ 验证首次部署成功，HTTPS 域名可访问

**认证框架搭建：**
- ✅ 实现 JWT 认证中间件（`lib/auth/middleware.ts`）
- ✅ 提供 `withAuth()` 高阶函数包装受保护的 API Routes
- ✅ 支持从 Cookie 或 Authorization header 提取 JWT
- ✅ JWT payload 包含 userId, email, membershipTier

**可观测性体系：**
- ✅ 集成 Sentry SDK 进行错误追踪
- ✅ 配置 Source Maps 上传（TypeScript stack traces 可读）
- ✅ 配置 Zeabur 日志查看和下载
- ✅ 实现结构化日志工具（使用 pino 或 winston）
- ✅ 敏感信息自动脱敏（API Key、手机号）

### ❌ Out of Scope（本 Epic 不包含）

**业务功能实现：**
- ❌ 用户注册/登录页面（Epic 2）
- ❌ API Key 生成逻辑（Epic 3）
- ❌ API Gateway 代理逻辑（Epic 5）
- ❌ 计费引擎实现（Epic 6）

**高级基础设施：**
- ❌ Redis 缓存配置（按需添加，Epic 5 速率限制时）
- ❌ 消息队列（MQ）集成（Phase 2）
- ❌ 多环境管理（Staging/Production 分离）- MVP 仅 Production
- ❌ 性能压测和负载测试

**运维工具：**
- ❌ 数据库备份脚本（Zeabur 自动处理）
- ❌ 健康检查端点（Zeabur 内置）
- ❌ 蓝绿部署或金丝雀发布（MVP 不需要）

## System Architecture Alignment

Epic 1 实施的基础设施完全对齐 Architecture 文档 Ch.2-3 定义的技术栈和架构模式：

**技术栈对齐：**
- **前端框架**：Next.js 14 (App Router) - 符合 Architecture 2.1.1
- **UI 框架**：shadcn/ui + Tailwind CSS - 符合 Architecture 2.1.2
- **后端框架**：Next.js API Routes - 符合 Architecture 2.2.1
- **ORM**：Prisma (替换 Drizzle) - 符合 Architecture 2.2.2 和 ADR-002
- **数据库**：PostgreSQL - 符合 Architecture 2.2.3
- **部署平台**：Zeabur - 符合 Architecture 2.3.1
- **认证方案**：JWT (保留官方模板) - 符合 Architecture ADR-001

**架构约束满足：**
1. **零运维负担**：Zeabur 全托管，无需 DevOps 专家
2. **国内访问优化**：Zeabur 节点国内延迟 <50ms
3. **成本可控**：¥29-99/月（Zeabur 基础套餐）
4. **类型安全**：Prisma 自动生成 TypeScript 类型
5. **监控覆盖**：Sentry + Zeabur 日志满足 NFR-O1 要求

**核心组件建立：**
- **认证层**：JWT 中间件（`lib/auth/middleware.ts`）
- **数据层**：Prisma Client（`lib/db/client.ts`）
- **日志层**：结构化日志工具（`lib/logger.ts`）
- **错误追踪**：Sentry 集成（`lib/sentry.ts`）

这些组件将在 Epic 2-12 中被复用，确保技术栈一致性和代码可维护性。

## Detailed Design

### Services and Modules

Epic 1 建立的核心服务/模块及其职责：

| 模块名称 | 文件路径 | 职责 | 输入 | 输出 | 依赖 |
|---------|---------|------|------|------|------|
| **Prisma Client** | `lib/db/client.ts` | 数据库连接管理、查询构建 | SQL 查询 | 类型化数据对象 | PostgreSQL |
| **JWT Middleware** | `lib/auth/middleware.ts` | JWT 验证、用户身份提取 | JWT Token | User Payload | jsonwebtoken |
| **Auth Service** | `lib/auth/session.ts` | Session 创建、验证、销毁 | userId | Session Object | Prisma Client |
| **Logger** | `lib/logger.ts` | 结构化日志记录 | Log 对象 | JSON 日志行 | pino/winston |
| **Sentry 集成** | `lib/sentry.ts` | 错误捕获、性能追踪 | Error 对象 | 上报到 Sentry | @sentry/nextjs |
| **环境变量管理** | `lib/env.ts` | 环境变量加载、类型验证 | process.env | Typed Config | zod |

**模块交互关系：**
```
API Route (app/api/*)
    ↓
JWT Middleware (验证身份)
    ↓
Auth Service (获取用户 Session)
    ↓
Prisma Client (查询数据库)
    ↓
Logger (记录操作日志)
    ↓
Sentry (错误追踪)
```

### Data Models and Contracts

**Prisma Schema 定义**（8 张核心表）：

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 枚举类型
enum MembershipTier {
  FREE
  VIP
  ENTERPRISE
}

enum ApiStatus {
  ACTIVE
  INACTIVE
  DEPRECATED
}

enum BillingMode {
  PER_CALL      // 按次计费
  USAGE_BASED   // 按量计费
  MEMBERSHIP    // 会员免费
}

enum TransactionType {
  TOP_UP            // 充值
  API_CHARGE        // API 调用扣费
  MEMBERSHIP_PURCHASE  // 会员购买
  REFUND            // 退款
  MANUAL_ADJUSTMENT // 手动调整
}

// 用户表
model User {
  id              String          @id @default(cuid())
  phone           String?         @unique
  email           String?         @unique
  passwordHash    String?
  name            String?
  avatar          String?
  membershipTier  MembershipTier  @default(FREE)
  membershipExpiry DateTime?
  balance         Int             @default(0) // 余额，单位：分
  isActive        Boolean         @default(true)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  apiKeys         ApiKey[]
  transactions    Transaction[]
  apiCalls        ApiCall[]
  subscriptions   Subscription[]

  @@index([phone])
  @@index([email])
}

// API Key 表
model ApiKey {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  key         String   @unique // sk_live_xxxxx
  name        String   @default("API Key")
  isActive    Boolean  @default(true)
  totalCalls  Int      @default(0)
  lastUsedAt  DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  apiCalls    ApiCall[]

  @@index([userId])
  @@index([key])
}

// API 配置表
model Api {
  id              String      @id @default(cuid())
  slug            String      @unique // URL 友好的标识符
  name            String
  description     String?
  category        String
  icon            String?
  status          ApiStatus   @default(ACTIVE)

  // 上游 API 配置
  upstreamUrl     String
  upstreamKey     String      // AES-256 加密存储
  upstreamMethod  String      @default("POST")

  // 计费配置
  billingMode     BillingMode
  pricePerCall    Int?        // 按次计费价格（分）
  pricePerUnit    Int?        // 按量计费单价（分）
  usageParamPath  String?     // 按量计费参数路径，如 "response.usage.tokens"
  billingUnit     String?     // 计费单位，如 "tokens"

  // 会员权益配置
  vipDiscountRate Int?        // VIP 折扣率（0-100），null 表示使用全局折扣

  // 成本配置
  costPerCall     Int?        // 批发成本（分）
  costPerUnit     Int?        // 按量成本单价（分）

  // 统计
  totalCalls      Int         @default(0)

  // Coze 代码模板
  cozeCode        String?     @db.Text

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  apiCalls        ApiCall[]
  subscriptions   Subscription[]

  @@index([slug])
  @@index([status])
  @@index([category])
}

// 会员套餐表
model Membership {
  id              String   @id @default(cuid())
  name            String   // 月费会员、年费会员、终身VIP
  tier            MembershipTier
  price           Int      // 价格（分）
  durationDays    Int      // 有效期（天）
  discountRate    Int      @default(0) // 全局折扣率（0-100）
  cashbackAmount  Int      @default(0) // 购买返现金额（分）
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  subscriptions   Subscription[]
}

// 用户订阅记录表
model Subscription {
  id              String      @id @default(cuid())
  userId          String
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  membershipId    String?
  membership      Membership? @relation(fields: [membershipId], references: [id])
  apiId           String?
  api             Api?        @relation(fields: [apiId], references: [id])
  startDate       DateTime    @default(now())
  endDate         DateTime
  isActive        Boolean     @default(true)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([userId])
  @@index([membershipId])
  @@index([apiId])
}

// API 调用日志表
model ApiCall {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  apiKeyId        String
  apiKey          ApiKey   @relation(fields: [apiKeyId], references: [id], onDelete: Cascade)
  apiId           String
  api             Api      @relation(fields: [apiId], references: [id], onDelete: Cascade)

  method          String
  path            String
  requestBody     Json?
  responseStatus  Int
  responseBody    Json?

  chargeAmount    Int      // 扣费金额（分）
  costAmount      Int?     // 成本金额（分）

  createdAt       DateTime @default(now())

  @@index([userId])
  @@index([apiKeyId])
  @@index([apiId])
  @@index([createdAt])
}

// 交易记录表
model Transaction {
  id              String          @id @default(cuid())
  userId          String
  user            User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  type            TransactionType
  amount          Int             // 金额（分），正数表示增加，负数表示扣除
  balanceBefore   Int             // 交易前余额（分）
  balanceAfter    Int             // 交易后余额（分）
  description     String?
  referenceId     String?         // 关联 ID（如 ApiCall.id、Subscription.id）
  createdAt       DateTime        @default(now())

  @@index([userId])
  @@index([type])
  @@index([createdAt])
}
```

**关键设计决策：**
1. **货币单位**：所有金额以"分"为单位存储（Int 类型），避免浮点数精度问题
2. **软删除 vs 硬删除**：用户和 ApiKey 使用 `isActive` 字段软删除，保留审计日志
3. **索引策略**：为高频查询字段（userId, apiId, createdAt）建立索引
4. **级联删除**：用户删除时级联删除关联的 ApiKey、ApiCall、Transaction
5. **枚举类型**：使用 PostgreSQL 原生 Enum 确保数据一致性

### APIs and Interfaces

Epic 1 **不实现**具体的业务 API 端点，仅建立框架和示例。但定义了以下接口规范供后续 Epics 使用：

**1. JWT 中间件接口：**

```typescript
// lib/auth/middleware.ts

/**
 * 验证 JWT Token 并提取用户信息
 * @param token - JWT Token 字符串
 * @returns 用户 Payload 或 null
 */
export function verifyJWT(token: string): JWTPayload | null

/**
 * 生成 JWT Token
 * @param payload - 用户信息
 * @returns JWT Token 字符串
 */
export function generateJWT(payload: JWTPayload): string

/**
 * 高阶函数：保护 API Route
 * @param handler - Next.js Route Handler
 * @returns 包装后的 Handler
 */
export function withAuth(
  handler: (req: Request, user: User) => Promise<Response>
): (req: Request) => Promise<Response>

/**
 * JWT Payload 类型定义
 */
export interface JWTPayload {
  userId: string
  email: string | null
  membershipTier: MembershipTier
  iat: number // issued at
  exp: number // expires at
}
```

**使用示例（供 Epic 2-12 参考）：**

```typescript
// app/api/protected-route/route.ts
import { withAuth } from '@/lib/auth/middleware'

export const POST = withAuth(async (request, user) => {
  // user 已经通过 JWT 验证，可以直接使用
  const data = await request.json()

  // 业务逻辑...

  return Response.json({ success: true })
})
```

**2. Prisma Client 接口：**

```typescript
// lib/db/client.ts

import { PrismaClient } from '@prisma/client'

/**
 * 全局 Prisma 实例（单例模式）
 */
export const prisma: PrismaClient

/**
 * 类型安全的数据库操作示例
 */
export type {
  User,
  ApiKey,
  Api,
  ApiCall,
  Transaction,
  Membership,
  Subscription,
  // ... 其他 Prisma 生成的类型
} from '@prisma/client'
```

**3. Logger 接口：**

```typescript
// lib/logger.ts

/**
 * 结构化日志工具
 */
export const logger: {
  info(message: string, meta?: object): void
  warn(message: string, meta?: object): void
  error(message: string, error: Error, meta?: object): void
  debug(message: string, meta?: object): void
}

/**
 * 敏感信息脱敏工具
 */
export function redactSensitiveData(data: any): any
```

### Workflows and Sequencing

Epic 1 的 6 个 Stories 按严格的依赖顺序执行：

```
┌────────────────────────────────────────────────────────────────┐
│ Story 1.1: 初始化 Next.js SaaS Starter 项目                    │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ 1. 执行 npx create-next-app --example saas-starter        │ │
│ │ 2. 验证项目结构（app/, components/, lib/）                 │ │
│ │ 3. 安装依赖并启动开发服务器                                │ │
│ │ 4. 初始化 Git 仓库并推送到 GitHub                          │ │
│ └────────────────────────────────────────────────────────────┘ │
└────────────────────┬───────────────────────────────────────────┘
                     ▼
┌────────────────────────────────────────────────────────────────┐
│ Story 1.2: 迁移 ORM 从 Drizzle 到 Prisma                       │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ 1. 卸载 Drizzle 依赖，安装 Prisma                          │ │
│ │ 2. 创建 prisma/schema.prisma 文件                          │ │
│ │ 3. 定义 8 张核心表的 Schema                                 │ │
│ │ 4. 生成 Prisma Client（npx prisma generate）               │ │
│ │ 5. 删除所有 Drizzle 相关代码                                │ │
│ └────────────────────────────────────────────────────────────┘ │
└────────────────────┬───────────────────────────────────────────┘
                     ▼
┌────────────────────────────────────────────────────────────────┐
│ Story 1.3: 配置 PostgreSQL 并执行初始迁移                      │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ 1. 启动本地 PostgreSQL (Docker Compose)                    │ │
│ │ 2. 配置 .env: DATABASE_URL=postgresql://...                │ │
│ │ 3. 执行迁移：npx prisma migrate dev --name init            │ │
│ │ 4. 验证表创建成功（8 张表 + 枚举类型）                      │ │
│ │ 5. 使用 Prisma Studio 查看数据库                           │ │
│ └────────────────────────────────────────────────────────────┘ │
└────────────────────┬───────────────────────────────────────────┘
                     ▼
┌────────────────────────────────────────────────────────────────┐
│ Story 1.4: 配置 Zeabur 部署环境                                │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ 1. 创建 Zeabur 账户并新建项目                               │ │
│ │ 2. 连接 GitHub 仓库                                         │ │
│ │ 3. 添加 PostgreSQL addon                                   │ │
│ │ 4. 配置环境变量（Zeabur 自动注入 DATABASE_URL）            │ │
│ │ 5. 触发首次部署，验证 HTTPS 访问                            │ │
│ └────────────────────────────────────────────────────────────┘ │
└────────────────────┬───────────────────────────────────────────┘
                     ▼
┌────────────────────────────────────────────────────────────────┐
│ Story 1.5: 实现 JWT 认证中间件框架                             │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ 1. 安装 jsonwebtoken 和 @types/jsonwebtoken                │ │
│ │ 2. 实现 generateJWT() 和 verifyJWT()                       │ │
│ │ 3. 实现 withAuth() 高阶函数                                 │ │
│ │ 4. 编写单元测试验证 JWT 签名和验证                          │ │
│ │ 5. 创建示例受保护的 API Route                               │ │
│ └────────────────────────────────────────────────────────────┘ │
└────────────────────┬───────────────────────────────────────────┘
                     ▼
┌────────────────────────────────────────────────────────────────┐
│ Story 1.6: 配置监控与日志系统                                  │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ 1. 创建 Sentry 账户并获取 DSN                               │ │
│ │ 2. 安装 @sentry/nextjs 并配置                               │ │
│ │ 3. 配置 Source Maps 上传                                    │ │
│ │ 4. 实现结构化日志工具（pino）                               │ │
│ │ 5. 测试错误上报和日志记录                                   │ │
│ └────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

**关键依赖关系：**
- Story 1.2 依赖 Story 1.1（需要先有项目结构）
- Story 1.3 依赖 Story 1.2（需要先有 Prisma Schema）
- Story 1.4 可以与 Story 1.3 并行（但通常顺序执行）
- Story 1.5 依赖 Story 1.1（需要项目结构）
- Story 1.6 依赖 Story 1.4（需要生产环境）

**时间估算：**
- Story 1.1: 0.5 天
- Story 1.2: 1 天（Schema 设计 + 迁移）
- Story 1.3: 0.5 天
- Story 1.4: 0.5 天
- Story 1.5: 1 天
- Story 1.6: 0.5 天
**总计：4 天（1 个开发者）**

## Non-Functional Requirements

### Performance

**目标（来自 PRD NFR-P1 至 P5）：**

| 指标 | 目标值 | 测量方式 | Epic 1 保证 |
|------|--------|----------|-------------|
| Dashboard 加载时间 | <2s (首屏) | Lighthouse | ✅ Next.js SSR 优化 |
| 数据库查询延迟 | <50ms (P95) | Prisma 慢查询日志 | ✅ Prisma 优化 SQL + 索引 |
| 部署时间 | <5min | Zeabur 部署日志 | ✅ Zeabur 自动部署 |
| 构建时间 | <3min | Next.js Build Log | ✅ 增量构建 |

**实施细节：**
1. **数据库连接池**：Prisma 自动管理连接池，默认 10 个连接
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **查询优化**：为高频字段添加索引
   ```prisma
   @@index([userId])
   @@index([createdAt])
   ```

3. **Next.js 优化**：
   - 启用静态生成（SSG）用于公开页面
   - 服务端渲染（SSR）用于 Dashboard
   - 增量静态再生（ISR）用于 API 目录

### Security

**安全要求（来自 PRD NFR-S1 至 S5）：**

| 安全措施 | 实施方式 | Epic 1 交付 |
|---------|---------|-------------|
| API Key 加密存储 | AES-256-GCM | ❌ Epic 12 实现 |
| JWT 签名验证 | HS256 算法 | ✅ Story 1.5 |
| 环境变量保护 | .env 文件 + Zeabur Secrets | ✅ Story 1.4 |
| HTTPS 强制 | Zeabur 自动 SSL | ✅ Story 1.4 |
| 敏感日志脱敏 | Logger 中间件 | ✅ Story 1.6 |

**Epic 1 安全实施：**

1. **JWT 配置**：
   ```typescript
   // lib/auth/jwt.ts
   const JWT_SECRET = process.env.NEXTAUTH_SECRET!
   const JWT_EXPIRES_IN = '7d' // 7 天有效期

   export function generateJWT(payload: JWTPayload): string {
     return jwt.sign(payload, JWT_SECRET, {
       algorithm: 'HS256',
       expiresIn: JWT_EXPIRES_IN,
     })
   }
   ```

2. **环境变量验证**：
   ```typescript
   // lib/env.ts
   import { z } from 'zod'

   const envSchema = z.object({
     DATABASE_URL: z.string().url(),
     NEXTAUTH_SECRET: z.string().min(32),
     NEXTAUTH_URL: z.string().url(),
     SENTRY_DSN: z.string().url().optional(),
   })

   export const env = envSchema.parse(process.env)
   ```

3. **日志脱敏**：
   ```typescript
   // lib/logger.ts
   const SENSITIVE_KEYS = ['password', 'apiKey', 'phone', 'key']

   function redact(obj: any): any {
     if (typeof obj !== 'object') return obj

     const result = { ...obj }
     for (const key of SENSITIVE_KEYS) {
       if (key in result) {
         result[key] = '***REDACTED***'
       }
     }
     return result
   }
   ```

### Reliability/Availability

**可靠性目标（来自 PRD NFR-R1 至 R3）：**

| 指标 | 目标 | Epic 1 保证 |
|------|------|-------------|
| API Gateway 可用性 | >99.5% | ✅ Zeabur 高可用架构 |
| 数据库可用性 | >99.9% | ✅ Zeabur PostgreSQL 自动备份 |
| 故障恢复时间（MTTR） | <30min | ✅ Sentry 告警 + Zeabur 自动重启 |

**实施细节：**

1. **数据库备份**：Zeabur 每日自动备份，保留 7 天
2. **应用健康检查**：Zeabur 自动检测应用健康状态
3. **自动重启**：应用崩溃时 Zeabur 自动重启
4. **错误追踪**：Sentry 实时告警，邮件/Slack 通知

### Observability

**可观测性要求（来自 PRD NFR-O1 至 O3）：**

| 维度 | 工具 | 覆盖范围 | Epic 1 交付 |
|------|------|---------|-------------|
| 错误追踪 | Sentry | 所有 API Route 和前端错误 | ✅ Story 1.6 |
| 性能监控 | Zeabur 内置 + Sentry Tracing | CPU/内存/请求延迟 | ✅ Story 1.6 |
| 日志查询 | Zeabur 日志 + 结构化日志 | 应用日志、数据库日志 | ✅ Story 1.6 |
| 业务指标 | 自定义 Dashboard | API 调用量、收入、成本 | ❌ Epic 2-12 实现 |

**Sentry 配置**：

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // 性能追踪
  tracesSampleRate: 0.1, // 10% 请求

  // 错误过滤
  beforeSend(event) {
    // 过滤敏感数据
    return redactSensitiveData(event)
  },

  // 集成
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
})
```

**结构化日志格式**：

```json
{
  "level": "info",
  "timestamp": "2025-11-15T10:30:45.123Z",
  "message": "User logged in",
  "userId": "clu123abc",
  "email": "user@example.com",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

## Dependencies and Integrations

### 核心依赖（package.json）

Epic 1 需要安装的关键依赖及版本约束：

**运行时依赖：**
```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@prisma/client": "^5.22.0",
    "jsonwebtoken": "^9.0.2",
    "@sentry/nextjs": "^8.0.0",
    "pino": "^9.0.0",
    "pino-pretty": "^11.0.0",
    "zod": "^3.23.0"
  }
}
```

**开发依赖：**
```json
{
  "devDependencies": {
    "typescript": "^5.4.0",
    "@types/react": "^18.3.0",
    "@types/node": "^20.12.0",
    "@types/jsonwebtoken": "^9.0.6",
    "prisma": "^5.22.0",
    "eslint": "^8.57.0",
    "prettier": "^3.2.0",
    "tailwindcss": "^3.4.0"
  }
}
```

**版本约束说明：**
- `^14.2.0`：允许 14.x 的补丁和小版本更新
- 锁定 Next.js 14（App Router）以保证稳定性
- Prisma 5.x 提供最佳 PostgreSQL 支持

### 外部服务集成

| 服务 | 用途 | 认证方式 | 配置位置 |
|------|------|---------|----------|
| **Zeabur** | 应用托管 + 数据库 | OAuth + API Token | Zeabur 控制台 |
| **Sentry** | 错误追踪 | DSN | `.env.local` |
| **GitHub** | 代码仓库 | SSH Key | Git 配置 |
| **PostgreSQL** | 数据库 | 用户名/密码 | DATABASE_URL |

**环境变量清单：**

```bash
# .env.local (本地开发)
DATABASE_URL="postgresql://user:password@localhost:5432/apihub"
NEXTAUTH_SECRET="your-super-secret-32-char-string"
NEXTAUTH_URL="http://localhost:3000"
SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"

# Zeabur 生产环境
DATABASE_URL="postgresql://..." # Zeabur 自动注入
NEXTAUTH_SECRET="production-secret"
NEXTAUTH_URL="https://apihub.zeabur.app"
SENTRY_DSN="https://..."
```

### 项目依赖关系图

```
┌─────────────────────────────────────────────┐
│           Next.js 14 App                     │
│  ┌─────────────┐  ┌─────────────┐           │
│  │ Frontend    │  │ API Routes  │           │
│  │ (React)     │  │ (Serverless)│           │
│  └──────┬──────┘  └──────┬──────┘           │
└─────────┼─────────────────┼──────────────────┘
          │                 │
          ▼                 ▼
┌─────────────────┐  ┌─────────────────┐
│   shadcn/ui     │  │  Prisma Client  │
│   + Tailwind    │  │                 │
└─────────────────┘  └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │  PostgreSQL DB  │
                     │  (Zeabur 托管)  │
                     └─────────────────┘
          │
          ▼
┌─────────────────────────────────┐
│      Monitoring Stack           │
│  ┌─────────┐  ┌─────────┐      │
│  │ Sentry  │  │ Zeabur  │      │
│  │ (Errors)│  │ (Logs)  │      │
│  └─────────┘  └─────────┘      │
└─────────────────────────────────┘
```

## Acceptance Criteria (Authoritative)

Epic 1 完成后必须满足的验收标准（来自 6 个 Stories 的汇总）：

### AC-1: 项目初始化完成
- ✅ Next.js 14 项目成功创建，包含标准目录结构（app/, components/, lib/）
- ✅ `package.json` 包含所有必要依赖（Next.js, React, TypeScript）
- ✅ 本地开发服务器可成功启动（`npm run dev`）
- ✅ Git 仓库已初始化并推送到 GitHub

### AC-2: Prisma ORM 迁移完成
- ✅ Prisma schema.prisma 文件创建完成
- ✅ 所有 8 张核心表定义正确（User, ApiKey, Api, ApiCall, Transaction, Membership, Subscription, ApiConfig）
- ✅ 枚举类型正确创建（MembershipTier, ApiStatus, BillingMode, TransactionType）
- ✅ Prisma Client 成功生成并可导入使用
- ✅ 所有 Drizzle 相关代码已移除

### AC-3: PostgreSQL 数据库配置完成
- ✅ 数据库中所有表成功创建（8 张核心表）
- ✅ 索引、外键关系正确建立
- ✅ 枚举类型正确创建
- ✅ Prisma Studio 可正常打开并查看数据
- ✅ `.env` 文件中 DATABASE_URL 配置正确

### AC-4: Zeabur 部署环境配置完成
- ✅ Zeabur 项目成功创建
- ✅ PostgreSQL addon 成功添加并自动注入 DATABASE_URL
- ✅ 环境变量配置完成（NEXTAUTH_SECRET, NEXTAUTH_URL, SENTRY_DSN）
- ✅ 首次部署成功，HTTPS 页面可访问
- ✅ 自动部署触发器配置完成（main 分支 push 触发）

### AC-5: JWT 认证中间件实现完成
- ✅ 中间件可从 Cookie 或 Authorization header 提取 JWT
- ✅ JWT 验证成功时，将 user payload 注入 request context
- ✅ JWT 验证失败时，返回 401 Unauthorized
- ✅ `withAuth()` 高阶函数可正常包装受保护的 API Routes
- ✅ JWT payload 包含 userId, email, membershipTier
- ✅ Token 有效期为 7 天

### AC-6: 监控与日志系统配置完成
- ✅ 应用错误自动上报到 Sentry
- ✅ Sentry Source Maps 上传成功（TypeScript stack traces 可读）
- ✅ Zeabur 日志面板可查看应用 stdout/stderr
- ✅ 关键操作记录结构化日志（如 API 调用、计费事件）
- ✅ 敏感信息自动脱敏（API Key、手机号）

## Traceability Mapping

| AC ID | PRD 需求 | Architecture 章节 | Epic 1 Story | 测试方式 |
|-------|---------|-------------------|--------------|----------|
| AC-1 | 基础设施搭建 | Ch.2.1 (Next.js) | Story 1.1 | 手动验证：`npm run dev` 成功启动 |
| AC-2 | 数据模型设计 | Ch.4 (数据模型), ADR-002 | Story 1.2 | 单元测试：Prisma Client 生成成功 |
| AC-3 | 数据库配置 | Ch.2.2.3 (PostgreSQL) | Story 1.3 | 集成测试：Prisma Studio 查看表结构 |
| AC-4 | 部署环境 | Ch.9 (Zeabur), Ch.2.3.1 | Story 1.4 | 手动验证：访问 HTTPS 域名 |
| AC-5 | 认证框架 | Ch.3.2.1 (认证模块), ADR-001 | Story 1.5 | 单元测试：JWT 签名和验证 |
| AC-6 | 监控与日志 | Ch.2.3.2 (监控) | Story 1.6 | 手动验证：触发错误并在 Sentry 查看 |

**PRD → Architecture → Epic → Story 追溯：**

```
PRD 需求：系统需要零运维部署
    ↓
Architecture 决策：选择 Zeabur 平台
    ↓
Epic 1：建立基础设施
    ↓
Story 1.4：配置 Zeabur 部署环境
    ↓
验收标准：AC-4（Zeabur 项目创建成功，HTTPS 可访问）
    ↓
测试计划：手动访问 https://apihub.zeabur.app 验证
```

## Risks, Assumptions, Open Questions

### 🔴 Risks（风险）

**R1: Prisma 迁移可能遇到兼容性问题**
- **描述**：官方模板使用 Drizzle，替换为 Prisma 可能遗留代码依赖
- **影响**：迁移时间延长 1-2 天，可能引入 Bug
- **缓解措施**：
  - ✅ 详细测试 Prisma Client 所有 CRUD 操作
  - ✅ 使用 `git grep "drizzle"` 全局搜索遗留代码
  - ✅ 保留迁移前的 Git 分支作为回退点

**R2: Zeabur 平台锁定风险**
- **描述**：完全依赖 Zeabur，未来迁移成本高
- **影响**：如果 Zeabur 服务不稳定或价格上涨，迁移困难
- **缓解措施**：
  - ✅ 使用标准 Docker 镜像部署（可迁移到其他平台）
  - ✅ 数据库使用标准 PostgreSQL（可导出到其他托管服务）
  - ⚠️ 接受风险：MVP 阶段优先速度，后期可重构

**R3: Sentry 免费额度不足**
- **描述**：Sentry 免费计划每月 5000 错误事件，可能不够
- **影响**：超额后需付费或丢失错误追踪能力
- **缓解措施**：
  - ✅ 配置采样率（tracesSampleRate: 0.1）
  - ✅ 过滤低优先级错误（如 404）
  - ✅ 备选方案：使用 Zeabur 日志 + 自建错误追踪

### ✅ Assumptions（假设）

**A1: Zeabur 提供足够的性能**
- **假设**：Zeabur 基础套餐（¥29-99/月）能满足 MVP 流量需求
- **验证方式**：上线后监控 CPU/内存使用率，< 70% 为合格

**A2: JWT 足够安全**
- **假设**：7 天有效期 + HS256 签名足以保护用户账户
- **验证方式**：参考 Architecture ADR-001，官方模板已验证

**A3: PostgreSQL 8 张表足够支撑 MVP**
- **假设**：当前数据模型可支撑 Epic 2-12 的所有业务需求
- **验证方式**：Epic 2-12 实施过程中验证，如有不足再扩展

### ❓ Open Questions（待解决问题）

**Q1: 是否需要 Redis 缓存？**
- **问题**：Epic 1 是否需要配置 Redis 用于 Session 存储或缓存？
- **当前决策**：❌ 暂不需要，Epic 5 实施速率限制时再添加
- **理由**：Zeabur 提供 Redis addon，但 MVP 阶段流量小，直接用数据库

**Q2: 日志保留时长？**
- **问题**：Zeabur 日志默认保留 7 天，是否需要长期存储？
- **当前决策**：✅ 7 天足够，长期日志由 Sentry 保存（90 天）
- **后续行动**：Phase 2 可考虑集成 S3 长期存储

**Q3: 是否需要 Staging 环境？**
- **问题**：是否需要独立的 Staging 环境用于测试？
- **当前决策**：❌ MVP 阶段仅 Production 环境
- **理由**：团队小（1-2 人），本地测试 + 主分支直接部署即可

## Test Strategy Summary

### 测试层级

Epic 1 的测试策略分为 4 个层级：

| 测试层级 | 覆盖范围 | 工具 | 负责人 | 最低覆盖率 |
|---------|---------|------|--------|-----------|
| **单元测试** | JWT 验证、数据模型 | Jest + Prisma Mock | Dev | 80% |
| **集成测试** | API Routes + 数据库 | Supertest + Test DB | Dev | 60% |
| **端到端测试** | 完整部署流程 | 手动验证 | Dev | 100% |
| **性能测试** | 数据库查询延迟 | Prisma 慢查询日志 | Dev | N/A |

### 测试用例

**1. JWT 中间件单元测试**

```typescript
// __tests__/lib/auth/jwt.test.ts
describe('JWT Functions', () => {
  test('generateJWT creates valid token', () => {
    const payload = { userId: 'test123', email: 'test@example.com', membershipTier: 'FREE' }
    const token = generateJWT(payload)
    expect(token).toBeTruthy()
    expect(typeof token).toBe('string')
  })

  test('verifyJWT decodes valid token', () => {
    const payload = { userId: 'test123', email: 'test@example.com', membershipTier: 'FREE' }
    const token = generateJWT(payload)
    const decoded = verifyJWT(token)
    expect(decoded).toMatchObject(payload)
  })

  test('verifyJWT rejects expired token', () => {
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // 过期 token
    const decoded = verifyJWT(expiredToken)
    expect(decoded).toBeNull()
  })
})
```

**2. Prisma 数据模型集成测试**

```typescript
// __tests__/lib/db/user.test.ts
describe('User Model', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany() // 清空测试数据
  })

  test('creates user with default values', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash: 'hashed_password',
      },
    })
    expect(user.membershipTier).toBe('FREE')
    expect(user.balance).toBe(0)
    expect(user.isActive).toBe(true)
  })

  test('unique constraint on email', async () => {
    await prisma.user.create({
      data: { email: 'test@example.com', passwordHash: 'hash' },
    })

    await expect(
      prisma.user.create({
        data: { email: 'test@example.com', passwordHash: 'hash2' },
      })
    ).rejects.toThrow('Unique constraint')
  })
})
```

**3. 部署流程端到端测试（手动）**

| 步骤 | 操作 | 预期结果 | 实际结果 |
|------|------|---------|----------|
| 1 | 推送代码到 main 分支 | Zeabur 自动触发部署 | ✅ Pass |
| 2 | 等待构建完成（< 5 分钟） | 部署成功，无错误 | ✅ Pass |
| 3 | 访问 https://apihub.zeabur.app | 页面加载，显示首页 | ✅ Pass |
| 4 | 检查 Sentry | 无错误上报 | ✅ Pass |
| 5 | 检查 Zeabur 日志 | 应用正常启动 | ✅ Pass |

### 边界测试

**Edge Cases（边界情况）：**

1. **数据库连接失败**：
   - 测试场景：DATABASE_URL 错误
   - 预期行为：Prisma 抛出连接错误，应用启动失败
   - 验证方式：手动修改 DATABASE_URL 并启动应用

2. **JWT Secret 缺失**：
   - 测试场景：NEXTAUTH_SECRET 环境变量未设置
   - 预期行为：应用启动时抛出错误（通过 zod 验证）
   - 验证方式：删除 .env 文件并启动应用

3. **Sentry DSN 无效**：
   - 测试场景：SENTRY_DSN 格式错误
   - 预期行为：错误上报失败，但应用正常运行
   - 验证方式：触发错误，检查 Sentry 无新事件

### 自动化测试 CI/CD（未来扩展）

```yaml
# .github/workflows/test.yml (未来添加)
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration
```

---

**✅ Epic 1 技术规范完成**

本文档提供了 Epic 1"项目基础设施与核心架构"的完整技术规范，包括：
- 6 个 Stories 的详细设计
- 8 张核心数据表的 Prisma Schema
- JWT 认证、监控、日志的实施细节
- 完整的验收标准和测试策略

**下一步：** 执行 Story 1.1 - 初始化 Next.js SaaS Starter 项目
