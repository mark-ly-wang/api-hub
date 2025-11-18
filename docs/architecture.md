# API Hub 架构决策文档

**版本**: 1.0
**创建日期**: 2025-11-15
**作者**: BMad Method - Architecture Workflow
**项目类型**: API Gateway + SaaS B2B2C 平台

---

## 文档目录

1. [执行摘要](#1-执行摘要)
2. [技术栈决策](#2-技术栈决策)
3. [系统架构设计](#3-系统架构设计)
4. [数据模型设计](#4-数据模型设计)
5. [API端点规范](#5-api端点规范)
6. [核心架构模式](#6-核心架构模式)
7. [项目结构设计](#7-项目结构设计)
8. [实施模式与规范](#8-实施模式与规范)
9. [部署架构](#9-部署架构)
10. [模板迁移计划](#10-模板迁移计划)
11. [架构决策记录](#11-架构决策记录)
12. [成功标准](#12-成功标准)

---

## 1. 执行摘要

### 1.1 项目定位

**API Hub** 是一个专为Coze工作流创作者设计的API聚合平台，核心使命是通过极致便捷性降低API使用门槛。

**核心价值承诺**:
> **"10分钟从注册到成功调用API"**

**项目分类**:
- **类型**: API Gateway + SaaS B2B2C 平台
- **领域**: API聚合 / 创作者经济 / Fintech(计费)
- **目标用户**: Coze工作流创作者（B端）及其最终用户（C端）
- **开发阶段**: MVP（3-4个月交付周期）

### 1.2 技术栈概览

```
前端层:    Next.js 14 (App Router) + shadcn/ui + Tailwind CSS
后端层:    Next.js API Routes + Prisma ORM
数据库:    PostgreSQL
部署:      Zeabur (零运维PaaS平台)
认证:      JWT (基于官方模板)
支付:      Stripe
LLM:       OpenAI GPT-4o mini (Coze代码生成)
监控:      Zeabur内置 + Sentry
```

### 1.3 核心架构决策总览

| 决策领域 | 选择方案 | 关键理由 |
|---------|----------|----------|
| **Starter模板** | Next.js官方SaaS Starter | 官方维护、长期支持、代码质量高 |
| **部署平台** | Kubernetes + Docker + Supabase | 完全控制、国内访问速度快、成本可控、生产级架构 |
| **ORM策略** | 完全替换为Prisma | 统一技术栈、类型安全、迁移工具成熟 |
| **计费引擎** | 响应体解析（JSON Path） | 支持灵活按量计费、通用性强 |
| **计费时机** | 同步计费 | 强一致性、防止透支 |
| **API Key管理** | AES-256数据库加密 | 安全可靠、支持动态添加API |
| **LLM服务** | OpenAI GPT-4o mini | 成本低（$0.15/1M tokens）、代码生成质量高 |
| **认证系统** | 保留官方JWT方案 | 简单可靠、无第三方依赖 |

### 1.4 MVP功能范围

**包含**:
- ✅ 用户注册/登录（手机号+验证码）
- ✅ 统一API Key管理（一个Key访问所有API）
- ✅ API市场（浏览、订阅、调用）
- ✅ 三种计费模式（按次、按量、会员）
- ✅ 在线测试工具（嵌入式API Playground）
- ✅ Coze插件代码生成（LLM驱动）
- ✅ Dashboard（余额、调用统计、任务清单）
- ✅ 账户充值（Stripe集成）

**不包含**（Phase 2）:
- ❌ 多租户支持（Tenant隔离）
- ❌ Admin后台（API配置管理界面）
- ❌ 高级分析（漏斗分析、留存曲线）
- ❌ 社区功能（API评论、评分）
- ❌ 自定义计费规则配置界面

### 1.5 关键性能指标

| 指标 | 目标值 | 测量方式 |
|------|--------|----------|
| API Gateway延迟 | <100ms (P95) | Zeabur监控 + 自定义打点 |
| 上游API调用成功率 | >99% | 调用日志统计 |
| Dashboard加载时间 | <2s (首屏) | Lighthouse + RUM |
| 数据库查询延迟 | <50ms (P95) | Prisma慢查询日志 |
| 10分钟首次调用完成率 | >80% | 用户旅程漏斗分析 |

---

## 2. 技术栈决策

### 2.1 前端技术栈

#### 2.1.1 框架：Next.js 14 (App Router)

**选择理由**:
1. **全栈能力**: 前后端统一，减少技术栈复杂度
2. **SSR/SSG支持**: SEO友好，首屏加载快
3. **官方模板基础**: Next.js官方SaaS Starter已验证的架构
4. **部署优化**: Zeabur原生支持Next.js
5. **React生态**: 丰富的组件库和工具链

**权衡分析**:
- ✅ **优势**: 开发效率高、社区活跃、文档完善
- ⚠️ **劣势**: 学习曲线（App Router新特性）、包体积较大
- 🔄 **替代方案**: Remix（路由优先）、Astro（性能优先） - 但不适合高度交互的Dashboard

#### 2.1.2 UI框架：shadcn/ui + Tailwind CSS

**选择理由**:
1. **现代化设计**: 符合Stripe、Vercel等顶级SaaS产品视觉风格
2. **完全可定制**: 组件源码直接在项目中，可随意修改
3. **开发速度快**: 预设35个高质量组件，MVP快速搭建
4. **无障碍性优秀**: 基于Radix UI，默认WCAG 2.1 AA合规
5. **类型安全**: TypeScript原生支持

**组件复用策略**:
```
shadcn/ui直接使用:   35个 (35%) - Button, Input, Card等基础组件
shadcn/ui修改样式:   20个 (20%) - Dialog, Select等需品牌化的组件
完全自定义组件:      45个 (45%) - ApiCard, ApiTester等业务组件
────────────────────────────────────────
总计:                100个 (100%)
```

**权衡分析**:
- ✅ **优势**: 高度定制、无vendor lock-in、代码透明
- ⚠️ **劣势**: 需要手动更新组件、初期搭建时间稍长
- 🔄 **替代方案**: Ant Design（企业级但定制困难）、Chakra UI（抽象度高但性能较差）

### 2.2 后端技术栈

#### 2.2.1 后端框架：Next.js API Routes

**选择理由**:
1. **统一技术栈**: 前后端同一代码库，减少上下文切换
2. **Serverless友好**: 自动优化为Edge Functions/Serverless Functions
3. **类型共享**: 前后端共享TypeScript类型定义
4. **开发体验**: 热重载、快速迭代
5. **Zeabur原生支持**: 无需额外配置

**API组织策略**:
```
app/api/
├── auth/              # 认证相关
├── keys/              # API Key管理
├── marketplace/       # API市场
├── gateway/[apiId]/   # 核心Gateway（动态路由）
├── balance/           # 余额充值
├── dashboard/         # Dashboard数据
└── webhooks/          # Stripe回调
```

**权衡分析**:
- ✅ **优势**: 简化部署、统一代码库、快速开发
- ⚠️ **劣势**: 不适合CPU密集型任务（受限于Serverless执行时间）
- 🔄 **替代方案**: Express/Fastify（独立后端） - 但增加部署复杂度，不符合"零运维"约束

#### 2.2.2 ORM：Prisma

**选择理由**:
1. **类型安全**: 自动生成TypeScript类型，编译时错误检测
2. **声明式Schema**: 易读易维护的数据模型定义
3. **迁移工具**: 自动生成和管理数据库迁移
4. **查询优化**: 自动生成高效SQL，支持关系预加载
5. **生态完善**: 丰富的中间件和插件

**从Drizzle迁移**:
官方模板使用Drizzle ORM，需完全替换为Prisma：
```typescript
// 迁移前 (Drizzle)
import { db } from '@/lib/db/drizzle'
const users = await db.select().from(usersTable)

// 迁移后 (Prisma)
import { prisma } from '@/lib/db/client'
const users = await prisma.user.findMany()
```

**权衡分析**:
- ✅ **优势**: 类型安全、开发体验优秀、社区活跃
- ⚠️ **劣势**: 初期迁移工作量、生成的Client文件较大
- 🔄 **替代方案**: 保留Drizzle（但类型推导复杂） - 已否决

#### 2.2.3 数据库：PostgreSQL

**选择理由**:
1. **关系数据强一致性**: 计费系统需要ACID保证
2. **丰富的数据类型**: JSON/JSONB、Array、Enum等
3. **成熟的生态**: 备份、监控、性能优化工具完善
4. **Prisma完美支持**: 全功能支持
5. **Zeabur托管**: 自动备份、高可用、零运维

**托管方案**:
- **首选**: Supabase（功能丰富、免费额度慷慨、完美支持 Prisma、内置连接池）
- **备选**: 云服务商托管数据库（阿里云 RDS、腾讯云 PostgreSQL、AWS RDS）
- **自建**: Kubernetes 内部署 PostgreSQL StatefulSet（需要专业运维能力）

**权衡分析**:
- ✅ **优势**: 稳定可靠、功能强大、工具链成熟
- ⚠️ **劣势**: 相比NoSQL写入性能稍低
- 🔄 **替代方案**: MongoDB（灵活但缺乏事务保证） - 不适合计费系统

### 2.3 部署与基础设施

#### 2.3.1 部署平台：Kubernetes + Docker + Supabase

**选择理由**:
1. **完全控制**: 完全掌控基础设施，可自定义扩容策略、资源分配、网络配置
2. **国内访问速度**: 部署在国内 VPS/云服务器，无需翻墙，访问速度快
3. **成本可控**: 中长期成本远低于 Serverless 平台（$10-50/月 vs $100+/月）
4. **生产级架构**: 支持滚动更新、健康检查、自动伸缩、零停机部署
5. **技术成长**: 学习 Kubernetes 和容器化技术，提升 DevOps 能力
6. **厂商无关**: 不绑定特定云平台，可随时迁移（多云/混合云战略）

**Kubernetes + Supabase 架构**:
```
┌──────────────────────────────────────────────────────┐
│              Kubernetes Cluster                       │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌───────────────────────────────────────────────┐  │
│  │          Ingress (NGINX/Traefik)              │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │  TLS Termination (Let's Encrypt)        │  │  │
│  │  │  api.yourdomain.com → api-hub-service   │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └────────────────┬──────────────────────────────┘  │
│                   │                                  │
│  ┌────────────────▼──────────────────────────────┐  │
│  │        Service: api-hub-service               │  │
│  │        Type: ClusterIP, Port: 3000            │  │
│  └────────────────┬──────────────────────────────┘  │
│                   │                                  │
│  ┌────────────────▼──────────────────────────────┐  │
│  │   Deployment: api-hub (replicas: 2-10)       │  │
│  │   ┌──────────────────────────────────────┐   │  │
│  │   │  Pod 1: Next.js Standalone (512Mi)   │   │  │
│  │   │  - Liveness/Readiness: /api/health   │   │  │
│  │   │  - Resources: 512Mi RAM, 0.5 CPU     │   │  │
│  │   └──────────────────────────────────────┘   │  │
│  │   ┌──────────────────────────────────────┐   │  │
│  │   │  Pod 2: Next.js Standalone           │   │  │
│  │   └──────────────────────────────────────┘   │  │
│  │   HPA: CPU 70% 触发自动扩容               │   │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │        ConfigMap: api-hub-config             │  │
│  │        (非敏感环境变量)                       │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │        Secret: api-hub-secrets               │  │
│  │        (DATABASE_URL, NEXTAUTH_SECRET...)    │  │
│  └──────────────────────────────────────────────┘  │
└────────────────┬─────────────────────────────────────┘
                 │ DATABASE_URL (Connection Pooling)
                 │
┌────────────────▼─────────────────────────────────────┐
│       Supabase Platform (External)                   │
├──────────────────────────────────────────────────────┤
│  ┌────────────────────────────┐                     │
│  │  PostgreSQL 15             │                     │
│  │  (Connection Pooler 6543)  │                     │
│  │  (Direct Connection 5432)  │                     │
│  └────────────────────────────┘                     │
│                                                       │
│  内置功能:                                            │
│  ✅ 自动备份 (Point-in-Time)                          │
│  ✅ 连接池 (PgBouncer) - 避免 K8s 多副本连接耗尽      │
│  ✅ Dashboard + SQL Editor                           │
│  ✅ Realtime Subscriptions (可选)                     │
└───────────────────────────────────────────────────────┘
```

**部署流程**:
```bash
# ============================================
# 阶段 1: 准备 Kubernetes 集群和数据库
# ============================================
# 1. 购买 VPS/云服务器（推荐: 2C4G 起步）
# 2. 安装 Kubernetes (k3s/kubeadm/云厂商托管)
# 3. 创建 Supabase 项目，获取连接字符串

# ============================================
# 阶段 2: 配置 Kubernetes 资源
# ============================================
# 1. 创建命名空间
kubectl apply -f k8s/namespace.yaml

# 2. 创建 Secrets（敏感信息）
kubectl create secret generic api-hub-secrets \
  --from-literal=DATABASE_URL='postgresql://...:6543/...?pgbouncer=true' \
  --from-literal=DIRECT_URL='postgresql://...:5432/...' \
  --from-literal=NEXTAUTH_SECRET='your-secret' \
  --from-literal=SENTRY_DSN='https://...' \
  -n api-hub

# 3. 创建 ConfigMap（非敏感配置）
kubectl apply -f k8s/configmap.yaml

# ============================================
# 阶段 3: 部署应用
# ============================================
# 1. 构建并推送 Docker 镜像到 GitHub Container Registry
docker build -t ghcr.io/YOUR_USERNAME/api-hub:latest .
docker push ghcr.io/YOUR_USERNAME/api-hub:latest

# 2. 部署应用到 Kubernetes
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# 3. 验证部署
kubectl get pods -n api-hub
kubectl logs -f deployment/api-hub -n api-hub

# ============================================
# 阶段 4: 配置自动化 CI/CD (GitHub Actions)
# ============================================
# Git 推送自动触发构建和部署
git push origin main

# GitHub Actions 自动执行:
# - docker build (构建镜像)
# - docker push (推送到 GHCR)
# - kubectl set image (更新 Deployment)
# - kubectl rollout status (等待滚动更新完成)
# - 健康检查验证
```

**环境变量配置**:
```bash
# 数据库 (Supabase)
DATABASE_URL=postgresql://...@pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://...@pooler.supabase.com:5432/postgres

# NextAuth
NEXTAUTH_URL=https://api.yourdomain.com
NEXTAUTH_SECRET=your-secret-key

# Node.js 环境
NODE_ENV=production
LOG_LEVEL=info

# Sentry
SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=your-token
```

**Docker 镜像优化**:
- **多阶段构建**: deps → builder → runner (镜像大小 <250MB)
- **Alpine Linux**: 基础镜像仅 5MB，大幅减少镜像体积
- **Next.js Standalone**: 仅打包必要的 node_modules，减少 80% 体积
- **层缓存**: 利用 Docker layer cache 加速构建（从 10分钟 → 2分钟）

**Kubernetes 高可用配置**:
- **副本数**: 最少 2 个 Pod 保证高可用
- **滚动更新**: `maxSurge: 1, maxUnavailable: 0` 零停机部署
- **健康检查**: Liveness + Readiness Probe 确保流量只路由到健康 Pod
- **自动伸缩**: HPA 根据 CPU/内存自动扩容（2-10 副本）
- **资源限制**: 每 Pod 限制 512Mi-1Gi RAM，避免 OOM
- **连接池**: 每 Pod 限制 10 个数据库连接（总连接 = Pod数 × 10）

**权衡分析**:
- ✅ **优势**: 完全控制、国内访问快、成本低、生产级架构、技术成长
- ⚠️ **劣势**: 需要 DevOps 知识、运维成本（监控、备份、安全更新）
- 🔄 **替代方案**: Vercel（零运维但贵）、Railway（简单但功能少）

#### 2.3.2 监控与错误追踪

**Vercel 内置监控**:
- 应用健康检查
- 函数执行时间和调用次数
- 带宽和请求统计
- 实时日志查看 (Runtime Logs)

**Sentry集成**（错误追踪）:
```typescript
// lib/sentry.ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1, // 10%请求性能追踪
  environment: process.env.NODE_ENV,
})
```

**关键指标告警**:
- API Gateway 5xx错误率 > 1%
- 数据库查询延迟 > 500ms
- 余额不足调用失败 > 10次/分钟

### 2.4 第三方服务

#### 2.4.1 支付：Stripe

**选择理由**:
1. **官方模板集成**: Next.js SaaS Starter已内置Stripe
2. **国际化支持**: 支持微信支付、支付宝（Stripe中国）
3. **订阅管理**: 内置会员订阅系统
4. **安全合规**: PCI DSS Level 1认证
5. **Webhook可靠**: 自动重试机制

**集成策略**:
```typescript
// 充值流程
用户点击充值 → 创建Stripe Checkout Session
            → 重定向到Stripe支付页面
            → 支付成功 → Webhook回调
            → 更新用户余额
```

#### 2.4.2 LLM：OpenAI GPT-4o mini

**选择理由**:
1. **成本低**: $0.15/1M input tokens（相比GPT-4便宜90%）
2. **速度快**: 适合实时代码生成场景
3. **代码生成质量高**: 经过代码优化训练
4. **稳定性好**: 99.9% SLA保证

**使用场景**:
- Coze插件代码生成（主要功能）
- API参数智能预填充
- 错误提示自然语言生成

**成本估算**:
```
假设每次代码生成:
- 输入: 500 tokens (API文档 + 用户配置)
- 输出: 300 tokens (完整Coze插件代码)
- 成本: $0.15/1M * 500 + $0.6/1M * 300 = $0.00026/次

月1000次生成: $0.26/月 ≈ ¥2/月
```

**备选方案**:
- 通义千问（国产，合规优势）
- 文心一言（价格更低）
- 本地模板引擎（零成本但不够智能） - 降级方案

---

## 3. 系统架构设计

### 3.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                          用户层                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Web浏览器    │  │ Coze工作流   │  │ 第三方应用   │          │
│  │ (Dashboard)  │  │ (API调用)    │  │ (API调用)    │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js 前端层 (SSR/CSR)                     │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Dashboard页面 │  │ API市场页面  │  │ 认证页面     │         │
│  │ (React组件)   │  │ (React组件)  │  │ (登录/注册)  │         │
│  └───────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
└──────────┼──────────────────┼──────────────────┼────────────────┘
           │                  │                  │
           ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js API Routes 层                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              API Gateway (核心模块)                      │   │
│  │  /gateway/:apiId/*                                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│  │  │ 认证验证 │→ │ 余额检查 │→ │ 上游代理 │              │   │
│  │  └──────────┘  └──────────┘  └─────┬────┘              │   │
│  │                                     ▼                    │   │
│  │                              ┌──────────┐               │   │
│  │                              │ 计费扣费 │               │   │
│  │                              └──────────┘               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │ 认证API     │  │ Dashboard   │  │ 市场API     │           │
│  │ /api/auth/* │  │ API         │  │ /api/market*│           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
└──────────┬──────────────────┬──────────────────┬───────────────┘
           │                  │                  │
           ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                        业务逻辑层 (lib/)                         │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │ 计费引擎       │  │ 代码生成器     │  │ 加密工具       │   │
│  │ BillingEngine  │  │ CozeGenerator  │  │ Encryption     │   │
│  └────────────────┘  └────────────────┘  └────────────────┘   │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │ Gateway代理    │  │ 认证逻辑       │  │ 限流器         │   │
│  │ ApiProxy       │  │ AuthService    │  │ RateLimiter    │   │
│  └────────────────┘  └────────────────┘  └────────────────┘   │
└──────────┬──────────────────────────────────────┬───────────────┘
           │                                      │
           ▼                                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                         数据层                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Prisma ORM                                  │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │   │
│  │  │ User     │  │ ApiKey   │  │ Api      │             │   │
│  │  │ Model    │  │ Model    │  │ Model    │             │   │
│  │  └──────────┘  └──────────┘  └──────────┘             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              PostgreSQL Database                         │   │
│  │  Tables: users, api_keys, apis, subscriptions,          │   │
│  │          api_calls, transactions, memberships           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
           │                  │                  │
           ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                       外部服务层                                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐               │
│  │ 上游API    │  │ OpenAI     │  │ Stripe     │               │
│  │ (天气/GPT) │  │ (代码生成) │  │ (支付)     │               │
│  └────────────┘  └────────────┘  └────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 核心模块设计

#### 3.2.1 认证模块 (Authentication)

**功能**:
- 用户注册/登录（手机号+验证码）
- JWT生成和验证
- Session管理
- API Key认证（网关层）

**数据流**:
```
用户输入手机号 → 发送验证码 → 验证码校验
                ↓
          创建用户记录 → 生成JWT
                ↓
          设置Cookie → 返回Dashboard
```

**关键代码结构**:
```typescript
// lib/auth/jwt.ts
export function generateJWT(userId: string): string
export function verifyJWT(token: string): { userId: string } | null

// lib/auth/session.ts
export async function createSession(userId: string): Promise<Session>
export async function getSession(token: string): Promise<Session | null>

// app/api/auth/login/route.ts
export async function POST(request: Request)
```

#### 3.2.2 API Gateway模块

**功能**:
- 统一代理端点（`/gateway/:apiId/*`）
- 用户API Key验证
- 上游API Key映射
- 请求/响应转发
- 同步计费

**请求处理流程**:
```
┌────────────────────────────────────────────────────────────┐
│  客户端请求: POST /gateway/weather-api/v1/query           │
│  Headers: X-API-Key: sk_live_abc123                       │
│  Body: { city: "北京" }                                    │
└────────────┬───────────────────────────────────────────────┘
             ▼
      ┌──────────────┐
      │ 1. 认证验证  │ - 验证X-API-Key有效性
      └──────┬───────┘   - 获取User和Api信息
             ▼
      ┌──────────────┐
      │ 2. 余额检查  │ - 查询用户余额
      └──────┬───────┘   - 检查是否足够支付
             ▼
      ┌──────────────┐
      │ 3. 上游代理  │ - 映射到上游API Key
      └──────┬───────┘   - 转发请求到上游API
             ▼           - 获取响应
      ┌──────────────┐
      │ 4. 响应解析  │ - 解析计费参数（如tokens）
      └──────┬───────┘   - 计算实际费用
             ▼
      ┌──────────────┐
      │ 5. 计费扣费  │ - 扣除用户余额（事务性）
      └──────┬───────┘   - 记录调用日志
             ▼
      ┌──────────────┐
      │ 6. 返回响应  │ - 返回上游响应给客户端
      └──────────────┘
```

**关键代码结构**:
```typescript
// app/api/gateway/[apiId]/[...path]/route.ts
export async function ANY(
  request: Request,
  { params }: { params: { apiId: string; path: string[] } }
) {
  // 1. 认证
  const apiKey = request.headers.get('X-API-Key')
  const user = await authenticateApiKey(apiKey)

  // 2. 余额检查
  await checkBalance(user.id, estimatedCost)

  // 3. 代理请求
  const upstreamResponse = await proxyToUpstream(apiId, path, request)

  // 4. 计费
  const cost = await calculateCost(apiId, upstreamResponse)
  await chargeUser(user.id, cost)

  // 5. 返回
  return upstreamResponse
}
```

#### 3.2.3 计费引擎模块

**功能**:
- 支持三种计费模式（按次、按量、会员）
- 响应体JSON解析提取计费参数
- 会员权益判断
- 事务性扣费

**计费策略接口**:
```typescript
// lib/billing/types.ts
interface BillingStrategy {
  calculate(
    apiConfig: ApiConfig,
    request: Request,
    response: Response
  ): Promise<BillingResult>
}

interface BillingResult {
  amount: number          // 应扣费金额
  billingMode: string     // 计费模式
  metadata: {
    unit?: string         // 计费单位（次/tokens/页）
    quantity?: number     // 使用量
    pricePerUnit?: number // 单价
  }
}
```

**三种计费策略实现**:
```typescript
// lib/billing/strategies/per-call.ts
export class PerCallBilling implements BillingStrategy {
  async calculate(apiConfig, request, response) {
    return {
      amount: apiConfig.pricePerCall,
      billingMode: 'PER_CALL',
      metadata: { unit: '次', quantity: 1 }
    }
  }
}

// lib/billing/strategies/usage-based.ts
export class UsageBasedBilling implements BillingStrategy {
  async calculate(apiConfig, request, response) {
    // JSON Path解析提取使用量
    const quantity = extractFromResponse(
      response,
      apiConfig.usageParamPath // 如 "response.usage.tokens"
    )
    return {
      amount: quantity * apiConfig.pricePerUnit,
      billingMode: 'USAGE_BASED',
      metadata: {
        unit: apiConfig.billingUnit,
        quantity,
        pricePerUnit: apiConfig.pricePerUnit
      }
    }
  }
}

// lib/billing/strategies/membership.ts
export class MembershipBilling implements BillingStrategy {
  async calculate(apiConfig, request, response) {
    const user = await getUser(request)
    const hasMembership = await checkMembership(user.id, apiConfig.apiId)

    if (hasMembership && withinQuota(user, apiConfig)) {
      return { amount: 0, billingMode: 'MEMBERSHIP_FREE' }
    }

    // 超额或无会员，降级到按次计费
    return new PerCallBilling().calculate(apiConfig, request, response)
  }
}
```

**响应解析器**:
```typescript
// lib/billing/parser.ts
export function extractFromResponse(
  response: any,
  jsonPath: string // 如 "usage.total_tokens"
): number {
  const keys = jsonPath.split('.')
  let value = response

  for (const key of keys) {
    if (value && typeof value === 'object') {
      value = value[key]
    } else {
      throw new BillingParseError(`无法解析路径: ${jsonPath}`)
    }
  }

  return Number(value) || 0
}
```

#### 3.2.4 Coze代码生成模块

**功能**:
- 根据API文档生成Coze插件代码
- 智能参数预填充
- 错误处理代码生成
- 语法高亮输出

**生成流程**:
```
用户选择API → 可选配置参数 → 调用LLM生成代码
                                    ↓
                           返回完整插件代码（含API Key）
```

**提示词工程**:
```typescript
// lib/coze-generator/prompt.ts
export function buildPrompt(api: Api, userConfig: UserConfig): string {
  return `
你是Coze插件代码生成专家。请根据以下API文档生成完整的Coze工作流插件代码。

## API信息
- 名称: ${api.name}
- 端点: ${api.endpoint}
- 方法: ${api.method}
- 认证: 需要在Header中携带 X-API-Key

## 参数配置
${JSON.stringify(userConfig.params, null, 2)}

## 要求
1. 生成完整的JavaScript代码（async/await风格）
2. 包含错误处理（try/catch）
3. 自动填充API Key: ${userConfig.apiKey}
4. 添加注释说明关键步骤
5. 返回格式化的JSON响应

请直接输出代码，不要添加markdown代码块标记。
`
}
```

**LLM调用**:
```typescript
// lib/coze-generator/generate.ts
import OpenAI from 'openai'

export async function generateCozeCode(
  api: Api,
  userConfig: UserConfig
): Promise<string> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: '你是Coze插件代码生成专家，擅长生成简洁、可靠的API调用代码。'
      },
      {
        role: 'user',
        content: buildPrompt(api, userConfig)
      }
    ],
    temperature: 0.3, // 降低随机性，提高代码稳定性
    max_tokens: 1000,
  })

  return completion.choices[0].message.content
}
```

---

## 4. 数据模型设计

### 4.1 Prisma Schema完整定义

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============ 用户与认证 ============

model User {
  id            String   @id @default(cuid())
  phone         String   @unique
  email         String?  @unique
  name          String?
  avatar        String?

  // 账户余额（分为单位，避免浮点数精度问题）
  balance       Int      @default(0) // 单位：分

  // 会员状态
  membershipTier MembershipTier @default(FREE)
  membershipExpiresAt DateTime?

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // 关系
  apiKeys       ApiKey[]
  subscriptions Subscription[]
  apiCalls      ApiCall[]
  transactions  Transaction[]

  @@index([phone])
  @@index([membershipTier])
  @@map("users")
}

enum MembershipTier {
  FREE
  VIP
  ENTERPRISE
}

// ============ API Key管理 ============

model ApiKey {
  id          String   @id @default(cuid())
  key         String   @unique // 格式: sk_live_xxxxx
  name        String   // 用户自定义名称

  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // 使用统计
  totalCalls  Int      @default(0)
  lastUsedAt  DateTime?

  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // 关系
  apiCalls    ApiCall[]

  @@index([userId])
  @@index([key])
  @@map("api_keys")
}

// ============ API元数据 ============

model Api {
  id          String   @id @default(cuid())
  name        String   // 如 "天气查询API"
  slug        String   @unique // URL友好标识，如 "weather-api"
  description String
  icon        String?  // 图标URL

  // 上游API配置
  upstreamUrl String   // 上游API基础URL
  upstreamKey String   // 上游API密钥（AES-256加密存储）

  // 分类
  category    String   // AI能力、数据查询、工具类
  tags        String[] // 数组类型

  // 状态
  status      ApiStatus @default(ACTIVE)

  // 热度
  totalCalls  Int      @default(0)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // 关系
  configs     ApiConfig[]
  subscriptions Subscription[]
  apiCalls    ApiCall[]

  @@index([slug])
  @@index([category])
  @@index([status])
  @@map("apis")
}

enum ApiStatus {
  ACTIVE       // 正常可用
  MAINTENANCE  // 维护中
  DEPRECATED   // 已弃用
}

// ============ API计费配置 ============

model ApiConfig {
  id          String   @id @default(cuid())

  apiId       String
  api         Api      @relation(fields: [apiId], references: [id], onDelete: Cascade)

  // 计费模式
  billingMode BillingMode

  // 按次计费配置
  pricePerCall Int?    // 单位：分

  // 按量计费配置
  usageParamPath String? // JSON Path，如 "response.usage.tokens"
  billingUnit    String? // 计费单位，如 "tokens", "pages"
  pricePerUnit   Int?    // 单价（分）

  // 分级定价（JSON格式存储）
  // 如: [{ "upTo": 1000, "price": 0.01 }, { "upTo": null, "price": 0.005 }]
  tieredPricing  Json?

  // 会员配置
  vipFreeQuota   Int?    // VIP会员免费额度（按月）
  vipDiscountRate Int?   // VIP折扣率（百分比）

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([apiId])
  @@map("api_configs")
}

enum BillingMode {
  PER_CALL      // 按次
  USAGE_BASED   // 按量
  MEMBERSHIP    // 会员免费
}

// ============ 用户订阅 ============

model Subscription {
  id          String   @id @default(cuid())

  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  apiId       String
  api         Api      @relation(fields: [apiId], references: [id], onDelete: Cascade)

  // 会员专属配额使用情况（按月重置）
  monthlyQuotaUsed Int  @default(0)
  quotaResetAt     DateTime?

  subscribedAt DateTime @default(now())

  @@unique([userId, apiId])
  @@index([userId])
  @@index([apiId])
  @@map("subscriptions")
}

// ============ API调用记录 ============

model ApiCall {
  id          String   @id @default(cuid())

  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  apiKeyId    String
  apiKey      ApiKey   @relation(fields: [apiKeyId], references: [id], onDelete: Cascade)

  apiId       String
  api         Api      @relation(fields: [apiId], references: [id], onDelete: Cascade)

  // 请求信息
  method      String
  path        String
  statusCode  Int

  // 计费信息
  billingMode BillingMode
  cost        Int      // 本次费用（分）
  usageQuantity Int?   // 使用量（如tokens数）

  // 性能指标
  latency     Int      // 延迟（毫秒）

  // 错误信息
  errorMessage String?

  createdAt   DateTime @default(now())

  @@index([userId, createdAt])
  @@index([apiId, createdAt])
  @@index([apiKeyId])
  @@map("api_calls")
}

// ============ 账户交易记录 ============

model Transaction {
  id          String   @id @default(cuid())

  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  type        TransactionType
  amount      Int      // 金额（分），正数为充值，负数为消费
  balanceAfter Int     // 交易后余额

  // 关联信息
  description String   // 如 "充值", "调用天气API"
  referenceId String?  // 关联ID（如Stripe支付ID、ApiCall ID）

  createdAt   DateTime @default(now())

  @@index([userId, createdAt])
  @@index([type])
  @@map("transactions")
}

enum TransactionType {
  TOPUP         // 充值
  API_CHARGE    // API调用扣费
  REFUND        // 退款
  MEMBERSHIP    // 会员购买
}
```

### 4.2 数据模型关系图

```
User (用户)
 ├─1:N─→ ApiKey (API密钥)
 ├─1:N─→ Subscription (订阅关系)
 ├─1:N─→ ApiCall (调用记录)
 └─1:N─→ Transaction (交易记录)

Api (API元数据)
 ├─1:N─→ ApiConfig (计费配置)
 ├─1:N─→ Subscription (订阅关系)
 └─1:N─→ ApiCall (调用记录)

ApiKey (API密钥)
 └─1:N─→ ApiCall (调用记录)
```

### 4.3 索引策略

**高频查询索引**:
```prisma
// 用户认证
@@index([phone])        // User表，登录查询
@@index([key])          // ApiKey表，网关认证

// API调用查询
@@index([userId, createdAt])  // ApiCall表，用户调用历史
@@index([apiId, createdAt])   // ApiCall表，API使用统计

// 计费查询
@@index([userId, createdAt])  // Transaction表，账单查询
```

**唯一约束**:
```prisma
@unique               // User.phone, User.email
@unique               // ApiKey.key
@unique               // Api.slug
@@unique([userId, apiId])  // Subscription，防止重复订阅
```

---

## 5. API端点规范

### 5.1 认证相关 (5个)

#### POST /api/auth/register
**功能**: 用户注册

**请求**:
```typescript
{
  phone: string        // 手机号
  verificationCode: string  // 验证码
  name?: string        // 可选昵称
}
```

**响应**:
```typescript
{
  success: true,
  data: {
    user: {
      id: string,
      phone: string,
      balance: number
    },
    token: string  // JWT
  }
}
```

**业务逻辑**:
1. 验证验证码有效性
2. 创建用户记录
3. 赠送¥5体验金（balance = 500分）
4. 生成JWT
5. 设置Cookie

---

#### POST /api/auth/login
**功能**: 用户登录

**请求**:
```typescript
{
  phone: string
  verificationCode: string
}
```

**响应**: 同注册接口

---

#### POST /api/auth/logout
**功能**: 退出登录

**请求**: 无Body

**响应**:
```typescript
{
  success: true
}
```

**业务逻辑**: 清除Cookie中的JWT

---

#### GET /api/auth/session
**功能**: 获取当前会话

**认证**: 需要JWT

**响应**:
```typescript
{
  success: true,
  data: {
    user: {
      id: string,
      phone: string,
      name: string,
      balance: number,
      membershipTier: "FREE" | "VIP" | "ENTERPRISE"
    }
  }
}
```

---

### 5.2 API Key管理 (5个)

#### POST /api/keys
**功能**: 生成新API Key

**认证**: 需要JWT

**请求**:
```typescript
{
  name: string  // Key名称，如"我的第一个Key"
}
```

**响应**:
```typescript
{
  success: true,
  data: {
    id: string,
    key: string,  // sk_live_xxxxxx（完整Key，仅首次返回）
    name: string,
    createdAt: string
  }
}
```

**业务逻辑**:
1. 生成随机Key（格式：`sk_live_` + 32位随机字符）
2. 检查唯一性
3. 存储到数据库
4. 返回完整Key（⚠️ 仅此一次）

---

#### GET /api/keys
**功能**: 获取用户所有API Keys

**认证**: 需要JWT

**响应**:
```typescript
{
  success: true,
  data: {
    keys: [
      {
        id: string,
        name: string,
        keyPrefix: string,  // 如 "sk_live_abc1...xyz9"（脱敏）
        totalCalls: number,
        lastUsedAt: string | null,
        createdAt: string
      }
    ]
  }
}
```

---

#### DELETE /api/keys/:id
**功能**: 删除API Key

**认证**: 需要JWT

**响应**:
```typescript
{
  success: true
}
```

---

### 5.3 API市场 (8个)

#### GET /api/marketplace
**功能**: 获取API列表

**Query参数**:
```typescript
{
  category?: string       // 分类筛选
  tags?: string[]         // 标签筛选
  search?: string         // 关键词搜索
  sort?: "popular" | "price-asc" | "price-desc"
  page?: number
  limit?: number
}
```

**响应**:
```typescript
{
  success: true,
  data: {
    apis: [
      {
        id: string,
        name: string,
        slug: string,
        description: string,
        icon: string,
        category: string,
        tags: string[],
        pricing: {
          mode: "PER_CALL" | "USAGE_BASED" | "MEMBERSHIP",
          display: string  // 如 "¥0.01/次", "¥0.5/1000 tokens"
        },
        status: "ACTIVE" | "MAINTENANCE",
        totalCalls: number,
        isSubscribed: boolean  // 当前用户是否已订阅
      }
    ],
    total: number,
    page: number,
    limit: number
  }
}
```

---

#### GET /api/marketplace/:apiId
**功能**: 获取API详情

**响应**:
```typescript
{
  success: true,
  data: {
    api: {
      id: string,
      name: string,
      description: string,
      documentation: string,  // Markdown格式文档
      pricing: {
        mode: string,
        pricePerCall?: number,
        pricePerUnit?: number,
        billingUnit?: string,
        vipFreeQuota?: number
      },
      exampleRequest: object,
      exampleResponse: object,
      isSubscribed: boolean
    }
  }
}
```

---

#### POST /api/marketplace/:apiId/subscribe
**功能**: 订阅API

**认证**: 需要JWT

**响应**:
```typescript
{
  success: true,
  data: {
    subscription: {
      id: string,
      apiId: string,
      subscribedAt: string
    }
  }
}
```

---

#### POST /api/marketplace/:apiId/test
**功能**: 在线测试API

**认证**: 需要JWT

**请求**:
```typescript
{
  params: object  // 测试参数
}
```

**响应**:
```typescript
{
  success: true,
  data: {
    response: object,      // 上游API响应
    latency: number,       // 延迟（毫秒）
    cost: number,          // 本次费用（分）
    balanceAfter: number   // 余额
  }
}
```

---

#### POST /api/marketplace/:apiId/generate-coze-code
**功能**: 生成Coze插件代码

**认证**: 需要JWT

**请求**:
```typescript
{
  params?: object  // 可选参数配置
}
```

**响应**:
```typescript
{
  success: true,
  data: {
    code: string,  // 完整Coze插件代码
    language: "javascript"
  }
}
```

---

### 5.4 API Gateway (核心)

#### ANY /gateway/:apiId/\*
**功能**: 统一API代理端点

**认证**: 需要API Key（Header: `X-API-Key`）

**示例**:
```
POST /gateway/weather-api/v1/query
Headers:
  X-API-Key: sk_live_abc123
  Content-Type: application/json
Body:
  { "city": "北京" }
```

**响应**: 透传上游API响应

**错误响应**:
```typescript
{
  success: false,
  error: {
    code: "INSUFFICIENT_BALANCE" | "INVALID_API_KEY" | "API_ERROR",
    message: string
  }
}
```

---

### 5.5 计费相关 (6个)

#### GET /api/balance
**功能**: 获取账户余额

**认证**: 需要JWT

**响应**:
```typescript
{
  success: true,
  data: {
    balance: number,  // 当前余额（分）
    estimatedDays: number  // 基于过去7天平均消费预测可用天数
  }
}
```

---

#### POST /api/topup
**功能**: 发起充值

**认证**: 需要JWT

**请求**:
```typescript
{
  amount: number  // 充值金额（分）
}
```

**响应**:
```typescript
{
  success: true,
  data: {
    checkoutUrl: string  // Stripe支付页面URL
  }
}
```

---

#### GET /api/transactions
**功能**: 获取交易记录

**认证**: 需要JWT

**Query参数**:
```typescript
{
  type?: "TOPUP" | "API_CHARGE" | "REFUND",
  page?: number,
  limit?: number
}
```

**响应**:
```typescript
{
  success: true,
  data: {
    transactions: [
      {
        id: string,
        type: string,
        amount: number,
        balanceAfter: number,
        description: string,
        createdAt: string
      }
    ],
    total: number
  }
}
```

---

### 5.6 Dashboard (5个)

#### GET /api/dashboard/stats
**功能**: 获取Dashboard统计数据

**认证**: 需要JWT

**响应**:
```typescript
{
  success: true,
  data: {
    todayCalls: number,
    balance: number,
    membershipTier: string,
    topApis: [
      { apiId: string, name: string, calls: number }
    ]
  }
}
```

---

## 6. 核心架构模式

### 6.1 计费引擎设计

#### 6.1.1 策略模式实现

```typescript
// lib/billing/engine.ts
import { PerCallBilling } from './strategies/per-call'
import { UsageBasedBilling } from './strategies/usage-based'
import { MembershipBilling } from './strategies/membership'

export class BillingEngine {
  private strategies: Map<BillingMode, BillingStrategy>

  constructor() {
    this.strategies = new Map([
      ['PER_CALL', new PerCallBilling()],
      ['USAGE_BASED', new UsageBasedBilling()],
      ['MEMBERSHIP', new MembershipBilling()],
    ])
  }

  async charge(
    userId: string,
    apiConfig: ApiConfig,
    request: Request,
    response: any
  ): Promise<ChargeResult> {
    // 1. 选择计费策略
    const strategy = this.strategies.get(apiConfig.billingMode)

    // 2. 计算费用
    const billing = await strategy.calculate(apiConfig, request, response)

    // 3. 事务性扣费
    const result = await prisma.$transaction(async (tx) => {
      // 检查余额
      const user = await tx.user.findUnique({ where: { id: userId } })
      if (user.balance < billing.amount) {
        throw new InsufficientBalanceError()
      }

      // 扣除余额
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: billing.amount } }
      })

      // 记录交易
      await tx.transaction.create({
        data: {
          userId,
          type: 'API_CHARGE',
          amount: -billing.amount,
          balanceAfter: updatedUser.balance,
          description: `调用${apiConfig.api.name}`,
          referenceId: apiCallId
        }
      })

      return { success: true, balanceAfter: updatedUser.balance }
    })

    return result
  }
}
```

#### 6.1.2 响应解析器

```typescript
// lib/billing/parser.ts
export class ResponseParser {
  /**
   * 从响应体中提取计费参数
   * @param response - 上游API响应对象
   * @param jsonPath - JSON路径，如 "usage.total_tokens"
   * @returns 提取的数值
   */
  extract(response: any, jsonPath: string): number {
    try {
      const keys = jsonPath.split('.')
      let value = response

      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key]
        } else {
          // 路径不存在，记录警告并返回默认值
          console.warn(`无法解析路径 ${jsonPath}，使用降级策略`)
          return 1  // 降级为按次计费
        }
      }

      const numValue = Number(value)
      if (isNaN(numValue)) {
        throw new Error(`提取的值不是数字: ${value}`)
      }

      return numValue
    } catch (error) {
      console.error('响应解析失败:', error)
      // 降级策略：返回1，相当于按次计费
      return 1
    }
  }

  /**
   * 批量提取多个参数（用于复杂计费场景）
   */
  extractMultiple(response: any, paths: Record<string, string>): Record<string, number> {
    const result: Record<string, number> = {}
    for (const [key, path] of Object.entries(paths)) {
      result[key] = this.extract(response, path)
    }
    return result
  }
}
```

**示例用法**:
```typescript
// 示例1: GPT-4 按tokens计费
const response = {
  choices: [...],
  usage: {
    prompt_tokens: 50,
    completion_tokens: 100,
    total_tokens: 150
  }
}

const parser = new ResponseParser()
const tokens = parser.extract(response, 'usage.total_tokens')
// tokens = 150

// 示例2: OCR按页数计费
const ocrResponse = {
  result: {
    pages: [{ ... }, { ... }, { ... }]
  }
}

const pages = parser.extract(ocrResponse, 'result.pages.length')
// pages = 3
```

### 6.2 API Gateway代理模式

```typescript
// lib/gateway/proxy.ts
export class ApiProxy {
  /**
   * 代理请求到上游API
   */
  async forward(
    api: Api,
    path: string[],
    request: Request
  ): Promise<Response> {
    // 1. 构建上游URL
    const upstreamUrl = this.buildUpstreamUrl(api, path)

    // 2. 解密上游API Key
    const upstreamKey = this.decryptApiKey(api.upstreamKey)

    // 3. 转发请求
    const upstreamResponse = await fetch(upstreamUrl, {
      method: request.method,
      headers: {
        ...this.filterHeaders(request.headers),  // 过滤敏感Header
        'Authorization': `Bearer ${upstreamKey}`,  // 替换为上游Key
      },
      body: request.body,
      signal: AbortSignal.timeout(30000),  // 30秒超时
    })

    // 4. 错误处理
    if (!upstreamResponse.ok) {
      throw new UpstreamApiError(
        upstreamResponse.status,
        await upstreamResponse.text()
      )
    }

    return upstreamResponse
  }

  private buildUpstreamUrl(api: Api, path: string[]): string {
    const basePath = api.upstreamUrl.replace(/\/$/, '')
    const requestPath = '/' + path.join('/')
    return `${basePath}${requestPath}`
  }

  private filterHeaders(headers: Headers): HeadersInit {
    // 移除用户的API Key，避免泄露给上游
    const filtered = new Headers(headers)
    filtered.delete('x-api-key')
    filtered.delete('authorization')
    filtered.delete('cookie')
    return Object.fromEntries(filtered.entries())
  }

  private decryptApiKey(encryptedKey: string): string {
    // 使用AES-256解密
    return decrypt(encryptedKey, process.env.ENCRYPTION_KEY)
  }
}
```

### 6.3 API Key加密存储

```typescript
// lib/encryption/aes.ts
import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16

export class Encryption {
  private key: Buffer

  constructor(secretKey: string) {
    // 从环境变量派生密钥
    this.key = crypto.scryptSync(secretKey, 'salt', 32)
  }

  /**
   * 加密
   */
  encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(ALGORITHM, this.key, iv)

    let encrypted = cipher.update(plaintext, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    const authTag = cipher.getAuthTag()

    // 格式: iv:authTag:ciphertext
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
  }

  /**
   * 解密
   */
  decrypt(ciphertext: string): string {
    const [ivHex, authTagHex, encrypted] = ciphertext.split(':')

    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')

    const decipher = crypto.createDecipheriv(ALGORITHM, this.key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  }
}

// 使用示例
const encryption = new Encryption(process.env.ENCRYPTION_KEY)

// 存储时加密
const encryptedKey = encryption.encrypt('sk_upstream_real_key_123')
await prisma.api.create({
  data: {
    name: '天气API',
    upstreamKey: encryptedKey  // 存储加密后的Key
  }
})

// 使用时解密
const api = await prisma.api.findUnique({ where: { id: apiId } })
const realKey = encryption.decrypt(api.upstreamKey)
```

### 6.4 限流器设计

```typescript
// lib/gateway/rate-limiter.ts
import { Redis } from '@upstash/redis'

export class RateLimiter {
  private redis: Redis

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN,
    })
  }

  /**
   * 检查是否超过速率限制
   * @param key - 限流键（如 userId 或 apiKeyId）
   * @param limit - 限制次数
   * @param window - 时间窗口（秒）
   */
  async checkLimit(
    key: string,
    limit: number,
    window: number
  ): Promise<{ allowed: boolean; remaining: number }> {
    const now = Date.now()
    const windowKey = `ratelimit:${key}:${Math.floor(now / (window * 1000))}`

    const count = await this.redis.incr(windowKey)

    if (count === 1) {
      // 首次访问，设置过期时间
      await this.redis.expire(windowKey, window)
    }

    const allowed = count <= limit
    const remaining = Math.max(0, limit - count)

    return { allowed, remaining }
  }
}

// 使用示例（在Gateway中）
const rateLimiter = new RateLimiter()

// 每个用户每分钟最多100次请求
const { allowed, remaining } = await rateLimiter.checkLimit(
  `user:${userId}`,
  100,
  60
)

if (!allowed) {
  return new Response('Rate limit exceeded', {
    status: 429,
    headers: {
      'X-RateLimit-Remaining': remaining.toString(),
      'Retry-After': '60'
    }
  })
}
```

---

## 7. 项目结构设计

### 7.1 Next.js 14 目录结构

```
api-hub/
├── app/                           # Next.js App Router
│   ├── (auth)/                    # 认证页面组（共享布局）
│   │   ├── layout.tsx             # 认证页面布局（居中Card）
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/               # Dashboard页面组
│   │   ├── layout.tsx             # Dashboard布局（TopNav + TaskChecklist）
│   │   ├── page.tsx               # 概览页
│   │   ├── marketplace/
│   │   │   ├── page.tsx           # API市场列表
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # API详情页
│   │   ├── keys/
│   │   │   └── page.tsx           # API Key管理
│   │   ├── usage/
│   │   │   └── page.tsx           # 使用统计
│   │   ├── billing/
│   │   │   └── page.tsx           # 充值/账单
│   │   └── settings/
│   │       └── page.tsx           # 设置
│   │
│   ├── api/                       # API Routes
│   │   ├── auth/
│   │   │   ├── register/route.ts
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── session/route.ts
│   │   ├── keys/
│   │   │   ├── route.ts           # GET, POST
│   │   │   └── [id]/route.ts      # DELETE
│   │   ├── marketplace/
│   │   │   ├── route.ts           # GET列表
│   │   │   └── [apiId]/
│   │   │       ├── route.ts       # GET详情
│   │   │       ├── subscribe/route.ts
│   │   │       ├── test/route.ts
│   │   │       └── generate-coze-code/route.ts
│   │   ├── gateway/
│   │   │   └── [apiId]/
│   │   │       └── [...path]/
│   │   │           └── route.ts   # ⭐ 核心Gateway
│   │   ├── balance/
│   │   │   └── route.ts
│   │   ├── topup/
│   │   │   └── route.ts
│   │   ├── transactions/
│   │   │   └── route.ts
│   │   ├── dashboard/
│   │   │   └── stats/route.ts
│   │   └── webhooks/
│   │       └── stripe/route.ts
│   │
│   ├── layout.tsx                 # 根布局
│   ├── globals.css                # 全局样式
│   └── error.tsx                  # 错误页面
│
├── components/                    # React组件
│   ├── ui/                        # shadcn/ui基础组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...                    # 35个shadcn组件
│   │
│   ├── features/                  # 业务组件
│   │   ├── api-card/
│   │   │   ├── api-card.tsx
│   │   │   └── api-card-skeleton.tsx
│   │   ├── api-tester/
│   │   │   ├── api-tester.tsx
│   │   │   ├── param-form.tsx
│   │   │   └── response-viewer.tsx
│   │   ├── coze-code-generator/
│   │   │   ├── generator-dialog.tsx
│   │   │   ├── code-preview.tsx
│   │   │   └── param-configurator.tsx
│   │   ├── balance-widget/
│   │   │   └── balance-widget.tsx
│   │   ├── usage-chart/
│   │   │   └── usage-chart.tsx
│   │   └── task-checklist/
│   │       └── task-checklist.tsx
│   │
│   └── layouts/
│       ├── top-nav.tsx
│       ├── sidebar.tsx
│       └── user-menu.tsx
│
├── lib/                           # 核心业务逻辑
│   ├── billing/                   # 计费引擎
│   │   ├── engine.ts              # BillingEngine类
│   │   ├── strategies/
│   │   │   ├── per-call.ts
│   │   │   ├── usage-based.ts
│   │   │   └── membership.ts
│   │   ├── parser.ts              # ResponseParser
│   │   └── types.ts
│   │
│   ├── gateway/                   # API Gateway
│   │   ├── proxy.ts               # ApiProxy类
│   │   ├── router.ts
│   │   ├── rate-limiter.ts        # RateLimiter类
│   │   └── types.ts
│   │
│   ├── coze-generator/            # Coze代码生成
│   │   ├── generate.ts
│   │   ├── prompt.ts
│   │   └── templates/
│   │       └── base-template.ts
│   │
│   ├── encryption/                # 加密工具
│   │   ├── aes.ts                 # Encryption类
│   │   └── hash.ts
│   │
│   ├── auth/                      # 认证逻辑
│   │   ├── jwt.ts
│   │   ├── session.ts
│   │   └── middleware.ts
│   │
│   ├── db/                        # Prisma客户端
│   │   └── client.ts              # 单例Prisma Client
│   │
│   └── utils/
│       ├── api-response.ts        # 统一响应格式
│       ├── errors.ts              # 自定义错误类
│       └── validators.ts          # 参数验证
│
├── prisma/
│   ├── schema.prisma              # 数据模型
│   ├── migrations/                # 迁移文件
│   └── seed.ts                    # 种子数据
│
├── public/
│   ├── images/
│   └── icons/
│
├── styles/
│   └── globals.css
│
├── config/
│   ├── site.ts                    # 站点配置
│   └── apis.ts                    # API元数据配置
│
├── .env.local                     # 环境变量
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### 7.2 模块职责说明

#### app/ - 路由和页面
- **(auth)**: 认证页面组，共享居中布局
- **(dashboard)**: Dashboard页面组，共享TopNav布局
- **api/**: API Routes，所有后端端点

#### components/ - 组件分层
- **ui/**: shadcn/ui基础组件（原子层）
- **features/**: 业务组件（有机体层）
- **layouts/**: 布局组件

#### lib/ - 核心业务逻辑
- **billing/**: 计费引擎（策略模式）
- **gateway/**: API代理和路由
- **coze-generator/**: LLM代码生成
- **encryption/**: 安全加密工具
- **auth/**: 认证和授权
- **db/**: 数据库访问层

### 7.3 命名规范

**文件命名**:
```
组件文件:   kebab-case.tsx   (api-card.tsx)
工具文件:   kebab-case.ts    (rate-limiter.ts)
类型文件:   kebab-case.ts    (types.ts)
API Routes: route.ts         (固定名称)
页面文件:   page.tsx         (固定名称)
```

**组件命名**:
```typescript
// PascalCase for components
export function ApiCard() { ... }
export class BillingEngine { ... }

// camelCase for functions
export function generateJWT() { ... }
export async function authenticateUser() { ... }

// UPPER_SNAKE_CASE for constants
export const API_TIMEOUT_MS = 30000
export const MAX_RETRIES = 3
```

**变量命名**:
```typescript
// camelCase for variables
const userId = '123'
const apiResponse = await fetch(...)

// Boolean变量用 is/has/can 前缀
const isAuthenticated = true
const hasPermission = false
const canAccess = user.role === 'admin'
```

---

## 8. 实施模式与规范

### 8.1 数据库访问模式

**规则**: 所有数据库操作必须通过Prisma Client

```typescript
// ✅ DO: 使用Prisma Client
import { prisma } from '@/lib/db/client'

const user = await prisma.user.findUnique({ where: { id: userId } })

// ❌ DON'T: 直接SQL查询
import { sql } from '@vercel/postgres'
const result = await sql`SELECT * FROM users WHERE id = ${userId}` // ❌ 禁止
```

**单例模式**:
```typescript
// lib/db/client.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 8.2 API响应格式标准

**统一响应格式**:
```typescript
// lib/utils/api-response.ts
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    timestamp: string
    requestId: string
  }
}

// 成功响应
export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID(),
    }
  }
}

// 错误响应
export function errorResponse(
  code: string,
  message: string,
  details?: any
): ApiResponse {
  return {
    success: false,
    error: { code, message, details },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID(),
    }
  }
}
```

**使用示例**:
```typescript
// app/api/keys/route.ts
import { successResponse, errorResponse } from '@/lib/utils/api-response'

export async function GET(request: Request) {
  try {
    const keys = await prisma.apiKey.findMany({ ... })
    return Response.json(successResponse({ keys }))
  } catch (error) {
    return Response.json(
      errorResponse('KEYS_FETCH_FAILED', '获取API Keys失败'),
      { status: 500 }
    )
  }
}
```

### 8.3 错误处理模式

**自定义错误类**:
```typescript
// lib/utils/errors.ts
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// 具体错误类
export class InsufficientBalanceError extends AppError {
  constructor(required: number, available: number) {
    super(
      'INSUFFICIENT_BALANCE',
      '余额不足',
      402,
      { required, available }
    )
  }
}

export class InvalidApiKeyError extends AppError {
  constructor() {
    super('INVALID_API_KEY', 'API Key无效', 401)
  }
}

export class UpstreamApiError extends AppError {
  constructor(statusCode: number, message: string) {
    super('UPSTREAM_API_ERROR', `上游API错误: ${message}`, 502, { statusCode })
  }
}
```

**错误处理中间件**:
```typescript
// lib/utils/error-handler.ts
import { AppError } from './errors'
import { errorResponse } from './api-response'

export function handleApiError(error: unknown): Response {
  console.error('API Error:', error)

  // 已知错误
  if (error instanceof AppError) {
    return Response.json(
      errorResponse(error.code, error.message, error.details),
      { status: error.statusCode }
    )
  }

  // Prisma错误
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return Response.json(
        errorResponse('UNIQUE_CONSTRAINT', '记录已存在'),
        { status: 409 }
      )
    }
  }

  // 未知错误
  return Response.json(
    errorResponse('INTERNAL_SERVER_ERROR', '服务器内部错误'),
    { status: 500 }
  )
}
```

### 8.4 计费引擎调用规则

**规则**: 只在Gateway层统一调用计费引擎

```typescript
// ✅ DO: 在Gateway中调用
// app/api/gateway/[apiId]/[...path]/route.ts
import { billingEngine } from '@/lib/billing/engine'

export async function ANY(request: Request, { params }) {
  // ...代理请求...
  const response = await proxyToUpstream(...)

  // 调用计费引擎
  await billingEngine.charge(userId, apiConfig, request, response)

  return response
}

// ❌ DON'T: 在其他地方直接操作余额
// app/api/some-endpoint/route.ts
await prisma.user.update({
  where: { id: userId },
  data: { balance: { decrement: 100 } }  // ❌ 禁止直接修改余额
})
```

### 8.5 环境变量管理

**.env.local**:
```bash
# 数据库
DATABASE_URL="postgresql://user:pass@localhost:5432/api_hub"

# 认证
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# 加密
ENCRYPTION_KEY="your-encryption-key-32-chars-long"

# OpenAI
OPENAI_API_KEY="sk-..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# 应用
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Redis (可选，限流用)
UPSTASH_REDIS_URL="https://..."
UPSTASH_REDIS_TOKEN="..."

# Sentry (可选，错误追踪)
SENTRY_DSN="https://..."
```

**类型安全访问**:
```typescript
// config/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  OPENAI_API_KEY: z.string().startsWith('sk-'),
  STRIPE_SECRET_KEY: z.string(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)

// 使用
import { env } from '@/config/env'
const apiKey = env.OPENAI_API_KEY  // 类型安全
```

---

## 9. 部署架构

### 9.1 Zeabur部署方案

#### 9.1.1 服务组件

```
┌─────────────────────────────────────────────────────────┐
│                  Zeabur Project: api-hub                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Service: api-hub-app (Next.js)                  │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │  Git: github.com/user/api-hub              │  │  │
│  │  │  Branch: main (自动部署)                   │  │  │
│  │  │  Build: npm run build                      │  │  │
│  │  │  Start: npm run start                      │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  │  Domain: api-hub.zeabur.app                      │  │
│  │  Custom Domain: api.yourdomain.com               │  │
│  │  SSL: 自动签发 (Let's Encrypt)                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Service: postgres (PostgreSQL 15)              │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │  Storage: 10GB SSD                         │  │  │
│  │  │  Backup: 每日自动备份（保留7天）           │  │  │
│  │  │  Connection: 内网连接（低延迟）            │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  │  Database: api_hub                               │  │
│  │  User: postgres                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Environment Variables (所有服务共享):                 │
│  ┌────────────────────────────────────────────────┐   │
│  │  DATABASE_URL         (自动注入)               │   │
│  │  JWT_SECRET           (手动添加)               │   │
│  │  ENCRYPTION_KEY       (手动添加)               │   │
│  │  OPENAI_API_KEY       (手动添加)               │   │
│  │  STRIPE_SECRET_KEY    (手动添加)               │   │
│  │  NEXT_PUBLIC_APP_URL  (自动生成)               │   │
│  └────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 9.1.2 部署流程

```bash
# 1. 初始化项目
npm create next-app@latest api-hub
cd api-hub

# 2. 安装依赖
npm install prisma @prisma/client
npm install openai stripe @stripe/stripe-js
npm install bcryptjs jose
npm install zod

# 3. 初始化Prisma
npx prisma init

# 4. 配置schema.prisma（使用前面定义的完整Schema）

# 5. 推送到GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/user/api-hub.git
git push -u origin main

# 6. 在Zeabur创建项目
# - 登录 zeabur.com
# - 创建新项目 "api-hub"
# - 添加服务 → 从GitHub导入
# - 选择仓库 user/api-hub
# - 自动检测Next.js项目

# 7. 添加PostgreSQL服务
# - 在项目中点击 "添加服务"
# - 选择 "PostgreSQL"
# - 自动创建数据库并注入DATABASE_URL

# 8. 配置环境变量
# - 在Zeabur控制台添加环境变量
# - JWT_SECRET, ENCRYPTION_KEY等

# 9. 运行迁移
# - 在本地执行: npx prisma migrate deploy
# - 或在Zeabur服务设置中添加构建后命令

# 10. 访问应用
# - Zeabur自动分配域名: api-hub-xxx.zeabur.app
# - 绑定自定义域名（可选）
```

#### 9.1.3 自动部署配置

**package.json scripts**:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate",
    "migrate": "prisma migrate deploy",
    "seed": "tsx prisma/seed.ts"
  }
}
```

**Zeabur构建配置（自动检测）**:
- Build Command: `npm run build`
- Start Command: `npm run start`
- Install Command: `npm ci`

### 9.2 数据库迁移策略

**开发环境**:
```bash
# 创建迁移
npx prisma migrate dev --name init

# 查看迁移状态
npx prisma migrate status
```

**生产环境（Zeabur）**:
```bash
# 部署迁移（在CI/CD或手动触发）
npx prisma migrate deploy

# 重置数据库（⚠️ 谨慎操作）
npx prisma migrate reset
```

### 9.3 监控与日志

#### Zeabur内置监控
- **CPU使用率**: 实时图表
- **内存使用**: 实时图表
- **网络流量**: 入站/出站带宽
- **日志查看**: 实时日志流

#### Sentry集成（错误追踪）
```typescript
// next.config.js
const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(
  {
    // Next.js配置
  },
  {
    silent: true,
    org: 'your-org',
    project: 'api-hub',
  }
)

// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
})
```

### 9.4 性能优化

**Next.js优化**:
```typescript
// next.config.js
module.exports = {
  // 图片优化
  images: {
    domains: ['cdn.yourdomain.com'],
    formats: ['image/avif', 'image/webp'],
  },

  // 压缩
  compress: true,

  // SWC编译
  swcMinify: true,

  // 实验性功能
  experimental: {
    optimizeCss: true,
  },
}
```

**数据库连接池**:
```typescript
// lib/db/client.ts
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // 连接池配置
  __internal: {
    engine: {
      connectionPoolSettings: {
        pool_timeout: 10,
        max_size: 10,  // Zeabur推荐值
      },
    },
  },
})
```

---

## 10. 模板迁移计划

### 10.1 从官方模板迁移

**官方模板**: [nextjs/saas-starter](https://github.com/nextjs/saas-starter)
**目标**: 完全替换Drizzle为Prisma，保留认证和支付逻辑

### 10.2 迁移步骤

#### 阶段1: 环境搭建（第1天）

```bash
# 1. Fork官方模板
git clone https://github.com/nextjs/saas-starter.git api-hub
cd api-hub

# 2. 安装Prisma
npm install prisma @prisma/client
npm install -D tsx

# 3. 初始化Prisma
npx prisma init

# 4. 复制Schema
# 将前面定义的完整Prisma Schema复制到 prisma/schema.prisma

# 5. 生成Prisma Client
npx prisma generate

# 6. 配置环境变量
cp .env.example .env.local
# 编辑.env.local，添加DATABASE_URL等
```

#### 阶段2: 数据库迁移（第2-3天）

**映射Drizzle表到Prisma**:

官方模板的Drizzle Schema:
```typescript
// 官方模板: lib/db/schema.ts (Drizzle)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 64 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
})

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
})
```

替换为Prisma Schema（已在第4节定义）:
```prisma
// prisma/schema.prisma (Prisma)
model User {
  id    String @id @default(cuid())
  phone String @unique
  // ... API Hub特定字段
}
```

**迁移数据查询代码**:

```typescript
// 迁移前 (Drizzle)
import { db } from '@/lib/db/drizzle'
import { users } from '@/lib/db/schema'

const user = await db
  .select()
  .from(users)
  .where(eq(users.email, email))
  .limit(1)

// 迁移后 (Prisma)
import { prisma } from '@/lib/db/client'

const user = await prisma.user.findUnique({
  where: { phone }
})
```

**批量替换工具**:
```bash
# 查找所有Drizzle查询
grep -r "db.select\|db.insert\|db.update\|db.delete" app/ lib/

# 手动逐个替换为Prisma语法
```

#### 阶段3: 认证逻辑迁移（第4天）

官方模板使用基于Cookie的JWT认证，保留这部分逻辑，只替换数据库查询:

```typescript
// lib/auth/session.ts (保留JWT逻辑，替换数据库查询)
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db/client'  // 改为Prisma

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, expiresAt })

  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function verifySession() {
  const cookie = cookies().get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    return null
  }

  // ✅ 改为Prisma查询
  const user = await prisma.user.findUnique({
    where: { id: session.userId }
  })

  return { user }
}
```

#### 阶段4: Stripe集成迁移（第5天）

官方模板的Stripe逻辑可直接保留，只需调整:

1. **Webhook处理器**:
```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'
import { prisma } from '@/lib/db/client'

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const sig = request.headers.get('stripe-signature')!
  const body = await request.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return Response.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  // 处理事件
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId

    // ✅ 使用Prisma更新余额
    await prisma.user.update({
      where: { id: userId },
      data: {
        balance: {
          increment: Number(session.amount_total) // Stripe金额单位是分
        }
      }
    })

    // 记录交易
    await prisma.transaction.create({
      data: {
        userId,
        type: 'TOPUP',
        amount: Number(session.amount_total),
        description: '充值',
        referenceId: session.id
      }
    })
  }

  return Response.json({ received: true })
}
```

#### 阶段5: UI组件保留（第6-7天）

官方模板已使用shadcn/ui，大部分UI组件可直接保留:

```
保留:
- components/ui/*  (shadcn组件)
- app/(auth)/*     (认证页面)
- components/navbar.tsx

新增（API Hub特定）:
- components/features/api-card/
- components/features/api-tester/
- components/features/coze-code-generator/
```

#### 阶段6: 添加API Hub核心功能（第8-20天）

**新增模块清单**:

```
第8-10天: API Gateway
├─ app/api/gateway/[apiId]/[...path]/route.ts
├─ lib/gateway/proxy.ts
├─ lib/gateway/rate-limiter.ts

第11-15天: 计费引擎
├─ lib/billing/engine.ts
├─ lib/billing/strategies/*
├─ lib/billing/parser.ts

第16-18天: Coze代码生成
├─ lib/coze-generator/generate.ts
├─ app/api/marketplace/[apiId]/generate-coze-code/route.ts

第19-20天: Dashboard页面
├─ app/(dashboard)/marketplace/*
├─ app/(dashboard)/keys/*
├─ components/features/usage-chart/
```

### 10.3 迁移验证清单

```
✅ 数据库
  ├─ Prisma Schema定义完整
  ├─ 迁移文件生成成功
  ├─ 种子数据可正常执行
  └─ 所有Drizzle查询已替换为Prisma

✅ 认证
  ├─ 注册流程正常
  ├─ 登录流程正常
  ├─ JWT验证正常
  └─ Session管理正常

✅ Stripe
  ├─ Checkout创建成功
  ├─ Webhook接收正常
  ├─ 余额更新正确
  └─ 交易记录创建成功

✅ API Hub核心功能
  ├─ API Gateway代理成功
  ├─ 计费引擎扣费正确
  ├─ Coze代码生成成功
  └─ Dashboard数据展示正常

✅ 部署
  ├─ Zeabur构建成功
  ├─ 环境变量配置正确
  ├─ 数据库连接正常
  └─ 生产环境运行稳定
```

---

## 11. 架构决策记录 (ADRs)

### ADR-001: 选择Zeabur而非阿里云自管理

**日期**: 2025-11-15
**状态**: ✅ 已接受

**背景**:
团队无运维能力，需要快速部署MVP验证产品方向。

**决策**:
选择Zeabur零运维PaaS平台，放弃阿里云ECS自管理方案。

**理由**:
1. 零运维负担，专注产品开发
2. Git推送自动部署，缩短迭代周期
3. 国内访问速度可接受（50-100ms）
4. 成本可控（¥29-99/月）
5. 避免备案等待期（20天）

**后果**:
- ✅ 开发速度显著提升
- ✅ 无需学习Linux运维知识
- ⚠️ 平台锁定风险（但迁移成本可控）
- ⚠️ 高级配置受限（如自定义Nginx）

**替代方案**:
- 阿里云ECS: 需要运维能力，已否决
- Vercel: Serverless限制，国内访问慢，已否决
- Railway: 国外平台，备选方案

---

### ADR-002: 完全替换Drizzle为Prisma

**日期**: 2025-11-15
**状态**: ✅ 已接受

**背景**:
Next.js官方SaaS Starter使用Drizzle ORM，但团队更熟悉Prisma。

**决策**:
完全移除Drizzle，重写所有数据库代码为Prisma。

**理由**:
1. **类型安全**: Prisma自动生成类型，编译时错误检测
2. **开发体验**: Prisma Studio可视化数据管理
3. **迁移工具**: `prisma migrate`比Drizzle Kit成熟
4. **团队熟悉度**: 降低学习成本
5. **统一技术栈**: 避免维护两套ORM

**后果**:
- ✅ 长期维护性更好
- ✅ 开发效率更高
- ⚠️ 初期迁移工作量约3-4天
- ⚠️ 失去Drizzle的轻量级优势

**替代方案**:
- 保留Drizzle: 学习成本高，已否决
- 混合使用: 维护复杂度高，已否决

---

### ADR-003: 选择响应体解析而非预定义规则

**日期**: 2025-11-15
**状态**: ✅ 已接受

**背景**:
按量计费需要从上游API响应中提取使用量（如tokens、pages）。

**决策**:
实现通用JSON Path解析器，运行时从响应体提取计费参数。

**理由**:
1. **灵活性**: 支持任意API的计费参数结构
2. **扩展性**: 新增API无需修改代码，只需配置JSON Path
3. **准确性**: 基于实际响应数据计费，避免估算误差

**后果**:
- ✅ 系统通用性强，易于扩展
- ✅ 计费准确性高
- ⚠️ 增加复杂度（需要错误处理）
- ⚠️ 性能略低（JSON解析开销）

**降级策略**:
- 解析失败时降级为按次计费（quantity=1）
- 记录解析错误日志，后续人工审核

**替代方案**:
- 预定义规则: 扩展性差，每个API需硬编码，已否决
- LLM解析响应: 成本高、延迟大，已否决

---

### ADR-004: 同步计费而非异步计费

**日期**: 2025-11-15
**状态**: ✅ 已接受

**背景**:
API调用完成后需要扣费，可以同步扣费或异步扣费。

**决策**:
在API Gateway流程中同步扣费（事务性操作）。

**理由**:
1. **强一致性**: 确保余额和调用记录完全同步
2. **防止透支**: 调用前检查余额，调用后立即扣费
3. **简化逻辑**: 无需维护异步任务队列
4. **审计友好**: 交易记录与调用一一对应

**后果**:
- ✅ 数据一致性强
- ✅ 无透支风险
- ⚠️ API延迟增加50-100ms（数据库写入时间）
- ⚠️ 数据库写入压力增大

**性能优化**:
- 使用Prisma事务批量操作
- 数据库索引优化
- 读写分离（如需要）

**替代方案**:
- 异步计费: 性能好但一致性弱，已否决
- 预扣费+结算: 逻辑复杂，已否决

---

### ADR-005: OpenAI GPT-4o mini而非国产LLM

**日期**: 2025-11-15
**状态**: ✅ 已接受

**背景**:
Coze插件代码生成需要LLM服务。

**决策**:
使用OpenAI GPT-4o mini，暂不使用国产LLM（通义千问/文心一言）。

**理由**:
1. **代码生成质量**: GPT-4系列在代码生成上表现最佳
2. **成本低**: $0.15/1M tokens，比GPT-4便宜90%
3. **速度快**: 适合实时生成场景
4. **稳定性**: 99.9% SLA保证

**后果**:
- ✅ 用户体验好（生成质量高）
- ✅ 成本可控（每次生成约¥0.002）
- ⚠️ 依赖国外服务（需要稳定网络）
- ⚠️ 潜在合规风险（如涉及敏感数据）

**备选方案**:
- 通义千问: 国内合规，但代码生成质量待验证
- 本地模板引擎: 成本为0，但不够智能

**迁移路径**:
- MVP阶段使用OpenAI
- 如遇合规问题，切换到通义千问（接口兼容，成本相近）

---

### ADR-006: 数据库加密存储API Key

**日期**: 2025-11-15
**状态**: ✅ 已接受

**背景**:
需要存储上游API的密钥（如OpenAI API Key、天气API Key）。

**决策**:
使用AES-256-GCM加密后存储在PostgreSQL数据库。

**理由**:
1. **安全性**: AES-256标准加密算法
2. **可查询性**: 仍可通过ID查询（加密不影响主键）
3. **实现简单**: Node.js crypto模块内置支持
4. **成本低**: 无需额外服务

**后果**:
- ✅ 满足基本安全要求
- ✅ 实现简单，无外部依赖
- ⚠️ 加密密钥管理责任重大（若泄露则全部密钥泄露）
- ⚠️ 无密钥轮换机制（需手动实现）

**密钥管理**:
- 加密密钥存储在环境变量 `ENCRYPTION_KEY`
- 使用 scrypt 从密钥派生（加盐）
- ⚠️ 生产环境必须使用强随机密钥（32字节）

**替代方案**:
- 云KMS（AWS KMS/阿里云KMS）: 更安全但成本高，可作为未来升级方向
- 环境变量存储: 不支持动态添加API，已否决

---

## 12. 成功标准

### 12.1 功能完整性

**核心功能验收**:
```
✅ 用户认证
  ├─ 手机号+验证码注册成功率 > 95%
  ├─ JWT有效期管理正确（7天）
  └─ Session刷新机制正常

✅ API Key管理
  ├─ 生成Key格式正确（sk_live_ + 32字符）
  ├─ Key唯一性校验无冲突
  └─ 删除Key级联删除调用记录

✅ API Gateway
  ├─ 支持所有HTTP方法（GET/POST/PUT/DELETE/PATCH）
  ├─ 请求/响应透传无数据损坏
  ├─ 错误处理覆盖所有异常场景
  └─ 认证失败返回401，余额不足返回402

✅ 计费引擎
  ├─ 三种计费模式测试通过
  ├─ 响应解析准确率 > 99%
  ├─ 余额扣费事务性保证（无脏数据）
  └─ 会员权益判断逻辑正确

✅ Coze代码生成
  ├─ 生成代码可直接运行（无语法错误）
  ├─ API Key自动填充正确
  ├─ 参数智能预填充准确率 > 80%
  └─ 生成时间 < 5秒

✅ Dashboard
  ├─ 实时余额显示延迟 < 2秒
  ├─ 调用统计准确性 100%
  ├─ 任务清单状态持久化
  └─ 图表数据可视化正确

✅ 10分钟首次调用体验
  ├─ 新用户完成率 > 80%
  ├─ 流程中断点 < 2个
  └─ 用户满意度 > 4/5分
```

### 12.2 性能指标

**响应时间**:
```
API Gateway延迟 (P95):       < 100ms    ⭐ 核心指标
Dashboard首屏加载:           < 2s
API列表页加载:              < 1.5s
代码生成响应时间:           < 5s
数据库查询延迟 (P95):       < 50ms
```

**吞吐量**:
```
并发API调用:                1000+ QPS
同时在线用户:               500+ 用户
数据库连接池:               10个连接（Zeabur推荐）
```

**可用性**:
```
系统可用性:                 > 99.9% (月停机 < 43分钟)
API Gateway成功率:          > 99%
数据库可用性:               > 99.95% (Zeabur SLA)
```

### 12.3 安全指标

**认证与授权**:
```
✅ JWT签名验证无漏洞
✅ API Key泄露后可立即撤销
✅ 密码存储使用bcrypt (cost=10)
✅ Session劫持防护（HttpOnly Cookie）
```

**数据加密**:
```
✅ 上游API Key AES-256加密存储
✅ HTTPS强制（生产环境）
✅ 敏感日志脱敏（不记录完整API Key）
```

**漏洞防护**:
```
✅ SQL注入防护（Prisma参数化查询）
✅ XSS防护（React自动转义）
✅ CSRF防护（SameSite Cookie）
✅ Rate Limiting（每用户100次/分钟）
✅ OWASP Top 10审查通过
```

### 12.4 代码质量

**TypeScript**:
```
✅ 严格模式启用（strict: true）
✅ 类型覆盖率 > 95%
✅ 无any类型（除必要场景）
✅ 编译零错误零警告
```

**测试覆盖率**:
```
单元测试:
  ├─ 计费引擎测试覆盖率 > 90%
  ├─ 响应解析器测试覆盖率 > 95%
  └─ 加密工具测试覆盖率 > 100%

集成测试:
  ├─ API Gateway端到端测试
  ├─ 认证流程测试
  └─ 支付流程测试（使用Stripe测试环境）
```

**代码规范**:
```
✅ ESLint规则100%通过
✅ Prettier格式化一致
✅ 组件平均行数 < 200行
✅ 函数复杂度 < 10
```

### 12.5 用户体验

**10分钟首次调用漏斗**:
```
注册成功:         100%基线
生成API Key:      > 95% (流失 < 5%)
选择API:          > 90% (流失 < 10%)
获取代码:         > 85% (流失 < 15%)
完成测试调用:     > 80% (流失 < 20%)
────────────────────────────────────
总完成率:         > 80%  ⭐ 核心成功指标
```

**用户满意度**:
```
界面易用性:       > 4.5/5
API文档清晰度:    > 4.0/5
响应速度:         > 4.0/5
整体满意度:       > 4.2/5
NPS净推荐值:      > 30
```

### 12.6 业务指标（MVP阶段）

**用户增长**:
```
月活跃用户 (MAU):         100-500人
日活跃用户 (DAU):         30-100人
注册转化率:               > 20% (着陆页→注册)
留存率 (7天):             > 40%
```

**收入指标**:
```
付费用户占比:             > 10%
ARPU (人均收入):          > ¥50/月
充值成功率:               > 95%
月经常性收入 (MRR):       ¥5000-¥25000
```

**运营成本**:
```
Zeabur平台费:             ¥29-99/月
OpenAI API费用:           ¥100-500/月
Stripe手续费:             2.9% + ¥2/笔
域名费用:                 ¥50/年
────────────────────────────────────
总成本:                   ¥200-800/月
────────────────────────────────────
盈亏平衡点:               10-20个付费用户
```

---

## 附录

### A. 快速启动清单

```bash
# 1. 克隆仓库
git clone https://github.com/nextjs/saas-starter.git api-hub
cd api-hub

# 2. 安装依赖
npm install
npm install prisma @prisma/client openai stripe

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入:
# - DATABASE_URL
# - JWT_SECRET
# - ENCRYPTION_KEY
# - OPENAI_API_KEY
# - STRIPE_SECRET_KEY

# 4. 初始化数据库
npx prisma migrate dev --name init
npx prisma db seed

# 5. 启动开发服务器
npm run dev

# 6. 访问
open http://localhost:3000
```

### B. 关键文件路径索引

```
认证:
  - lib/auth/jwt.ts
  - lib/auth/session.ts
  - app/api/auth/*/route.ts

API Gateway:
  - app/api/gateway/[apiId]/[...path]/route.ts
  - lib/gateway/proxy.ts

计费引擎:
  - lib/billing/engine.ts
  - lib/billing/strategies/*
  - lib/billing/parser.ts

Coze代码生成:
  - lib/coze-generator/generate.ts
  - app/api/marketplace/[apiId]/generate-coze-code/route.ts

数据模型:
  - prisma/schema.prisma

组件:
  - components/features/api-card/
  - components/features/api-tester/
  - components/features/coze-code-generator/
```

### C. 环境变量完整清单

```bash
# 数据库
DATABASE_URL="postgresql://..."

# 认证
JWT_SECRET="your-secret-min-32-chars"

# 加密
ENCRYPTION_KEY="your-encryption-key-32-chars"

# OpenAI
OPENAI_API_KEY="sk-..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# 应用
NEXT_PUBLIC_APP_URL="https://api-hub.zeabur.app"
NODE_ENV="production"

# Redis (可选)
UPSTASH_REDIS_URL="https://..."
UPSTASH_REDIS_TOKEN="..."

# Sentry (可选)
SENTRY_DSN="https://..."
```

### D. 技术债务与未来优化

**已知限制（MVP阶段可接受）**:
1. 响应解析失败降级为按次计费（准确性略低）
2. 无密钥轮换机制（手动管理加密密钥）
3. 无多租户支持（Phase 2功能）
4. 无Admin后台（手动数据库操作）
5. 有限的API文档自动化（手动维护）

**Phase 2优化方向**:
1. 引入云KMS管理密钥（提升安全性）
2. 实现Admin后台（API配置界面）
3. 添加多租户支持（企业客户隔离）
4. 优化计费引擎（分级定价、动态折扣）
5. 集成更多LLM（通义千问、文心一言作为备选）
6. 实现WebSocket实时余额更新（提升体验）

---

## 文档变更历史

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|----------|------|
| 1.0 | 2025-11-15 | 初始版本，完整架构设计 | BMad Method |

---

**文档结束**
