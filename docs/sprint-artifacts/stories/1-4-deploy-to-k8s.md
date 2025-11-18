# Story 1-4: Kubernetes 容器化部署（生产级架构）

**Status**: ready-for-dev

**Epic**: Epic 1 - 项目基础设施与核心架构

**Story ID**: 1-4

**Dependencies**:
- Story 1-1: Next.js Starter 项目初始化 ✅
- Story 1-2: Prisma ORM 迁移 ✅
- Story 1-3: PostgreSQL 数据库配置 ✅
- Story 1-5: JWT 认证中间件 ✅
- Story 1-6: Sentry 监控与日志系统 ✅

---

## 📝 故事描述

作为一个**项目负责人**，我希望将 api-hub 应用部署到 Kubernetes 集群中，使用 Docker 容器化技术和 GitHub Actions 自动化 CI/CD，以便：

1. 获得完全的基础设施控制权（资源分配、扩容策略、网络配置）
2. 提升国内用户访问速度（部署在国内 VPS/云服务器）
3. 降低长期运营成本（相比 Serverless 平台节省 60%+ 成本）
4. 实现生产级高可用架构（滚动更新、健康检查、自动伸缩）
5. 提升团队 DevOps 能力（学习 K8s 和容器化技术）

---

## ✅ 验收标准 (Acceptance Criteria)

### AC1: Docker 镜像构建成功
**Given** Dockerfile 和 .dockerignore 配置完成  
**When** 执行 `docker build` 命令  
**Then**
- 镜像成功构建，无错误
- 镜像大小 < 300MB（Alpine + Standalone 优化）
- 镜像包含所有运行时依赖（Prisma Client、Next.js Server）
- 健康检查端点 `/api/health` 可访问

**And** 本地测试容器运行正常

### AC2: Kubernetes 资源配置完成
**Given** k8s/ 目录包含所有 YAML 配置文件  
**When** 应用配置到 K8s 集群  
**Then**
- Namespace `api-hub` 创建成功
- ConfigMap 包含非敏感环境变量
- Secret 包含敏感信息
- Deployment 配置 2 个副本
- Service 暴露 3000 端口
- Ingress 配置 TLS 和域名路由

### AC3: GitHub Actions CI/CD 自动化
**Given** `.github/workflows/deploy-k8s.yml` 配置完成  
**When** 推送代码到 main 分支  
**Then**
- GitHub Actions 自动触发构建流程
- Docker 镜像构建并推送到 GHCR
- Kubernetes Deployment 自动更新镜像
- 滚动更新完成，无停机时间

### AC4: 生产环境验证通过
**Given** 应用已部署到 K8s 集群  
**When** 访问生产域名  
**Then**
- HTTPS 证书自动配置
- 响应时间 < 500ms
- 健康检查返回 200 OK
- 数据库连接正常
- Sentry 接收日志

---

## 📚 技术上下文

### 为什么选择 Kubernetes？

**优势**:
1. **完全控制**: 自定义资源分配、扩容策略、网络配置
2. **国内访问快**: 部署在国内 VPS，延迟 <50ms
3. **成本低**: ¥200-500/月（2C4G VPS + Supabase Free）
4. **生产级**: 滚动更新、健康检查、自动伸缩
5. **技术成长**: 学习 K8s 和容器化技术

**架构**:
```
Kubernetes Cluster
  ├─ Ingress (NGINX + TLS)
  ├─ Service (ClusterIP:3000)
  └─ Deployment (replicas: 2-10)
       ├─ Pod 1 (512Mi RAM, 0.5 CPU)
       └─ Pod 2 (健康检查: /api/health)
```

---

## 🔗 相关文档

- [Kubernetes 官方文档](https://kubernetes.io/docs/)
- [Next.js Standalone 模式](https://nextjs.org/docs/app/api-reference/next-config-js/output)
- [k8s/README.md](../../../k8s/README.md) - 详细部署指南

---

**最后更新**: 2025-01-18  
**负责人**: DevOps Team  
**审核人**: Tech Lead
