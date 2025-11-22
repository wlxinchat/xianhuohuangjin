import { PriceData, TechnicalIndicators, TradingSignal, SignalType } from '../types';
import { calculateSMA } from '../indicators/sma';
import { calculateRSI } from '../indicators/rsi';
import { calculateMACD } from '../indicators/macd';
import { calculateATR, calculateStopLoss, calculateTakeProfit } from '../indicators/atr';

/**
 * 交易信号生成器
 */
export class SignalGenerator {
  /**
   * 计算所有技术指标
   */
  calculateIndicators(priceHistory: PriceData[]): TechnicalIndicators {
    return {
      sma20: calculateSMA(priceHistory, 20),
      sma50: calculateSMA(priceHistory, 50),
      rsi: calculateRSI(priceHistory, 14),
      macd: calculateMACD(priceHistory, 12, 26, 9),
      atr: calculateATR(priceHistory, 14)
    };
  }

  /**
   * 生成交易信号
   */
  generateSignal(
    priceHistory: PriceData[],
    indicators: TechnicalIndicators
  ): TradingSignal {
    const currentPrice = priceHistory[priceHistory.length - 1].close;
    const reasons: string[] = [];
    let bullishScore = 0;
    let bearishScore = 0;

    // 1. 趋势分析 - SMA
    if (indicators.sma20 !== null && indicators.sma50 !== null) {
      if (currentPrice > indicators.sma20 && indicators.sma20 > indicators.sma50) {
        bullishScore += 25;
        reasons.push('价格位于短期均线上方，呈上升趋势');
      } else if (currentPrice < indicators.sma20 && indicators.sma20 < indicators.sma50) {
        bearishScore += 25;
        reasons.push('价格位于短期均线下方，呈下降趋势');
      } else if (currentPrice > indicators.sma20) {
        bullishScore += 10;
        reasons.push('价格高于20日均线');
      } else if (currentPrice < indicators.sma20) {
        bearishScore += 10;
        reasons.push('价格低于20日均线');
      }
    }

    // 2. 动量分析 - RSI
    if (indicators.rsi !== null) {
      if (indicators.rsi < 30) {
        bullishScore += 20;
        reasons.push(`RSI超卖(${indicators.rsi.toFixed(2)})，可能反弹`);
      } else if (indicators.rsi > 70) {
        bearishScore += 20;
        reasons.push(`RSI超买(${indicators.rsi.toFixed(2)})，可能回调`);
      } else if (indicators.rsi < 40) {
        bearishScore += 15;
        reasons.push('RSI处于弱势区域');
      } else if (indicators.rsi > 60) {
        bullishScore += 15;
        reasons.push('RSI处于强势区域');
      }
    }

    // 3. 趋势强度 - MACD
    const { macd, signal: macdSignal, histogram } = indicators.macd;
    if (macd !== null && macdSignal !== null && histogram !== null) {
      if (histogram > 0 && macd > macdSignal) {
        bullishScore += 25;
        reasons.push('MACD金叉且位于零轴上方，多头趋势');
      } else if (histogram < 0 && macd < macdSignal) {
        bearishScore += 25;
        reasons.push('MACD死叉且位于零轴下方，空头趋势');
      } else if (histogram > 0) {
        bullishScore += 15;
        reasons.push('MACD柱状图为正，短期动能向上');
      } else if (histogram < 0) {
        bearishScore += 15;
        reasons.push('MACD柱状图为负，短期动能向下');
      }
    }

    // 4. 波动率分析 - ATR
    if (indicators.atr !== null) {
      const atrPercent = (indicators.atr / currentPrice) * 100;
      if (atrPercent > 1.5) {
        reasons.push(`市场波动较大(ATR: ${atrPercent.toFixed(2)}%)，注意风险控制`);
      } else if (atrPercent < 0.5) {
        reasons.push(`市场波动较小(ATR: ${atrPercent.toFixed(2)}%)，可能酝酿突破`);
      }
    }

    // 5. 综合评分和信号判断
    const totalScore = bullishScore + bearishScore;
    let signal: SignalType;
    let confidence: number;

    if (bullishScore > bearishScore && bullishScore >= 25) {
      signal = SignalType.BUY;
      confidence = Math.min((bullishScore / totalScore) * 100, 95);
    } else if (bearishScore > bullishScore && bearishScore >= 25) {
      signal = SignalType.SELL;
      confidence = Math.min((bearishScore / totalScore) * 100, 95);
    } else {
      signal = SignalType.HOLD;
      confidence = 50;
      reasons.push('信号不明确，建议观望');
    }

    // 6. 计算止损止盈
    let stopLoss: number | null = null;
    let takeProfit: number | null = null;

    if (indicators.atr !== null && signal !== SignalType.HOLD) {
      const isLong = signal === SignalType.BUY;
      stopLoss = calculateStopLoss(currentPrice, indicators.atr, 2, isLong);
      takeProfit = calculateTakeProfit(currentPrice, indicators.atr, 3, isLong);
    }

    return {
      signal,
      confidence: Math.round(confidence),
      reasons,
      stopLoss,
      takeProfit,
      currentPrice,
      timestamp: Date.now()
    };
  }

  /**
   * 分析市场状态
   */
  analyzeMarket(priceHistory: PriceData[]): {
    trend: string;
    strength: string;
    volatility: string;
  } {
    if (priceHistory.length < 50) {
      return {
        trend: '数据不足',
        strength: '未知',
        volatility: '未知'
      };
    }

    const indicators = this.calculateIndicators(priceHistory);
    const currentPrice = priceHistory[priceHistory.length - 1].close;

    // 趋势判断
    let trend = '震荡';
    if (indicators.sma20 !== null && indicators.sma50 !== null) {
      if (currentPrice > indicators.sma20 && indicators.sma20 > indicators.sma50) {
        trend = '上升';
      } else if (currentPrice < indicators.sma20 && indicators.sma20 < indicators.sma50) {
        trend = '下降';
      }
    }

    // 强度判断
    let strength = '中等';
    if (indicators.rsi !== null) {
      if (indicators.rsi > 60 || indicators.rsi < 40) {
        strength = '强';
      } else if (indicators.rsi > 45 && indicators.rsi < 55) {
        strength = '弱';
      }
    }

    // 波动率判断
    let volatility = '正常';
    if (indicators.atr !== null) {
      const atrPercent = (indicators.atr / currentPrice) * 100;
      if (atrPercent > 1.5) {
        volatility = '高';
      } else if (atrPercent < 0.5) {
        volatility = '低';
      }
    }

    return { trend, strength, volatility };
  }
}

export const signalGenerator = new SignalGenerator();
