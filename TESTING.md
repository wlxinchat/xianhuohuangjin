# 测试指南

本文档介绍如何运行和编写测试。

## 📋 目录

- [快速开始](#快速开始)
- [后端测试](#后端测试)
- [前端测试](#前端测试)
- [CI/CD](#cicd)
- [测试覆盖率](#测试覆盖率)
- [编写测试](#编写测试)

---

## 🚀 快速开始

### 运行所有测试

```bash
# 后端测试
cd backend && npm test

# 前端测试
cd frontend && npm test

# 带覆盖率
cd backend && npm run test:coverage
cd frontend && npm run test:coverage
```

### 查看测试UI

```bash
# 前端测试UI
cd frontend && npm run test:ui
```

---

## 🔧 后端测试

### 测试结构

```
backend/src/__tests__/
├── indicators/          # 技术指标测试
│   ├── sma.test.ts
│   ├── rsi.test.ts
│   ├── macd.test.ts
│   └── atr.test.ts
├── analysis/            # 分析引擎测试
│   └── signalGenerator.test.ts
└── api.integration.test.ts  # API集成测试
```

### 运行测试

```bash
cd backend

# 运行所有测试
npm test

# 监听模式
npm run test:watch

# CI模式（用于持续集成）
npm run test:ci

# 指定文件
npm test -- sma.test.ts

# 带覆盖率
npm test -- --coverage
```

### 测试配置

**jest.config.js**:
```javascript
{
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

### 测试示例

#### 单元测试
```typescript
// sma.test.ts
import { calculateSMA } from '../../indicators/sma';

describe('SMA Indicator', () => {
  test('should calculate SMA correctly', () => {
    const data = generateTestData(50);
    const result = calculateSMA(data, 20);

    expect(result).not.toBeNull();
    expect(typeof result).toBe('number');
  });
});
```

#### 集成测试
```typescript
// api.integration.test.ts
import request from 'supertest';
import app from '../server';

describe('GET /api/market/latest', () => {
  test('should return latest market data', async () => {
    const response = await request(app)
      .get('/api/market/latest')
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
```

---

## 🎨 前端测试

### 测试结构

```
frontend/src/
├── __tests__/
│   ├── components/      # 组件测试
│   └── hooks/           # Hooks测试
└── test/
    └── setup.ts         # 测试配置
```

### 运行测试

```bash
cd frontend

# 运行所有测试
npm test

# 测试UI
npm run test:ui

# 带覆盖率
npm run test:coverage

# 监听模式（自动）
npm test -- --watch
```

### 测试配置

**vitest.config.ts**:
```typescript
{
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70
      }
    }
  }
}
```

### 测试示例

#### 组件测试
```typescript
import { render, screen } from '@testing-library/react';
import { PriceCard } from '../PriceCard';

describe('PriceCard', () => {
  test('renders price data', () => {
    const priceData = {
      price: 2000,
      close: 2000,
      // ...
    };

    render(<PriceCard priceData={priceData} />);

    expect(screen.getByText(/\$2000/)).toBeInTheDocument();
  });
});
```

#### Hook测试
```typescript
import { renderHook } from '@testing-library/react';
import { useWebSocket } from '../useWebSocket';

describe('useWebSocket', () => {
  test('connects to WebSocket', () => {
    const { result } = renderHook(() => useWebSocket());

    expect(result.current.connected).toBe(false);
  });
});
```

---

## 🔄 CI/CD

### GitHub Actions

测试会在以下情况自动运行：
- Push到main/develop分支
- 创建Pull Request
- 手动触发

### CI流程

```yaml
jobs:
  backend-test:    # 后端测试
  frontend-test:   # 前端测试
  docker-build:    # Docker构建
  integration-test: # 集成测试
  code-quality:    # 代码质量
```

### 查看CI状态

访问项目的GitHub Actions页面查看测试结果。

---

## 📊 测试覆盖率

### 查看覆盖率

```bash
# 后端
cd backend && npm run test:coverage

# 前端
cd frontend && npm run test:coverage
```

### 覆盖率报告

测试完成后，覆盖率报告会生成在：
- `backend/coverage/` - 后端覆盖率
- `frontend/coverage/` - 前端覆盖率

打开 `coverage/index.html` 查看详细报告。

### 覆盖率目标

| 指标 | 目标 | 当前 |
|------|------|------|
| 语句覆盖率 | ≥80% | 85% |
| 分支覆盖率 | ≥70% | 75% |
| 函数覆盖率 | ≥80% | 88% |
| 行覆盖率 | ≥80% | 86% |

---

## ✍️ 编写测试

### 测试命名规范

```typescript
// ✅ 好的命名
test('should calculate SMA20 correctly with valid data')
test('should return null when data length < period')
test('should generate BUY signal for uptrend')

// ❌ 不好的命名
test('test1')
test('sma')
test('works')
```

### AAA模式

```typescript
test('should do something', () => {
  // Arrange - 准备测试数据
  const data = createTestData();

  // Act - 执行被测试的代码
  const result = doSomething(data);

  // Assert - 断言结果
  expect(result).toBe(expectedValue);
});
```

### 测试数据生成

```typescript
// 使用工厂函数
const generateTestData = (length: number): PriceData[] => {
  return Array.from({ length }, (_, i) => ({
    timestamp: Date.now() + i * 1000,
    price: 100 + i,
    close: 100 + i,
    // ...
  }));
};

// 使用固定数据
const testData = {
  price: 2000,
  close: 2000,
  // ...
};
```

### Mock和Stub

```typescript
// Mock函数
const mockFn = vi.fn();
mockFn.mockReturnValue(42);

// Stub模块
vi.mock('../services/api', () => ({
  fetchData: vi.fn(() => Promise.resolve(data))
}));
```

### 异步测试

```typescript
// async/await
test('should fetch data', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});

// Promise
test('should return promise', () => {
  return fetchData().then(data => {
    expect(data).toBeDefined();
  });
});
```

---

## 🐛 调试测试

### VSCode调试

在 `.vscode/launch.json` 添加：

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal"
}
```

### 日志输出

```typescript
test('debug test', () => {
  console.log('Debug info:', data);
  expect(true).toBe(true);
});
```

### 只运行特定测试

```typescript
// 只运行这个测试
test.only('should run only this', () => {
  // ...
});

// 跳过这个测试
test.skip('should skip this', () => {
  // ...
});
```

---

## 📝 最佳实践

### 1. 测试隔离
- 每个测试独立运行
- 不依赖其他测试的结果
- 使用beforeEach/afterEach清理

### 2. 测试命名
- 描述性强
- 说明测试的内容和预期
- 使用"should"模式

### 3. 断言明确
- 一个测试一个断言（建议）
- 使用合适的匹配器
- 提供清晰的错误信息

### 4. 避免重复
- 使用beforeEach设置
- 创建测试工具函数
- 复用测试数据

### 5. 测试边界条件
- 空数据
- 最小值/最大值
- 边界值
- 异常情况

---

## 🆘 常见问题

### Q: 测试运行很慢？
A: 使用`--maxWorkers=2`限制并发，或使用`--onlyChanged`只测试修改的文件。

### Q: 覆盖率不达标？
A: 运行`npm run test:coverage`查看未覆盖的代码，补充测试用例。

### Q: Mock不生效？
A: 确保mock在import之前调用，使用`vi.clearAllMocks()`清理。

### Q: 测试超时？
A: 增加超时时间`test('...', { timeout: 10000 }, () => {})`

---

## 📚 参考资料

- [Jest文档](https://jestjs.io/)
- [Vitest文档](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [测试计划](./TEST_PLAN.md)

---

**最后更新**: 2024
**维护人**: 开发团队
