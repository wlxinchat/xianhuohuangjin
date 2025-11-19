import { Router, Request, Response } from 'express';
import { priceService } from '../services/priceService';
import { signalGenerator } from '../analysis/signalGenerator';

const router = Router();

/**
 * 获取最新市场数据
 */
router.get('/market/latest', (req: Request, res: Response) => {
  try {
    const latestPrice = priceService.getLatestPrice();

    if (!latestPrice) {
      return res.status(404).json({
        success: false,
        message: '暂无价格数据'
      });
    }

    const priceHistory = priceService.getPriceHistory();
    const indicators = signalGenerator.calculateIndicators(priceHistory);
    const signal = signalGenerator.generateSignal(priceHistory, indicators);

    res.json({
      success: true,
      data: {
        price: latestPrice,
        indicators,
        signal
      }
    });
  } catch (error) {
    console.error('获取市场数据失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

/**
 * 获取价格历史
 */
router.get('/market/history', (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const priceHistory = priceService.getRecentPrices(limit);

    res.json({
      success: true,
      data: priceHistory
    });
  } catch (error) {
    console.error('获取价格历史失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

/**
 * 获取技术指标
 */
router.get('/market/indicators', (req: Request, res: Response) => {
  try {
    const priceHistory = priceService.getPriceHistory();

    if (priceHistory.length === 0) {
      return res.status(404).json({
        success: false,
        message: '暂无数据'
      });
    }

    const indicators = signalGenerator.calculateIndicators(priceHistory);

    res.json({
      success: true,
      data: indicators
    });
  } catch (error) {
    console.error('获取技术指标失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

/**
 * 获取交易信号
 */
router.get('/market/signal', (req: Request, res: Response) => {
  try {
    const priceHistory = priceService.getPriceHistory();

    if (priceHistory.length < 50) {
      return res.status(404).json({
        success: false,
        message: '数据不足，需要至少50条历史数据'
      });
    }

    const indicators = signalGenerator.calculateIndicators(priceHistory);
    const signal = signalGenerator.generateSignal(priceHistory, indicators);

    res.json({
      success: true,
      data: signal
    });
  } catch (error) {
    console.error('获取交易信号失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

/**
 * 获取市场分析
 */
router.get('/market/analysis', (req: Request, res: Response) => {
  try {
    const priceHistory = priceService.getPriceHistory();

    if (priceHistory.length < 50) {
      return res.status(404).json({
        success: false,
        message: '数据不足'
      });
    }

    const analysis = signalGenerator.analyzeMarket(priceHistory);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('获取市场分析失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

/**
 * 健康检查
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API 运行正常',
    timestamp: new Date().toISOString()
  });
});

export default router;
