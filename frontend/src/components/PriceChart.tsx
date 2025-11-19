import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { MarketData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PriceChartProps {
  marketHistory: MarketData[];
}

export const PriceChart: React.FC<PriceChartProps> = ({ marketHistory }) => {
  const [maxDataPoints] = useState(50);

  const recentData = marketHistory.slice(-maxDataPoints);

  const chartData = {
    labels: recentData.map(d =>
      new Date(d.price.timestamp).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    ),
    datasets: [
      {
        label: '价格',
        data: recentData.map(d => d.price.close),
        borderColor: 'rgb(250, 204, 21)',
        backgroundColor: 'rgba(250, 204, 21, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true
      },
      {
        label: 'SMA 20',
        data: recentData.map(d => d.indicators.sma20),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderDash: [5, 5],
        tension: 0.4
      },
      {
        label: 'SMA 50',
        data: recentData.map(d => d.indicators.sma50),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderDash: [5, 5],
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#cbd5e1',
          font: {
            size: 12
          },
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#cbd5e1',
        bodyColor: '#e2e8f0',
        borderColor: '#475569',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += '$' + context.parsed.y.toFixed(2);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8',
          maxTicksLimit: 10,
          font: {
            size: 10
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8',
          callback: function(value: any) {
            return '$' + value.toFixed(2);
          },
          font: {
            size: 10
          }
        }
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 shadow-xl border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-300">价格走势图</h2>
        <div className="text-sm text-slate-400">
          最近 {recentData.length} 个数据点
        </div>
      </div>
      <div className="h-80">
        {recentData.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            等待数据加载...
          </div>
        )}
      </div>
    </div>
  );
};
