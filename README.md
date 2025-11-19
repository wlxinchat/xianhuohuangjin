# 现货黄金交易监控系统

一个功能完整的现货黄金交易监控系统，提供实时价格监控、技术指标分析和智能交易建议。

## ✨ 功能特点

### 🏆 实时价格监控
- 实时获取黄金价格数据
- WebSocket 实时推送价格更新
- 价格变化趋势展示
- 高低点追踪

### 📈 技术指标分析
- **移动平均线 (SMA 20/50)**: 识别价格趋势
- **相对强弱指数 (RSI)**: 判断超买超卖
- **MACD 指标**: 趋势强度和方向
- **ATR 波动率分析**: 市场波动性评估

### 🤖 智能交易建议
- 基于多重技术指标的综合分析
- 买入/卖出/持仓信号
- 止损止盈位建议
- 信号置信度评估
- 详细的分析依据说明

### 🎨 直观用户界面
- 现代化的暗色主题设计
- 响应式布局，支持移动端
- 实时图表展示
- 专业的金融界面风格

## 🛠 技术架构

### 后端技术栈
- **Node.js + Express**: REST API 服务
- **WebSocket (ws)**: 实时数据推送
- **Node-cron**: 定时数据更新
- **Axios**: HTTP 请求处理
- **TypeScript**: 类型安全

### 前端技术栈
- **React 18 + TypeScript**: 前端框架
- **Vite**: 构建工具
- **Tailwind CSS**: UI 样式框架
- **Chart.js + react-chartjs-2**: 图表绘制
- **WebSocket Client**: 实时通信

### 核心算法
- **多指标综合评分系统**: 趋势分析 + 动量分析 + 波动率分析
- **自适应止损止盈**: 基于 ATR 的动态风险控制
- **信号过滤机制**: 减少噪音信号，提高准确性

## 📁 项目结构

```
xianhuohuangjin/
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── server.ts        # Express 服务器主文件
│   │   ├── websocket.ts     # WebSocket 服务
│   │   ├── indicators/      # 技术指标计算模块
│   │   │   ├── sma.ts       # 移动平均线
│   │   │   ├── rsi.ts       # 相对强弱指数
│   │   │   ├── macd.ts      # MACD 指标
│   │   │   └── atr.ts       # 平均真实波幅
│   │   ├── services/        # 服务层
│   │   │   └── priceService.ts  # 价格数据服务
│   │   ├── analysis/        # 分析引擎
│   │   │   └── signalGenerator.ts  # 交易信号生成
│   │   ├── routes/          # API 路由
│   │   │   └── api.ts
│   │   └── types/           # TypeScript 类型定义
│   │       └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                # 前端应用
│   ├── src/
│   │   ├── components/      # React 组件
│   │   │   ├── Header.tsx
│   │   │   ├── PriceCard.tsx
│   │   │   ├── IndicatorsCard.tsx
│   │   │   ├── SignalCard.tsx
│   │   │   └── PriceChart.tsx
│   │   ├── hooks/           # 自定义 Hooks
│   │   │   └── useWebSocket.ts
│   │   ├── services/        # 服务层
│   │   │   └── websocket.ts
│   │   ├── types/           # TypeScript 类型
│   │   │   └── index.ts
│   │   ├── styles/          # 样式文件
│   │   │   └── index.css
│   │   ├── App.tsx          # 主应用组件
│   │   └── main.tsx         # 入口文件
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
│
└── README.md
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd xianhuohuangjin
```

2. **安装后端依赖**
```bash
cd backend
npm install
```

3. **配置后端环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，配置必要的参数
```

4. **安装前端依赖**
```bash
cd ../frontend
npm install
```

5. **配置前端环境变量**
```bash
cp .env.example .env
# 如使用默认配置可跳过此步
```

### 运行项目

#### 开发模式

**启动后端服务:**
```bash
cd backend
npm run dev
```
后端服务将在 `http://localhost:3001` 启动

**启动前端应用:**
```bash
cd frontend
npm run dev
```
前端应用将在 `http://localhost:3000` 启动

访问 `http://localhost:3000` 即可看到应用界面

#### 生产模式

**构建后端:**
```bash
cd backend
npm run build
npm start
```

**构建前端:**
```bash
cd frontend
npm run build
npm run preview
```

## 📊 API 接口

### REST API

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/health` | GET | 健康检查 |
| `/api/market/latest` | GET | 获取最新市场数据 |
| `/api/market/history` | GET | 获取价格历史 (支持 limit 参数) |
| `/api/market/indicators` | GET | 获取技术指标 |
| `/api/market/signal` | GET | 获取交易信号 |
| `/api/market/analysis` | GET | 获取市场分析 |

### WebSocket

连接到 `ws://localhost:3001` 接收实时市场数据

**消息类型:**
- `connected`: 连接成功
- `marketData`: 市场数据更新
- `error`: 错误消息

## 🎯 核心功能说明

### 技术指标计算

#### SMA (简单移动平均线)
- 计算周期: 20 和 50
- 用途: 识别价格趋势方向
- 金叉死叉信号判断

#### RSI (相对强弱指数)
- 计算周期: 14
- 超买线: 70
- 超卖线: 30
- 用途: 判断市场超买超卖状态

#### MACD (指数平滑异同移动平均线)
- 快线: 12
- 慢线: 26
- 信号线: 9
- 用途: 判断趋势强度和转折点

#### ATR (平均真实波幅)
- 计算周期: 14
- 用途: 评估市场波动性
- 动态止损止盈计算

### 交易信号生成

系统使用多指标综合评分算法:

1. **趋势分析** (权重 25%)
   - 价格与均线位置关系
   - 均线多头/空头排列

2. **动量分析** (权重 30%)
   - RSI 超买超卖判断
   - 动量强度评估

3. **趋势强度** (权重 25%)
   - MACD 金叉死叉
   - 零轴位置判断

4. **波动率分析** (权重 20%)
   - ATR 波动性评估
   - 风险级别判定

**信号生成规则:**
- 多头得分 ≥ 40: 买入信号
- 空头得分 ≥ 40: 卖出信号
- 其他情况: 持仓观望

### 止损止盈策略

- **止损位**: 当前价格 ± (2 × ATR)
- **止盈位**: 当前价格 ± (3 × ATR)
- 动态调整，适应市场波动

## 🔧 配置说明

### 后端配置 (.env)

```env
PORT=3001                    # 服务器端口
GOLD_API_KEY=your_api_key   # 黄金价格 API 密钥 (可选)
UPDATE_INTERVAL=10000        # 数据更新间隔 (毫秒)
```

### 前端配置 (.env)

```env
VITE_WS_URL=ws://localhost:3001      # WebSocket 地址
VITE_API_URL=http://localhost:3001/api  # API 地址
```

## 📝 开发说明

### 添加新的技术指标

1. 在 `backend/src/indicators/` 目录创建新文件
2. 实现指标计算函数
3. 在 `signalGenerator.ts` 中集成
4. 更新类型定义

### 自定义交易策略

编辑 `backend/src/analysis/signalGenerator.ts` 中的 `generateSignal` 方法，调整评分权重和规则。

### 更换数据源

编辑 `backend/src/services/priceService.ts`，将 `generateSimulatedPrice` 替换为真实 API 调用。

支持的 API:
- GoldAPI.io
- Metals-API.com
- 其他黄金价格 API

## ⚠️ 注意事项

1. **免责声明**: 本系统仅供学习和研究使用，不构成任何投资建议
2. **数据准确性**: 当前使用模拟数据，实际使用需接入真实 API
3. **风险提示**: 投资有风险，决策需谨慎
4. **API 限制**: 使用真实 API 时注意调用频率限制

## 🔮 未来规划

- [ ] 接入真实黄金价格 API
- [ ] 添加更多技术指标 (布林带、KDJ 等)
- [ ] 支持多时间周期分析
- [ ] 历史数据回测功能
- [ ] 交易记录和统计
- [ ] 邮件/短信通知
- [ ] 多语言支持
- [ ] 移动端 App

## 📄 许可证

MIT License

## 👨‍💻 作者

开发者: Claude Code Assistant

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题或建议，请通过 Issue 联系。

---

**祝您交易顺利！💰📈**
