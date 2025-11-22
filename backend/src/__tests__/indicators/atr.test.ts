import { calculateATR, calculateStopLoss, calculateTakeProfit } from '../../indicators/atr';
import { PriceData } from '../../types';

describe('ATR Indicator', () => {
  const generateVolatileData = (length: number, volatility: number = 5): PriceData[] => {
    const data: PriceData[] = [];
    let price = 100;

    for (let i = 0; i < length; i++) {
      const change = (Math.random() - 0.5) * volatility * 2;
      price += change;

      const high = price + Math.random() * volatility;
      const low = price - Math.random() * volatility;

      data.push({
        timestamp: Date.now() + i * 1000,
        price,
        open: price,
        high,
        low,
        close: price
      });
    }

    return data;
  };

  describe('calculateATR', () => {
    test('should calculate ATR with valid data', () => {
      const data = generateVolatileData(30);
      const atr = calculateATR(data, 14);

      expect(atr).not.toBeNull();
      expect(atr).toBeGreaterThan(0);
    });

    test('should return null when data is insufficient', () => {
      const data = generateVolatileData(10);
      const atr = calculateATR(data, 14);

      expect(atr).toBeNull();
    });

    test('should handle different periods', () => {
      const data = generateVolatileData(50);
      const atr7 = calculateATR(data, 7);
      const atr14 = calculateATR(data, 14);
      const atr21 = calculateATR(data, 21);

      expect(atr7).not.toBeNull();
      expect(atr14).not.toBeNull();
      expect(atr21).not.toBeNull();
    });

    test('should increase with higher volatility', () => {
      const lowVolData = generateVolatileData(30, 2);
      const highVolData = generateVolatileData(30, 10);

      const atrLow = calculateATR(lowVolData, 14);
      const atrHigh = calculateATR(highVolData, 14);

      expect(atrHigh).toBeGreaterThan(atrLow!);
    });

    test('should work with minimum valid data', () => {
      const data = generateVolatileData(15); // period + 1
      const atr = calculateATR(data, 14);

      expect(atr).not.toBeNull();
    });
  });

  describe('calculateStopLoss', () => {
    test('should calculate long stop loss correctly', () => {
      const currentPrice = 100;
      const atr = 5;
      const stopLoss = calculateStopLoss(currentPrice, atr, 2, true);

      expect(stopLoss).toBe(90); // 100 - (5 * 2)
    });

    test('should calculate short stop loss correctly', () => {
      const currentPrice = 100;
      const atr = 5;
      const stopLoss = calculateStopLoss(currentPrice, atr, 2, false);

      expect(stopLoss).toBe(110); // 100 + (5 * 2)
    });

    test('should adjust with different multipliers', () => {
      const currentPrice = 100;
      const atr = 5;

      const stopLoss1x = calculateStopLoss(currentPrice, atr, 1, true);
      const stopLoss2x = calculateStopLoss(currentPrice, atr, 2, true);
      const stopLoss3x = calculateStopLoss(currentPrice, atr, 3, true);

      expect(stopLoss1x).toBe(95);
      expect(stopLoss2x).toBe(90);
      expect(stopLoss3x).toBe(85);
    });

    test('should handle zero ATR', () => {
      const currentPrice = 100;
      const stopLoss = calculateStopLoss(currentPrice, 0, 2, true);

      expect(stopLoss).toBe(100);
    });
  });

  describe('calculateTakeProfit', () => {
    test('should calculate long take profit correctly', () => {
      const currentPrice = 100;
      const atr = 5;
      const takeProfit = calculateTakeProfit(currentPrice, atr, 3, true);

      expect(takeProfit).toBe(115); // 100 + (5 * 3)
    });

    test('should calculate short take profit correctly', () => {
      const currentPrice = 100;
      const atr = 5;
      const takeProfit = calculateTakeProfit(currentPrice, atr, 3, false);

      expect(takeProfit).toBe(85); // 100 - (5 * 3)
    });

    test('should adjust with different multipliers', () => {
      const currentPrice = 100;
      const atr = 5;

      const tp1x = calculateTakeProfit(currentPrice, atr, 1, true);
      const tp2x = calculateTakeProfit(currentPrice, atr, 2, true);
      const tp3x = calculateTakeProfit(currentPrice, atr, 3, true);

      expect(tp1x).toBe(105);
      expect(tp2x).toBe(110);
      expect(tp3x).toBe(115);
    });

    test('should be greater than stop loss for long position', () => {
      const currentPrice = 100;
      const atr = 5;

      const stopLoss = calculateStopLoss(currentPrice, atr, 2, true);
      const takeProfit = calculateTakeProfit(currentPrice, atr, 3, true);

      expect(takeProfit).toBeGreaterThan(stopLoss);
    });
  });
});
