# Docker 部署指南

本文档介绍如何使用 Docker 部署现货黄金交易监控系统。

## 📋 前置要求

- Docker >= 20.10.0
- Docker Compose >= 2.0.0

## 🚀 快速开始

### 方式一：一键启动（推荐）

```bash
chmod +x docker-start.sh
./docker-start.sh
```

### 方式二：手动启动

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

## 📦 服务架构

系统包含两个服务：

| 服务 | 端口 | 说明 |
|------|------|------|
| backend | 3012 | 后端 API + WebSocket |
| frontend | 3011 | 前端应用 (Nginx) |

## 🔧 配置说明

### 环境变量

#### 后端环境变量 (docker-compose.yml)

```yaml
environment:
  - PORT=3012
  - NODE_ENV=production
  - UPDATE_INTERVAL=10000
  - GOLD_API_KEY=your_api_key_here  # 可选
```

#### 前端环境变量 (docker-compose.yml)

```yaml
environment:
  - VITE_WS_URL=ws://localhost:3012
  - VITE_API_URL=http://localhost:3012/api
```

### 端口配置

如需修改端口，编辑 `docker-compose.yml`：

```yaml
services:
  backend:
    ports:
      - "自定义端口:3012"

  frontend:
    ports:
      - "自定义端口:3011"
```

## 📊 容器管理

### 启动服务

```bash
docker-compose up -d
```

### 停止服务

```bash
docker-compose down
```

### 重启服务

```bash
docker-compose restart
```

### 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看后端日志
docker-compose logs -f backend

# 查看前端日志
docker-compose logs -f frontend
```

### 查看服务状态

```bash
docker-compose ps
```

### 进入容器

```bash
# 进入后端容器
docker-compose exec backend sh

# 进入前端容器
docker-compose exec frontend sh
```

## 🔍 健康检查

系统内置健康检查：

**后端健康检查：**
```bash
curl http://localhost:3012/api/health
```

**前端健康检查：**
```bash
curl http://localhost:3011/
```

**Docker 健康检查：**
```bash
docker-compose ps
```

## 🐛 故障排查

### 1. 容器无法启动

```bash
# 查看详细日志
docker-compose logs

# 检查端口占用
lsof -i :3011
lsof -i :3012
```

### 2. 后端连接失败

```bash
# 检查后端服务
docker-compose logs backend

# 进入后端容器检查
docker-compose exec backend sh
```

### 3. 前端无法访问后端

检查 `frontend/nginx.conf` 中的代理配置：

```nginx
location /api {
    proxy_pass http://backend:3012;
    # ...
}
```

### 4. WebSocket 连接失败

检查 nginx 配置中的 WebSocket 代理：

```nginx
location /ws {
    proxy_pass http://backend:3012;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    # ...
}
```

### 5. 重新构建镜像

```bash
# 清理并重新构建
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 📈 性能优化

### 1. 多阶段构建

Dockerfile 已使用多阶段构建优化镜像大小：

```dockerfile
FROM node:18-alpine AS builder
# 构建阶段

FROM node:18-alpine
# 运行阶段
```

### 2. 镜像缓存

合理利用 Docker 缓存层：

```bash
# 仅重新构建有变化的服务
docker-compose build backend
docker-compose build frontend
```

### 3. 资源限制

编辑 `docker-compose.yml` 添加资源限制：

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## 🔐 安全建议

### 1. 使用环境变量文件

创建 `.env` 文件（不要提交到 Git）：

```env
# .env
BACKEND_PORT=3012
FRONTEND_PORT=3011
GOLD_API_KEY=your_secret_key
```

修改 `docker-compose.yml`：

```yaml
services:
  backend:
    env_file:
      - .env
```

### 2. 非 root 用户

Dockerfile 已配置非 root 用户运行：

```dockerfile
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs
```

### 3. 最小化镜像

使用 Alpine Linux 基础镜像：

```dockerfile
FROM node:18-alpine
```

## 📦 数据持久化

如需持久化数据，添加数据卷：

```yaml
services:
  backend:
    volumes:
      - gold-data:/app/data

volumes:
  gold-data:
```

## 🌐 生产部署

### 1. 使用反向代理

推荐使用 Nginx 或 Traefik 作为反向代理：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3011;
    }

    location /api {
        proxy_pass http://localhost:3012;
    }
}
```

### 2. HTTPS 配置

使用 Let's Encrypt：

```bash
# 安装 certbot
apt-get install certbot python3-certbot-nginx

# 获取证书
certbot --nginx -d your-domain.com
```

### 3. 监控和日志

集成 Prometheus 和 Grafana：

```yaml
services:
  prometheus:
    image: prom/prometheus
    # ...

  grafana:
    image: grafana/grafana
    # ...
```

## 🔄 更新部署

```bash
# 拉取最新代码
git pull

# 重新构建并启动
docker-compose down
docker-compose build
docker-compose up -d
```

## 📝 常用命令速查

| 操作 | 命令 |
|------|------|
| 启动 | `docker-compose up -d` |
| 停止 | `docker-compose down` |
| 重启 | `docker-compose restart` |
| 日志 | `docker-compose logs -f` |
| 状态 | `docker-compose ps` |
| 构建 | `docker-compose build` |
| 清理 | `docker-compose down -v` |

## 🆘 获取帮助

- 查看 README.md
- 查看 QUICKSTART.md
- 提交 GitHub Issue

---

**祝您部署顺利！** 🎉
