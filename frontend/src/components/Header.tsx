import React from 'react';

interface HeaderProps {
  connected: boolean;
}

export const Header: React.FC<HeaderProps> = ({ connected }) => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 shadow-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">💰</div>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                现货黄金交易监控系统
              </h1>
              <p className="text-sm text-slate-400">实时价格 · 技术分析 · 智能信号</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              connected
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                connected ? 'bg-green-500 pulse-glow' : 'bg-red-500'
              }`}></div>
              <span className="text-sm font-medium">
                {connected ? '已连接' : '未连接'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
