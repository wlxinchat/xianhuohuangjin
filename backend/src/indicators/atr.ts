import { PriceData } from '../types';

/**
 * 计算真实波动幅度均值 (Average True Range)
 * @param data 价格数据数组
 * @param period 周期，默认14
 * @returns ATR 值
 */
export function calculateATR(data: PriceData[], period: number = 14): number | null {
  if (data.length < period + 1) {
    return null;
  }

  const trueRanges: number[] = [];

  // 计算每个周期的真实波动幅度
  for (let i = 1; i < data.length; i++) {
    const high = data[i].high;
    const low = data[i].low;
    const prevClose = data[i - 1].close;

    const tr = Math.max(
      high - low,                    // 当前最高价 - 当前最低价
      Math.abs(high - prevClose),    // 当前最高价 - 前收盘价
      Math.abs(low - prevClose)      // 当前最低价 - 前收盘价
    );

    trueRanges.push(tr);
  }

  // 计算ATR (使用简单移动平均)
  const recentTR = trueRanges.slice(-period);
  const atr = recentTR.reduce((sum, tr) => sum + tr, 0) / period;

  return atr;
}

/**
 * 基于ATR计算止损位
 * @param currentPrice 当前价格
 * @param atr ATR值
 * @param multiplier ATR倍数，默认2
 * @param isLong 是否多头持仓
 * @returns 止损价位
 */
export function calculateStopLoss(
  currentPrice: number,
  atr: number,
  multiplier: number = 2,
  isLong: boolean = true
): number {
  if (isLong) {
    return currentPrice - (atr * multiplier);
  } else {
    return currentPrice + (atr * multiplier);
  }
}

/**
 * 基于ATR计算止盈位
 * @param currentPrice 当前价格
 * @param atr ATR值
 * @param multiplier ATR倍数，默认3
 * @param isLong 是否多头持仓
 * @returns 止盈价位
 */
export function calculateTakeProfit(
  currentPrice: number,
  atr: number,
  multiplier: number = 3,
  isLong: boolean = true
): number {
  if (isLong) {
    return currentPrice + (atr * multiplier);
  } else {
    return currentPrice - (atr * multiplier);
  }
}
