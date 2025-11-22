# 测试计划文档

## 📋 测试策略

### 测试金字塔

```
           /\
          /  \  E2E Tests (5%)
         /____\
        /      \  Integration Tests (15%)
       /________\
      /          \  Unit Tests (80%)
     /____________\
```

### 测试覆盖目标

| 类型 | 目标覆盖率 | 优先级 |
|------|-----------|--------|
| 单元测试 | ≥80% | 高 |
| 集成测试 | ≥60% | 中 |
| E2E测试 | 核心流程 | 高 |

---

## 🧪 测试分类

### 1. 单元测试 (Unit Tests)

**后端单元测试**:
- ✅ 技术指标计算 (SMA, RSI, MACD, ATR)
- ✅ 交易信号生成算法
- ✅ 价格数据处理
- ✅ WebSocket 消息处理
- ✅ 工具函数

**前端单元测试**:
- ✅ 组件渲染
- ✅ 自定义 Hooks
- ✅ 工具函数
- ✅ 状态管理

### 2. 集成测试 (Integration Tests)

**API 集成测试**:
- ✅ REST API 端点
- ✅ WebSocket 连接
- ✅ 数据流完整性
- ✅ 错误处理

**组件集成测试**:
- ✅ 组件交互
- ✅ 数据流
- ✅ 事件处理

### 3. E2E 测试 (End-to-End Tests)

**关键流程**:
- ✅ 用户访问应用
- ✅ 实时数据加载
- ✅ WebSocket 连接
- ✅ 图表展示
- ✅ 交易信号显示

---

## 🔧 测试工具

### 后端测试
- **Jest**: 测试框架
- **Supertest**: API 测试
- **ws**: WebSocket 测试

### 前端测试
- **Vitest**: 测试框架
- **React Testing Library**: 组件测试
- **@testing-library/user-event**: 用户交互
- **@vitest/ui**: 测试界面

### E2E 测试
- **Playwright**: 浏览器自动化

### 代码覆盖率
- **c8**: 覆盖率工具
- **Istanbul**: 报告生成

---

## 📊 测试矩阵

### 后端测试矩阵

| 模块 | 单元测试 | 集成测试 | 优先级 |
|------|---------|---------|--------|
| indicators/sma.ts | ✅ | - | P0 |
| indicators/rsi.ts | ✅ | - | P0 |
| indicators/macd.ts | ✅ | - | P0 |
| indicators/atr.ts | ✅ | - | P0 |
| analysis/signalGenerator.ts | ✅ | ✅ | P0 |
| services/priceService.ts | ✅ | ✅ | P0 |
| routes/api.ts | ✅ | ✅ | P0 |
| websocket.ts | ✅ | ✅ | P1 |

### 前端测试矩阵

| 组件 | 单元测试 | 集成测试 | E2E |
|------|---------|---------|-----|
| PriceCard | ✅ | ✅ | ✅ |
| IndicatorsCard | ✅ | ✅ | ✅ |
| SignalCard | ✅ | ✅ | ✅ |
| PriceChart | ✅ | ✅ | ✅ |
| useWebSocket | ✅ | ✅ | ✅ |

---

## 🎯 测试场景

### 核心业务场景

#### 场景1: 技术指标计算
```
Given: 100条价格数据
When: 计算SMA(20, 50)
Then: 返回正确的均线值
```

#### 场景2: 交易信号生成
```
Given: 完整的技术指标数据
When: 生成交易信号
Then:
  - 返回BUY/SELL/HOLD信号
  - 置信度在0-100之间
  - 包含分析原因
  - 包含止损止盈位
```

#### 场景3: 实时数据推送
```
Given: WebSocket已连接
When: 价格更新
Then:
  - 前端收到最新数据
  - 图表更新
  - 指标重新计算
  - 信号更新
```

### 边界条件测试

#### 数据不足
```
Given: 少于50条价格数据
When: 计算技术指标
Then: 返回null或提示数据不足
```

#### 异常数据
```
Given: 价格为0或负数
When: 计算指标
Then: 抛出错误或返回null
```

#### 连接中断
```
Given: WebSocket连接中断
When: 尝试重连
Then:
  - 自动重连
  - 最多重试5次
  - 显示连接状态
```

---

## 🔍 性能测试

### 指标
- API响应时间 < 100ms
- WebSocket延迟 < 50ms
- 前端渲染时间 < 16ms (60fps)
- 内存使用 < 100MB

### 负载测试
- 并发连接: 100+
- 数据更新频率: 10秒/次
- 持续运行: 24小时

---

## 🐛 Bug 追踪

### 测试结果记录
```
[P0] Critical - 必须修复
[P1] High - 高优先级
[P2] Medium - 中优先级
[P3] Low - 低优先级
```

### Bug 模板
```markdown
## Bug描述
简要描述bug

## 复现步骤
1. 步骤1
2. 步骤2
3. 步骤3

## 预期结果
应该发生什么

## 实际结果
实际发生了什么

## 环境
- 浏览器:
- 操作系统:
- 版本:

## 优先级
[P0/P1/P2/P3]
```

---

## 📈 测试报告

### 报告内容
1. 测试覆盖率
2. 通过/失败统计
3. 性能指标
4. Bug列表
5. 改进建议

### 报告格式
- HTML报告
- JSON数据
- 终端输出

---

## 🚀 CI/CD 集成

### GitHub Actions
```yaml
触发条件:
- Push到main分支
- Pull Request
- 定时任务(每日)

测试流程:
1. 代码检查(Lint)
2. 单元测试
3. 集成测试
4. E2E测试
5. 构建验证
6. 覆盖率报告
```

---

## 📝 测试检查清单

### 开发阶段
- [ ] 编写单元测试
- [ ] 本地运行测试
- [ ] 测试覆盖率 ≥80%
- [ ] 所有测试通过

### 提交前
- [ ] 运行完整测试套件
- [ ] 检查测试覆盖率
- [ ] 修复失败的测试
- [ ] 更新测试文档

### 发布前
- [ ] 运行E2E测试
- [ ] 性能测试
- [ ] 安全测试
- [ ] 兼容性测试

---

## 🎓 最佳实践

### 测试命名
```typescript
// 好的命名
test('should calculate SMA20 correctly with valid data')
test('should return null when data length < period')

// 不好的命名
test('test1')
test('sma')
```

### 测试结构
```typescript
// AAA模式
describe('SMA Calculator', () => {
  test('should calculate correctly', () => {
    // Arrange - 准备
    const data = generateTestData(50);

    // Act - 执行
    const result = calculateSMA(data, 20);

    // Assert - 断言
    expect(result).toBe(expectedValue);
  });
});
```

### 测试隔离
- 每个测试独立运行
- 不依赖其他测试
- 清理测试数据
- 使用mock避免外部依赖

---

**文档版本**: v1.0
**最后更新**: 2024
**维护人**: 测试团队
