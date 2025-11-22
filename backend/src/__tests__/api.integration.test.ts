import request from 'supertest';
import express from 'express';
import cors from 'cors';
import apiRoutes from '../routes/api';
import { priceService } from '../services/priceService';

// 创建测试应用
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

describe('API Integration Tests', () => {
  beforeAll(async () => {
    // 初始化测试数据
    for (let i = 0; i < 100; i++) {
      await priceService.fetchGoldPrice();
    }
  });

  describe('GET /api/health', () => {
    test('should return健康状态', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('API 运行正常');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/market/latest', () => {
    test('should return latest market data', async () => {
      const response = await request(app)
        .get('/api/market/latest')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('price');
      expect(response.body.data).toHaveProperty('indicators');
      expect(response.body.data).toHaveProperty('signal');
    });

    test('should include valid price data', async () => {
      const response = await request(app).get('/api/market/latest');

      const { price } = response.body.data;
      expect(price).toHaveProperty('timestamp');
      expect(price).toHaveProperty('price');
      expect(price).toHaveProperty('open');
      expect(price).toHaveProperty('high');
      expect(price).toHaveProperty('low');
      expect(price).toHaveProperty('close');
    });

    test('should include valid technical indicators', async () => {
      const response = await request(app).get('/api/market/latest');

      const { indicators } = response.body.data;
      expect(indicators).toHaveProperty('sma20');
      expect(indicators).toHaveProperty('sma50');
      expect(indicators).toHaveProperty('rsi');
      expect(indicators).toHaveProperty('macd');
      expect(indicators).toHaveProperty('atr');
    });

    test('should include valid trading signal', async () => {
      const response = await request(app).get('/api/market/latest');

      const { signal } = response.body.data;
      expect(signal).toHaveProperty('signal');
      expect(signal).toHaveProperty('confidence');
      expect(signal).toHaveProperty('reasons');
      expect(signal).toHaveProperty('currentPrice');
      expect(['BUY', 'SELL', 'HOLD']).toContain(signal.signal);
      expect(signal.confidence).toBeGreaterThanOrEqual(0);
      expect(signal.confidence).toBeLessThanOrEqual(100);
    });
  });

  describe('GET /api/market/history', () => {
    test('should return price history', async () => {
      const response = await request(app)
        .get('/api/market/history')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('should respect limit parameter', async () => {
      const limit = 10;
      const response = await request(app)
        .get(`/api/market/history?limit=${limit}`)
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(limit);
    });

    test('should return array of price data', async () => {
      const response = await request(app).get('/api/market/history?limit=5');

      response.body.data.forEach((item: any) => {
        expect(item).toHaveProperty('timestamp');
        expect(item).toHaveProperty('price');
        expect(item).toHaveProperty('close');
      });
    });
  });

  describe('GET /api/market/indicators', () => {
    test('should return technical indicators', async () => {
      const response = await request(app)
        .get('/api/market/indicators')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('sma20');
      expect(response.body.data).toHaveProperty('rsi');
      expect(response.body.data).toHaveProperty('macd');
      expect(response.body.data).toHaveProperty('atr');
    });
  });

  describe('GET /api/market/signal', () => {
    test('should return trading signal', async () => {
      const response = await request(app)
        .get('/api/market/signal')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('signal');
      expect(response.body.data).toHaveProperty('confidence');
      expect(response.body.data).toHaveProperty('reasons');
    });

    test('should include stop loss and take profit', async () => {
      const response = await request(app).get('/api/market/signal');

      const signal = response.body.data;
      if (signal.signal !== 'HOLD') {
        expect(signal).toHaveProperty('stopLoss');
        expect(signal).toHaveProperty('takeProfit');
      }
    });
  });

  describe('GET /api/market/analysis', () => {
    test('should return market analysis', async () => {
      const response = await request(app)
        .get('/api/market/analysis')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('trend');
      expect(response.body.data).toHaveProperty('strength');
      expect(response.body.data).toHaveProperty('volatility');
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for unknown endpoint', async () => {
      const response = await request(app)
        .get('/api/unknown')
        .expect(404);
    });

    test('should handle invalid limit parameter', async () => {
      const response = await request(app)
        .get('/api/market/history?limit=invalid');

      // 应该使用默认值
      expect(response.status).toBe(200);
    });
  });

  describe('Response Format', () => {
    test('all successful responses should have success: true', async () => {
      const endpoints = [
        '/api/health',
        '/api/market/latest',
        '/api/market/history',
        '/api/market/indicators',
        '/api/market/signal',
        '/api/market/analysis'
      ];

      for (const endpoint of endpoints) {
        const response = await request(app).get(endpoint);
        expect(response.body).toHaveProperty('success', true);
      }
    });

    test('all market endpoints should return JSON', async () => {
      const response = await request(app).get('/api/market/latest');
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });
});
