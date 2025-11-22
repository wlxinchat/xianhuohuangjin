# 贡献指南

感谢您对现货黄金交易监控系统的关注！我们欢迎任何形式的贡献。

## 开发环境设置

1. Fork 本仓库
2. 克隆到本地
```bash
git clone https://github.com/your-username/xianhuohuangjin.git
cd xianhuohuangjin
```

3. 安装依赖
```bash
./setup.sh
```

4. 创建开发分支
```bash
git checkout -b feature/your-feature-name
```

## 代码规范

### TypeScript
- 使用严格模式
- 为所有函数添加类型注解
- 使用有意义的变量名
- 添加必要的注释

### 前端 (React)
- 使用函数式组件和 Hooks
- 组件文件使用 PascalCase
- Props 定义明确的接口
- 使用 Tailwind CSS 进行样式开发

### 后端 (Node.js)
- 使用 async/await 处理异步操作
- 统一的错误处理
- API 返回统一格式
- 添加适当的日志

## 提交规范

使用语义化提交信息：

```
类型: 简短描述

详细描述（可选）

关闭的 Issue（可选）
```

### 提交类型
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具相关

### 示例
```
feat: 添加布林带技术指标

- 实现布林带计算算法
- 在前端展示布林带
- 更新交易信号算法

Closes #123
```

## 功能开发流程

1. **创建 Issue**: 描述要添加的功能或修复的 Bug
2. **讨论方案**: 在 Issue 中讨论实现方案
3. **开发**: 在开发分支上实现功能
4. **测试**: 确保功能正常工作
5. **提交 PR**: 创建 Pull Request
6. **代码审查**: 等待维护者审查
7. **合并**: 审查通过后合并到主分支

## 添加新技术指标

1. 在 `backend/src/indicators/` 创建新文件
```typescript
// backend/src/indicators/bollinger.ts
import { PriceData } from '../types';

export function calculateBollingerBands(
  data: PriceData[],
  period: number = 20,
  stdDev: number = 2
): { upper: number; middle: number; lower: number } | null {
  // 实现算法
}
```

2. 在类型定义中添加
```typescript
// backend/src/types/index.ts
export interface TechnicalIndicators {
  // ... 现有指标
  bollinger?: {
    upper: number | null;
    middle: number | null;
    lower: number | null;
  };
}
```

3. 集成到信号生成器
```typescript
// backend/src/analysis/signalGenerator.ts
import { calculateBollingerBands } from '../indicators/bollinger';

// 在 calculateIndicators 方法中添加
```

4. 更新前端展示
```typescript
// frontend/src/components/IndicatorsCard.tsx
// 添加布林带的展示组件
```

## 测试

### 运行测试
```bash
# 后端测试
cd backend
npm test

# 前端测试
cd frontend
npm test
```

### 编写测试
为新功能添加单元测试和集成测试

## 文档

- 更新 README.md
- 更新 API.md
- 添加代码注释
- 更新类型定义

## Pull Request 检查清单

提交 PR 前确保：

- [ ] 代码遵循项目规范
- [ ] 添加了必要的测试
- [ ] 所有测试通过
- [ ] 更新了相关文档
- [ ] 提交信息清晰明确
- [ ] 没有合并冲突
- [ ] 代码经过自我审查

## 需要帮助？

- 查看现有的 Issues 和 PRs
- 在 Issue 中提问
- 阅读代码和文档

## 行为准则

- 尊重所有贡献者
- 建设性的反馈
- 专注于问题本身
- 保持友好和专业

## 许可证

贡献的代码将遵循项目的 MIT 许可证。

---

感谢您的贡献！🎉
