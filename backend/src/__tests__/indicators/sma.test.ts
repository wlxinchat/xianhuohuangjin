import { calculateSMA, calculateMultipleSMA } from '../../indicators/sma';
import { PriceData } from '../../types';

describe('SMA Indicator', () => {
  // 生成测试数据
  const generateTestData = (length: number, basePrice: number = 100): PriceData[] => {
    return Array.from({ length }, (_, i) => ({
      timestamp: Date.now() + i * 1000,
      price: basePrice + i,
      open: basePrice + i,
      high: basePrice + i + 1,
      low: basePrice + i - 1,
      close: basePrice + i,
      volume: 1000
    }));
  };

  describe('calculateSMA', () => {
    test('should calculate SMA correctly with valid data', () => {
      const data = generateTestData(50, 100);
      const result = calculateSMA(data, 20);

      expect(result).not.toBeNull();
      expect(typeof result).toBe('number');
    });

    test('should return null when data length is less than period', () => {
      const data = generateTestData(10);
      const result = calculateSMA(data, 20);

      expect(result).toBeNull();
    });

    test('should return null when data is empty', () => {
      const result = calculateSMA([], 20);

      expect(result).toBeNull();
    });

    test('should calculate SMA with period of 1', () => {
      const data = generateTestData(10, 100);
      const result = calculateSMA(data, 1);

      expect(result).toBe(109); // Last price
    });

    test('should calculate correct average for known values', () => {
      const data: PriceData[] = [
        { timestamp: 1, price: 100, open: 100, high: 101, low: 99, close: 100 },
        { timestamp: 2, price: 102, open: 102, high: 103, low: 101, close: 102 },
        { timestamp: 3, price: 104, open: 104, high: 105, low: 103, close: 104 },
        { timestamp: 4, price: 106, open: 106, high: 107, low: 105, close: 106 },
        { timestamp: 5, price: 108, open: 108, high: 109, low: 107, close: 108 }
      ];

      const result = calculateSMA(data, 5);
      const expected = (100 + 102 + 104 + 106 + 108) / 5;

      expect(result).toBe(expected);
    });

    test('should only use recent data for calculation', () => {
      const data = generateTestData(100, 100);
      const sma20 = calculateSMA(data, 20);
      const sma50 = calculateSMA(data, 50);

      expect(sma20).not.toBe(sma50);
      expect(sma20).toBeGreaterThan(sma50!);
    });
  });

  describe('calculateMultipleSMA', () => {
    test('should calculate multiple SMAs correctly', () => {
      const data = generateTestData(100, 100);
      const result = calculateMultipleSMA(data, [20, 50]);

      expect(result).toHaveProperty('sma20');
      expect(result).toHaveProperty('sma50');
      expect(result.sma20).not.toBeNull();
      expect(result.sma50).not.toBeNull();
    });

    test('should return null for periods longer than data', () => {
      const data = generateTestData(30);
      const result = calculateMultipleSMA(data, [20, 50, 100]);

      expect(result.sma20).not.toBeNull();
      expect(result.sma50).toBeNull();
      expect(result.sma100).toBeNull();
    });

    test('should handle empty periods array', () => {
      const data = generateTestData(50);
      const result = calculateMultipleSMA(data, []);

      expect(Object.keys(result).length).toBe(0);
    });
  });
});
