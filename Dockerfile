# ============================================
# Stage 1: Dependencies
# 安装所有依赖和生成 Prisma Client
# ============================================
FROM node:20-alpine AS deps

# 安装 OpenSSL (Prisma 需要) 和 libc6-compat (Alpine 兼容性)
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# 复制依赖文件
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# 安装依赖并生成 Prisma Client
RUN npm ci && \
    npx prisma generate

# ============================================
# Stage 2: Builder
# 构建 Next.js 应用（Standalone 模式）
# ============================================
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# 从 deps 阶段复制 node_modules
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 设置环境变量
ENV NEXT_TELEMETRY_DISABLED=1

# 构建时使用虚拟数据库 URL（仅用于 Prisma schema 解析）
# 实际数据库连接在运行时通过环境变量提供
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DIRECT_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# 构建应用
RUN npm run build

# ============================================
# Stage 3: Runner
# 最终运行镜像（仅包含必要文件）
# ============================================
FROM node:20-alpine AS runner

# 安装 curl（用于健康检查）和 OpenSSL（Prisma 需要）
RUN apk add --no-cache curl openssl

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非 root 用户（安全最佳实践）
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 复制 public 目录（静态资源）
COPY --from=builder /app/public ./public

# 复制 standalone 构建产物
# Next.js standalone 模式会自动将所有必要文件打包到 .next/standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 复制 Prisma schema 和 migrations（运行时迁移需要）
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 健康检查（每30秒检查一次）
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# 启动应用
# 注意：Prisma 迁移在 Kubernetes Init Container 中执行，这里仅启动 Node.js 服务器
CMD ["node", "server.js"]
