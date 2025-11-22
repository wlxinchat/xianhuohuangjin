# 本地部署指南

本文档详细介绍如何在您的本地环境部署现货黄金交易监控系统。

---

## 📋 目录

- [环境要求](#环境要求)
- [方式一: 标准部署](#方式一-标准部署)
- [方式二: Docker部署](#方式二-docker部署)
- [配置说明](#配置说明)
- [常见问题](#常见问题)
- [卸载指南](#卸载指南)

---

## 🔧 环境要求

### 必需软件

| 软件 | 版本要求 | 说明 |
|------|---------|------|
| **Node.js** | ≥18.x | 推荐 18.x 或 20.x LTS |
| **npm** | ≥9.x | 随Node.js安装 |
| **Git** | ≥2.x | 用于克隆代码 |

### 可选软件（Docker部署）

| 软件 | 版本要求 | 说明 |
|------|---------|------|
| **Docker** | ≥20.x | 容器化部署 |
| **Docker Compose** | ≥2.x | 多容器编排 |

### 操作系统支持

- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu 20.04+, CentOS 7+)

---

## 🚀 方式一: 标准部署

### 步骤1: 克隆代码

```bash
# 克隆仓库
git clone https://github.com/你的用户名/xianhuohuangjin.git

# 进入项目目录
cd xianhuohuangjin
```

### 步骤2: 安装后端依赖

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 构建TypeScript代码
npm run build
```

### 步骤3: 安装前端依赖

```bash
# 回到项目根目录
cd ..

# 进入前端目录
cd frontend

# 安装依赖
npm install

# 构建生产版本
npm run build
```

### 步骤4: 配置环境变量

#### 后端配置

创建 `backend/.env` 文件：

```bash
# 服务端口
PORT=3012

# 运行环境
NODE_ENV=production

# 数据更新间隔（毫秒）
UPDATE_INTERVAL=10000

# WebSocket配置
WS_PORT=3012
```

#### 前端配置

创建 `frontend/.env` 文件：

```bash
# API地址
VITE_API_URL=http://localhost:3012/api

# WebSocket地址
VITE_WS_URL=ws://localhost:3012
```

### 步骤5: 启动服务

#### 方式A: 开发模式（推荐用于测试）

**终端1 - 启动后端**:
```bash
cd backend
npm run dev
```

**终端2 - 启动前端**:
```bash
cd frontend
npm run dev
```

访问地址：
- 前端: http://localhost:5173/
- 后端API: http://localhost:3012/api

#### 方式B: 生产模式

**终端1 - 启动后端**:
```bash
cd backend
npm start
```

**终端2 - 启动前端**:
```bash
cd frontend
npm run build
npx vite preview --port 3011
```

访问地址：
- 前端: http://localhost:3011/
- 后端API: http://localhost:3012/api

### 步骤6: 验证部署

打开浏览器访问前端地址，您应该看到：
- ✅ 实时价格更新
- ✅ 技术指标显示
- ✅ 交易信号推荐
- ✅ 价格走势图

---

## 🐳 方式二: Docker部署

### 前提条件

确保已安装 Docker 和 Docker Compose：

```bash
# 检查Docker版本
docker --version

# 检查Docker Compose版本
docker compose version
```

### 步骤1: 克隆代码

```bash
git clone https://github.com/你的用户名/xianhuohuangjin.git
cd xianhuohuangjin
```

### 步骤2: 构建并启动

```bash
# 构建并启动所有服务
docker compose up -d

# 查看日志
docker compose logs -f

# 查看服务状态
docker compose ps
```

### 步骤3: 访问应用

- 前端: http://localhost:3011/
- 后端API: http://localhost:3012/api
- 健康检查: http://localhost:3012/api/health

### Docker常用命令

```bash
# 停止服务
docker compose down

# 重启服务
docker compose restart

# 查看日志
docker compose logs -f backend
docker compose logs -f frontend

# 重新构建并启动
docker compose up -d --build

# 清理所有容器和镜像
docker compose down -v --rmi all
```

---

## ⚙️ 配置说明

### 后端配置项

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `PORT` | 3012 | 后端服务端口 |
| `NODE_ENV` | development | 运行环境 |
| `UPDATE_INTERVAL` | 10000 | 价格更新间隔(毫秒) |

### 前端配置项

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `VITE_API_URL` | http://localhost:3012/api | 后端API地址 |
| `VITE_WS_URL` | ws://localhost:3012 | WebSocket地址 |

### 端口配置

系统默认使用以下端口：

| 服务 | 端口 | 协议 |
|------|------|------|
| 前端 | 3011 | HTTP |
| 后端API | 3012 | HTTP |
| WebSocket | 3012 | WS |

**如需修改端口**:

1. 修改 `backend/.env` 中的 `PORT`
2. 修改 `frontend/.env` 中的 `VITE_API_URL` 和 `VITE_WS_URL`
3. 修改 `docker-compose.yml` 中的端口映射（Docker部署）

---

## 🎯 使用脚本快速部署

### Linux/macOS快速启动脚本

创建 `start.sh`:

```bash
#!/bin/bash

echo "🚀 启动现货黄金交易监控系统..."

# 启动后端
echo "📡 启动后端服务..."
cd backend
npm start &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 启动前端
echo "🎨 启动前端服务..."
cd ../frontend
npx vite preview --port 3011 &
FRONTEND_PID=$!

echo "✅ 服务启动成功！"
echo "前端: http://localhost:3011/"
echo "后端: http://localhost:3012/api"
echo ""
echo "按 Ctrl+C 停止服务"

# 保存PID
echo $BACKEND_PID > ../backend.pid
echo $FRONTEND_PID > ../frontend.pid

# 等待
wait
```

使用方法：
```bash
chmod +x start.sh
./start.sh
```

### Windows快速启动脚本

创建 `start.bat`:

```batch
@echo off
echo 🚀 启动现货黄金交易监控系统...

echo 📡 启动后端服务...
start "Backend" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak

echo 🎨 启动前端服务...
start "Frontend" cmd /k "cd frontend && npx vite preview --port 3011"

echo ✅ 服务启动成功！
echo 前端: http://localhost:3011/
echo 后端: http://localhost:3012/api
```

使用方法：双击 `start.bat`

---

## 🛠️ 常见问题

### Q1: 端口已被占用

**错误信息**: `Error: listen EADDRINUSE: address already in use :::3012`

**解决方案**:

```bash
# Linux/macOS - 查找占用端口的进程
lsof -i :3012
kill -9 <PID>

# Windows - 查找占用端口的进程
netstat -ano | findstr :3012
taskkill /PID <PID> /F

# 或者修改端口配置
# 编辑 backend/.env 和 frontend/.env
```

### Q2: npm install 失败

**错误信息**: `npm ERR! network` 或超时

**解决方案**:

```bash
# 方案1: 使用国内镜像源
npm config set registry https://registry.npmmirror.com

# 方案2: 清除缓存重试
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# 方案3: 使用yarn替代
npm install -g yarn
yarn install
```

### Q3: 前端页面空白

**可能原因**:
1. 后端未启动
2. API地址配置错误
3. 浏览器缓存问题

**解决方案**:

```bash
# 1. 检查后端是否运行
curl http://localhost:3012/api/health

# 2. 检查前端配置
cat frontend/.env

# 3. 清除浏览器缓存
# Chrome: Ctrl+Shift+Delete
# 或使用无痕模式访问
```

### Q4: WebSocket连接失败

**错误信息**: `WebSocket connection failed`

**解决方案**:

```bash
# 1. 确认后端WebSocket服务已启动
# 查看后端日志应该有: "WebSocket 服务器已启动"

# 2. 检查防火墙设置
# Windows: 允许端口3012
# Linux: sudo ufw allow 3012

# 3. 检查前端WS配置
# frontend/.env 中的 VITE_WS_URL
```

### Q5: Docker构建失败

**错误信息**: `Error response from daemon`

**解决方案**:

```bash
# 1. 检查Docker是否运行
docker ps

# 2. 清理Docker缓存
docker system prune -a

# 3. 重新构建
docker compose build --no-cache
docker compose up -d

# 4. 查看详细错误
docker compose logs backend
docker compose logs frontend
```

### Q6: 构建很慢

**解决方案**:

```bash
# 1. 使用npm镜像源
npm config set registry https://registry.npmmirror.com

# 2. 使用Docker镜像加速
# 编辑 /etc/docker/daemon.json (Linux)
# C:\ProgramData\docker\config\daemon.json (Windows)
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com"
  ]
}

# 重启Docker
sudo systemctl restart docker  # Linux
# Windows: 右键Docker图标 -> Restart
```

---

## 🔍 验证部署成功

### 检查清单

运行以下命令验证：

```bash
# 1. 检查后端健康状态
curl http://localhost:3012/api/health

# 应返回:
# {"success":true,"message":"API 运行正常","timestamp":"..."}

# 2. 检查市场数据
curl http://localhost:3012/api/market/latest

# 应返回包含价格、指标、信号的JSON数据

# 3. 检查前端
curl -I http://localhost:3011/

# 应返回: HTTP/1.1 200 OK

# 4. 检查WebSocket (使用wscat)
npm install -g wscat
wscat -c ws://localhost:3012

# 应该连接成功并接收到价格更新消息
```

### 功能测试

1. **实时价格更新**: 打开前端，观察价格每10秒更新
2. **技术指标**: 查看SMA、RSI、MACD、ATR显示
3. **交易信号**: 查看BUY/SELL/HOLD信号推荐
4. **价格图表**: 查看K线图是否正常显示

---

## 🧹 卸载指南

### 标准部署卸载

```bash
# 1. 停止所有Node进程
pkill -f "node"

# 2. 删除项目文件
cd ..
rm -rf xianhuohuangjin

# 3. (可选) 卸载Node.js
# macOS: brew uninstall node
# Windows: 控制面板 -> 卸载程序
# Linux: sudo apt remove nodejs npm
```

### Docker部署卸载

```bash
# 1. 停止并删除容器
docker compose down -v

# 2. 删除镜像
docker rmi gold-trading-backend gold-trading-frontend

# 3. 删除项目文件
cd ..
rm -rf xianhuohuangjin

# 4. (可选) 清理Docker
docker system prune -a --volumes
```

---

## 📚 更多资源

- [快速开始指南](./QUICKSTART.md)
- [API文档](./API.md)
- [测试指南](./TESTING.md)
- [项目README](./README.md)

---

## 💡 性能优化建议

### 生产环境优化

1. **使用PM2管理进程**:
```bash
npm install -g pm2

# 启动后端
cd backend
pm2 start npm --name "gold-backend" -- start

# 启动前端（Nginx推荐）
pm2 start npx --name "gold-frontend" -- vite preview --port 3011

# 保存配置
pm2 save
pm2 startup
```

2. **使用Nginx反向代理**:
```nginx
# /etc/nginx/sites-available/gold-trading
server {
    listen 80;
    server_name your-domain.com;

    # 前端
    location / {
        proxy_pass http://localhost:3011;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 后端API
    location /api {
        proxy_pass http://localhost:3012;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # WebSocket
    location /ws {
        proxy_pass http://localhost:3012;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

3. **启用HTTPS**:
```bash
# 使用Let's Encrypt
sudo certbot --nginx -d your-domain.com
```

---

## 🆘 获取帮助

如果遇到问题：

1. 查看 [常见问题](#常见问题) 部分
2. 检查 [GitHub Issues](https://github.com/你的用户名/xianhuohuangjin/issues)
3. 查看服务日志获取错误详情

**日志位置**:
- 后端日志: 终端输出或使用 `pm2 logs gold-backend`
- 前端日志: 浏览器开发者工具 Console
- Docker日志: `docker compose logs -f`

---

**祝您部署成功！** 🎉

如有任何问题，欢迎提Issue或联系维护人员。
