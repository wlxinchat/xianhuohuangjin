import React, { useEffect, useState } from 'react';
import { PriceData } from '../types';

interface PriceCardProps {
  priceData: PriceData | null;
}

export const PriceCard: React.FC<PriceCardProps> = ({ priceData }) => {
  const [prevPrice, setPrevPrice] = useState<number | null>(null);
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | 'neutral'>('neutral');

  useEffect(() => {
    if (priceData && prevPrice !== null) {
      if (priceData.close > prevPrice) {
        setPriceDirection('up');
      } else if (priceData.close < prevPrice) {
        setPriceDirection('down');
      }
    }
    if (priceData) {
      setPrevPrice(priceData.close);
    }
  }, [priceData, prevPrice]);

  if (!priceData) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/2 mb-4"></div>
          <div className="h-12 bg-slate-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const priceChange = priceData.close - priceData.open;
  const priceChangePercent = ((priceChange / priceData.open) * 100);

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 shadow-xl border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-300">现货黄金 (XAU/USD)</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500 pulse-glow"></div>
          <span className="text-sm text-slate-400">实时</span>
        </div>
      </div>

      <div className="mb-6">
        <div className={`text-4xl font-bold mb-2 ${
          priceDirection === 'up' ? 'text-green-400' :
          priceDirection === 'down' ? 'text-red-400' :
          'text-white'
        }`}>
          ${priceData.close.toFixed(2)}
        </div>
        <div className={`flex items-center space-x-2 text-sm ${
          priceChange >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          <span>{priceChange >= 0 ? '▲' : '▼'}</span>
          <span>${Math.abs(priceChange).toFixed(2)}</span>
          <span>({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-slate-700/50 rounded p-3">
          <div className="text-slate-400 mb-1">最高</div>
          <div className="text-white font-semibold">${priceData.high.toFixed(2)}</div>
        </div>
        <div className="bg-slate-700/50 rounded p-3">
          <div className="text-slate-400 mb-1">最低</div>
          <div className="text-white font-semibold">${priceData.low.toFixed(2)}</div>
        </div>
        <div className="bg-slate-700/50 rounded p-3">
          <div className="text-slate-400 mb-1">开盘</div>
          <div className="text-white font-semibold">${priceData.open.toFixed(2)}</div>
        </div>
        <div className="bg-slate-700/50 rounded p-3">
          <div className="text-slate-400 mb-1">时间</div>
          <div className="text-white font-semibold">
            {new Date(priceData.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};
