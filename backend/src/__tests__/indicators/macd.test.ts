import { calculateMACD, interpretMACD } from '../../indicators/macd';
import { PriceData } from '../../types';

describe('MACD Indicator', () => {
  const generateTestData = (length: number, basePrice: number = 100): PriceData[] => {
    return Array.from({ length }, (_, i) => ({
      timestamp: Date.now() + i * 1000,
      price: basePrice + Math.sin(i / 10) * 10,
      open: basePrice + Math.sin(i / 10) * 10,
      high: basePrice + Math.sin(i / 10) * 10 + 1,
      low: basePrice + Math.sin(i / 10) * 10 - 1,
      close: basePrice + Math.sin(i / 10) * 10
    }));
  };

  describe('calculateMACD', () => {
    test('should calculate MACD with default parameters', () => {
      const data = generateTestData(100);
      const result = calculateMACD(data);

      expect(result).toHaveProperty('macd');
      expect(result).toHaveProperty('signal');
      expect(result).toHaveProperty('histogram');
      expect(result.macd).not.toBeNull();
      expect(result.signal).not.toBeNull();
      expect(result.histogram).not.toBeNull();
    });

    test('should return null when data is insufficient', () => {
      const data = generateTestData(30);
      const result = calculateMACD(data);

      expect(result.macd).toBeNull();
      expect(result.signal).toBeNull();
      expect(result.histogram).toBeNull();
    });

    test('should calculate histogram as difference of MACD and signal', () => {
      const data = generateTestData(100);
      const result = calculateMACD(data);

      if (result.macd !== null && result.signal !== null && result.histogram !== null) {
        expect(Math.abs(result.histogram - (result.macd - result.signal))).toBeLessThan(0.0001);
      }
    });

    test('should handle custom parameters', () => {
      const data = generateTestData(100);
      const result = calculateMACD(data, 5, 13, 6);

      expect(result.macd).not.toBeNull();
      expect(result.signal).not.toBeNull();
      expect(result.histogram).not.toBeNull();
    });

    test('should work with minimal valid data', () => {
      const data = generateTestData(36); // 26 + 9 + 1
      const result = calculateMACD(data);

      expect(result.macd).not.toBeNull();
      expect(result.signal).not.toBeNull();
    });

    test('should produce different values for different data', () => {
      const data1 = generateTestData(100, 100);
      const data2 = generateTestData(100, 200);

      const result1 = calculateMACD(data1);
      const result2 = calculateMACD(data2);

      expect(result1.macd).not.toBe(result2.macd);
    });
  });

  describe('interpretMACD', () => {
    test('should identify bullish signal', () => {
      const macd = { macd: 5, signal: 3, histogram: 2 };
      const result = interpretMACD(macd);

      expect(result).toBe('多头信号');
    });

    test('should identify bearish signal', () => {
      const macd = { macd: -5, signal: -3, histogram: -2 };
      const result = interpretMACD(macd);

      expect(result).toBe('空头信号');
    });

    test('should identify bearish when histogram is negative', () => {
      const macd = { macd: 2, signal: 3, histogram: -1 };
      const result = interpretMACD(macd);

      expect(result).toBe('空头信号');
    });

    test('should handle null values', () => {
      const macd = { macd: null, signal: null, histogram: null };
      const result = interpretMACD(macd);

      expect(result).toBe('数据不足');
    });

    test('should handle zero values', () => {
      const macd = { macd: 0, signal: 0, histogram: 0 };
      const result = interpretMACD(macd);

      expect(result).toBe('中性');
    });
  });
});
