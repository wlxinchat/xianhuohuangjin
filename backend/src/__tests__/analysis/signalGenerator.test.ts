import { SignalGenerator } from '../../analysis/signalGenerator';
import { PriceData, SignalType } from '../../types';

describe('SignalGenerator', () => {
  const generator = new SignalGenerator();

  const generateTrendData = (length: number, trend: 'up' | 'down' | 'neutral'): PriceData[] => {
    const data: PriceData[] = [];
    let price = 2000;

    for (let i = 0; i < length; i++) {
      if (trend === 'up') {
        price += Math.random() * 5 + 2;
      } else if (trend === 'down') {
        price -= Math.random() * 5 + 2;
      } else {
        price += (Math.random() - 0.5) * 3;
      }

      data.push({
        timestamp: Date.now() + i * 1000,
        price,
        open: price - 1,
        high: price + 2,
        low: price - 2,
        close: price
      });
    }

    return data;
  };

  describe('calculateIndicators', () => {
    test('should calculate all indicators with sufficient data', () => {
      const data = generateTrendData(100, 'neutral');
      const indicators = generator.calculateIndicators(data);

      expect(indicators).toHaveProperty('sma20');
      expect(indicators).toHaveProperty('sma50');
      expect(indicators).toHaveProperty('rsi');
      expect(indicators).toHaveProperty('macd');
      expect(indicators).toHaveProperty('atr');
    });

    test('should return valid indicator values', () => {
      const data = generateTrendData(100, 'neutral');
      const indicators = generator.calculateIndicators(data);

      expect(indicators.sma20).not.toBeNull();
      expect(indicators.sma50).not.toBeNull();
      expect(indicators.rsi).not.toBeNull();
      expect(indicators.macd.macd).not.toBeNull();
      expect(indicators.atr).not.toBeNull();
    });

    test('should return null for indicators when data is insufficient', () => {
      const data = generateTrendData(30, 'neutral');
      const indicators = generator.calculateIndicators(data);

      expect(indicators.sma20).not.toBeNull();
      expect(indicators.sma50).toBeNull(); // Needs 50 data points
    });
  });

  describe('generateSignal', () => {
    test('should generate BUY signal for strong uptrend', () => {
      const data = generateTrendData(100, 'up');
      const indicators = generator.calculateIndicators(data);
      const signal = generator.generateSignal(data, indicators);

      expect(signal.signal).toBe(SignalType.BUY);
      expect(signal.confidence).toBeGreaterThan(0);
      expect(signal.confidence).toBeLessThanOrEqual(100);
      expect(signal.reasons.length).toBeGreaterThan(0);
    });

    test('should generate SELL signal for strong downtrend', () => {
      const data = generateTrendData(100, 'down');
      const indicators = generator.calculateIndicators(data);
      const signal = generator.generateSignal(data, indicators);

      expect(signal.signal).toBe(SignalType.SELL);
      expect(signal.confidence).toBeGreaterThan(0);
      expect(signal.confidence).toBeLessThanOrEqual(100);
    });

    test('should include stop loss and take profit for BUY signal', () => {
      const data = generateTrendData(100, 'up');
      const indicators = generator.calculateIndicators(data);
      const signal = generator.generateSignal(data, indicators);

      if (signal.signal === SignalType.BUY && indicators.atr !== null) {
        expect(signal.stopLoss).not.toBeNull();
        expect(signal.takeProfit).not.toBeNull();
        expect(signal.stopLoss!).toBeLessThan(signal.currentPrice);
        expect(signal.takeProfit!).toBeGreaterThan(signal.currentPrice);
      }
    });

    test('should include stop loss and take profit for SELL signal', () => {
      const data = generateTrendData(100, 'down');
      const indicators = generator.calculateIndicators(data);
      const signal = generator.generateSignal(data, indicators);

      if (signal.signal === SignalType.SELL && indicators.atr !== null) {
        expect(signal.stopLoss).not.toBeNull();
        expect(signal.takeProfit).not.toBeNull();
        expect(signal.stopLoss!).toBeGreaterThan(signal.currentPrice);
        expect(signal.takeProfit!).toBeLessThan(signal.currentPrice);
      }
    });

    test('should have valid timestamp', () => {
      const data = generateTrendData(100, 'neutral');
      const indicators = generator.calculateIndicators(data);
      const signal = generator.generateSignal(data, indicators);

      expect(signal.timestamp).toBeGreaterThan(0);
      expect(signal.timestamp).toBeLessThanOrEqual(Date.now() + 1000);
    });

    test('should have current price matching latest data', () => {
      const data = generateTrendData(100, 'neutral');
      const indicators = generator.calculateIndicators(data);
      const signal = generator.generateSignal(data, indicators);

      expect(signal.currentPrice).toBe(data[data.length - 1].close);
    });

    test('should include analysis reasons', () => {
      const data = generateTrendData(100, 'neutral');
      const indicators = generator.calculateIndicators(data);
      const signal = generator.generateSignal(data, indicators);

      expect(Array.isArray(signal.reasons)).toBe(true);
      expect(signal.reasons.length).toBeGreaterThan(0);
      signal.reasons.forEach(reason => {
        expect(typeof reason).toBe('string');
        expect(reason.length).toBeGreaterThan(0);
      });
    });
  });

  describe('analyzeMarket', () => {
    test('should analyze uptrend market', () => {
      const data = generateTrendData(100, 'up');
      const analysis = generator.analyzeMarket(data);

      expect(analysis).toHaveProperty('trend');
      expect(analysis).toHaveProperty('strength');
      expect(analysis).toHaveProperty('volatility');
      expect(['上升', '震荡', '下降']).toContain(analysis.trend);
    });

    test('should analyze downtrend market', () => {
      const data = generateTrendData(100, 'down');
      const analysis = generator.analyzeMarket(data);

      expect(['上升', '震荡', '下降']).toContain(analysis.trend);
      expect(['强', '中等', '弱']).toContain(analysis.strength);
    });

    test('should return unknown for insufficient data', () => {
      const data = generateTrendData(30, 'neutral');
      const analysis = generator.analyzeMarket(data);

      expect(analysis.trend).toBe('数据不足');
      expect(analysis.strength).toBe('未知');
      expect(analysis.volatility).toBe('未知');
    });

    test('should detect volatility levels', () => {
      const data = generateTrendData(100, 'neutral');
      const analysis = generator.analyzeMarket(data);

      expect(['高', '正常', '低']).toContain(analysis.volatility);
    });
  });
});
