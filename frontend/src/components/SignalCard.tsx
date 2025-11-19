import React from 'react';
import { TradingSignal, SignalType } from '../types';

interface SignalCardProps {
  signal: TradingSignal | null;
}

export const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {
  if (!signal) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/2 mb-4"></div>
          <div className="h-24 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  const getSignalColor = (signalType: SignalType) => {
    switch (signalType) {
      case SignalType.BUY:
        return 'text-green-400 bg-green-500/20 border-green-500';
      case SignalType.SELL:
        return 'text-red-400 bg-red-500/20 border-red-500';
      case SignalType.HOLD:
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500';
      default:
        return 'text-slate-400 bg-slate-500/20 border-slate-500';
    }
  };

  const getSignalIcon = (signalType: SignalType) => {
    switch (signalType) {
      case SignalType.BUY:
        return '📈';
      case SignalType.SELL:
        return '📉';
      case SignalType.HOLD:
        return '⏸';
      default:
        return '❓';
    }
  };

  const getSignalText = (signalType: SignalType) => {
    switch (signalType) {
      case SignalType.BUY:
        return '买入信号';
      case SignalType.SELL:
        return '卖出信号';
      case SignalType.HOLD:
        return '持仓观望';
      default:
        return '无信号';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 shadow-xl border border-slate-700">
      <h2 className="text-xl font-semibold text-slate-300 mb-4">交易建议</h2>

      {/* 信号类型 */}
      <div className={`rounded-lg p-6 mb-4 border-2 ${getSignalColor(signal.signal)}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{getSignalIcon(signal.signal)}</span>
            <div>
              <div className="text-2xl font-bold">{getSignalText(signal.signal)}</div>
              <div className="text-sm opacity-75">
                置信度: {signal.confidence}%
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">当前价格</div>
            <div className="text-xl font-semibold">${signal.currentPrice.toFixed(2)}</div>
          </div>
        </div>

        {/* 置信度条 */}
        <div className="mt-3">
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                signal.signal === SignalType.BUY ? 'bg-green-500' :
                signal.signal === SignalType.SELL ? 'bg-red-500' :
                'bg-yellow-500'
              }`}
              style={{ width: `${signal.confidence}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 止损止盈 */}
      {(signal.stopLoss !== null || signal.takeProfit !== null) && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {signal.stopLoss !== null && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
              <div className="text-xs text-red-400 mb-1">建议止损位</div>
              <div className="text-lg font-semibold text-red-300">
                ${signal.stopLoss.toFixed(2)}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {((Math.abs(signal.currentPrice - signal.stopLoss) / signal.currentPrice) * 100).toFixed(2)}% 风险
              </div>
            </div>
          )}
          {signal.takeProfit !== null && (
            <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
              <div className="text-xs text-green-400 mb-1">建议止盈位</div>
              <div className="text-lg font-semibold text-green-300">
                ${signal.takeProfit.toFixed(2)}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {((Math.abs(signal.takeProfit - signal.currentPrice) / signal.currentPrice) * 100).toFixed(2)}% 收益
              </div>
            </div>
          )}
        </div>
      )}

      {/* 分析原因 */}
      <div className="bg-slate-700/50 rounded p-4">
        <div className="text-sm text-slate-400 mb-2">分析依据</div>
        <ul className="space-y-2">
          {signal.reasons.map((reason, index) => (
            <li key={index} className="flex items-start space-x-2 text-sm">
              <span className="text-blue-400 mt-0.5">•</span>
              <span className="text-slate-300">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 免责声明 */}
      <div className="mt-4 text-xs text-slate-500 text-center">
        ⚠️ 以上建议仅供参考，不构成投资建议，投资有风险，决策需谨慎
      </div>
    </div>
  );
};
