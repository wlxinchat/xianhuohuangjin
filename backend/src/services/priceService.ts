import axios from 'axios';
import { PriceData } from '../types';

/**
 * 价格数据服务
 */
export class PriceService {
  private priceHistory: PriceData[] = [];
  private readonly maxHistoryLength = 200; // 保留最近200条数据

  /**
   * 获取实时黄金价格
   * 使用多个免费API作为备选
   */
  async fetchGoldPrice(): Promise<PriceData | null> {
    try {
      // 方案1: 使用 metals-api.com (免费版有限制)
      // 方案2: 使用 goldapi.io
      // 方案3: 模拟数据用于演示

      // 这里使用模拟数据，实际使用时替换为真实API
      const simulatedPrice = await this.generateSimulatedPrice();

      // 添加到历史记录
      this.addToHistory(simulatedPrice);

      return simulatedPrice;
    } catch (error) {
      console.error('获取黄金价格失败:', error);
      return null;
    }
  }

  /**
   * 生成模拟价格数据 (用于演示)
   * 实际使用时应替换为真实API调用
   */
  private async generateSimulatedPrice(): Promise<PriceData> {
    const basePrice = 2000; // 基准价格 $2000/盎司
    const now = Date.now();

    // 获取上一个价格
    const lastPrice = this.priceHistory.length > 0
      ? this.priceHistory[this.priceHistory.length - 1].close
      : basePrice;

    // 模拟价格波动 (-0.5% 到 +0.5%)
    const volatility = 0.005;
    const change = (Math.random() - 0.5) * 2 * volatility * lastPrice;
    const newPrice = lastPrice + change;

    // 模拟日内波动
    const highLowRange = Math.abs(change) * (1 + Math.random());

    return {
      timestamp: now,
      price: newPrice,
      open: lastPrice,
      high: Math.max(newPrice, lastPrice) + highLowRange / 2,
      low: Math.min(newPrice, lastPrice) - highLowRange / 2,
      close: newPrice,
      volume: Math.floor(Math.random() * 10000) + 5000
    };
  }

  /**
   * 使用真实API获取黄金价格 (需要API密钥)
   */
  private async fetchFromGoldAPI(): Promise<PriceData | null> {
    try {
      const apiKey = process.env.GOLD_API_KEY;
      if (!apiKey) {
        throw new Error('API密钥未配置');
      }

      // 示例: GoldAPI.io
      const response = await axios.get('https://www.goldapi.io/api/XAU/USD', {
        headers: {
          'x-access-token': apiKey
        }
      });

      const data = response.data;
      const now = Date.now();

      return {
        timestamp: now,
        price: data.price,
        open: data.open_price || data.price,
        high: data.high_price || data.price,
        low: data.low_price || data.price,
        close: data.price,
        volume: 0
      };
    } catch (error) {
      console.error('GoldAPI调用失败:', error);
      return null;
    }
  }

  /**
   * 添加价格到历史记录
   */
  private addToHistory(priceData: PriceData): void {
    this.priceHistory.push(priceData);

    // 保持历史记录在最大长度内
    if (this.priceHistory.length > this.maxHistoryLength) {
      this.priceHistory.shift();
    }
  }

  /**
   * 获取价格历史
   */
  getPriceHistory(): PriceData[] {
    return [...this.priceHistory];
  }

  /**
   * 获取最新价格
   */
  getLatestPrice(): PriceData | null {
    if (this.priceHistory.length === 0) {
      return null;
    }
    return this.priceHistory[this.priceHistory.length - 1];
  }

  /**
   * 获取指定数量的最近价格
   */
  getRecentPrices(count: number): PriceData[] {
    return this.priceHistory.slice(-count);
  }
}

// 导出单例
export const priceService = new PriceService();
