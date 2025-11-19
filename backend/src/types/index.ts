// 价格数据类型
export interface PriceData {
  timestamp: number;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

// 技术指标类型
export interface TechnicalIndicators {
  sma20: number | null;
  sma50: number | null;
  rsi: number | null;
  macd: {
    macd: number | null;
    signal: number | null;
    histogram: number | null;
  };
  atr: number | null;
}

// 交易信号类型
export enum SignalType {
  BUY = 'BUY',
  SELL = 'SELL',
  HOLD = 'HOLD'
}

// 交易建议
export interface TradingSignal {
  signal: SignalType;
  confidence: number; // 0-100
  reasons: string[];
  stopLoss: number | null;
  takeProfit: number | null;
  currentPrice: number;
  timestamp: number;
}

// 市场数据
export interface MarketData {
  price: PriceData;
  indicators: TechnicalIndicators;
  signal: TradingSignal;
}
