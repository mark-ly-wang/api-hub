# Architecture Risk Scan - Epic 2-12

**Date**: 2025-01-19
**Scope**: Epic 2-12 (MVP Phase)
**Purpose**: 识别所有可能导致"策略动摇"的关键架构决策，避免 Epic 1 的返工问题
**Methodology**: 扫描每个 Epic 的技术需求，识别"高切换成本"的架构选择

---

## 🎯 Executive Summary

本次扫描识别了 **12 个关键架构决策点**，分为以下优先级：

- 🔴 **P0 - 必须在相应 Epic 开始前决策** (3 个)
- 🟠 **P1 - 建议在相应 Epic 开始前决策** (5 个)
- 🟡 **P2 - 可以边做边调整** (4 个)

**总体风险评估**: 🟠 **中等风险**
- Epic 2 有 3 个 P0/P1 决策点（SMS、Email、Session）
- Epic 5-6 有 2 个 P0 决策点（网关架构、计费并发）
- Epic 11 有 1 个 P0 决策点（支付渠道）

---

## 📊 Epic-by-Epic Risk Analysis

### Epic 2: 用户认证与账户管理

**FR 覆盖**: FR1-FR8
**Stories**: 8 个
**整体风险**: 🟠 **中等**

#### 🔴 Decision 1: SMS Provider Selection (P0)

**问题**: Story 2.1 需要发送短信验证码，选择哪个 SMS 服务商？

**选项**:
1. **阿里云短信** - 国内主流，¥0.045/条
2. **腾讯云短信** - 类似阿里云，¥0.05/条
3. **Twilio** - 国际主流，国内需要备案，¥0.50/条

**决策标准**:
- 国内可用性（MVP 主要服务国内用户）
- 价格（预计月发送 1000-5000 条）
- API 易用性
- 文档质量

**推荐决策**: **阿里云短信**
- ✅ 国内稳定，延迟低
- ✅ 价格便宜
- ✅ 文档中文友好
- ⚠️ 需要实名认证和短信签名审核（1-2 天）

**切换成本**: 🟠 中等（需要重写 SMS 发送逻辑，~2-3 小时）

**何时决策**: ✅ **在 Epic 2 开始前**（需要提前注册并完成审核）

**风险**: 如果不提前决策，Epic 2 开始时可能因等待审核而阻塞

---

#### 🟠 Decision 2: Email Service Selection (P1)

**问题**: Story 2.2 需要发送邮箱验证链接和密码重置邮件，选择哪个邮件服务？

**选项**:
1. **Resend** - 新兴服务，开发者友好，免费额度 3000/月
2. **SendGrid** - 老牌服务，免费额度 100/天
3. **AWS SES** - 便宜但配置复杂，¥0.10/千封
4. **Mailgun** - 稳定但贵，免费额度 5000/月（前3个月）

**决策标准**:
- 免费额度（MVP 初期预计 <1000/月）
- API 易用性
- 送达率
- 国内访问速度

**推荐决策**: **Resend**
- ✅ 现代化 API，TypeScript 友好
- ✅ 免费额度足够（3000/月）
- ✅ 文档优秀，快速集成
- ⚠️ 较新服务，送达率未经长期验证

**切换成本**: 🟡 低（邮件服务 API 相似，切换成本 ~1-2 小时）

**何时决策**: ✅ **在 Epic 2 开始前**

**风险**: 低（邮件服务切换成本小，可以先用 Resend，后期切换）

---

#### 🟠 Decision 3: Session Storage Strategy (P1)

**问题**: Story 2.8 提到"可选：显示所有活跃 session 列表"，是否需要 Session 管理？

**选项**:
1. **无状态 JWT**（当前方案）- 简单但无法撤销 Token
2. **Redis Session Store** - 可撤销、可列表，但增加复杂度
3. **数据库 Session Table** - 可持久化，但查询慢

**决策标准**:
- 是否需要"查看所有活跃设备"功能？
- 是否需要"单独注销某个设备"功能？
- 安全性要求（Token 泄露后能否立即撤销？）

**推荐决策**: **先用无状态 JWT，Epic 2 暂不做 Session 管理**
- ✅ 简单，符合 MVP 快速迭代原则
- ✅ JWT 已在 Story 1.5 实现
- ⚠️ 后期如需撤销功能，可在 Epic 12（安全）时添加 Redis

**切换成本**: 🟡 中低（从无状态切换到 Redis 需要 ~4-6 小时）

**何时决策**: ✅ **Epic 2 开始前确认**（建议先不做，Story 2.8 的"可选"功能推迟）

**风险**: 中低（MVP 可以不做 Session 管理，后期扩展）

---

### Epic 3: API Key 生命周期管理

**FR 覆盖**: FR9-FR13
**Stories**: 5 个
**整体风险**: 🟢 **低**

#### 无关键架构决策

Epic 3 的实现相对明确：
- API Key 生成使用 `crypto.randomBytes()`
- 存储在 `ApiKey` 表（已在 Prisma Schema 定义）
- 无需外部服务依赖

**建议**: 直接按照 Story 执行即可。

---

### Epic 4: API 市场与浏览体验

**FR 覆盖**: FR28-FR34
**Stories**: 7 个
**整体风险**: 🟢 **低**

#### 🟡 Decision 4: Search Implementation (P2)

**问题**: Story 4.3 需要搜索功能，使用什么方案？

**选项**:
1. **PostgreSQL ILIKE** - 简单但慢
2. **PostgreSQL Full-Text Search** - 内置，性能好
3. **Algolia / MeiliSearch** - 专业搜索引擎，快但需额外服务

**推荐决策**: **先用 PostgreSQL ILIKE，后期优化**
- ✅ MVP 数据量小（<100 个 API），ILIKE 足够
- ✅ 无需额外服务
- 🔄 后期可平滑升级到 Full-Text Search 或 Algolia

**切换成本**: 🟢 低（搜索逻辑封装在一个函数，切换成本 ~2 小时）

**何时决策**: 🕐 **Epic 4 执行时决策**（可以边做边调整）

---

### Epic 5: API 网关核心引擎

**FR 覆盖**: FR35-FR42
**Stories**: 8 个
**整体风险**: 🔴 **高**

#### 🔴 Decision 5: Gateway Architecture (P0) ⚠️ **关键**

**问题**: 网关核心逻辑如何实现？单体 API Route 还是独立微服务？

**选项**:

**Option A: Next.js API Route (单体架构)**
```typescript
// app/api/gateway/[api_slug]/route.ts
export async function POST(request: Request) {
  // 1. 验证 API Key
  // 2. 检查余额
  // 3. 速率限制
  // 4. 代理到上游
  // 5. 计费
  // 6. 记录日志
}
```

**Option B: 独立 Node.js 网关服务 (微服务架构)**
```
api-hub-web (Next.js) ←→ api-gateway-service (Express/Fastify)
                             ↓
                          Upstream APIs
```

**对比分析**:

| 维度 | Option A (单体) | Option B (微服务) |
|------|----------------|------------------|
| **开发速度** | ✅ 快（1-2 天） | ❌ 慢（4-5 天） |
| **部署复杂度** | ✅ 简单（已有 K8s） | ❌ 复杂（需额外 Deployment） |
| **性能** | 🟡 中等（Next.js overhead） | ✅ 高（专门优化） |
| **可扩展性** | 🟡 水平扩展 Pod | ✅ 独立扩展网关 |
| **技术栈一致性** | ✅ 统一 Next.js | ❌ 需维护多技术栈 |
| **故障隔离** | ❌ 与 Web 共享资源 | ✅ 独立故障域 |
| **适用场景** | MVP 快速验证 | 大规模生产 |

**推荐决策**: **Option A - Next.js API Route（MVP 阶段）**

**理由**:
1. ✅ **快速启动**: Epic 5 可在 1-2 天完成核心逻辑
2. ✅ **简化部署**: 无需额外服务，复用 K8s Deployment
3. ✅ **技术栈一致**: 团队只需熟悉 Next.js
4. ✅ **足够性能**: Next.js API Route 可处理 1000+ QPS（MVP 远低于此）
5. 🔄 **可迁移性**: 后期可抽离为独立服务，接口不变

**切换成本**: 🔴 **极高**（从单体重构为微服务需要 3-5 天）

**何时决策**: ✅ **在 Epic 5 开始前**

**何时重新评估**: 当日 API 调用量 > 10万次/天时，考虑独立网关服务

**风险**: 🔴 高（这是整个平台的核心架构，一旦选错影响巨大）

---

#### 🟡 Decision 6: Rate Limiting Storage (P2)

**问题**: Story 5.5 速率限制的计数器存储在哪里？

**选项**:
1. **Memory (Node.js Map)** - 最快但不支持多 Pod
2. **Redis** - 标准方案，支持分布式
3. **Database** - 慢且不适合高频写

**推荐决策**: **Redis**（需要在 Epic 5 开始前部署）

**部署方式**:
- Supabase 不提供 Redis（仅 PostgreSQL）
- 使用 **Upstash Redis**（Serverless Redis，免费额度 10K 命令/天）
- 或自建 Redis（K8s StatefulSet）

**切换成本**: 🟡 中等（~3-4 小时）

**何时决策**: ✅ **Epic 5 开始前**

---

### Epic 6: 智能计费引擎

**FR 覆盖**: FR43-FR53
**Stories**: 7 个
**整体风险**: 🔴 **高**

#### 🔴 Decision 7: Billing Concurrency Control (P0) ⚠️ **关键**

**问题**: 如何保证计费的并发安全？防止余额被重复扣减？

**场景**: 用户同时发起 10 个 API 请求，每个扣费 ¥1，余额 ¥5
- ❌ **错误实现**: 10 个请求都检查余额 ≥ ¥1，全部通过，余额变成 -¥5
- ✅ **正确实现**: 只有前 5 个请求成功，后 5 个返回"余额不足"

**选项**:

**Option A: Database Row-Level Lock**
```sql
BEGIN;
SELECT * FROM User WHERE id = $1 FOR UPDATE;  -- 行锁
UPDATE User SET balance = balance - $amount WHERE id = $1 AND balance >= $amount;
COMMIT;
```

**Option B: Optimistic Locking (Version Field)**
```sql
UPDATE User
SET balance = balance - $amount, version = version + 1
WHERE id = $1 AND balance >= $amount AND version = $current_version;
```

**Option C: Redis Distributed Lock**
```typescript
await redis.lock(`user:${userId}:balance`, async () => {
  // 检查余额 + 扣费
})
```

**对比分析**:

| 方案 | 并发安全 | 性能 | 复杂度 | 死锁风险 |
|------|---------|------|--------|----------|
| Row Lock (Pessimistic) | ✅ 完美 | 🟡 中等 | ✅ 简单 | ⚠️ 中等 |
| Optimistic Lock | ✅ 良好 | ✅ 高 | 🟡 中等 | ✅ 无 |
| Redis Lock | ✅ 完美 | ✅ 高 | 🔴 复杂 | ⚠️ 中等 |

**推荐决策**: **Option A - Database Row-Level Lock (FOR UPDATE)**

**理由**:
1. ✅ **绝对安全**: PostgreSQL 事务保证
2. ✅ **简单**: Prisma 支持事务，易于实现
3. ✅ **足够性能**: 单用户并发通常 <10，行锁足够
4. ⚠️ **死锁预防**: 设置合理的 `lock_timeout`

**实现示例**:
```typescript
await prisma.$transaction(async (tx) => {
  // 1. 锁定用户记录
  const user = await tx.$queryRaw`
    SELECT * FROM User WHERE id = ${userId} FOR UPDATE
  `

  // 2. 检查余额
  if (user.balance < chargeAmount) {
    throw new Error('Insufficient balance')
  }

  // 3. 扣费
  await tx.user.update({
    where: { id: userId },
    data: { balance: { decrement: chargeAmount } }
  })

  // 4. 记录交易
  await tx.transaction.create({ ... })
})
```

**切换成本**: 🔴 **极高**（计费逻辑是核心，重构需要 5-7 天）

**何时决策**: ✅ **在 Epic 6 开始前**

**风险**: 🔴 **极高**（计费错误会导致资金损失，必须一次做对）

---

#### 🟡 Decision 8: Usage Parameter Extraction (P2)

**问题**: Story 6.2 按量计费需要从 API 响应中提取计量参数（如 `response.usage.tokens`），如何实现？

**选项**:
1. **JSONPath** - 标准库，支持复杂路径
2. **Lodash _.get()** - 简单易用
3. **手写递归解析** - 灵活但易出错

**推荐决策**: **JSONPath 库**（如 `jsonpath-plus`）

**切换成本**: 🟢 低（~1 小时）

**何时决策**: 🕐 **Epic 6 执行时**

---

### Epic 7: 账户余额与充值系统

**FR 覆盖**: FR14-FR20
**Stories**: 6 个
**整体风险**: 🟢 **低**

#### 无关键架构决策

Epic 7 主要是数据展示和查询：
- 余额查询（直接读 `User.balance`）
- 交易记录（查询 `Transaction` 表）
- 充值逻辑在 Epic 11（支付集成）

**建议**: 直接按 Story 执行。

---

### Epic 8: 会员体系与权益管理

**FR 覆盖**: FR21-FR27
**Stories**: 6 个
**整体风险**: 🟢 **低**

#### 无关键架构决策

会员逻辑相对简单：
- 套餐配置存储在 `Membership` 表
- 用户购买记录在 `Subscription` 表
- 折扣计算在计费引擎（Epic 6）

**建议**: 直接按 Story 执行。

---

### Epic 9: Coze 插件智能代码生成

**FR 覆盖**: FR54-FR57
**Stories**: 4 个
**整体风险**: 🟡 **中低**

#### 🟡 Decision 9: LLM Provider Selection (P2)

**问题**: 使用哪个 LLM 生成 Coze 代码模板？

**选项**:
1. **OpenAI GPT-4** - 效果最好但贵
2. **Claude 3.5 Sonnet** - 代码能力强
3. **Qwen / GLM-4** - 国产，便宜

**推荐决策**: **先用 OpenAI GPT-4-turbo-preview**（后期可切换）

**切换成本**: 🟢 低（LLM 接口标准化，~1-2 小时）

**何时决策**: 🕐 **Epic 9 执行时**

---

### Epic 10: 通知与用户触达

**FR 覆盖**: FR90-FR94
**Stories**: 5 个
**整体风险**: 🟡 **中低**

#### 🟡 Decision 10: Notification Delivery (P2)

**问题**: 如何发送通知？实时还是批量？

**选项**:
1. **即时发送** - 每次余额变化立即发送
2. **消息队列 + Worker** - Bull/BullMQ + Redis
3. **Cron 定时任务** - 每小时检查一次

**推荐决策**: **先用即时发送，后期优化为消息队列**

**切换成本**: 🟡 中等（~4-5 小时）

**何时决策**: 🕐 **Epic 10 执行时**

---

### Epic 11: 支付集成（Stripe MVP）

**FR 覆盖**: FR95-FR99
**Stories**: 5 个
**整体风险**: 🔴 **高**

#### 🔴 Decision 11: Payment Gateway Selection (P0) ⚠️ **关键**

**问题**: PRD 提到"微信支付、支付宝"，但 Epic 11 标题是"Stripe MVP"，最终用哪个？

**背景**:
- **Stripe**: 国际主流，支持全球支付，但**国内用户体验差**（需要信用卡）
- **微信支付/支付宝**: 国内主流，但接入门槛高（需要企业资质、备案）

**选项**:

**Option A: Stripe (MVP)**
- ✅ 接入简单（个人即可注册）
- ✅ 文档优秀，API 友好
- ❌ 国内用户接受度低（需要国际信用卡）
- ❌ 手续费高（2.9% + ¥2.00/笔）

**Option B: 微信支付 + 支付宝**
- ✅ 国内用户首选
- ✅ 手续费低（0.6%）
- ❌ 需要企业营业执照
- ❌ 接入流程复杂（审核 3-7 天）

**Option C: Stripe + 国内聚合支付（如 Ping++, PayPal Braintree）**
- ✅ 同时支持国内外
- ⚠️ 需要两套接入逻辑
- 💰 成本更高

**推荐决策**: **分阶段策略**

**MVP 阶段（Epic 11）**:
- ✅ 先接入 **Stripe**（快速验证，个人可用）
- ⚠️ 限制：仅支持测试充值，或面向海外用户

**正式上线前**:
- 🔄 补充接入**微信支付 + 支付宝**（需要企业资质）
- 🎯 成为 Epic 11.5（新增 Story）

**切换成本**: 🔴 **高**（两套支付逻辑，~5-7 天）

**何时决策**: ✅ **现在决策**

**当前决策**:
- Epic 11 先做 Stripe（MVP 验证）
- 正式上线前补充国内支付（需要并行注册企业账号）

**风险**: 🔴 高（支付是商业化核心，选错会影响收入）

---

### Epic 12: 安全与风控体系

**FR 覆盖**: FR100-FR105
**Stories**: 6 个
**整体风险**: 🟡 **中等**

#### 🟡 Decision 12: API Key Encryption (P1)

**问题**: API Key 如何加密存储？

**选项**:
1. **Hash (bcrypt / sha256)** - 单向，无法解密
2. **AES-256 对称加密** - 可解密，需要 Key 管理
3. **明文存储** - ❌ 不安全

**推荐决策**: **AES-256-GCM + 环境变量 Key**

**理由**:
- ✅ 需要在 Admin 后台显示 Upstream API Key（所以不能用 Hash）
- ✅ 用户自己的 API Key 可以 Hash（无需解密）

**切换成本**: 🟡 中等（~3-4 小时）

**何时决策**: ✅ **Epic 12 开始前**

---

## 🎯 Priority Actions

### 🔴 P0 - 必须在 Epic 开始前决策（3 个）

| Decision | Epic | 截止时间 | 推荐方案 | 责任人 |
|----------|------|---------|---------|--------|
| SMS Provider | Epic 2 | Epic 2 启动前 | 阿里云短信 | 你 |
| Gateway Architecture | Epic 5 | Epic 5 启动前 | Next.js API Route | 你 + 我 |
| Billing Concurrency | Epic 6 | Epic 6 启动前 | Database Row Lock | 你 + 我 |

### 🟠 P1 - 建议在 Epic 开始前决策（5 个）

| Decision | Epic | 截止时间 | 推荐方案 | 责任人 |
|----------|------|---------|---------|--------|
| Email Service | Epic 2 | Epic 2 启动前 | Resend | 你 |
| Session Storage | Epic 2 | Epic 2 启动前 | 无状态 JWT（暂不做） | 你 |
| Rate Limiting Storage | Epic 5 | Epic 5 启动前 | Upstash Redis | 你 |
| Payment Gateway | Epic 11 | Epic 11 启动前 | Stripe (MVP) | 你 |
| API Key Encryption | Epic 12 | Epic 12 启动前 | AES-256-GCM | 你 |

### 🟡 P2 - 可以边做边调整（4 个）

| Decision | Epic | 推荐方案 | 备注 |
|----------|------|---------|------|
| Search Implementation | Epic 4 | PostgreSQL ILIKE | 后期可升级 |
| Usage Parameter Extraction | Epic 6 | JSONPath 库 | 切换成本低 |
| LLM Provider | Epic 9 | OpenAI GPT-4-turbo | 可灵活切换 |
| Notification Delivery | Epic 10 | 即时发送 | 后期优化 |

---

## 📋 Epic 2 Pre-Start Checklist

在开始 Epic 2 之前，**必须完成**以下任务：

### ✅ Task 1: 注册阿里云短信服务

**步骤**:
1. 注册阿里云账号（如果没有）
2. 开通短信服务
3. 创建短信签名（需审核 1-2 个工作日）
4. 创建短信模板（"您的验证码是{code}，5分钟内有效"）
5. 获取 AccessKey ID 和 Secret

**预计时间**: 30 分钟（不含审核等待）

**截止时间**: Epic 2 启动前 2 天

---

### ✅ Task 2: 注册 Resend 邮件服务

**步骤**:
1. 访问 https://resend.com 注册
2. 创建 API Key
3. 验证发件域名（可选，MVP 可用 `@resend.dev`）

**预计时间**: 10 分钟

**截止时间**: Epic 2 启动前 1 天

---

### ✅ Task 3: 确认 Session 管理策略

**决策**:
- [ ] ✅ **确认**: Epic 2 先不做 Session 管理，Story 2.8 的"可选"功能推迟
- [ ] ❌ **拒绝**: 我要做 Session 管理，需要部署 Redis

**如果选择做 Session 管理**，需要：
1. 部署 Upstash Redis 或 自建 Redis
2. 安装 `ioredis` 库
3. 实现 Session CRUD 逻辑

**预计时间**: 4-6 小时

**截止时间**: Epic 2 启动前

---

## 📝 ADR Requirements

以下决策需要记录在 Architecture Decision Records（ADR）中：

1. **ADR-003**: Deployment Platform - Kubernetes ✅ **待补充**
2. **ADR-004**: SMS Provider - 阿里云短信 (Epic 2 前)
3. **ADR-005**: Email Service - Resend (Epic 2 前)
4. **ADR-006**: Gateway Architecture - Next.js API Route (Epic 5 前)
5. **ADR-007**: Billing Concurrency Control - Row-Level Lock (Epic 6 前)
6. **ADR-008**: Payment Gateway - Stripe MVP (Epic 11 前)

---

## 🔮 Long-Term Considerations

### 何时重新评估这些决策？

| 决策 | 重新评估触发条件 |
|------|------------------|
| Gateway Architecture | 日 API 调用量 > 10万次 |
| SMS Provider | 月短信量 > 10万条 |
| Email Service | 送达率 < 95% |
| Rate Limiting Storage | 速率限制计数 > 1万次/秒 |
| Payment Gateway | 需要正式商业化（获得企业资质） |
| Search Implementation | API 数量 > 500 或用户搜索频繁 |

---

## ✅ Sign-off

**扫描完成时间**: 2025-01-19
**扫描范围**: Epic 2-12 (MVP 范围)
**识别决策点**: 12 个
**关键风险**: 3 个 P0 决策（SMS、Gateway、Billing）

**下一步行动**:
1. ✅ 完成 Epic 2 Pre-Start Checklist（注册 SMS、Email 服务）
2. ✅ 补充 ADR-003（Kubernetes 部署决策）
3. ✅ 在 Epic 5-6 启动前，详细设计 Gateway 和 Billing 架构

**责任人**: Development Team + Scrum Master

---

_"Fail to plan, plan to fail."_ - Benjamin Franklin
