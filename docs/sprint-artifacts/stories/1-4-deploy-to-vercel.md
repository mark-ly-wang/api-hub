# Story 1.4: 配置 Vercel + Supabase 部署环境

Status: ready-for-dev

## Story

As a 开发者,
I want 在 Vercel 上部署 Next.js 应用并使用 Supabase PostgreSQL,
So that 实现零配置部署、全球 CDN 加速和免费数据库托管。

## Acceptance Criteria

1. **Given** GitHub 仓库和 Vercel/Supabase 账户
2. **When** 创建 Supabase 项目并获取数据库连接字符串
3. **Then** Supabase 项目成功创建，DATABASE_URL 和 DIRECT_URL 可用
4. **And** 创建 Vercel 项目并关联 Git 仓库
5. **Then** Vercel 项目成功创建，自动检测为 Next.js 应用
6. **And** 配置所有必要环境变量（DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, NEXTAUTH_URL 等）
7. **And** 首次部署成功，Prisma 迁移自动执行
8. **And** 应用可通过 HTTPS 访问，8 张数据库表创建成功
9. **And** 自动部署触发器工作正常（main 分支 push 触发）

## Tasks / Subtasks

### Phase 1: Supabase 数据库设置 (AC: 2, 3)

- [ ] 创建 Supabase 账户并登录
  - [ ] 访问 https://supabase.com 注册账户
  - [ ] 使用 GitHub 账户关联登录
  - [ ] 验证账户激活成功

- [ ] 创建新的 Supabase 项目
  - [ ] 在 Supabase Dashboard 点击 "New Project"
  - [ ] 输入项目名称（api-hub-production）
  - [ ] 设置强密码（记录在安全位置）
  - [ ] 选择地区（推荐：Singapore 或 Tokyo，亚太地区延迟低）
  - [ ] 等待项目初始化完成（约 2 分钟）

- [ ] 获取数据库连接字符串
  - [ ] 进入 Project Settings → Database
  - [ ] 找到 "Connection string" 部分
  - [ ] 复制 **Connection pooling** URL（端口 6543, Session mode）
    - 格式：`postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true`
    - 保存为 `DATABASE_URL`
  - [ ] 复制 **Direct connection** URL（端口 5432）
    - 格式：`postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres`
    - 保存为 `DIRECT_URL`

- [ ] 验证数据库连接（可选）
  - [ ] 在 Supabase Dashboard → SQL Editor
  - [ ] 执行测试查询：`SELECT version();`
  - [ ] 确认 PostgreSQL 版本（应为 15+）

### Phase 2: Vercel 项目设置 (AC: 4, 5, 6)

- [ ] 创建 Vercel 账户并登录
  - [ ] 访问 https://vercel.com 注册账户
  - [ ] 使用 GitHub 账户关联登录
  - [ ] 选择 Hobby Plan（免费）

- [ ] 导入 GitHub 仓库
  - [ ] 在 Vercel Dashboard 点击 "Add New..." → "Project"
  - [ ] 选择 GitHub 作为源
  - [ ] 授权 Vercel 访问 GitHub 仓库
  - [ ] 找到并选择 `api-hub` 仓库
  - [ ] 点击 "Import"

- [ ] 配置项目设置
  - [ ] Framework Preset: Next.js（自动检测）
  - [ ] Root Directory: `./`（默认）
  - [ ] Build Command: `npm run build`（自动设置）
  - [ ] Install Command: `npm install`（自动设置）
  - [ ] Output Directory: `.next`（自动设置）

- [ ] 配置环境变量
  - [ ] 点击 "Environment Variables" 展开配置面板
  - [ ] 添加以下变量（**所有环境：Production, Preview, Development**）：
    ```bash
    # 数据库连接
    DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
    DIRECT_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres

    # NextAuth（先用临时值，部署后更新）
    NEXTAUTH_URL=https://your-app.vercel.app
    NEXTAUTH_SECRET=hHRbK8CPiBpMxBYox6o5B35vvwdTFAQPywRE8LjITSw=

    # Sentry（可选，如不需要可跳过）
    NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@o0.ingest.sentry.io/0
    SENTRY_DSN=https://your-sentry-dsn@o0.ingest.sentry.io/0
    SENTRY_AUTH_TOKEN=your-sentry-auth-token
    SENTRY_ORG=your-org-slug
    SENTRY_PROJECT=api-hub

    # 日志级别
    LOG_LEVEL=info

    # Node环境
    NODE_ENV=production
    ```
  - [ ] 确认所有变量保存成功

### Phase 3: 首次部署 (AC: 7, 8)

- [ ] 触发首次部署
  - [ ] 点击 "Deploy" 按钮
  - [ ] 监控部署日志（Build Logs）
  - [ ] 等待构建完成（约 2-5 分钟）

- [ ] 验证构建成功
  - [ ] 确认构建日志显示以下步骤成功：
    ```
    ✓ npm install
    ✓ prisma generate
    ✓ next build
    ✓ Build completed
    ```
  - [ ] 确认无构建错误（红色 ❌）

- [ ] 获取部署域名
  - [ ] 在部署完成后，Vercel 会显示域名
  - [ ] 域名格式：`api-hub-xxx.vercel.app`（xxx 为随机字符）
  - [ ] 复制完整域名（包括 https://）

- [ ] 更新 NEXTAUTH_URL 环境变量
  - [ ] 进入 Vercel Project Settings → Environment Variables
  - [ ] 找到 `NEXTAUTH_URL` 变量
  - [ ] 点击编辑，更新为实际域名：`https://api-hub-xxx.vercel.app`
  - [ ] 保存更改
  - [ ] **重要**: 点击 "Redeploy" 重新部署以使用新的环境变量

- [ ] 访问应用验证部署
  - [ ] 在浏览器访问 Vercel 提供的域名
  - [ ] 确认页面正常加载（显示 Next.js 首页或自定义内容）
  - [ ] 确认 HTTPS 证书有效（浏览器地址栏显示锁图标）
  - [ ] 打开浏览器开发者工具 → Console，检查无错误

- [ ] 验证数据库迁移成功
  - [ ] 在 Supabase Dashboard → Table Editor
  - [ ] 确认看到 8 张表：
    - `User`
    - `ApiKey`
    - `Api`
    - `Membership`
    - `Subscription`
    - `ApiCall`
    - `Transaction`
    - `_prisma_migrations`（Prisma 迁移记录表）
  - [ ] 或在 SQL Editor 执行查询验证：
    ```sql
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema='public'
    ORDER BY table_name;
    ```
  - [ ] 确认 4 个枚举类型存在：
    ```sql
    SELECT typname
    FROM pg_type
    WHERE typtype = 'e';
    ```
    应返回：`ApiStatus`, `BillingMode`, `MembershipTier`, `TransactionType`

### Phase 4: 自动部署验证 (AC: 9)

- [ ] 验证自动部署配置
  - [ ] 在 Vercel Project Settings → Git
  - [ ] 确认 "Production Branch" 设置为 `main`
  - [ ] 确认 "Automatic Deployments" 已启用

- [ ] 测试自动部署
  - [ ] 本地修改一个文件（如 README.md）
  - [ ] 提交并推送到 main 分支：
    ```bash
    git add README.md
    git commit -m "test: verify automatic deployment"
    git push origin main
    ```
  - [ ] 在 Vercel Dashboard 查看 Deployments 列表
  - [ ] 确认自动触发新的部署
  - [ ] 等待部署完成并验证成功

- [ ] 验证 Preview Deployments（可选）
  - [ ] 创建新分支并推送：
    ```bash
    git checkout -b feature/test-preview
    git push origin feature/test-preview
    ```
  - [ ] 在 Vercel 确认生成了 Preview 部署
  - [ ] 访问 Preview URL 验证可访问
  - [ ] 删除测试分支

### Phase 5: 性能和功能验证

- [ ] 验证 API 端点工作
  - [ ] 访问 `/api/test-sentry` 测试 Sentry 集成
  - [ ] 访问 `/api/protected` 测试 JWT 中间件
  - [ ] 确认 API 响应正常（200 或预期状态码）

- [ ] 验证 Sentry 错误上报（如配置了 Sentry）
  - [ ] 访问 `/api/test-sentry?error=true`
  - [ ] 在 Sentry Dashboard 确认收到错误报告
  - [ ] 验证 Source Maps 正确（错误堆栈显示 .ts 文件）

- [ ] 性能测试
  - [ ] 使用 Lighthouse 测试首页性能
  - [ ] 目标：Performance Score > 90
  - [ ] 确认 First Contentful Paint < 1.5s
  - [ ] 确认 Time to Interactive < 3.0s

- [ ] 数据库连接池验证
  - [ ] 在 Vercel Function Logs 中查看 Prisma 日志
  - [ ] 确认使用连接池（端口 6543）
  - [ ] 无 "too many connections" 错误

### Phase 6: 文档和收尾

- [ ] 记录部署信息
  - [ ] 创建 `docs/deployment-info.md` 文件
  - [ ] 记录以下信息：
    - Vercel 项目 URL
    - 生产域名
    - Supabase 项目 ID
    - 部署时间和版本

- [ ] 更新 README.md
  - [ ] 添加部署章节
  - [ ] 说明如何访问生产环境
  - [ ] 列出环境变量配置要求

- [ ] 标记 Story 完成
  - [ ] 在 `sprint-status.yaml` 中更新 Story 1-4 状态为 `done`
  - [ ] 添加完成日期和验收记录

## Dev Notes

### Learnings from Previous Story

**From Story 1.3 (Status: done)**

- **PostgreSQL 数据库已配置**: 本地 Docker PostgreSQL 运行正常
  - 数据库凭据: 用户 `apihub`, 数据库 `apihub`
  - 迁移文件已生成: `prisma/migrations/20251116005618_init/migration.sql`
  - 包含 8 张表 + 4 个枚举类型 + 17 个索引 + 8 个外键

- **Prisma 迁移系统就绪**: 已有初始迁移文件
  - 生产环境使用命令: `npx prisma migrate deploy` (不是 `migrate dev`)
  - 迁移文件会从 Git 同步到生产环境
  - Vercel 会在首次启动时自动运行迁移

- **环境变量配置经验**:
  - 已在本地配置 DATABASE_URL，生产环境需使用 Supabase 连接字符串
  - 需要额外配置 DIRECT_URL 用于 Prisma Migrate
  - 需要配置 NEXTAUTH_SECRET 和 NEXTAUTH_URL
  - Prisma 通过 `env("DATABASE_URL")` 和 `env("DIRECT_URL")` 自动加载

- **数据库验证脚本可复用**: `scripts/verify-database.ts`
  - 可用于生产环境部署后验证数据库结构
  - 确认所有表和枚举正确创建

### Technical Context

**Vercel + Supabase 平台特性：**

**Vercel:**
- **自动化部署**: Git push 自动触发构建和部署
- **零配置 HTTPS**: 自动签发 SSL 证书
- **全球 CDN**: Edge Network 遍布全球，性能卓越
- **Preview Deployments**: 每个 PR 自动生成预览环境
- **环境变量管理**: 支持 Production, Preview, Development 三种环境
- **函数日志**: 实时查看 Serverless Function 日志
- **自动扩容**: 根据流量自动调整资源

**Supabase:**
- **免费额度**: 500MB 数据库、无限 API 请求（公平使用）
- **连接池**: 内置 PgBouncer，最多 60 个并发连接
- **自动备份**: Point-in-Time Recovery (PITR)
- **Dashboard**: 可视化 SQL Editor、Table Editor、API 文档
- **Realtime**: 可选启用实时订阅（WebSocket）
- **Auth**: 内置认证系统（本项目使用 JWT，不使用 Supabase Auth）

**部署流程：**
1. **Git 推送** → GitHub 仓库更新
2. **Webhook 触发** → Vercel 收到通知
3. **代码拉取** → Vercel 克隆最新代码
4. **依赖安装** → `npm install`（安装所有 dependencies）
5. **Prisma 生成** → `prisma generate`（Vercel 自动检测）
6. **构建** → `npm run build`（Next.js 构建）
7. **部署** → 部署到全球 Edge Network
8. **迁移** → 首次启动时运行 `prisma migrate deploy`
9. **流量切换** → 新版本上线

**环境变量配置：**
- `DATABASE_URL` - Supabase Pooler URL（端口 6543，带 `pgbouncer=true`）
- `DIRECT_URL` - Supabase Direct URL（端口 5432，仅用于迁移）
- `NEXTAUTH_SECRET` - 手动配置（生成命令: `openssl rand -base64 32`）
- `NEXTAUTH_URL` - 设置为 Vercel 域名（如 `https://api-hub-xxx.vercel.app`）
- `NODE_ENV=production` - Vercel 自动设置

**连接池优化：**
- **问题**: Vercel Functions 是无服务器的，每次调用可能创建新的数据库连接
- **解决**: 使用 Supabase Connection Pooler（PgBouncer），端口 6543
- **Prisma 配置**: `directUrl` 用于迁移（端口 5432），`url` 用于查询（端口 6543）

### Project Structure Notes

**需要修改的文件：**
```
api-hub/
├── prisma/schema.prisma         # 已添加 directUrl 配置
├── .env.example                # 已更新 DATABASE_URL 和 DIRECT_URL 示例
├── package.json                # 无需修改，Vercel 自动识别
└── docs/architecture.md        # 已更新为 Vercel + Supabase
```

**Vercel 自动识别：**
- Vercel 自动检测 Next.js 项目（通过 package.json）
- 自动设置构建命令为 `npm run build`
- 自动设置启动命令为 `npm start`
- 自动运行 `prisma generate`（检测到 `prisma/schema.prisma`）

**Prisma 迁移执行时机：**
- **构建时**: `prisma generate`（生成 Prisma Client）
- **首次启动时**: `prisma migrate deploy`（通过 `package.json` 的 `start` 脚本）
- **后续启动**: 仅在有新迁移时执行

### Architectural Constraints

**来自 Architecture Document 和 Tech Spec Epic 1：**

1. **部署平台**: 使用 Vercel + Supabase（符合更新后的 Architecture 2.3.1）
   - 原因：Next.js 原生支持、全球 CDN、免费额度、零运维

2. **数据库迁移**: 生产环境使用 `prisma migrate deploy`
   - 禁止使用 `migrate dev`（会尝试创建影子数据库）
   - 迁移文件必须从 Git 同步，不得手动修改

3. **环境变量安全**:
   - 敏感信息（SECRET、DATABASE_URL）不得提交到 Git
   - 必须通过 Vercel 环境变量配置
   - 确保 `.env` 和 `.env.local` 在 .gitignore 中

4. **HTTPS 强制**:
   - 所有生产流量必须使用 HTTPS
   - Vercel 自动处理，无需额外配置

5. **健康检查**:
   - Vercel 自动对应用进行健康检查
   - 确保首页可正常响应 200 状态码

6. **日志记录**:
   - 应用日志输出到 stdout/stderr
   - Vercel 自动收集并在 Function Logs 显示
   - Sentry 集成用于错误追踪

### Testing Standards

**验证方式：**

1. **部署成功验证**:
   - Vercel Deployment Status 显示为 "Ready"（绿色勾）
   - 部署日志无错误信息
   - 构建时间 < 5 分钟（正常情况）

2. **应用可访问性**:
   - 访问 Vercel 提供的域名（https://xxx.vercel.app）
   - 页面正常加载，无 502/504 错误
   - HTTPS 证书有效（浏览器地址栏显示锁图标）

3. **数据库连接验证**:
   - 方法1: 在 Supabase Table Editor 查看表列表
   - 方法2: 查看 Vercel Function Logs，确认无数据库连接错误
   - 方法3: 访问 API 端点测试数据库查询

4. **数据库迁移验证**:
   - 在 Supabase Dashboard → SQL Editor 执行查询:
     ```sql
     SELECT table_name FROM information_schema.tables
     WHERE table_schema='public' ORDER BY table_name;
     ```
   - 确认 8 张表存在：User, ApiKey, Api, Membership, Subscription, ApiCall, Transaction, _prisma_migrations
   - 确认枚举类型存在：MembershipTier, ApiStatus, BillingMode, TransactionType

5. **环境变量验证**:
   - 在 Next.js API Route 中临时添加日志（仅测试用）:
     ```typescript
     console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
     console.log('NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET)
     ```
   - 在 Vercel Function Logs 查看输出
   - **安全提示**: 测试后立即删除日志代码，不要打印完整的环境变量值

6. **自动部署测试**:
   - 修改 README.md 或任意文件
   - Git push 到 main 分支
   - 观察 Vercel Deployments 页面自动触发新部署
   - 验证新部署成功并上线

7. **性能验证**:
   - 使用 Lighthouse 测试（Chrome DevTools）
   - Performance Score > 90
   - First Contentful Paint < 1.5s
   - Largest Contentful Paint < 2.5s

**完成标准：**
- ✅ Supabase 项目创建成功，数据库可用
- ✅ Vercel 项目创建成功并关联 GitHub 仓库
- ✅ 所有必要环境变量配置完成
- ✅ 首次部署成功，应用可通过 HTTPS 访问
- ✅ 自动部署触发器工作正常
- ✅ 数据库迁移成功，8 张表全部创建
- ✅ API 端点响应正常
- ✅ Sentry 集成工作正常（如配置）
- ✅ 部署文档更新（记录域名、环境配置等）

### References

- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Story 1.4]
- [Source: docs/epics.md#Story 1.4: 配置部署环境]
- [Source: docs/architecture.md#2.3.1 部署方案 - Vercel + Supabase]
- [Source: docs/sprint-artifacts/stories/1-3-setup-postgresql.md#Completion Notes]
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Migrate in Production](https://www.prisma.io/docs/guides/migrate/production-troubleshooting)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Completion Notes List

**本地开发准备工作已完成**:
1. ✅ 项目代码已准备好部署 (Stories 1.1-1.3)
2. ✅ Prisma 迁移文件已生成并提交到 Git
3. ✅ 数据库 Schema 完整 (8 张表 + 4 个枚举)
4. ✅ 本地开发环境正常运行
5. ✅ Prisma Schema 已优化，添加 `directUrl` 配置
6. ✅ `.env.example` 已更新，包含 Supabase 连接示例

**部署相关文件已准备**:
- ✅ `package.json` 包含正确的 build 和 start 脚本
- ✅ `.gitignore` 排除 .env 文件
- ✅ `prisma/schema.prisma` 配置 `url` 和 `directUrl`
- ✅ Architecture 文档已更新为 Vercel + Supabase

**待完成** (用户按 Story 任务执行):
- ⏸️ Supabase 账户创建和项目配置
- ⏸️ Vercel 账户创建和项目配置
- ⏸️ 环境变量设置
- ⏸️ 生产数据库迁移
- ⏸️ 首次部署验证

### File List

**Modified Files:**
- `prisma/schema.prisma` - 添加 directUrl 配置
- `.env.example` - 更新 Supabase 连接示例
- `docs/architecture.md` - 重写部署章节
- `docs/sprint-artifacts/stories/1-4-deploy-to-vercel.md` - 新建（本文件）

**Reference Files:**
- `package.json` - 构建和启动脚本
- `.gitignore` - 确保环境变量不被提交
- `prisma/migrations/20251116005618_init/migration.sql` - 数据库迁移文件
