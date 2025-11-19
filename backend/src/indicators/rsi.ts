import { PriceData } from '../types';

/**
 * 计算相对强弱指数 (Relative Strength Index)
 * @param data 价格数据数组
 * @param period 周期，默认14
 * @returns RSI 值 (0-100)
 */
export function calculateRSI(data: PriceData[], period: number = 14): number | null {
  if (data.length < period + 1) {
    return null;
  }

  const changes: number[] = [];
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i].close - data[i - 1].close);
  }

  // 计算初始平均涨跌幅
  const recentChanges = changes.slice(-period);
  let avgGain = 0;
  let avgLoss = 0;

  recentChanges.forEach(change => {
    if (change > 0) {
      avgGain += change;
    } else {
      avgLoss += Math.abs(change);
    }
  });

  avgGain /= period;
  avgLoss /= period;

  if (avgLoss === 0) {
    return 100;
  }

  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  return rsi;
}

/**
 * 判断RSI信号
 * @param rsi RSI值
 * @returns 信号描述
 */
export function interpretRSI(rsi: number | null): string {
  if (rsi === null) return '数据不足';

  if (rsi > 70) return '超买区域';
  if (rsi < 30) return '超卖区域';
  if (rsi > 60) return '强势区域';
  if (rsi < 40) return '弱势区域';
  return '中性区域';
}
