import React from 'react';
import { TechnicalIndicators } from '../types';

interface IndicatorsCardProps {
  indicators: TechnicalIndicators | null;
}

export const IndicatorsCard: React.FC<IndicatorsCardProps> = ({ indicators }) => {
  if (!indicators) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-slate-700 rounded"></div>
            <div className="h-16 bg-slate-700 rounded"></div>
            <div className="h-16 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const getRSIColor = (rsi: number | null) => {
    if (rsi === null) return 'text-slate-400';
    if (rsi > 70) return 'text-red-400';
    if (rsi < 30) return 'text-green-400';
    return 'text-blue-400';
  };

  const getRSILabel = (rsi: number | null) => {
    if (rsi === null) return '数据不足';
    if (rsi > 70) return '超买';
    if (rsi < 30) return '超卖';
    if (rsi > 60) return '强势';
    if (rsi < 40) return '弱势';
    return '中性';
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 shadow-xl border border-slate-700">
      <h2 className="text-xl font-semibold text-slate-300 mb-4">技术指标</h2>

      <div className="space-y-4">
        {/* 移动平均线 */}
        <div className="bg-slate-700/50 rounded p-4">
          <div className="text-sm text-slate-400 mb-2">移动平均线 (SMA)</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500">SMA 20</div>
              <div className="text-lg font-semibold text-yellow-400">
                {indicators.sma20 !== null ? `$${indicators.sma20.toFixed(2)}` : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">SMA 50</div>
              <div className="text-lg font-semibold text-orange-400">
                {indicators.sma50 !== null ? `$${indicators.sma50.toFixed(2)}` : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* RSI */}
        <div className="bg-slate-700/50 rounded p-4">
          <div className="text-sm text-slate-400 mb-2">相对强弱指数 (RSI)</div>
          <div className="flex items-center justify-between">
            <div className={`text-2xl font-bold ${getRSIColor(indicators.rsi)}`}>
              {indicators.rsi !== null ? indicators.rsi.toFixed(2) : 'N/A'}
            </div>
            <div className={`text-sm px-3 py-1 rounded ${
              indicators.rsi !== null && indicators.rsi > 70 ? 'bg-red-500/20 text-red-400' :
              indicators.rsi !== null && indicators.rsi < 30 ? 'bg-green-500/20 text-green-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {getRSILabel(indicators.rsi)}
            </div>
          </div>
          {indicators.rsi !== null && (
            <div className="mt-2">
              <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                  style={{ width: `${indicators.rsi}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* MACD */}
        <div className="bg-slate-700/50 rounded p-4">
          <div className="text-sm text-slate-400 mb-2">MACD 指标</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <div className="text-slate-500">MACD</div>
              <div className={`font-semibold ${
                indicators.macd.macd !== null && indicators.macd.macd > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {indicators.macd.macd !== null ? indicators.macd.macd.toFixed(2) : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Signal</div>
              <div className="font-semibold text-blue-400">
                {indicators.macd.signal !== null ? indicators.macd.signal.toFixed(2) : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Histogram</div>
              <div className={`font-semibold ${
                indicators.macd.histogram !== null && indicators.macd.histogram > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {indicators.macd.histogram !== null ? indicators.macd.histogram.toFixed(2) : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* ATR */}
        <div className="bg-slate-700/50 rounded p-4">
          <div className="text-sm text-slate-400 mb-2">平均真实波幅 (ATR)</div>
          <div className="text-xl font-semibold text-purple-400">
            {indicators.atr !== null ? `$${indicators.atr.toFixed(2)}` : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};
