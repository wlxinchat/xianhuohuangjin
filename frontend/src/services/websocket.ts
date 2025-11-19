import { MarketData, WebSocketMessage } from '../types';

type MessageCallback = (data: MarketData) => void;
type ErrorCallback = (error: string) => void;
type ConnectionCallback = () => void;

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private messageCallbacks: Set<MessageCallback> = new Set();
  private errorCallbacks: Set<ErrorCallback> = new Set();
  private connectionCallbacks: Set<ConnectionCallback> = new Set();
  private disconnectionCallbacks: Set<ConnectionCallback> = new Set();

  constructor(private url: string) {}

  connect(): void {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket 连接已建立');
        this.reconnectAttempts = 0;
        this.connectionCallbacks.forEach(cb => cb());
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('解析消息失败:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket 错误:', error);
        this.errorCallbacks.forEach(cb => cb('连接错误'));
      };

      this.ws.onclose = () => {
        console.log('WebSocket 连接已关闭');
        this.disconnectionCallbacks.forEach(cb => cb());
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('创建 WebSocket 失败:', error);
      this.attemptReconnect();
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'marketData':
        if (message.data) {
          this.messageCallbacks.forEach(cb => cb(message.data!));
        }
        break;
      case 'error':
        if (message.message) {
          this.errorCallbacks.forEach(cb => cb(message.message!));
        }
        break;
      case 'connected':
        console.log('服务器确认连接:', message.message);
        break;
      default:
        console.log('未知消息类型:', message.type);
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`尝试重新连接 (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay);
    } else {
      console.error('达到最大重连次数，停止重连');
      this.errorCallbacks.forEach(cb => cb('无法连接到服务器'));
    }
  }

  send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket 未连接');
    }
  }

  onMessage(callback: MessageCallback): () => void {
    this.messageCallbacks.add(callback);
    return () => this.messageCallbacks.delete(callback);
  }

  onError(callback: ErrorCallback): () => void {
    this.errorCallbacks.add(callback);
    return () => this.errorCallbacks.delete(callback);
  }

  onConnection(callback: ConnectionCallback): () => void {
    this.connectionCallbacks.add(callback);
    return () => this.connectionCallbacks.delete(callback);
  }

  onDisconnection(callback: ConnectionCallback): () => void {
    this.disconnectionCallbacks.add(callback);
    return () => this.disconnectionCallbacks.delete(callback);
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

// 创建单例
const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
export const websocketService = new WebSocketService(wsUrl);
