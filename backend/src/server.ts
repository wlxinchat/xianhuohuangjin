import express from 'express';
import cors from 'cors';
import http from 'http';
import cron from 'node-cron';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import { wsManager } from './websocket';
import { priceService } from './services/priceService';
import { signalGenerator } from './analysis/signalGenerator';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3012;

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api', apiRoutes);

// 创建 HTTP 服务器
const server = http.createServer(app);

// 初始化 WebSocket
wsManager.initialize(server);

// 定时更新价格数据并推送
const updateInterval = parseInt(process.env.UPDATE_INTERVAL || '10000'); // 默认10秒

/**
 * 更新市场数据并广播
 */
async function updateAndBroadcast() {
  try {
    // 获取最新价格
    const latestPrice = await priceService.fetchGoldPrice();

    if (!latestPrice) {
      console.error('获取价格失败');
      return;
    }

    // 获取历史数据
    const priceHistory = priceService.getPriceHistory();

    // 计算技术指标
    const indicators = signalGenerator.calculateIndicators(priceHistory);

    // 生成交易信号
    const signal = signalGenerator.generateSignal(priceHistory, indicators);

    // 广播数据
    wsManager.broadcastMarketData({
      price: latestPrice,
      indicators,
      signal
    });

    console.log(`[${new Date().toLocaleTimeString()}] 价格更新: $${latestPrice.close.toFixed(2)}, 信号: ${signal.signal}, 置信度: ${signal.confidence}%`);
  } catch (error) {
    console.error('更新市场数据失败:', error);
    wsManager.broadcastError('数据更新失败');
  }
}

// 启动定时任务
let updateTask: cron.ScheduledTask;

function startPriceUpdates() {
  // 立即执行一次更新
  updateAndBroadcast();

  // 使用 node-cron 定时更新
  // 每隔指定秒数更新一次
  const cronExpression = `*/${Math.floor(updateInterval / 1000)} * * * * *`;

  updateTask = cron.schedule(cronExpression, () => {
    updateAndBroadcast();
  });

  console.log(`价格更新任务已启动，更新间隔: ${updateInterval}ms`);
}

// 初始化数据
async function initializeData() {
  console.log('正在初始化历史数据...');

  // 生成初始历史数据(用于演示)
  for (let i = 0; i < 100; i++) {
    await priceService.fetchGoldPrice();
    // 短暂延迟以模拟时间序列
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  console.log('历史数据初始化完成');
}

// 启动服务器
async function startServer() {
  try {
    // 初始化数据
    await initializeData();

    // 启动价格更新任务
    startPriceUpdates();

    // 启动 HTTP 服务器
    server.listen(PORT, () => {
      console.log('=================================');
      console.log('🚀 黄金交易监控系统后端服务已启动');
      console.log(`📡 HTTP API: http://localhost:${PORT}`);
      console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
      console.log(`👥 当前连接数: ${wsManager.getClientCount()}`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n正在关闭服务器...');

  if (updateTask) {
    updateTask.stop();
  }

  wsManager.close();

  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});

// 启动
startServer();
