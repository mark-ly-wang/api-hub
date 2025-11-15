# Story 1.1: 初始化 Next.js SaaS Starter 项目

Status: drafted

## Story

As a 开发者,
I want 基于 Next.js 官方 SaaS Starter 初始化项目,
So that 拥有经过验证的项目结构和最佳实践基础。

## Context

**Epic:** Epic 1 - 项目基础设施与核心架构
**Story Position:** Epic 1 的第一个 Story（1/6）
**Prerequisites:** 无

**为什么这个 Story 重要？**

Story 1.1 是整个 api-hub 项目的起点。通过使用 Next.js 官方 SaaS Starter 模板，我们获得：
1. **验证过的项目结构**：官方维护的目录组织和最佳实践
2. **完整的 TypeScript 配置**：开箱即用的类型安全
3. **内置的 SaaS 功能**：认证框架（JWT）、支付集成（Stripe）、Dashboard 组件
4. **快速启动**：避免从零配置，节省 2-3 天架构探索时间

**与后续 Stories 的关系：**
- Story 1.2 将在此基础上迁移 ORM（Drizzle → Prisma）
- Story 1.3 将配置数据库连接
- Story 1.4 将部署到 Zeabur
- Story 1.5 将复用模板中的 JWT 认证框架
- Story 1.6 将集成监控工具

## Acceptance Criteria

基于 [Epics](../epics.md#story-11-初始化-nextjs-saas-starter-项目) 和 [Tech Spec Epic 1](./tech-spec-epic-1.md#story-11-初始化-nextjs-saas-starter-项目)：

### AC-1: 项目成功创建
- **Given** Next.js SaaS Starter 官方仓库可访问
- **When** 执行 `npx create-next-app@latest api-hub --example https://github.com/vercel/next.js/tree/canary/examples/with-stripe-typescript`
- **Then** 项目目录创建成功，包含以下标准结构：
  ```
  api-hub/
  ├── app/              # Next.js 14 App Router 目录
  ├── components/       # React 组件
  ├── lib/              # 工具函数和业务逻辑
  ├── public/           # 静态资源
  ├── prisma/           # （暂时为空，Story 1.2 添加）
  ├── package.json      # 依赖配置
  ├── tsconfig.json     # TypeScript 配置
  ├── next.config.js    # Next.js 配置
  └── .env.local.example # 环境变量模板
  ```

### AC-2: 依赖完整性验证
- **Given** 项目已创建
- **When** 检查 `package.json`
- **Then** 包含以下关键依赖：
  - `next`: `^14.x.x`（Next.js 14 App Router）
  - `react`: `^18.x.x`
  - `react-dom`: `^18.x.x`
  - `typescript`: `^5.x.x`
  - `@types/react`: `^18.x.x`
  - `@types/node`: `^20.x.x`
  - `stripe`: （Stripe 支付集成）
  - `drizzle-orm`: （Story 1.2 将替换为 Prisma）

### AC-3: 开发服务器启动成功
- **Given** 依赖已安装（`npm install` 完成）
- **When** 执行 `npm run dev`
- **Then** 开发服务器在 `http://localhost:3000` 启动成功
- **And** 浏览器访问显示模板的默认首页（无错误）
- **And** 控制台无 TypeScript 编译错误

### AC-4: TypeScript 配置正确
- **Given** 项目已创建
- **When** 检查 `tsconfig.json`
- **Then** 包含以下关键配置：
  ```json
  {
    "compilerOptions": {
      "target": "ES2017",
      "lib": ["dom", "dom.iterable", "esnext"],
      "jsx": "preserve",
      "module": "esnext",
      "moduleResolution": "node",
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true,
      "incremental": true,
      "plugins": [{ "name": "next" }],
      "paths": {
        "@/*": ["./*"]
      }
    }
  }
  ```

### AC-5: Git 仓库初始化
- **Given** 项目已创建
- **When** 初始化 Git 仓库并提交
- **Then** `.git` 目录存在
- **And** 初始提交包含所有模板文件
- **And** `.gitignore` 正确配置（忽略 `node_modules/`, `.next/`, `.env.local`）
- **And** 仓库推送到 GitHub 远程仓库

## Tasks / Subtasks

基于 [Tech Spec Epic 1 - Workflows](./tech-spec-epic-1.md#workflows-and-sequencing)：

### Task 1: 执行项目初始化命令 (AC: #1)
- [ ] **1.1** 确认本地环境满足要求
  - Node.js >= 18.x
  - npm >= 9.x
  - Git 已安装
- [ ] **1.2** 执行项目创建命令
  ```bash
  npx create-next-app@latest api-hub --example https://github.com/vercel/next.js/tree/canary/examples/with-stripe-typescript
  ```
- [ ] **1.3** 等待模板下载和依赖安装完成
- [ ] **1.4** 验证项目目录结构符合 AC-1

### Task 2: 安装项目依赖 (AC: #2)
- [ ] **2.1** 进入项目目录：`cd api-hub`
- [ ] **2.2** 执行依赖安装：`npm install`
- [ ] **2.3** 验证 `package.json` 包含关键依赖（AC-2）
- [ ] **2.4** 检查 `package-lock.json` 生成成功

### Task 3: 验证 TypeScript 配置 (AC: #4)
- [ ] **3.1** 打开 `tsconfig.json` 文件
- [ ] **3.2** 确认 `strict: true` 启用
- [ ] **3.3** 确认路径别名 `@/*` 配置正确
- [ ] **3.4** 执行 TypeScript 类型检查：`npm run type-check`（如果有此脚本）

### Task 4: 启动开发服务器并验证 (AC: #3)
- [ ] **4.1** 复制环境变量模板：`cp .env.local.example .env.local`
- [ ] **4.2** 启动开发服务器：`npm run dev`
- [ ] **4.3** 浏览器访问 `http://localhost:3000`
- [ ] **4.4** 验证首页正常渲染，无控制台错误
- [ ] **4.5** 验证热重载功能正常（修改文件触发刷新）
- [ ] **4.6** 停止开发服务器（Ctrl+C）

### Task 5: 初始化 Git 仓库 (AC: #5)
- [ ] **5.1** 初始化 Git：`git init`
- [ ] **5.2** 检查 `.gitignore` 内容是否正确
  - 确认包含：`node_modules/`, `.next/`, `.env.local`, `*.log`
- [ ] **5.3** 添加所有文件到 Git：`git add .`
- [ ] **5.4** 创建初始提交：
  ```bash
  git commit -m "feat: initialize project with Next.js SaaS Starter

  - Use Next.js 14 App Router
  - Include Stripe integration template
  - TypeScript configuration enabled
  - Directory structure: app/, components/, lib/"
  ```
- [ ] **5.5** 在 GitHub 创建新仓库 `api-hub`
- [ ] **5.6** 添加远程仓库：
  ```bash
  git remote add origin git@github.com:YOUR_USERNAME/api-hub.git
  git branch -M main
  git push -u origin main
  ```
- [ ] **5.7** 验证 GitHub 仓库显示所有文件

### Task 6: 文档记录和清理 (Best Practice)
- [ ] **6.1** 创建 `README.md` 记录项目概述
  - 项目名称、描述、技术栈
  - 本地开发启动步骤
  - 环境变量说明
- [ ] **6.2** 记录模板中包含的功能（供后续 Stories 参考）：
  - JWT 认证框架位置（`lib/auth/`）
  - Stripe 集成位置（`lib/stripe/`）
  - Drizzle ORM 配置位置（`lib/db/`，Story 1.2 将替换）
- [ ] **6.3** 删除模板中的示例代码（可选，保留作为参考）

## Dev Notes

### 架构对齐

**来自 [Architecture Ch.2.1](../architecture.md#21-前端技术栈)：**
- ✅ 使用 Next.js 14 App Router（不是 Pages Router）
- ✅ TypeScript 严格模式启用
- ✅ 路径别名 `@/*` 映射到项目根目录

**来自 [Tech Spec Epic 1](./tech-spec-epic-1.md#21-前端技术栈)：**
- ✅ 官方模板包含 Stripe 集成（符合 Architecture 2.4.1 支付方案）
- ✅ 官方模板包含 JWT 认证（符合 Architecture ADR-001）
- ⚠️ 官方模板使用 Drizzle ORM（Story 1.2 将替换为 Prisma，符合 Architecture ADR-002）

### 项目结构笔记

**初始化后的关键目录和文件：**

```
api-hub/
├── app/
│   ├── layout.tsx          # 根布局组件
│   ├── page.tsx             # 首页
│   ├── api/                 # API Routes
│   │   └── auth/            # 认证相关 API（模板提供）
│   └── dashboard/           # Dashboard 页面（模板提供）
├── components/
│   ├── ui/                  # UI 组件（模板可能包含基础组件）
│   └── ...                  # 其他组件
├── lib/
│   ├── auth/                # JWT 认证逻辑（模板提供）
│   ├── stripe/              # Stripe 集成（模板提供）
│   ├── db/                  # Drizzle ORM 配置（Story 1.2 替换）
│   └── utils/               # 工具函数
├── public/
│   └── ...                  # 静态资源
└── package.json
```

**重要提醒：**
1. **不要删除** `lib/auth/` 和 `lib/stripe/` - Epic 1 后续 Stories 会复用
2. **暂时保留** Drizzle 相关代码 - Story 1.2 会系统性替换
3. **检查** `.env.local.example` - 了解需要的环境变量

### 技术约束和注意事项

**从 Tech Spec Epic 1 提取：**

1. **Node.js 版本要求：** >= 18.x（Next.js 14 要求）
2. **包管理器：** npm（官方模板默认），也可选择 pnpm/yarn
3. **TypeScript 严格模式：** 必须启用，确保类型安全
4. **环境变量：**
   - `DATABASE_URL`（Story 1.3 配置）
   - `NEXTAUTH_SECRET`（JWT 密钥，Story 1.5 配置）
   - `NEXTAUTH_URL`（认证回调 URL）
   - `STRIPE_SECRET_KEY`（Stripe 密钥，Epic 11 配置）

**已知问题（来自 Tech Spec Epic 1 - Risks）：**
- ⚠️ 官方模板可能定期更新，命令执行时的版本可能与文档描述略有差异
- ✅ 缓解措施：优先使用固定版本的模板（通过 Git tag 或 commit hash）

### Testing Strategy

**来自 [Tech Spec Epic 1 - Test Strategy](./tech-spec-epic-1.md#test-strategy-summary)：**

Story 1.1 的测试主要是**手动验证**（端到端测试），因为是项目初始化步骤：

**测试检查清单：**
- [x] 项目目录创建成功（AC-1）
- [x] `package.json` 包含所有关键依赖（AC-2）
- [x] `npm run dev` 启动无错误（AC-3）
- [x] TypeScript 配置正确（AC-4）
- [x] Git 仓库初始化并推送到 GitHub（AC-5）

**无需单元测试或集成测试** - 此 Story 是基础设施搭建，后续 Stories 会引入测试框架。

### Learnings from Previous Story

**这是 Epic 1 的第一个 Story** - 没有前序 Story 的学习内容。

### References

- [Source: docs/epics.md#Story-1.1-初始化-Next.js-SaaS-Starter-项目]
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Overview]
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Workflows-and-Sequencing]
- [Source: docs/architecture.md#2.1-前端技术栈]
- [Source: docs/architecture.md#ADR-001-保留官方JWT方案]
- [Next.js SaaS Starter Template: https://github.com/vercel/next.js/tree/canary/examples/with-stripe-typescript]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by story-context workflow -->

### Agent Model Used

<!-- Will be filled during story-context or dev-story workflow -->

### Debug Log References

<!-- Dev agent will add debug log paths during implementation -->

### Completion Notes List

<!-- Dev agent will add completion notes after implementation:
- New patterns/services created
- Architectural decisions made
- Technical debt deferred
- Warnings for next story
-->

### File List

<!-- Dev agent will list files created/modified/deleted during implementation:
- NEW: [file paths]
- MODIFIED: [file paths]
- DELETED: [file paths]
-->

---

**Story Created:** 2025-11-15
**Story Status:** drafted
**Next Workflow:** Run `/bmad:bmm:workflows:story-context` to generate technical context and mark ready for development
