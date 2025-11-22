# API 文档

## REST API

### 基础信息
- **Base URL**: `http://localhost:3001/api`
- **Content-Type**: `application/json`

---

## 端点列表

### 1. 健康检查

**端点**: `GET /health`

**描述**: 检查 API 服务状态

**响应示例**:
```json
{
  "success": true,
  "message": "API 运行正常",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 2. 获取最新市场数据

**端点**: `GET /market/latest`

**描述**: 获取最新的价格、技术指标和交易信号

**响应示例**:
```json
{
  "success": true,
  "data": {
    "price": {
      "timestamp": 1704067200000,
      "price": 2000.50,
      "open": 2000.00,
      "high": 2005.00,
      "low": 1995.00,
      "close": 2000.50,
      "volume": 5000
    },
    "indicators": {
      "sma20": 1998.25,
      "sma50": 1995.50,
      "rsi": 55.5,
      "macd": {
        "macd": 2.5,
        "signal": 2.0,
        "histogram": 0.5
      },
      "atr": 15.25
    },
    "signal": {
      "signal": "BUY",
      "confidence": 75,
      "reasons": [
        "价格位于短期均线上方，呈上升趋势",
        "RSI处于中性区域",
        "MACD金叉且位于零轴上方，多头趋势"
      ],
      "stopLoss": 1969.75,
      "takeProfit": 2046.25,
      "currentPrice": 2000.50,
      "timestamp": 1704067200000
    }
  }
}
```

---

### 3. 获取价格历史

**端点**: `GET /market/history`

**描述**: 获取历史价格数据

**查询参数**:
- `limit` (可选): 返回的数据条数，默认 100

**请求示例**:
```
GET /market/history?limit=50
```

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "timestamp": 1704067200000,
      "price": 2000.50,
      "open": 2000.00,
      "high": 2005.00,
      "low": 1995.00,
      "close": 2000.50,
      "volume": 5000
    }
    // ... 更多历史数据
  ]
}
```

---

### 4. 获取技术指标

**端点**: `GET /market/indicators`

**描述**: 获取当前技术指标

**响应示例**:
```json
{
  "success": true,
  "data": {
    "sma20": 1998.25,
    "sma50": 1995.50,
    "rsi": 55.5,
    "macd": {
      "macd": 2.5,
      "signal": 2.0,
      "histogram": 0.5
    },
    "atr": 15.25
  }
}
```

---

### 5. 获取交易信号

**端点**: `GET /market/signal`

**描述**: 获取当前交易建议

**响应示例**:
```json
{
  "success": true,
  "data": {
    "signal": "BUY",
    "confidence": 75,
    "reasons": [
      "价格位于短期均线上方，呈上升趋势",
      "RSI处于中性区域"
    ],
    "stopLoss": 1969.75,
    "takeProfit": 2046.25,
    "currentPrice": 2000.50,
    "timestamp": 1704067200000
  }
}
```

**信号类型**:
- `BUY`: 买入信号
- `SELL`: 卖出信号
- `HOLD`: 持仓观望

---

### 6. 获取市场分析

**端点**: `GET /market/analysis`

**描述**: 获取市场状态分析

**响应示例**:
```json
{
  "success": true,
  "data": {
    "trend": "上升",
    "strength": "强",
    "volatility": "正常"
  }
}
```

---

## WebSocket API

### 连接地址
```
ws://localhost:3001
```

### 消息格式

#### 1. 连接确认
**接收**:
```json
{
  "type": "connected",
  "message": "已连接到黄金交易监控系统"
}
```

#### 2. 市场数据更新
**接收**:
```json
{
  "type": "marketData",
  "data": {
    "price": { ... },
    "indicators": { ... },
    "signal": { ... }
  }
}
```

#### 3. 错误消息
**接收**:
```json
{
  "type": "error",
  "message": "错误描述"
}
```

#### 4. Ping/Pong
**发送**:
```json
{
  "type": "ping"
}
```

**接收**:
```json
{
  "type": "pong"
}
```

---

## 错误响应

所有错误响应格式：
```json
{
  "success": false,
  "message": "错误描述"
}
```

### HTTP 状态码
- `200`: 成功
- `404`: 未找到资源
- `500`: 服务器错误

---

## 数据更新频率

- REST API: 按需请求
- WebSocket: 默认每 10 秒推送一次（可通过环境变量配置）

---

## 使用示例

### JavaScript/TypeScript
```typescript
// REST API
const response = await fetch('http://localhost:3001/api/market/latest');
const data = await response.json();

// WebSocket
const ws = new WebSocket('ws://localhost:3001');
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log(message);
};
```

### Python
```python
import requests

# REST API
response = requests.get('http://localhost:3001/api/market/latest')
data = response.json()

# WebSocket
import websocket
ws = websocket.WebSocket()
ws.connect('ws://localhost:3001')
```

### curl
```bash
# 获取最新数据
curl http://localhost:3001/api/market/latest | jq

# 获取历史数据
curl "http://localhost:3001/api/market/history?limit=50" | jq

# 获取交易信号
curl http://localhost:3001/api/market/signal | jq
```

---

## 注意事项

1. 当前版本使用模拟数据，实际部署需接入真实 API
2. WebSocket 会自动重连，最多重试 5 次
3. 数据更新频率可通过 `UPDATE_INTERVAL` 环境变量配置
4. 历史数据最多保留 200 条记录
