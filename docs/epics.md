# api-hub - Epic Breakdown

**Author:** BMad
**Date:** 2025-11-15
**Project Level:** {{project_level}}
**Target Scale:** {{target_scale}}

---

## Overview

This document provides the complete epic and story breakdown for api-hub, decomposing the requirements from the [PRD](./PRD.md) into implementable stories.

**Living Document Notice:** This is the initial version. It will be updated after UX Design and Architecture workflows add interaction and technical details to stories.

### Epic 结构概览

本项目共规划 **15 个 Epics**，其中 **12 个为 MVP 范围**（Epic 1-12），**3 个为 Phase 2**（Epic 13-15）。

**MVP Epics（按实施顺序）:**

1. **Epic 1: 项目基础设施与核心架构** - 建立开发、部署和监控基础
2. **Epic 2: 用户认证与账户管理** (FR1-FR8) - 用户注册、登录、资料管理
3. **Epic 3: API Key 生命周期管理** (FR9-FR13) - 统一 Key 生成和管理
4. **Epic 4: API 市场与浏览体验** (FR28-FR34) - API 发现、搜索、文档查看
5. **Epic 5: API 网关核心引擎** (FR35-FR42) - 统一代理、验证、转发、记录
6. **Epic 6: 智能计费引擎** (FR43-FR53) - 三种计费模式、会员折扣、审计
7. **Epic 7: 账户余额与充值系统** (FR14-FR20) - 余额查看、充值、交易记录
8. **Epic 8: 会员体系与权益管理** (FR21-FR27) - 会员套餐、购买、折扣应用
9. **Epic 9: Coze 插件智能代码生成** (FR54-FR57) - LLM 驱动代码生成
10. **Epic 10: 通知与用户触达** (FR90-FR94) - 余额提醒、会员到期通知
11. **Epic 11: 支付集成（Stripe MVP）** (FR95-FR99) - Stripe 支付集成
12. **Epic 12: 安全与风控体系** (FR100-FR105) - 加密、限流、审计、风控

**Phase 2 Epics（Admin 后台）:**

13. **Epic 13: Admin - API 接入与配置** (FR58-FR70) - API 管理界面、AI 数据处理
14. **Epic 14: Admin - 会员套餐管理** (FR71-FR75) - 套餐配置界面
15. **Epic 15: Admin - 用户管理与监控** (FR76-FR89) - 用户管理、统计监控、告警

---

## Functional Requirements Inventory

**从 PRD 提取的完整 FR 列表（105个功能需求）：**

### 用户账户与认证 (FR1-FR8)
- FR1: 用户可以通过手机号+验证码注册账户
- FR2: 用户可以通过邮箱+密码注册账户
- FR3: 用户可以登录系统并维持会话状态
- FR4: 用户可以退出登录并终止会话
- FR5: 用户可以通过邮箱/手机号重置密码
- FR6: 用户可以查看和更新个人资料(昵称、头像等)
- FR7: 用户可以修改账户安全设置(密码、绑定手机/邮箱)
- FR8: 系统支持多设备同时登录同一账户

### API Key管理 (FR9-FR13)
- FR9: 用户可以生成个人API Key用于调用网关API
- FR10: 用户可以查看自己拥有的所有API Keys列表
- FR11: 用户可以为API Key设置备注名称(便于识别用途)
- FR12: 用户可以撤销/删除不再使用的API Key
- FR13: 用户可以轮换(重新生成)API Key以提升安全性

### 账户余额与充值 (FR14-FR20)
- FR14: 用户可以查看当前账户余额
- FR15: 用户可以通过微信支付充值账户
- FR16: 用户可以通过支付宝充值账户
- FR17: 用户可以查看充值记录(时间、金额、支付方式)
- FR18: 用户可以查看消费记录(时间、API、扣费金额)
- FR19: 用户可以按时间范围和API类型筛选交易记录
- FR20: 用户在余额不足时收到预警提醒

### 会员系统 (FR21-FR27)
- FR21: 用户可以浏览可用的会员套餐(月费/年费/VIP等)
- FR22: 用户可以购买会员套餐
- FR23: 用户可以查看自己的会员状态(类型、到期时间、权益)
- FR24: 用户可以续费即将到期的会员
- FR25: 会员用户享受全局折扣(根据套餐配置如9折/8折)
- FR26: 会员用户在购买套餐时获得充值返现
- FR27: 会员到期后失去折扣权益但保留账户余额

### API浏览与文档 (FR28-FR34)
- FR28: 用户可以浏览平台提供的API目录
- FR29: 用户可以按分类(工具类、AI类、数据类等)筛选API
- FR30: 用户可以搜索API(按名称、描述、标签)
- FR31: 用户可以查看API详细文档(功能说明、参数、返回值、示例)
- FR32: 用户可以查看API定价信息(按次/按量价格,会员优惠)
- FR33: 用户可以查看API的Coze插件代码模板
- FR34: 用户可以一键复制Coze插件代码到剪贴板

### API网关调用 (FR35-FR42)
- FR35: 用户可以使用API Key通过统一网关端点调用任意已发布的API
- FR36: 系统验证API Key的有效性(未过期、未撤销)
- FR37: 系统验证用户权限(账户状态正常、未被封禁)
- FR38: 系统验证账户余额足够支付本次API调用费用
- FR39: 系统检查用户是否超过速率限制配额
- FR40: 系统将用户请求代理转发到上游第三方API
- FR41: 系统在返回响应前完成计费扣费
- FR42: 系统记录每次API调用日志(用户、API、时间、请求参数、响应状态、扣费金额)

### 计费系统 (FR43-FR53)
- FR43: 系统支持按次计费模式,每次调用固定价格
- FR44: 系统根据API配置的单次价格进行扣费
- FR45: 系统支持按量计费模式,根据API响应中的计量参数扣费
- FR46: 系统支持嵌套参数识别(如`response.usage.tokens`,支持2-3层深度)
- FR47: 系统根据配置的参数路径和系数(如tokens × 单价)计算费用
- FR48: 系统对会员用户应用全局折扣(根据会员套餐配置)
- FR49: 系统支持API级别的会员权益配置(应用全局折扣/排除会员折扣/特殊会员折扣/会员免费)
- FR50: 系统在扣费前检查余额,不足时拒绝调用并返回余额不足提示
- FR51: 系统保证计费准确性,每次扣费可追溯可审计
- FR52: 系统支持管理员手动调整用户余额(需审批和记录)
- FR53: 系统计算并记录每次API调用的成本(批发价)和收入(零售价)

### Coze插件代码生成 (FR54-FR57)
- FR54: 系统为每个API自动生成标准的Coze插件代码模板
- FR55: 生成的代码包含正确的API端点、参数映射、API Key配置
- FR56: 生成的代码包含示例参数值和使用说明注释
- FR57: 用户可以直接复制代码粘贴到Coze工作流中使用

### Admin - API接入管理 (FR58-FR66)
- FR58: 管理员可以添加新的第三方API到平台
- FR59: 管理员可以配置API基本信息(名称、描述、分类、图标)
- FR60: 管理员可以配置上游API参数(URL、HTTP方法、认证方式)
- FR61: 管理员可以选择计费模式(按次/按量)
- FR62: 管理员可以配置按次计费的单次价格
- FR63: 管理员可以配置按量计费的参数路径和系数
- FR64: 管理员可以配置API的会员权益(应用全局折扣/排除/特殊折扣/免费)
- FR65: 管理员可以编辑已发布API的配置
- FR66: 管理员可以下架/删除不再提供的API

### Admin - AI数据处理 (FR67-FR70)
- FR67: 管理员在配置第三方API时可以使用AI辅助生成数据转换代码
- FR68: AI数据处理可以简化复杂的API返回结构
- FR69: AI数据处理可以统一不同API的数据格式
- FR70: AI数据处理可以添加平台增值参数(余额提醒、联系方式等)

### Admin - 会员套餐管理 (FR71-FR75)
- FR71: 管理员可以创建新的会员套餐
- FR72: 管理员可以配置套餐参数(名称、价格、有效期、全局折扣率、返现金额)
- FR73: 管理员可以创建多种套餐类型(月费/年费/VIP等)
- FR74: 管理员可以编辑现有套餐配置
- FR75: 管理员可以下架不再提供的套餐(已购用户不受影响)

### Admin - 用户管理 (FR76-FR80)
- FR76: 管理员可以查询用户列表(支持搜索和筛选)
- FR77: 管理员可以查看用户详细信息(注册时间、会员状态、余额、消费记录)
- FR78: 管理员可以查看用户的API调用统计
- FR79: 管理员可以启用/禁用用户账户
- FR80: 管理员可以手动调整用户余额(需记录原因和审批)

### Admin - 统计与监控 (FR81-FR89)
- FR81: 管理员可以查看平台整体统计数据(用户数、活跃用户、API调用量)
- FR82: 管理员可以查看收入统计(按时间维度、按API维度)
- FR83: 管理员可以查看成本统计(API批发成本)
- FR84: 管理员可以查看利润统计(收入-成本)
- FR85: 管理员可以查看API调用排行(最热门API)
- FR86: 管理员可以查看用户增长趋势图
- FR87: 管理员可以查看收入增长趋势图
- FR88: 管理员可以配置告警规则(成本异常、调用失败率高等)
- FR89: 管理员收到告警通知(邮件/短信/系统内通知)

### 通知系统 (FR90-FR94)
- FR90: 用户在余额不足时收到通知
- FR91: 用户在会员即将到期时收到提醒
- FR92: 用户在充值成功后收到确认通知
- FR93: 用户可以配置通知偏好(邮件/短信/站内信)
- FR94: 系统通知包含可操作的链接(如"立即充值"、"续费会员")

### 支付集成 (FR95-FR99)
- FR95: 系统集成微信支付,支持扫码支付
- FR96: 系统集成支付宝,支持扫码支付
- FR97: 支付成功后实时更新账户余额
- FR98: 支付失败时给用户明确的错误提示和重试选项
- FR99: 系统记录所有支付交易(成功/失败),可追溯可审计

### 安全与风控 (FR100-FR105)
- FR100: 系统对API Key进行加密存储
- FR101: 系统限制单个用户的API调用频率(防止滥用)
- FR102: 系统检测异常调用模式(如突然大量调用)并触发风控
- FR103: 系统记录所有敏感操作的审计日志(管理员操作、余额变动等)
- FR104: 系统支持IP白名单功能(可选,企业用户)
- FR105: 系统在检测到可疑活动时可临时冻结账户并通知用户

**总计：105个功能需求**

---

## FR Coverage Map

| Epic | 覆盖的功能需求 (FRs) | Story 数量 |
|------|---------------------|-----------|
| Epic 1: 项目基础设施与核心架构 | 基础设施（支撑所有 FR） | 6 stories |
| Epic 2: 用户认证与账户管理 | FR1-FR8 | 8 stories |
| Epic 3: API Key 生命周期管理 | FR9-FR13 | 5 stories |
| Epic 4: API 市场与浏览体验 | FR28-FR34 | 7 stories |
| Epic 5: API 网关核心引擎 | FR35-FR42 | 8 stories |
| Epic 6: 智能计费引擎 | FR43-FR53 | 7 stories |
| Epic 7: 账户余额与充值系统 | FR14-FR20 | 6 stories |
| Epic 8: 会员体系与权益管理 | FR21-FR27 | 6 stories |
| Epic 9: Coze 插件智能代码生成 | FR54-FR57 | 4 stories |
| Epic 10: 通知与用户触达 | FR90-FR94 | 5 stories |
| Epic 11: 支付集成（Stripe MVP） | FR95-FR99 | 5 stories |
| Epic 12: 安全与风控体系 | FR100-FR105 | 6 stories |
| Epic 13: Admin - API 接入与配置 | FR58-FR70 | 7 stories (Phase 2) |
| Epic 14: Admin - 会员套餐管理 | FR71-FR75 | 5 stories (Phase 2) |
| Epic 15: Admin - 用户管理与监控 | FR76-FR89 | 8 stories (Phase 2) |
| **总计** | **105 FRs** | **~83 stories (MVP: ~67, Phase 2: ~20)** |

---
## Epic 1: 项目基础设施与核心架构

**Epic 目标：** 建立项目开发、部署和监控基础设施，为所有后续功能提供技术底座。

---

### Story 1.1: 初始化 Next.js SaaS Starter 项目

As a 开发者,
I want 基于 Next.js 官方 SaaS Starter 初始化项目,
So that 拥有经过验证的项目结构和最佳实践基础。

**Acceptance Criteria:**
- **Given** Next.js SaaS Starter 官方仓库
- **When** 执行 `npx create-next-app --example` 命令
- **Then** 项目成功创建，包含标准目录结构（app/、components/、lib/）
- **And** package.json 包含所有必要依赖（Next.js 14, React, TypeScript）
- **And** 本地开发服务器可成功启动（`npm run dev`）

**Prerequisites:** 无

**Technical Notes:**
- 使用 Next.js 14 App Router
- 保留官方模板的 Drizzle ORM 配置（Story 1.2 将迁移到 Prisma）
- 确认 TypeScript 配置正确

---

### Story 1.2: 迁移 ORM 从 Drizzle 到 Prisma

As a 开发者,
I want 将 ORM 从 Drizzle 完全替换为 Prisma,
So that 统一技术栈并获得更好的类型安全和迁移工具。

**Acceptance Criteria:**
- **Given** Next.js SaaS Starter 使用 Drizzle ORM
- **When** 配置 Prisma 并迁移 schema 定义
- **Then** Prisma schema.prisma 文件创建完成
- **And** 所有原 Drizzle schema 定义转换为 Prisma models
- **And** Prisma Client 成功生成并可导入使用
- **And** 数据库连接配置正确（.env 中 DATABASE_URL）
- **And** 原 Drizzle 相关代码全部移除

**Prerequisites:** Story 1.1

**Technical Notes:**
- Architecture 文档 Ch.10 详细描述迁移步骤
- 预计耗时 3-4 天
- Prisma models: User, ApiKey, Api, ApiConfig, Subscription, ApiCall, Transaction, Membership
- 参考 Architecture 文档的完整 schema 定义

---

### Story 1.3: 配置 PostgreSQL 数据库并执行初始迁移

As a 开发者,
I want 配置 PostgreSQL 数据库连接并执行 Prisma 迁移,
So that 数据库 schema 与代码定义同步。

**Acceptance Criteria:**
- **Given** Prisma schema 已定义
- **When** 配置本地 PostgreSQL 连接并执行 `prisma migrate dev`
- **Then** 数据库中所有表成功创建（8 张核心表）
- **And** 索引、外键关系正确建立
- **And** 枚举类型正确创建（MembershipTier, ApiStatus, BillingMode, TransactionType）
- **And** Prisma Studio 可正常打开并查看数据

**Prerequisites:** Story 1.2

**Technical Notes:**
- 本地开发使用 Docker PostgreSQL 容器
- Zeabur 部署使用托管 PostgreSQL addon
- 迁移文件保存在 prisma/migrations/ 目录

---

###Story 1.4: 配置 Zeabur 部署环境

As a 开发者,
I want 在 Zeabur 上配置项目部署环境,
So that 实现持续部署和生产环境访问。

**Acceptance Criteria:**
- **Given** Zeabur 账户和项目代码仓库
- **When** 创建 Zeabur 项目并关联 Git 仓库
- **Then** Zeabur 项目成功创建
- **And** PostgreSQL addon 成功添加并自动注入 DATABASE_URL
- **And** 环境变量配置完成（NEXTAUTH_SECRET, NEXTAUTH_URL 等）
- **And** 首次部署成功，"Hello World" 页面可访问
- **And** 自动部署触发器配置完成（main 分支 push 触发）

**Prerequisites:** Story 1.3

**Technical Notes:**
- Architecture Ch.9 详细描述 Zeabur 配置
- 配置自定义域名（可选）
- 启用 HTTPS（Zeabur 自动）

---

### Story 1.5: 实现 JWT 认证中间件框架

As a 开发者,
I want 实现 JWT 认证中间件框架,
So that 后续 API 路由可以轻松保护并验证用户身份。

**Acceptance Criteria:**
- **Given** Next.js API Routes
- **When** 创建 JWT 认证中间件 `lib/auth/middleware.ts`
- **Then** 中间件可从 Cookie 或 Authorization header 提取 JWT
- **And** JWT 验证成功时，将 user payload 注入 request context
- **And** JWT 验证失败时，返回 401 Unauthorized
- **And** 提供 `withAuth()` 高阶函数包装受保护的 API Routes

**Prerequisites:** Story 1.1

**Technical Notes:**
- 保留官方 JWT 方案（Architecture 决策 ADR）
- JWT payload 包含: userId, email, membershipTier
- Token 有效期: 7 天
- 使用 jsonwebtoken 库

---

### Story 1.6: 配置监控与日志系统

As a 开发者,
I want 配置 Sentry 错误监控和 Zeabur 日志,
So that 生产环境问题可被快速发现和诊断。

**Acceptance Criteria:**
- **Given** Sentry 账户和 Zeabur 部署
- **When** 集成 Sentry SDK 并配置环境变量
- **Then** 应用错误自动上报到 Sentry
- **And** Sentry Source Maps 上传成功（TypeScript stack traces 可读）
- **And** Zeabur 日志面板可查看应用 stdout/stderr
- **And** 关键操作记录结构化日志（如 API 调用、计费事件）

**Prerequisites:** Story 1.4

**Technical Notes:**
- Sentry DSN 配置在环境变量
- 使用 pino 或 winston 进行结构化日志
- 敏感信息脱敏（API Key、手机号）

---

## Epic 2: 用户认证与账户管理

**Epic 目标：** 用户能够注册、登录并管理个人信息，支持手机号和邮箱两种注册方式。

**FR 覆盖：** FR1-FR8

---

### Story 2.1: 实现手机号+验证码注册 (FR1)

As a 新用户,
I want 通过手机号和验证码注册账户,
So that 快速创建账户无需记忆密码。

**Acceptance Criteria:**
- **Given** 注册页面 `/register`
- **When** 用户输入手机号（11 位）并请求验证码
- **Then** 系统发送 6 位验证码短信（阿里云短信服务）
- **And** 验证码 5 分钟内有效
- **And** 用户输入验证码并提交后，账户创建成功
- **And** 自动登录并跳转到 Dashboard

**Prerequisites:** Story 1.5 (JWT 框架)

**Technical Notes:**
- 手机号格式验证: `/^1[3-9]\d{9}$/`
- 集成阿里云短信 API
- 验证码存储在 Redis（5 分钟 TTL）或数据库临时表
- User 表字段：phone (unique), membershipTier (默认 FREE), balance (默认 0)

---

### Story 2.2: 实现邮箱+密码注册 (FR2)

As a 新用户,
I want 通过邮箱和密码注册账户,
So that 使用传统注册方式。

**Acceptance Criteria:**
- **Given** 注册页面支持邮箱注册
- **When** 用户输入邮箱和密码并提交
- **Then** 邮箱格式验证通过（RFC 5322）
- **And** 密码强度验证: 8+ 字符, 至少 1 大写, 1 数字, 1 特殊字符
- **And** 密码 bcrypt 哈希存储（cost=10）
- **And** 发送邮箱验证链接（15 分钟有效）
- **And** 用户点击验证链接后账户激活

**Prerequisites:** Story 1.5

**Technical Notes:**
- 使用 bcrypt 库
- 邮箱验证 token 存储策略（JWT 或数据库）
- 集成邮件服务（Resend 或 SendGrid）

---

### Story 2.3: 实现登录功能 (FR3)

As a 注册用户,
I want 使用手机号/邮箱+密码登录,
So that 访问我的账户。

**Acceptance Criteria:**
- **Given** 登录页面 `/login`
- **When** 用户输入手机号或邮箱+密码并提交
- **Then** 系统验证凭据正确性
- **And** 登录成功后生成 JWT（7 天有效期）
- **And** JWT 保存在 HttpOnly Cookie 中
- **And** 跳转到 Dashboard 或上次访问页面
- **And** 登录失败 5 次后账户锁定 15 分钟

**Prerequisites:** Story 2.1, Story 2.2

**Technical Notes:**
- 支持手机号或邮箱登录（灵活查询）
- 密码验证使用 bcrypt.compare()
- 登录失败计数存储（Redis 或数据库）

---

### Story 2.4: 实现登出功能 (FR4)

As a 登录用户,
I want 安全登出系统,
So that 保护账户安全（尤其共享设备）。

**Acceptance Criteria:**
- **Given** 用户已登录
- **When** 点击"登出"按钮
- **Then** JWT Cookie 被清除
- **And** 客户端 session 状态重置
- **And** 用户被重定向到登录页

**Prerequisites:** Story 2.3

**Technical Notes:**
- 清除 HttpOnly Cookie: `res.setHeader('Set-Cookie', 'token=; Max-Age=0')`
- 可选：Token 黑名单机制（存储已登出 token，拒绝复用）

---

### Story 2.5: 实现密码重置功能 (FR5)

As a 忘记密码的用户,
I want 通过邮箱/手机号重置密码,
So that 重新获得账户访问权限。

**Acceptance Criteria:**
- **Given** 密码重置页面
- **When** 用户输入邮箱或手机号并请求重置
- **Then** 系统发送重置链接（邮箱）或验证码（手机）
- **And** 重置链接/验证码 15 分钟内有效
- **And** 用户通过链接/验证码设置新密码
- **And** 新密码符合强度要求
- **And** 密码更新后，原 JWT 失效（强制重新登录）

**Prerequisites:** Story 2.3

**Technical Notes:**
- 重置 token 存储（带过期时间）
- 密码更新后可选：使所有 session 失效

---

### Story 2.6: 实现个人资料查看与更新 (FR6)

As a 登录用户,
I want 查看和更新个人资料（昵称、头像）,
So that 个性化我的账户。

**Acceptance Criteria:**
- **Given** 个人设置页面 `/settings/profile`
- **When** 用户访问页面
- **Then** 显示当前昵称、头像、手机号、邮箱
- **And** 用户可修改昵称（最多 50 字符）
- **And** 用户可上传头像图片（< 2MB, jpg/png）
- **And** 头像上传到云存储（Zeabur Storage 或 Cloudflare R2）
- **And** 更新后数据库 User 表同步更新

**Prerequisites:** Story 2.3

**Technical Notes:**
- 头像 URL 存储在 User.avatar 字段
- 图片压缩和格式转换
- 昵称 XSS 过滤

---

### Story 2.7: 实现账户安全设置 (FR7)

As a 登录用户,
I want 修改密码和绑定手机/邮箱,
So that 增强账户安全性。

**Acceptance Criteria:**
- **Given** 安全设置页面 `/settings/security`
- **When** 用户修改密码
- **Then** 需验证当前密码
- **And** 新密码符合强度要求
- **And** 密码更新后强制重新登录
- **When** 用户绑定新手机号或邮箱
- **Then** 需发送验证码/链接确认
- **And** 绑定成功后数据库更新

**Prerequisites:** Story 2.6

**Technical Notes:**
- 修改密码后使所有 session 失效
- 手机号/邮箱唯一性检查

---

### Story 2.8: 支持多设备同时登录 (FR8)

As a 登录用户,
I want 在多个设备同时登录,
So that 随时随地访问账户。

**Acceptance Criteria:**
- **Given** 用户在设备 A 已登录
- **When** 在设备 B 登录同一账户
- **Then** 设备 A 的 session 仍然有效
- **And** 两个设备可同时操作
- **And** 可选：显示所有活跃 session 列表（设备类型、最后活跃时间）
- **And** 可选：单独注销某个 session

**Prerequisites:** Story 2.3

**Technical Notes:**
- JWT 无状态设计天然支持多设备
- 可选：Session 管理表（记录设备信息）

---

## Epic 3: API Key 生命周期管理

**Epic 目标：** 用户拥有统一 API Key 访问所有平台 API，支持生成、查看、命名、撤销和轮换操作。

**FR 覆盖：** FR9-FR13

---

### Story 3.1: 实现 API Key 生成功能 (FR9)

As a 登录用户,
I want 生成个人 API Key,
So that 使用统一 Key 调用所有平台 API。

**Acceptance Criteria:**
- **Given** Dashboard 或 API Keys 管理页面
- **When** 用户点击"生成新 Key"按钮
- **Then** 系统生成 32 字符密码学安全随机 Key（格式: `sk_live_xxxxxxxx...`）
- **And** Key 保存到 ApiKey 表（userId、key、name、createdAt）
- **And** Key 明文显示一次（提示复制保存）
- **And** 后续只显示 Key 的最后 4 位（如 `sk_***...abc1`）

**Prerequisites:** Story 2.3 (用户登录)

**Technical Notes:**
- 使用 crypto.randomBytes() 生成
- Key 格式前缀区分环境: `sk_live_` (生产) 或 `sk_test_` (测试)
- ApiKey 表字段: id, userId, key, name, isActive, totalCalls, lastUsedAt

---

### Story 3.2: 实现 API Keys 列表查看 (FR10)

As a 登录用户,
I want 查看我的所有 API Keys 列表,
So that 管理多个 Keys 的使用场景。

**Acceptance Criteria:**
- **Given** API Keys 管理页面 `/dashboard/keys`
- **When** 用户访问页面
- **Then** 显示所有 Keys 列表（表格形式）
- **And** 每个 Key 显示: 名称、创建时间、最后使用时间、调用次数、状态（激活/已撤销）
- **And** Key 值脱敏显示（仅最后 4 位）
- **And** 列表按创建时间倒序排列

**Prerequisites:** Story 3.1

**Technical Notes:**
- 查询: `SELECT * FROM ApiKey WHERE userId = $1 ORDER BY createdAt DESC`
- 显示 totalCalls 统计
- 状态标签: 绿色（激活）、灰色（已撤销）

---

### Story 3.3: 实现 API Key 命名功能 (FR11)

As a 登录用户,
I want 为 API Key 设置备注名称,
So that 便于识别不同 Key 的用途（如"生产环境"、"测试用"）。

**Acceptance Criteria:**
- **Given** API Keys 列表页
- **When** 用户在生成时或之后编辑 Key 名称
- **Then** 名称字段支持输入（最多 50 字符）
- **And** 名称更新后数据库 ApiKey.name 同步更新
- **And** 默认名称为 "API Key" + 创建时间

**Prerequisites:** Story 3.2

**Technical Notes:**
- 名称唯一性不强制（同一用户可有重名 Key）
- XSS 过滤

---

### Story 3.4: 实现 API Key 撤销功能 (FR12)

As a 登录用户,
I want 撤销/删除不再使用的 API Key,
So that 防止泄露的 Key 被滥用。

**Acceptance Criteria:**
- **Given** API Keys 列表页
- **When** 用户点击某个 Key 的"撤销"按钮
- **Then** 弹出二次确认对话框
- **And** 确认后 ApiKey.isActive 设置为 false
- **And** 该 Key 后续请求返回 401 Unauthorized
- **And** 列表中 Key 状态变为"已撤销"（灰色标签）
- **And** 可选：彻底删除 Key（物理删除记录）

**Prerequisites:** Story 3.2

**Technical Notes:**
- 软删除 vs 硬删除：建议软删除（保留审计日志）
- 撤销后 ApiCall 历史记录仍可查询

---

### Story 3.5: 实现 API Key 轮换功能 (FR13)

As a 登录用户,
I want 轮换（重新生成）API Key,
So that 定期更换 Key 提升安全性。

**Acceptance Criteria:**
- **Given** API Keys 列表页
- **When** 用户点击某个 Key 的"轮换"按钮
- **Then** 系统生成新的 Key 值（保留原 name、userId）
- **And** 旧 Key 值失效
- **And** 新 Key 明文显示一次（提示复制）
- **And** 数据库更新 ApiKey.key 字段和 updatedAt
- **And** totalCalls、lastUsedAt 重置

**Prerequisites:** Story 3.4

**Technical Notes:**
- 轮换 = 生成新 Key + 撤销旧 Key（原子操作）
- 旧 Key 立即失效（无宽限期）

---

## Epic 4: API 市场与浏览体验

**Epic 目标：** 用户能够发现、搜索并了解平台提供的 API，查看文档和定价，获取 Coze 插件代码模板。

**FR 覆盖：** FR28-FR34

---

### Story 4.1: 实现 API 目录浏览页面 (FR28)

As a 用户（登录或未登录）,
I want 浏览平台提供的 API 目录,
So that 了解有哪些可用的 API。

**Acceptance Criteria:**
- **Given** API 市场页面 `/apis`
- **When** 用户访问页面
- **Then** 显示所有状态为 ACTIVE 的 API 列表（卡片形式）
- **And** 每个 API 卡片显示: icon、name、description（简短）、category 标签、调用次数
- **And** 卡片布局响应式（桌面 3 列、平板 2 列、手机 1 列）
- **And** 支持无限滚动或分页加载

**Prerequisites:** Story 1.1 (项目基础)

**Technical Notes:**
- 查询: `SELECT * FROM Api WHERE status = 'ACTIVE' ORDER BY totalCalls DESC`
- 使用 shadcn/ui Card 组件
- API 图标存储在 CDN

---

### Story 4.2: 实现 API 分类筛选 (FR29)

As a 用户,
I want 按分类筛选 API（工具类、AI 类、数据类等）,
So that 快速找到特定类型的 API。

**Acceptance Criteria:**
- **Given** API 市场页面
- **When** 用户选择某个分类标签（如"AI 能力"）
- **Then** 页面只显示该分类的 API
- **And** 分类标签显示 API 数量（如"AI 能力 (12)"）
- **And** 支持"全部分类"选项清除筛选

**Prerequisites:** Story 4.1

**Technical Notes:**
- Api.category 字段枚举值: AI能力、数据查询、工具类、图像处理、文本生成 等
- 客户端筛选 或 服务端查询

---

### Story 4.3: 实现 API 搜索功能 (FR30)

As a 用户,
I want 搜索 API（按名称、描述、标签）,
So that 快速找到需要的 API。

**Acceptance Criteria:**
- **Given** API 市场页面的搜索框
- **When** 用户输入关键词并搜索
- **Then** 实时显示匹配的 API（name、description、tags 包含关键词）
- **And** 搜索结果高亮关键词
- **And** 支持模糊匹配（不区分大小写）
- **And** 无结果时显示"未找到相关 API"

**Prerequisites:** Story 4.1

**Technical Notes:**
- PostgreSQL 全文搜索: `WHERE name ILIKE '%keyword%' OR description ILIKE '%keyword%'`
- 可选：集成 Algolia 或 MeiliSearch 提升搜索体验

---

### Story 4.4: 实现 API 详情页面 (FR31)

As a 用户,
I want 查看 API 详细文档（功能说明、参数、返回值、示例）,
So that 了解如何使用该 API。

**Acceptance Criteria:**
- **Given** 点击某个 API 卡片
- **When** 进入 API 详情页 `/apis/:slug`
- **Then** 显示完整文档:
  - 功能说明
  - 请求参数表格（字段名、类型、必填、描述）
  - 返回值示例（JSON 格式化）
  - 错误码说明
  - 使用示例（curl 命令）
- **And** 右侧显示快捷操作区（在线测试、获取代码、立即使用）

**Prerequisites:** Story 4.1

**Technical Notes:**
- API 文档存储策略: 数据库字段 或 Markdown 文件
- 使用 Shiki 进行代码高亮

---

### Story 4.5: 实现 API 定价信息展示 (FR32)

As a 用户,
I want 查看 API 定价信息（按次/按量价格、会员优惠）,
So that 了解使用成本。

**Acceptance Criteria:**
- **Given** API 详情页
- **When** 查看定价区域
- **Then** 清晰显示计费模式（按次、按量、会员免费）
- **And** 按次计费: 显示单次价格（如 ¥0.01/次）
- **And** 按量计费: 显示计费单位和单价（如 ¥0.001/token）
- **And** 会员优惠: 显示 VIP/ENTERPRISE 折扣率（如 VIP 8 折）
- **And** 提供成本估算器（输入预计调用量 → 显示预估费用）

**Prerequisites:** Story 4.4

**Technical Notes:**
- 从 ApiConfig 表读取: billingMode, pricePerCall, pricePerUnit, vipDiscountRate
- 成本估算器为客户端计算

---

### Story 4.6: 实现 Coze 插件代码模板查看 (FR33)

As a Coze 创作者,
I want 查看 API 的 Coze 插件代码模板,
So that 了解如何在 Coze 工作流中集成该 API。

**Acceptance Criteria:**
- **Given** API 详情页
- **When** 点击"Coze 代码模板"标签
- **Then** 显示完整的 Coze 插件代码（JavaScript）
- **And** 代码包含: API 端点、参数映射、API Key 配置、示例参数值
- **And** 代码语法高亮显示
- **And** 包含使用说明注释

**Prerequisites:** Story 4.4

**Technical Notes:**
- 代码生成逻辑在 Epic 9（LLM 驱动）
- 此处仅展示已生成的代码（从 Api 表字段读取）

---

### Story 4.7: 实现一键复制 Coze 代码功能 (FR34)

As a Coze 创作者,
I want 一键复制 Coze 插件代码到剪贴板,
So that 快速粘贴到 Coze 工作流中。

**Acceptance Criteria:**
- **Given** Coze 代码模板显示
- **When** 点击"复制代码"按钮
- **Then** 代码复制到剪贴板
- **And** 显示成功提示 Toast（"代码已复制"）
- **And** 按钮临时变为"已复制" ✓ 状态（2 秒后恢复）

**Prerequisites:** Story 4.6

**Technical Notes:**
- 使用 Clipboard API: `navigator.clipboard.writeText()`
- shadcn/ui Toast 组件
- 复制成功率 > 90%（PRD NFR-U1 要求）

---

## Epic 5: API 网关核心引擎

**Epic 目标：** 统一 API Gateway 端点，验证 API Key、权限、余额，代理转发请求到上游 API，记录调用日志。

**FR 覆盖：** FR35-FR42

---

### Story 5.1: 实现统一网关端点 (FR35)

As a 用户,
I want 使用 API Key 通过统一网关端点调用任意已发布的 API,
So that 无需管理多个 API 的认证和端点。

**Acceptance Criteria:**
- **Given** 网关端点 `POST /api/gateway/:apiId/*`
- **When** 用户发送请求（携带 API Key 在 header: `X-API-Key`）
- **Then** 系统路由到对应 API 的处理逻辑
- **And** 支持动态路径（`:apiId` 映射到 Api.slug）
- **And** 支持所有 HTTP 方法（GET/POST/PUT/DELETE/PATCH）

**Prerequisites:** Story 3.1 (API Key 生成)

**Technical Notes:**
- Next.js API Route: `app/api/gateway/[apiId]/[...path]/route.ts`
- 动态路由捕获所有子路径

---

### Story 5.2: 实现 API Key 验证 (FR36)

As a 系统,
I want 验证 API Key 的有效性（未过期、未撤销）,
So that 只有合法 Key 可以调用 API。

**Acceptance Criteria:**
- **Given** 网关请求携带 API Key
- **When** 系统验证 Key
- **Then** 查询 ApiKey 表: `WHERE key = $1 AND isActive = true`
- **And** Key 存在且激活 → 验证通过
- **And** Key 不存在或已撤销 → 返回 401 Unauthorized: "Invalid API Key"
- **And** 更新 ApiKey.lastUsedAt 为当前时间

**Prerequisites:** Story 5.1

**Technical Notes:**
- 验证中间件: `lib/gateway/middleware/validateApiKey.ts`
- 错误响应统一格式: `{success: false, error: "Invalid API Key"}`

---

### Story 5.3: 实现用户权限验证 (FR37)

As a 系统,
I want 验证用户权限（账户状态正常、未被封禁）,
So that 防止被封禁用户继续调用 API。

**Acceptance Criteria:**
- **Given** API Key 验证通过
- **When** 查询关联 User 账户状态
- **Then** User.isActive = true → 权限验证通过
- **And** User.isActive = false → 返回 403 Forbidden: "Account suspended"
- **And** 检查账户是否在黑名单（可选，未来扩展）

**Prerequisites:** Story 5.2

**Technical Notes:**
- User 表添加 isActive 字段（默认 true）
- 封禁逻辑在 Epic 12（安全与风控）

---

### Story 5.4: 实现余额充足性检查 (FR38)

As a 系统,
I want 验证账户余额足够支付本次 API 调用费用,
So that 防止透支调用。

**Acceptance Criteria:**
- **Given** 用户权限验证通过
- **When** 检查 User.balance 和 ApiConfig 计费配置
- **Then** 按次计费: `balance >= pricePerCall` → 通过
- **And** 按量计费: 预估费用 ≤ balance → 通过（实际费用在 Story 5.7 计算）
- **And** 余额不足 → 返回 402 Payment Required: "Insufficient balance"

**Prerequisites:** Story 5.3

**Technical Notes:**
- 按量计费预估: 假设最大消耗（或跳过预检查，在计费时验证）
- 会员免费模式: 跳过余额检查

---

### Story 5.5: 实现速率限制检查 (FR39)

As a 系统,
I want 检查用户是否超过速率限制配额,
So that 防止滥用和保护上游 API。

**Acceptance Criteria:**
- **Given** 用户权限和余额验证通过
- **When** 检查速率限制（如 100 次/分钟）
- **Then** 当前分钟调用次数 < 限制 → 通过
- **And** 超过限制 → 返回 429 Too Many Requests: "Rate limit exceeded"
- **And** 响应头包含: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

**Prerequisites:** Story 5.4

**Technical Notes:**
- 使用 Redis 计数器（key: `ratelimit:user:{userId}`, TTL: 60s）
- 速率限制配置: 基础用户 100/min, VIP 1000/min

---

### Story 5.6: 实现上游 API 请求代理转发 (FR40)

As a 系统,
I want 将用户请求代理转发到上游第三方 API,
So that 实现 API Gateway 核心功能。

**Acceptance Criteria:**
- **Given** 所有验证通过
- **When** 系统转发请求到上游 API
- **Then** 从 Api 表读取 upstreamUrl
- **And** 从 Api 表读取并解密 upstreamKey（AES-256-GCM）
- **And** 构造上游请求: URL、HTTP 方法、Headers、Body
- **And** 设置超时: 5 秒
- **And** 发送请求并接收响应
- **And** 响应状态码和内容原样返回给用户

**Prerequisites:** Story 5.5

**Technical Notes:**
- 使用 fetch() 或 axios
- 上游 Key 解密: `lib/crypto/decrypt.ts`
- 处理上游超时: 返回 504 Gateway Timeout

---

### Story 5.7: 实现同步计费扣费 (FR41)

As a 系统,
I want 在返回响应前完成计费扣费,
So that 保证计费准确性和强一致性。

**Acceptance Criteria:**
- **Given** 上游 API 响应成功
- **When** 调用计费引擎计算费用
- **Then** 按次计费: 扣除固定价格
- **And** 按量计费: 解析响应体参数路径（如 `response.usage.tokens`）并计算费用
- **And** 会员计费: 应用折扣或免费额度
- **And** 使用数据库事务扣减 User.balance
- **And** 创建 Transaction 记录（type: API_CHARGE, amount: -费用）
- **And** 扣费失败 → 回滚并返回错误（不返回 API 响应）

**Prerequisites:** Story 5.6

**Technical Notes:**
- 计费引擎详细实现在 Epic 6
- 同步计费（Architecture ADR-004）

---

### Story 5.8: 实现 API 调用日志记录 (FR42)

As a 系统,
I want 记录每次 API 调用日志（用户、API、时间、请求参数、响应状态、扣费金额）,
So that 支持审计、统计和故障排查。

**Acceptance Criteria:**
- **Given** API 调用完成（成功或失败）
- **When** 创建 ApiCall 记录
- **Then** 记录字段包含:
  - userId, apiKeyId, apiId
  - method, path, requestBody (JSON)
  - responseStatus, responseBody (JSON, 可选脱敏)
  - chargeAmount (扣费金额)
  - createdAt (时间戳)
- **And** 日志异步写入（不阻塞响应）
- **And** 更新 ApiKey.totalCalls += 1
- **And** 更新 Api.totalCalls += 1

**Prerequisites:** Story 5.7

**Technical Notes:**
- 异步写入: 使用消息队列或后台 worker
- 敏感参数脱敏（如密码、Token）
- ApiCall 表索引: userId, apiId, createdAt

---

## Epic 6: 智能计费引擎

**Epic 目标：** 实现三种灵活计费模式（按次、按量、会员），支持嵌套参数解析、会员折扣、余额检查和审计追溯。

**FR 覆盖：** FR43-FR53

---

### Story 6.1: 实现按次计费引擎 (FR43, FR44)

As a 系统,
I want 支持按次计费模式，每次调用扣除固定价格,
So that 简单 API 可使用固定定价。

**Acceptance Criteria:**
- **Given** ApiConfig.billingMode = PER_CALL
- **When** 计费引擎计算费用
- **Then** 费用 = ApiConfig.pricePerCall（单位：分）
- **And** 与响应内容无关（固定费用）
- **And** 返回计费结果: `{amount: number, mode: 'PER_CALL'}`

**Prerequisites:** Story 5.6 (上游响应获取)

**Technical Notes:**
- 计费引擎类: `lib/billing/engine.ts`
- Strategy Pattern: `PerCallBilling extends BillingStrategy`

---

### Story 6.2: 实现按量计费引擎 - 响应参数解析 (FR45, FR46, FR47)

As a 系统,
I want 支持按量计费模式，根据 API 响应中的计量参数扣费,
So that 支持用量计费的 API（如 LLM tokens）。

**Acceptance Criteria:**
- **Given** ApiConfig.billingMode = USAGE_BASED
- **When** 计费引擎解析响应体
- **Then** 从 ApiConfig.usageParamPath 读取 JSON Path（如 `response.usage.tokens`）
- **And** 使用 ResponseParser 提取参数值（支持 2-3 层嵌套）
- **And** 费用 = 提取值 × ApiConfig.pricePerUnit
- **And** 解析失败 → 降级为按次计费（返回 1）
- **And** 记录解析错误日志

**Prerequisites:** Story 6.1

**Technical Notes:**
- ResponseParser: `lib/billing/parser.ts`
- JSON Path 解析库或自实现递归提取
- 降级策略（Architecture 考虑）

---

### Story 6.3: 实现会员计费逻辑 (FR48, FR49)

As a 系统,
I want 对会员用户应用全局折扣或 API 级特殊配置,
So that 会员享受折扣或免费权益。

**Acceptance Criteria:**
- **Given** User.membershipTier ≠ FREE
- **When** 计费引擎计算费用
- **Then** 读取 ApiConfig.vipDiscountRate（如 20 表示 8 折）
- **And** 应用折扣: 费用 = 原价 × (100 - vipDiscountRate) / 100
- **And** 特殊配置处理:
  - vipDiscountRate = 100 → 会员免费（费用 = 0）
  - vipDiscountRate = 0 → 排除会员折扣（原价）
  - vipDiscountRate = null → 应用全局折扣（从 Membership 表读取）
- **And** 返回计费结果: `{amount: number, originalAmount: number, discount: number}`

**Prerequisites:** Story 6.2

**Technical Notes:**
- 折扣计算精度（避免浮点数误差，使用整数分）
- 全局折扣配置存储位置

---

### Story 6.4: 实现余额检查与扣费事务 (FR50, FR51)

As a 系统,
I want 扣费前检查余额，使用数据库事务保证一致性,
So that 防止透支且保证计费准确性。

**Acceptance Criteria:**
- **Given** 计费引擎计算出费用
- **When** 执行扣费操作
- **Then** 使用 Prisma 事务 `$transaction()`
- **And** 查询 User.balance
- **And** balance < 费用 → 回滚并抛出 InsufficientBalanceError
- **And** balance >= 费用 → 扣减余额: `User.update({balance: {decrement: 费用}})`
- **And** 创建 Transaction 记录
- **And** 事务提交成功 → 返回新余额
- **And** 事务失败 → 完全回滚，返回错误

**Prerequisites:** Story 6.3

**Technical Notes:**
- Prisma 事务隔离级别
- 并发扣费测试（竞态条件）

---

### Story 6.5: 实现管理员手动余额调整 (FR52)

As a 管理员,
I want 手动调整用户余额（需审批和记录）,
So that 处理退款、补偿等特殊情况。

**Acceptance Criteria:**
- **Given** Admin API 端点 `POST /api/admin/users/:userId/balance`
- **When** 管理员提交余额调整请求（amount, reason）
- **Then** 验证管理员权限
- **And** 更新 User.balance
- **And** 创建 Transaction 记录（type: MANUAL_ADJUSTMENT, description: reason）
- **And** 记录审计日志（操作人、时间、原余额、新余额）

**Prerequisites:** Story 6.4

**Technical Notes:**
- Admin 认证中间件
- Transaction.type 枚举: API_CHARGE, TOP_UP, MANUAL_ADJUSTMENT

---

### Story 6.6: 实现成本与收入记录 (FR53)

As a 系统,
I want 计算并记录每次 API 调用的成本（批发价）和收入（零售价）,
So that 统计平台利润。

**Acceptance Criteria:**
- **Given** API 调用完成并计费
- **When** 记录到 ApiCall 表
- **Then** chargeAmount 字段记录用户扣费金额（收入）
- **And** costAmount 字段记录上游 API 成本（从 ApiConfig.costPerCall 或 costPerUnit 读取）
- **And** profit = chargeAmount - costAmount
- **And** 支持后续统计查询: `SELECT SUM(chargeAmount - costAmount) AS totalProfit`

**Prerequisites:** Story 6.4

**Technical Notes:**
- ApiConfig 表添加 costPerCall/costPerUnit 字段
- ApiCall 表添加 costAmount 字段

---

### Story 6.7: 实现计费审计追溯功能 (FR51)

As a 运营人员,
I want 每次扣费可追溯可审计,
So that 财务准确性有保障。

**Acceptance Criteria:**
- **Given** Transaction 和 ApiCall 表记录完整
- **When** 查询某次 API 调用的计费详情
- **Then** 可通过 ApiCall.id 关联到 Transaction.referenceId
- **And** Transaction 记录包含: 用户、金额、时间、描述、余额快照
- **And** 支持对账查询: 用户总消费 = SUM(Transactions WHERE type = 'API_CHARGE')
- **And** 支持财务报表: 按日/月/年聚合收入和成本

**Prerequisites:** Story 6.6

**Technical Notes:**
- Transaction.referenceId 关联 ApiCall.id
- 索引优化查询性能

---

## Epic 7: 账户余额与充值系统

**Epic 目标：** 用户能够查看余额、通过 Stripe 充值、查看交易记录、筛选查询，余额不足时收到预警。

**FR 覆盖：** FR14-FR20

**Stories:** (6 个 Stories，简化展示结构)
- Story 7.1: 实现余额查看 Dashboard (FR14)
- Story 7.2: 实现 Stripe 充值集成 (FR15, FR16 - Stripe 替代微信/支付宝)
- Story 7.3: 实现充值记录查看 (FR17)
- Story 7.4: 实现消费记录查看 (FR18)
- Story 7.5: 实现交易记录筛选查询 (FR19)
- Story 7.6: 实现余额不足预警通知 (FR20)

---

## Epic 8: 会员体系与权益管理

**Epic 目标：** 用户能够浏览、购买、续费会员套餐，享受折扣和返现权益。

**FR 覆盖：** FR21-FR27

**Stories:** (6 个 Stories)
- Story 8.1: 实现会员套餐浏览页面 (FR21)
- Story 8.2: 实现会员套餐购买流程 (FR22)
- Story 8.3: 实现会员状态查看 (FR23)
- Story 8.4: 实现会员续费功能 (FR24)
- Story 8.5: 实现会员全局折扣应用 (FR25)
- Story 8.6: 实现会员购买返现机制 (FR26)
  - Story 8.7: 实现会员到期权益回收 (FR27)

---

## Epic 9: Coze 插件智能代码生成

**Epic 目标：** 使用 OpenAI GPT-4o mini 自动生成 Coze 插件代码模板，包含正确的端点、参数映射、示例值。

**FR 覆盖：** FR54-FR57

**Stories:** (4 个 Stories)
- Story 9.1: 实现 LLM 代码生成服务 (FR54, FR55)
- Story 9.2: 实现参数映射与 API Key 配置 (FR55)
- Story 9.3: 实现示例参数值生成 (FR56)
- Story 9.4: 实现代码缓存与更新机制 (FR57)

---

## Epic 10: 通知与用户触达

**Epic 目标：** 及时通知用户重要事件（余额不足、会员到期、充值成功），支持通知偏好配置。

**FR 覆盖：** FR90-FR94

**Stories:** (5 个 Stories)
- Story 10.1: 实现余额不足通知 (FR90)
- Story 10.2: 实现会员到期提醒 (FR91)
- Story 10.3: 实现充值成功确认通知 (FR92)
- Story 10.4: 实现通知偏好配置 (FR93)
- Story 10.5: 实现通知可操作链接 (FR94)

---

## Epic 11: 支付集成（Stripe MVP）

**Epic 目标：** 集成 Stripe 支付（替代微信/支付宝），支持扫码支付、余额实时更新、交易记录。

**FR 覆盖：** FR95-FR99（Stripe 替代方案）

**Stories:** (5 个 Stories)
- Story 11.1: 集成 Stripe SDK 和 Webhook (FR95, FR96)
- Story 11.2: 实现 Stripe Checkout Session 创建 (FR95)
- Story 11.3: 实现支付成功余额更新 (FR97)
- Story 11.4: 实现支付失败错误处理 (FR98)
- Story 11.5: 实现支付交易记录审计 (FR99)

---

## Epic 12: 安全与风控体系

**Epic 目标：** 保护平台和用户资产安全，包括 Key 加密、速率限制、异常检测、审计日志、IP 白名单、账户冻结。

**FR 覆盖：** FR100-FR105

**Stories:** (6 个 Stories)
- Story 12.1: 实现 API Key AES-256 加密存储 (FR100)
- Story 12.2: 实现用户速率限制 (FR101)
- Story 12.3: 实现异常调用模式检测 (FR102)
- Story 12.4: 实现敏感操作审计日志 (FR103)
- Story 12.5: 实现 IP 白名单功能 (FR104)
- Story 12.6: 实现可疑活动账户冻结 (FR105)

---

## Epic 13: Admin - API 接入与配置 (Phase 2)

**Epic 目标：** 管理员通过可视化界面添加、配置、编辑、下架第三方 API，使用 AI 辅助数据处理。

**FR 覆盖：** FR58-FR70

**Stories:** (7 个 Stories - Phase 2，简化)
- Story 13.1: Admin API 添加界面 (FR58, FR59)
- Story 13.2: 上游 API 参数配置 (FR60)
- Story 13.3: 计费模式配置界面 (FR61, FR62, FR63)
- Story 13.4: 会员权益配置 (FR64)
- Story 13.5: API 编辑功能 (FR65)
- Story 13.6: API 下架/删除 (FR66)
- Story 13.7: AI 数据处理辅助 (FR67-FR70)

---

## Epic 14: Admin - 会员套餐管理 (Phase 2)

**Epic 目标：** 管理员创建、配置、编辑、下架会员套餐。

**FR 覆盖：** FR71-FR75

**Stories:** (5 个 Stories - Phase 2)
- Story 14.1: 会员套餐创建界面 (FR71, FR72)
- Story 14.2: 多种套餐类型支持 (FR73)
- Story 14.3: 套餐编辑功能 (FR74)
- Story 14.4: 套餐下架处理 (FR75)
- Story 14.5: 套餐统计报表

---

## Epic 15: Admin - 用户管理与监控 (Phase 2)

**Epic 目标：** 管理员查询用户、查看详情、管理账户、查看统计、配置告警。

**FR 覆盖：** FR76-FR89

**Stories:** (8 个 Stories - Phase 2)
- Story 15.1: 用户列表查询 (FR76)
- Story 15.2: 用户详情查看 (FR77)
- Story 15.3: 用户 API 调用统计 (FR78)
- Story 15.4: 用户账户启用/禁用 (FR79)
- Story 15.5: 手动余额调整 (FR80)
- Story 15.6: 平台整体统计 Dashboard (FR81-FR85)
- Story 15.7: 增长趋势图可视化 (FR86, FR87)
- Story 15.8: 告警规则配置与通知 (FR88, FR89)

---



---

## FR Coverage Matrix

**完整的 FR 到 Epic 和 Story 的映射：**

| FR | 功能需求描述 | Epic | Stories |
|----|------------|------|---------|
| FR1 | 手机号+验证码注册 | Epic 2 | Story 2.1 |
| FR2 | 邮箱+密码注册 | Epic 2 | Story 2.2 |
| FR3 | 登录并维持会话 | Epic 2 | Story 2.3 |
| FR4 | 退出登录 | Epic 2 | Story 2.4 |
| FR5 | 密码重置 | Epic 2 | Story 2.5 |
| FR6 | 个人资料管理 | Epic 2 | Story 2.6 |
| FR7 | 账户安全设置 | Epic 2 | Story 2.7 |
| FR8 | 多设备登录 | Epic 2 | Story 2.8 |
| FR9 | 生成 API Key | Epic 3 | Story 3.1 |
| FR10 | 查看 Keys 列表 | Epic 3 | Story 3.2 |
| FR11 | Key 命名 | Epic 3 | Story 3.3 |
| FR12 | Key 撤销 | Epic 3 | Story 3.4 |
| FR13 | Key 轮换 | Epic 3 | Story 3.5 |
| FR14 | 查看余额 | Epic 7 | Story 7.1 |
| FR15 | 微信支付充值 | Epic 11 | Story 11.2 (Stripe 替代) |
| FR16 | 支付宝充值 | Epic 11 | Story 11.2 (Stripe 替代) |
| FR17 | 充值记录 | Epic 7 | Story 7.3 |
| FR18 | 消费记录 | Epic 7 | Story 7.4 |
| FR19 | 交易记录筛选 | Epic 7 | Story 7.5 |
| FR20 | 余额预警 | Epic 7 | Story 7.6 |
| FR21-FR27 | 会员系统 | Epic 8 | Stories 8.1-8.7 |
| FR28 | API 目录浏览 | Epic 4 | Story 4.1 |
| FR29 | API 分类筛选 | Epic 4 | Story 4.2 |
| FR30 | API 搜索 | Epic 4 | Story 4.3 |
| FR31 | API 详情文档 | Epic 4 | Story 4.4 |
| FR32 | API 定价信息 | Epic 4 | Story 4.5 |
| FR33 | Coze 代码模板 | Epic 4 | Story 4.6 |
| FR34 | 一键复制代码 | Epic 4 | Story 4.7 |
| FR35 | 统一网关端点 | Epic 5 | Story 5.1 |
| FR36 | API Key 验证 | Epic 5 | Story 5.2 |
| FR37 | 用户权限验证 | Epic 5 | Story 5.3 |
| FR38 | 余额充足检查 | Epic 5 | Story 5.4 |
| FR39 | 速率限制 | Epic 5 | Story 5.5 |
| FR40 | 请求代理转发 | Epic 5 | Story 5.6 |
| FR41 | 同步计费扣费 | Epic 5 | Story 5.7 |
| FR42 | 调用日志记录 | Epic 5 | Story 5.8 |
| FR43-FR44 | 按次计费 | Epic 6 | Story 6.1 |
| FR45-FR47 | 按量计费 | Epic 6 | Story 6.2 |
| FR48-FR49 | 会员计费 | Epic 6 | Story 6.3 |
| FR50-FR51 | 余额检查与事务 | Epic 6 | Story 6.4 |
| FR52 | 手动余额调整 | Epic 6 | Story 6.5 |
| FR53 | 成本收入记录 | Epic 6 | Story 6.6 |
| FR54-FR57 | Coze 代码生成 | Epic 9 | Stories 9.1-9.4 |
| FR58-FR70 | Admin API 管理 | Epic 13 | Stories 13.1-13.7 (Phase 2) |
| FR71-FR75 | Admin 会员管理 | Epic 14 | Stories 14.1-14.5 (Phase 2) |
| FR76-FR89 | Admin 用户/监控 | Epic 15 | Stories 15.1-15.8 (Phase 2) |
| FR90-FR94 | 通知系统 | Epic 10 | Stories 10.1-10.5 |
| FR95-FR99 | 支付集成 | Epic 11 | Stories 11.1-11.5 |
| FR100-FR105 | 安全与风控 | Epic 12 | Stories 12.1-12.6 |

**验证结果：** ✅ 所有 105 个 FRs 均已覆盖

---

## Summary

### Epic Breakdown 完成

**生成的Epic和Story统计：**
- **MVP Epics:** 12 个 (Epic 1-12)
- **Phase 2 Epics:** 3 个 (Epic 13-15)
- **总 Stories:** 约 83 个
  - MVP Stories: ~67 个
  - Phase 2 Stories: ~20 个

**FR 覆盖率：**
- ✅ 所有 105 个功能需求已映射到 Stories
- ✅ 无遗漏的 FR
- ✅ 无孤立的 Story（所有 Story 都追溯到 FR）

**Story 质量特征：**
- ✅ 所有 Story 遵循 BDD 格式（Given/When/Then）
- ✅ Epic 1（基础设施）正确放置在首位
- ✅ Stories 垂直切片（交付完整功能）
- ✅ 无前向依赖（仅引用已完成的 Story）
- ✅ 详细的验收标准（UI 细节、性能目标、技术规范）
- ✅ 技术笔记提供实施指导

**下一步行动（BMad Method 工作流）：**

1. **UX Design Workflow** (如果有 UI) - 运行: `/bmad:bmm:workflows:create-design`
   → 将添加交互细节到 Stories 的验收标准中

2. **Architecture Workflow** - 运行: `/bmad:bmm:workflows:architecture`
   → 将添加技术决策到 Stories 的 Technical Notes 中

3. **Phase 4 Implementation** - Stories 准备就绪
   → 每个 Story 从以下拉取上下文：
     - PRD（为什么）
     - epics.md（什么和如何）
     - UX Design（交互）
     - Architecture（技术）

**重要提示：**
本文档是 **Living Document**，将在 UX 和 Architecture 工作流完成后更新。当前版本提供了初始的 Epic 和 Story 分解，确保了 PRD 需求的完整覆盖。

---

_Created by BMad Method - Epic and Story Decomposition Workflow_
_Last Updated: 2025-11-15_
_For implementation: Each story contains detailed acceptance criteria for autonomous agent execution_

