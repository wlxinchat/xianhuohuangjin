import React, { useState, useEffect } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { Header } from './components/Header';
import { PriceCard } from './components/PriceCard';
import { IndicatorsCard } from './components/IndicatorsCard';
import { SignalCard } from './components/SignalCard';
import { PriceChart } from './components/PriceChart';
import { MarketData } from './types';

function App() {
  const { marketData, connected, error } = useWebSocket();
  const [marketHistory, setMarketHistory] = useState<MarketData[]>([]);
  const [maxHistoryLength] = useState(100);

  useEffect(() => {
    if (marketData) {
      setMarketHistory(prev => {
        const newHistory = [...prev, marketData];
        // 保持历史记录在最大长度内
        if (newHistory.length > maxHistoryLength) {
          return newHistory.slice(-maxHistoryLength);
        }
        return newHistory;
      });
    }
  }, [marketData, maxHistoryLength]);

  return (
    <div className="min-h-screen bg-slate-950">
      <Header connected={connected} />

      <main className="container mx-auto px-4 py-6">
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {!connected && !error && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/50 text-yellow-400 px-4 py-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🔄</span>
              <span>正在连接服务器...</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <PriceCard priceData={marketData?.price || null} />
          <IndicatorsCard indicators={marketData?.indicators || null} />
          <SignalCard signal={marketData?.signal || null} />
        </div>

        <div className="mb-6">
          <PriceChart marketHistory={marketHistory} />
        </div>

        <footer className="text-center text-slate-500 text-sm py-6 border-t border-slate-800">
          <p>现货黄金交易监控系统 v1.0.0</p>
          <p className="mt-2">
            数据更新频率: 10秒 | 技术指标: SMA, RSI, MACD, ATR
          </p>
          <p className="mt-2 text-xs">
            ⚠️ 本系统仅供学习和研究使用，不构成任何投资建议
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
