import { PriceData } from '../types';

/**
 * 计算简单移动平均线 (Simple Moving Average)
 * @param data 价格数据数组
 * @param period 周期
 * @returns SMA 值
 */
export function calculateSMA(data: PriceData[], period: number): number | null {
  if (data.length < period) {
    return null;
  }

  const relevantData = data.slice(-period);
  const sum = relevantData.reduce((acc, item) => acc + item.close, 0);
  return sum / period;
}

/**
 * 计算多个周期的SMA
 * @param data 价格数据数组
 * @param periods 周期数组
 * @returns SMA值对象
 */
export function calculateMultipleSMA(
  data: PriceData[],
  periods: number[]
): Record<string, number | null> {
  const result: Record<string, number | null> = {};

  periods.forEach(period => {
    result[`sma${period}`] = calculateSMA(data, period);
  });

  return result;
}
