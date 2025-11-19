# 快速开始指南

## 一键启动

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

- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:3001
- **WebSocket**: ws://localhost:3001

## API 测试

### 获取最新市场数据
```bash
curl http://localhost:3001/api/market/latest
```

### 获取价格历史
```bash
curl http://localhost:3001/api/market/history?limit=50
```

### 获取交易信号
```bash
curl http://localhost:3001/api/market/signal
```

### 健康检查
```bash
curl http://localhost:3001/api/health
```

## 环境变量配置

### 后端 (backend/.env)
```env
PORT=3001
GOLD_API_KEY=your_api_key_here
UPDATE_INTERVAL=10000
```

### 前端 (frontend/.env)
```env
VITE_WS_URL=ws://localhost:3001
VITE_API_URL=http://localhost:3001/api
```

## 常见问题

### Q: 端口被占用怎么办？
A: 修改 backend/.env 中的 PORT，同时修改 frontend/.env 中的 VITE_WS_URL 和 VITE_API_URL

### Q: WebSocket 连接失败？
A: 确保后端服务已启动，检查防火墙设置

### Q: 前端无法连接后端？
A: 检查 CORS 配置，确保前端和后端端口配置正确

## 生产部署

### 构建后端
```bash
cd backend
npm run build
npm start
```

### 构建前端
```bash
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

如遇问题，请查看 README.md 或提交 Issue。
