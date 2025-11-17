# Story 1.4: 配置 Zeabur 部署环境

Status: drafted  # 技术债务: 等待手动部署

## Story

As a 开发者,
I want 在 Zeabur 上配置项目部署环境,
So that 实现持续部署和生产环境访问。

## Acceptance Criteria

1. **Given** Zeabur 账户和项目代码仓库
2. **When** 创建 Zeabur 项目并关联 Git 仓库
3. **Then** Zeabur 项目成功创建
4. **And** PostgreSQL addon 成功添加并自动注入 DATABASE_URL
5. **And** 环境变量配置完成（NEXTAUTH_SECRET, NEXTAUTH_URL 等）
6. **And** 首次部署成功,"Hello World" 页面可访问
7. **And** 自动部署触发器配置完成（main 分支 push 触发）

## Tasks / Subtasks

- [ ] 创建 Zeabur 账户并登录 (AC: 1)
  - [ ] 访问 https://zeabur.com 注册账户
  - [ ] 使用 GitHub 账户关联登录
  - [ ] 验证账户激活成功
- [ ] 创建新项目并关联 Git 仓库 (AC: 2, 3)
  - [ ] 在 Zeabur Dashboard 点击 "New Project"
  - [ ] 选择 GitHub 仓库（api-hub）
  - [ ] 授权 Zeabur 访问仓库
  - [ ] 选择部署分支（main）
  - [ ] 确认项目创建成功
- [ ] 添加 PostgreSQL addon (AC: 4)
  - [ ] 在项目中点击 "Add Service" → "Database" → "PostgreSQL"
  - [ ] 选择 PostgreSQL 版本（16）
  - [ ] 等待数据库实例创建完成
  - [ ] 验证 DATABASE_URL 环境变量自动注入
  - [ ] 复制 DATABASE_URL 连接字符串备用
- [ ] 配置必要环境变量 (AC: 5)
  - [ ] 在项目设置中添加环境变量
  - [ ] `NEXTAUTH_SECRET` - 生成随机密钥（32+ 字符）
  - [ ] `NEXTAUTH_URL` - 设置为 Zeabur 提供的域名（https://xxx.zeabur.app）
  - [ ] `NODE_ENV` - 设置为 "production"
  - [ ] 验证所有环境变量正确保存
- [ ] 执行数据库迁移到生产环境 (AC: 4)
  - [ ] 配置 Zeabur 构建命令包含 `prisma migrate deploy`
  - [ ] 或手动在 Zeabur 控制台执行迁移
  - [ ] 验证迁移成功，8 张表创建完成
  - [ ] 使用 Prisma Studio 连接生产数据库验证（可选）
- [ ] 触发首次部署 (AC: 6)
  - [ ] 推送代码到 main 分支触发自动部署
  - [ ] 或在 Zeabur Dashboard 手动触发部署
  - [ ] 监控部署日志，确认构建成功
  - [ ] 验证部署状态变为 "Running"
  - [ ] 访问 Zeabur 提供的域名（https://xxx.zeabur.app）
  - [ ] 确认页面可访问（显示 Next.js 默认页面或自定义内容）
- [ ] 配置自动部署触发器 (AC: 7)
  - [ ] 验证 Zeabur 已自动配置 GitHub Webhook
  - [ ] 测试：修改 README.md 并推送到 main
  - [ ] 确认 Zeabur 自动触发新的部署
  - [ ] 验证部署成功并更新线上环境
- [ ] 配置自定义域名（可选）
  - [ ] 在 Zeabur 项目设置中添加自定义域名
  - [ ] 配置 DNS CNAME 记录指向 Zeabur
  - [ ] 等待 SSL 证书自动签发
  - [ ] 验证自定义域名可通过 HTTPS 访问
- [ ] 验证生产环境完整性
  - [ ] 验证 HTTPS 证书有效
  - [ ] 验证数据库连接成功（通过 API 测试或日志）
  - [ ] 验证环境变量正确加载
  - [ ] 检查 Zeabur 日志输出正常

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
  - **重要**: Zeabur 构建脚本需包含迁移步骤

- **环境变量配置经验**:
  - 已在本地配置 DATABASE_URL，生产环境需替换为 Zeabur PostgreSQL 提供的连接字符串
  - 需要额外配置 NEXTAUTH_SECRET 和 NEXTAUTH_URL
  - Prisma 通过 `env("DATABASE_URL")` 自动加载

- **数据库验证脚本可复用**: `scripts/verify-database.ts`
  - 可用于生产环境部署后验证数据库结构
  - 确认所有表和枚举正确创建

- **审查建议** (Story 1.3 低优先级):
  - [Low] docker-compose.yml 中的 `version: '3.8'` 字段已废弃 - 不影响 Zeabur 部署
  - [Advisory] 生产环境密码需更换 - Zeabur PostgreSQL 会自动生成强密码，无需手动设置

[Source: stories/1-3-setup-postgresql.md#Dev-Agent-Record, #Senior-Developer-Review]

### Technical Context

**Zeabur 平台特性：**
- **自动化部署**: Git push 自动触发构建和部署
- **零配置 HTTPS**: 自动签发 SSL 证书
- **环境变量管理**: Web 界面配置，自动注入到应用
- **PostgreSQL Addon**: 一键添加，自动注入 DATABASE_URL
- **日志查看**: 实时查看应用 stdout/stderr 日志
- **自动扩容**: 根据流量自动调整资源（基础套餐有限制）

**部署流程：**
1. **Git 推送** → GitHub 仓库更新
2. **Webhook 触发** → Zeabur 收到通知
3. **代码拉取** → Zeabur 克隆最新代码
4. **依赖安装** → `npm install`
5. **构建** → `npm run build`（Next.js 构建）
6. **迁移** → `npx prisma migrate deploy`（需配置）
7. **启动** → `npm start`
8. **健康检查** → 验证应用响应
9. **流量切换** → 新版本上线

**环境变量配置：**
- `DATABASE_URL` - Zeabur PostgreSQL 自动注入
- `NEXTAUTH_SECRET` - 手动配置（生成命令: `openssl rand -base64 32`）
- `NEXTAUTH_URL` - 设置为 Zeabur 域名（如 `https://api-hub-xxx.zeabur.app`）
- `NODE_ENV=production` - 确保生产模式运行

**迁移策略：**
- **本地开发**: `prisma migrate dev` - 生成迁移文件
- **生产部署**: `prisma migrate deploy` - 仅应用现有迁移
- **Zeabur 配置**: 在构建脚本或 package.json 中添加迁移步骤

### Project Structure Notes

**需要修改的文件：**
```
api-hub/
├── package.json               # 可能需要添加 build 脚本
├── .gitignore                 # 确保 .env 文件不提交
└── (Zeabur 无需额外配置文件，通过 Web 界面配置)
```

**Zeabur 自动识别：**
- Zeabur 自动检测 Next.js 项目（通过 package.json）
- 自动使用 Node.js 运行时
- 自动执行 `npm install` 和 `npm run build`
- 自动执行 `npm start` 启动应用

**自定义构建脚本（如需要）：**
如果需要在构建时执行 Prisma 迁移，可在 package.json 修改：

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build",
    "start": "next start"
  }
}
```

**或在 Zeabur 项目设置中配置构建命令：**
```bash
npm install && npx prisma generate && npx prisma migrate deploy && npm run build
```

### Architectural Constraints

**来自 Architecture Document 和 Tech Spec Epic 1：**

1. **部署平台**: 必须使用 Zeabur（符合 Architecture 2.3.1）
   - 原因：零运维负担，国内访问优化，成本可控

2. **数据库迁移**: 生产环境使用 `prisma migrate deploy`
   - 禁止使用 `migrate dev`（会尝试创建影子数据库）
   - 迁移文件必须从 Git 同步，不得手动修改

3. **环境变量安全**:
   - 敏感信息（SECRET、DATABASE_URL）不得提交到 Git
   - 必须通过 Zeabur 环境变量配置
   - 确保 `.env` 和 `.env.local` 在 .gitignore 中

4. **HTTPS 强制**:
   - 所有生产流量必须使用 HTTPS
   - Zeabur 自动处理，无需额外配置

5. **健康检查**:
   - Zeabur 自动对 `/` 路径进行健康检查
   - 确保首页可正常响应 200 状态码

6. **日志记录**:
   - 应用日志输出到 stdout/stderr
   - Zeabur 自动收集并在 Dashboard 显示
   - 为 Story 1.6（监控日志）做准备

### Testing Standards

**验证方式：**

1. **部署成功验证**:
   - Zeabur Dashboard 显示部署状态为 "Running"（绿色）
   - 部署日志无错误信息
   - 构建时间 < 5 分钟（正常情况）

2. **应用可访问性**:
   - 访问 Zeabur 提供的域名（https://xxx.zeabur.app）
   - 页面正常加载，无 502/504 错误
   - HTTPS 证书有效（浏览器地址栏显示锁图标）

3. **数据库连接验证**:
   - 方法1: 在应用中添加简单 API 路由测试数据库查询
   - 方法2: 查看 Zeabur 日志，确认无数据库连接错误
   - 方法3: 使用 Prisma Studio 连接生产数据库（DATABASE_URL）

4. **数据库迁移验证**:
   - 使用 Zeabur 提供的 DATABASE_URL 连接 PostgreSQL
   - 执行查询: `SELECT table_name FROM information_schema.tables WHERE table_schema='public';`
   - 确认 8 张表存在：User, ApiKey, Api, Membership, Subscription, ApiCall, Transaction
   - 确认枚举类型存在：MembershipTier, ApiStatus, BillingMode, TransactionType

5. **环境变量验证**:
   - 在 Next.js API Route 中打印环境变量（临时测试）
   - 确认 DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL 正确加载
   - **安全提示**: 测试后立即删除打印环境变量的代码

6. **自动部署测试**:
   - 修改 README.md 或任意文件
   - Git push 到 main 分支
   - 观察 Zeabur Dashboard 自动触发新部署
   - 验证新部署成功并上线

**完成标准：**
- ✅ Zeabur 项目创建成功并关联 GitHub 仓库
- ✅ PostgreSQL addon 添加成功，DATABASE_URL 可用
- ✅ 所有必要环境变量配置完成
- ✅ 首次部署成功，应用可通过 HTTPS 访问
- ✅ 自动部署触发器工作正常
- ✅ 数据库迁移成功，8 张表全部创建
- ✅ 部署文档更新（记录域名、环境配置等）

### References

- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Story 1.4]
- [Source: docs/epics.md#Story 1.4: 配置 Zeabur 部署环境]
- [Source: docs/architecture.md#2.3.1 部署方案 - Zeabur]
- [Source: docs/sprint-artifacts/stories/1-3-setup-postgresql.md#Completion Notes]
- [Zeabur Documentation](https://zeabur.com/docs)
- [Prisma Migrate in Production](https://www.prisma.io/docs/guides/migrate/production-troubleshooting)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

**⚠️ 技术债务记录 (Technical Debt)**

**债务类型**: 部署配置 - 需要手动操作
**优先级**: Medium (不阻塞本地开发)
**创建日期**: 2025-11-16

**详情**:
Story 1.4 涉及 Zeabur 云平台配置,需要以下手动操作:
1. 创建 Zeabur 账户并关联 GitHub 仓库
2. 添加 PostgreSQL addon 并获取 DATABASE_URL
3. 配置环境变量 (NEXTAUTH_SECRET, NEXTAUTH_URL, NODE_ENV)
4. 执行首次部署并验证
5. 配置自动部署触发器

**影响范围**:
- ✅ **不影响本地开发**: Stories 1.5-1.6 和所有 Epic 2+ 的功能可在本地环境完成
- ⚠️ **部署测试延迟**: 无法验证生产环境的数据库迁移和 HTTPS 配置
- ⚠️ **环境差异**: 本地使用 Docker PostgreSQL,生产使用 Zeabur PostgreSQL
- ℹ️ **后续集成**: Epic 11 (Stripe 支付) 需要生产环境域名用于 webhook

**计划解决时间**: 在 Epic 1 完成后,开始 Epic 2 之前手动完成部署

**需要的输入** (部署时):
- GitHub 仓库 URL: https://github.com/[用户名]/api-hub
- Zeabur 生成的环境变量 (DATABASE_URL, 域名)

**验收标准** (部署完成后):
- [ ] Zeabur 项目创建成功
- [ ] PostgreSQL addon 配置并迁移成功
- [ ] 应用可通过 HTTPS 访问
- [ ] 自动部署工作正常

**相关 Stories**:
- 依赖: Stories 1.1, 1.2, 1.3 (已完成)
- 被依赖: Story 1.6 (监控日志 - Sentry 需要生产环境 URL,但可先配置本地)

### Completion Notes List

**本地开发准备工作已完成**:
1. ✅ 项目代码已准备好部署 (Stories 1.1-1.3)
2. ✅ Prisma 迁移文件已生成并提交到 Git
3. ✅ 数据库 Schema 完整 (8 张表 + 4 个枚举)
4. ✅ 本地开发环境正常运行

**部署相关文件已准备**:
- ✅ `package.json` 包含正确的 build 和 start 脚本
- ✅ `.gitignore` 排除 .env 文件
- ✅ Prisma schema 配置使用 `env("DATABASE_URL")`

**待手动完成** (用户稍后操作):
- ⏸️ Zeabur 账户创建和项目配置
- ⏸️ 环境变量设置
- ⏸️ 生产数据库迁移
- ⏸️ 首次部署验证

### File List
