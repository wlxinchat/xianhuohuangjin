import { PriceData } from '../types';

/**
 * 计算指数移动平均线 (Exponential Moving Average)
 */
function calculateEMA(data: number[], period: number): number[] {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);

  // 初始EMA使用SMA
  let sum = 0;
  for (let i = 0; i < period && i < data.length; i++) {
    sum += data[i];
  }
  ema[period - 1] = sum / period;

  // 计算后续EMA
  for (let i = period; i < data.length; i++) {
    ema[i] = (data[i] - ema[i - 1]) * multiplier + ema[i - 1];
  }

  return ema;
}

/**
 * 计算MACD指标
 * @param data 价格数据数组
 * @param fastPeriod 快线周期，默认12
 * @param slowPeriod 慢线周期，默认26
 * @param signalPeriod 信号线周期，默认9
 * @returns MACD指标对象
 */
export function calculateMACD(
  data: PriceData[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): { macd: number | null; signal: number | null; histogram: number | null } {
  if (data.length < slowPeriod + signalPeriod) {
    return { macd: null, signal: null, histogram: null };
  }

  const closePrices = data.map(d => d.close);

  // 计算快线和慢线EMA
  const emaFast = calculateEMA(closePrices, fastPeriod);
  const emaSlow = calculateEMA(closePrices, slowPeriod);

  // 计算MACD线
  const macdLine: number[] = [];
  for (let i = slowPeriod - 1; i < data.length; i++) {
    macdLine.push(emaFast[i] - emaSlow[i]);
  }

  // 计算信号线
  const signalLine = calculateEMA(macdLine, signalPeriod);

  // 获取最新值
  const latestMacd = macdLine[macdLine.length - 1];
  const latestSignal = signalLine[signalLine.length - 1];
  const histogram = latestMacd - latestSignal;

  return {
    macd: latestMacd,
    signal: latestSignal,
    histogram: histogram
  };
}

/**
 * 判断MACD信号
 */
export function interpretMACD(macd: {
  macd: number | null;
  signal: number | null;
  histogram: number | null;
}): string {
  if (macd.macd === null || macd.signal === null || macd.histogram === null) {
    return '数据不足';
  }

  if (macd.histogram > 0 && macd.macd > macd.signal) {
    return '多头信号';
  } else if (macd.histogram < 0 && macd.macd < macd.signal) {
    return '空头信号';
  }

  return '中性';
}
