import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { MarketData } from './types';

/**
 * WebSocket 服务管理器
 */
export class WebSocketManager {
  private wss: WebSocketServer | null = null;
  private clients: Set<WebSocket> = new Set();

  /**
   * 初始化 WebSocket 服务器
   */
  initialize(server: Server): void {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('新客户端连接');
      this.clients.add(ws);

      // 发送欢迎消息
      ws.send(JSON.stringify({
        type: 'connected',
        message: '已连接到黄金交易监控系统'
      }));

      // 处理客户端消息
      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message.toString());
          this.handleClientMessage(ws, data);
        } catch (error) {
          console.error('解析客户端消息失败:', error);
        }
      });

      // 处理连接关闭
      ws.on('close', () => {
        console.log('客户端断开连接');
        this.clients.delete(ws);
      });

      // 处理错误
      ws.on('error', (error) => {
        console.error('WebSocket 错误:', error);
        this.clients.delete(ws);
      });
    });

    console.log('WebSocket 服务器已启动');
  }

  /**
   * 处理客户端消息
   */
  private handleClientMessage(ws: WebSocket, data: any): void {
    switch (data.type) {
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong' }));
        break;
      case 'subscribe':
        // 可以实现订阅特定数据流的逻辑
        ws.send(JSON.stringify({
          type: 'subscribed',
          channel: data.channel
        }));
        break;
      default:
        console.log('未知消息类型:', data.type);
    }
  }

  /**
   * 广播市场数据到所有连接的客户端
   */
  broadcastMarketData(marketData: MarketData): void {
    const message = JSON.stringify({
      type: 'marketData',
      data: marketData
    });

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  /**
   * 发送错误消息到所有客户端
   */
  broadcastError(error: string): void {
    const message = JSON.stringify({
      type: 'error',
      message: error
    });

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  /**
   * 获取当前连接数
   */
  getClientCount(): number {
    return this.clients.size;
  }

  /**
   * 关闭 WebSocket 服务器
   */
  close(): void {
    this.clients.forEach((client) => {
      client.close();
    });
    this.clients.clear();

    if (this.wss) {
      this.wss.close();
      console.log('WebSocket 服务器已关闭');
    }
  }
}

export const wsManager = new WebSocketManager();
