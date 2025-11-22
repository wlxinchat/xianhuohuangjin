import { calculateRSI, interpretRSI } from '../../indicators/rsi';
import { PriceData } from '../../types';

describe('RSI Indicator', () => {
  const generateTrendData = (length: number, trend: 'up' | 'down' | 'neutral'): PriceData[] => {
    const data: PriceData[] = [];
    let price = 100;

    for (let i = 0; i < length; i++) {
      if (trend === 'up') {
        price += Math.random() * 2;
      } else if (trend === 'down') {
        price -= Math.random() * 2;
      } else {
        price += (Math.random() - 0.5) * 2;
      }

      data.push({
        timestamp: Date.now() + i * 1000,
        price,
        open: price,
        high: price + 1,
        low: price - 1,
        close: price
      });
    }

    return data;
  };

  describe('calculateRSI', () => {
    test('should calculate RSI for uptrend data', () => {
      const data = generateTrendData(30, 'up');
      const rsi = calculateRSI(data, 14);

      expect(rsi).not.toBeNull();
      expect(rsi).toBeGreaterThan(50);
      expect(rsi).toBeLessThanOrEqual(100);
    });

    test('should calculate RSI for downtrend data', () => {
      const data = generateTrendData(30, 'down');
      const rsi = calculateRSI(data, 14);

      expect(rsi).not.toBeNull();
      expect(rsi).toBeLessThan(50);
      expect(rsi).toBeGreaterThanOrEqual(0);
    });

    test('should return null when data length is insufficient', () => {
      const data = generateTrendData(10, 'neutral');
      const rsi = calculateRSI(data, 14);

      expect(rsi).toBeNull();
    });

    test('should handle period parameter correctly', () => {
      const data = generateTrendData(50, 'neutral');
      const rsi7 = calculateRSI(data, 7);
      const rsi14 = calculateRSI(data, 14);
      const rsi21 = calculateRSI(data, 21);

      expect(rsi7).not.toBeNull();
      expect(rsi14).not.toBeNull();
      expect(rsi21).not.toBeNull();
    });

    test('should return 100 when all changes are positive', () => {
      const data: PriceData[] = Array.from({ length: 20 }, (_, i) => ({
        timestamp: i,
        price: 100 + i * 2,
        open: 100 + i * 2,
        high: 100 + i * 2 + 1,
        low: 100 + i * 2 - 1,
        close: 100 + i * 2
      }));

      const rsi = calculateRSI(data, 14);

      expect(rsi).toBe(100);
    });

    test('should return value between 0 and 100', () => {
      const data = generateTrendData(50, 'neutral');
      const rsi = calculateRSI(data, 14);

      expect(rsi).toBeGreaterThanOrEqual(0);
      expect(rsi).toBeLessThanOrEqual(100);
    });
  });

  describe('interpretRSI', () => {
    test('should identify overbought condition', () => {
      const result = interpretRSI(75);
      expect(result).toBe('超买区域');
    });

    test('should identify oversold condition', () => {
      const result = interpretRSI(25);
      expect(result).toBe('超卖区域');
    });

    test('should identify strong zone', () => {
      const result = interpretRSI(65);
      expect(result).toBe('强势区域');
    });

    test('should identify weak zone', () => {
      const result = interpretRSI(35);
      expect(result).toBe('弱势区域');
    });

    test('should identify neutral zone', () => {
      const result = interpretRSI(50);
      expect(result).toBe('中性区域');
    });

    test('should handle null input', () => {
      const result = interpretRSI(null);
      expect(result).toBe('数据不足');
    });

    test('should handle boundary values', () => {
      expect(interpretRSI(70)).toBe('超买区域');
      expect(interpretRSI(30)).toBe('超卖区域');
      expect(interpretRSI(60)).toBe('强势区域');
      expect(interpretRSI(40)).toBe('弱势区域');
    });
  });
});
