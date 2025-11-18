# Kubernetes 部署配置说明

本目录包含 API Hub 项目的 Kubernetes 部署配置文件。

## 📁 文件说明

| 文件 | 说明 | 是否必需 |
|------|------|---------|
| `namespace.yaml` | 创建独立命名空间 | ✅ 必需 |
| `configmap.yaml` | 非敏感环境变量配置 | ✅ 必需 |
| `secret.yaml.template` | 敏感信息模板（不提交 Git） | ✅ 必需 |
| `deployment.yaml` | 应用部署配置 | ✅ 必需 |
| `service.yaml` | 服务暴露配置 | ✅ 必需 |
| `ingress.yaml` | 外部访问和 TLS 配置 | ✅ 必需 |
| `hpa.yaml` | 自动伸缩配置 | 🟡 可选 |
| `migration-job.yaml` | 数据库迁移 Job | 🟡 可选 |

## 🚀 部署流程

### 1. 前置准备

#### 1.1 安装必要组件

```bash
# 安装 NGINX Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

# 安装 cert-manager（用于自动 TLS 证书）
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# 安装 Metrics Server（用于 HPA）
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

#### 1.2 配置镜像仓库访问（如果使用私有镜像）

```bash
# 创建 Docker 镜像拉取凭证
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=YOUR_GITHUB_TOKEN \
  -n api-hub

# 在 deployment.yaml 中添加 imagePullSecrets
```

### 2. 创建命名空间和配置

```bash
# 创建命名空间
kubectl apply -f namespace.yaml

# 创建 ConfigMap
kubectl apply -f configmap.yaml
```

### 3. 创建 Secrets

⚠️ **重要**: 不要直接使用 `secret.yaml.template`，它只是一个模板！

**方法 1: 从命令行创建**（推荐）

```bash
kubectl create secret generic api-hub-secrets \
  --from-literal=DATABASE_URL='postgresql://...' \
  --from-literal=DIRECT_URL='postgresql://...' \
  --from-literal=NEXTAUTH_SECRET='your-secret' \
  --from-literal=SENTRY_DSN='https://...' \
  --from-literal=SENTRY_AUTH_TOKEN='your-token' \
  --from-literal=SENTRY_ORG='your-org' \
  --from-literal=SENTRY_PROJECT='api-hub' \
  --from-literal=NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY='your-key' \
  -n api-hub
```

**方法 2: 从 .env 文件创建**

```bash
# 准备 .env.production 文件
cat > .env.production <<EOF
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=your-token
SENTRY_ORG=your-org
SENTRY_PROJECT=api-hub
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-key
EOF

# 从文件创建 Secret
kubectl create secret generic api-hub-secrets \
  --from-env-file=.env.production \
  -n api-hub

# 删除 .env.production（安全）
rm .env.production
```

### 4. 执行数据库迁移

**方法 1: 使用 Job**（推荐用于首次部署）

```bash
# 修改 migration-job.yaml 中的镜像地址
# 然后执行:
kubectl apply -f migration-job.yaml

# 查看迁移日志
kubectl logs job/prisma-migrate -n api-hub

# 清理 Job
kubectl delete job/prisma-migrate -n api-hub
```

**方法 2: 使用 Init Container**（推荐用于后续部署）

已在 `deployment.yaml` 中配置，每次部署自动执行。

### 5. 部署应用

```bash
# 修改 deployment.yaml 中的镜像地址:
# image: ghcr.io/YOUR_GITHUB_USERNAME/api-hub:latest

# 应用部署配置
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# 验证部署
kubectl get pods -n api-hub
kubectl logs -f deployment/api-hub -n api-hub
```

### 6. 配置 Ingress 和域名

```bash
# 修改 ingress.yaml 中的域名:
# - api.yourdomain.com

# 应用 Ingress 配置
kubectl apply -f ingress.yaml

# 验证 Ingress
kubectl get ingress -n api-hub
kubectl describe ingress api-hub-ingress -n api-hub
```

### 7. 配置自动伸缩（可选）

```bash
kubectl apply -f hpa.yaml

# 验证 HPA
kubectl get hpa -n api-hub
```

## 🔍 验证部署

### 检查 Pod 状态

```bash
kubectl get pods -n api-hub
kubectl describe pod <pod-name> -n api-hub
kubectl logs -f <pod-name> -n api-hub
```

### 检查服务

```bash
kubectl get svc -n api-hub
kubectl describe svc api-hub-service -n api-hub
```

### 检查 Ingress

```bash
kubectl get ingress -n api-hub
kubectl describe ingress api-hub-ingress -n api-hub
```

### 测试健康检查

```bash
# 进入容器
kubectl exec -it deployment/api-hub -n api-hub -- /bin/sh

# 测试健康检查端点
curl http://localhost:3000/api/health
```

## 🔄 更新部署

### 更新镜像

```bash
# 方法 1: 直接更新镜像
kubectl set image deployment/api-hub \
  api-hub=ghcr.io/YOUR_USERNAME/api-hub:NEW_TAG \
  -n api-hub

# 方法 2: 编辑 deployment.yaml 后应用
kubectl apply -f deployment.yaml

# 查看滚动更新状态
kubectl rollout status deployment/api-hub -n api-hub
```

### 回滚部署

```bash
# 查看历史版本
kubectl rollout history deployment/api-hub -n api-hub

# 回滚到上一版本
kubectl rollout undo deployment/api-hub -n api-hub

# 回滚到指定版本
kubectl rollout undo deployment/api-hub --to-revision=2 -n api-hub
```

## 📊 监控和调试

### 查看日志

```bash
# 查看所有 Pod 日志
kubectl logs -f deployment/api-hub -n api-hub

# 查看特定 Pod 日志
kubectl logs -f <pod-name> -n api-hub

# 查看 Init Container 日志
kubectl logs <pod-name> -c prisma-migrate -n api-hub
```

### 查看资源使用

```bash
# 查看 Pod 资源使用
kubectl top pods -n api-hub

# 查看节点资源使用
kubectl top nodes
```

### 查看事件

```bash
kubectl get events -n api-hub --sort-by='.lastTimestamp'
```

## 🛠️ 故障排查

### Pod 无法启动

```bash
# 查看 Pod 详情
kubectl describe pod <pod-name> -n api-hub

# 常见问题:
# 1. 镜像拉取失败 -> 检查镜像地址和访问权限
# 2. 健康检查失败 -> 检查 /api/health 端点
# 3. 资源不足 -> 调整 requests/limits
```

### 数据库连接失败

```bash
# 检查 Secret 配置
kubectl get secret api-hub-secrets -n api-hub -o yaml

# 验证数据库连接
kubectl exec -it deployment/api-hub -n api-hub -- \
  npx prisma db execute --sql "SELECT 1"
```

### Ingress 无法访问

```bash
# 检查 Ingress 状态
kubectl describe ingress api-hub-ingress -n api-hub

# 检查 DNS 解析
nslookup api.yourdomain.com

# 检查 cert-manager 证书
kubectl get certificate -n api-hub
kubectl describe certificate api-hub-tls -n api-hub
```

## 🗑️ 清理资源

```bash
# 删除所有资源
kubectl delete -f .

# 或者删除整个命名空间
kubectl delete namespace api-hub
```

## 📚 更多资源

- [Kubernetes 官方文档](https://kubernetes.io/docs/)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
- [cert-manager](https://cert-manager.io/docs/)
- [Prisma 文档](https://www.prisma.io/docs/)
