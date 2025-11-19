import { useEffect, useState } from 'react';
import { websocketService } from '../services/websocket';
import { MarketData } from '../types';

export function useWebSocket() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 连接 WebSocket
    websocketService.connect();

    // 订阅消息
    const unsubscribeMessage = websocketService.onMessage((data) => {
      setMarketData(data);
      setError(null);
    });

    const unsubscribeError = websocketService.onError((errorMsg) => {
      setError(errorMsg);
    });

    const unsubscribeConnection = websocketService.onConnection(() => {
      setConnected(true);
      setError(null);
    });

    const unsubscribeDisconnection = websocketService.onDisconnection(() => {
      setConnected(false);
    });

    // 清理
    return () => {
      unsubscribeMessage();
      unsubscribeError();
      unsubscribeConnection();
      unsubscribeDisconnection();
    };
  }, []);

  return { marketData, connected, error };
}
