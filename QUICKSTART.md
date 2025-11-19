# 快速开始指南

## 方式一：Docker 部署（推荐）

### 1. 一键启动
```bash
chmod +x docker-start.sh
./docker-start.sh
```

### 2. 访问应用
- **前端应用**: http://localhost:3011
- **后端API**: http://localhost:3012
- **WebSocket**: ws://localhost:3012

详细说明：[DOCKER.md](DOCKER.md)

---

## 方式二：本地开发

### 1. 首次安装
```bash
chmod +x setup.sh start.sh
./setup.sh
```

### 2. 启动系统
```bash
./start.sh
```

或手动启动：

```bash
# 终端1 - 启动后端
cd backend
npm run dev

# 终端2 - 启动前端
cd frontend
npm run dev
```

## 访问地址

- **前端应用**: http://localhost:3011
- **后端API**: http://localhost:3012
- **WebSocket**: ws://localhost:3012

## API 测试

### 获取最新市场数据
```bash
curl http://localhost:3012/api/market/latest
```

### 获取价格历史
```bash
curl http://localhost:3012/api/market/history?limit=50
```

### 获取交易信号
```bash
curl http://localhost:3012/api/market/signal
```

### 健康检查
```bash
curl http://localhost:3012/api/health
```

## 环境变量配置

### 后端 (backend/.env)
```env
PORT=3012
GOLD_API_KEY=your_api_key_here
UPDATE_INTERVAL=10000
```

### 前端 (frontend/.env)
```env
VITE_WS_URL=ws://localhost:3012
VITE_API_URL=http://localhost:3012/api
```

## 常见问题

### Q: 端口被占用怎么办？
A: 修改 backend/.env 中的 PORT，同时修改 frontend/.env 中的 VITE_WS_URL 和 VITE_API_URL

### Q: WebSocket 连接失败？
A: 确保后端服务已启动，检查防火墙设置

### Q: 前端无法连接后端？
A: 检查 CORS 配置，确保前端和后端端口配置正确

### Q: Docker 容器无法启动？
A: 检查 Docker 和 Docker Compose 是否正确安装，端口是否被占用

## 生产部署

### 使用 Docker（推荐）
```bash
docker-compose up -d
```

### 手动构建
```bash
# 构建后端
cd backend
npm run build
npm start

# 构建前端
cd frontend
npm run build
# 生成的文件在 dist/ 目录
```

## 开发建议

### 修改数据更新频率
编辑 `backend/.env`:
```env
UPDATE_INTERVAL=5000  # 5秒更新一次
```

### 接入真实API
编辑 `backend/src/services/priceService.ts`，取消注释 `fetchFromGoldAPI` 方法并配置 API 密钥。

### 自定义交易策略
编辑 `backend/src/analysis/signalGenerator.ts`，调整评分权重和判断逻辑。

## 技术支持

如遇问题，请查看：
- [README.md](README.md) - 完整文档
- [DOCKER.md](DOCKER.md) - Docker 部署指南
- [API.md](API.md) - API 文档
- GitHub Issues - 问题反馈
