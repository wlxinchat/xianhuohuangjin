#!/bin/bash

echo "=================================="
echo "🔍 项目完整性验证"
echo "=================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (缺失)"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        return 0
    else
        echo -e "${RED}✗${NC} $1/ (缺失)"
        return 1
    fi
}

# 统计变量
total=0
passed=0

echo "📁 检查项目结构..."
echo ""

# 根目录文件
echo "根目录文件:"
files=(
    "README.md"
    "QUICKSTART.md"
    "API.md"
    "CONTRIBUTING.md"
    "CHECKLIST.md"
    "PROJECT_SUMMARY.md"
    ".gitignore"
    "setup.sh"
    "start.sh"
)

for file in "${files[@]}"; do
    check_file "$file" && ((passed++))
    ((total++))
done

echo ""

# 后端文件
echo "后端文件:"
backend_files=(
    "backend/package.json"
    "backend/tsconfig.json"
    "backend/.env.example"
    "backend/src/server.ts"
    "backend/src/websocket.ts"
    "backend/src/types/index.ts"
    "backend/src/indicators/sma.ts"
    "backend/src/indicators/rsi.ts"
    "backend/src/indicators/macd.ts"
    "backend/src/indicators/atr.ts"
    "backend/src/services/priceService.ts"
    "backend/src/analysis/signalGenerator.ts"
    "backend/src/routes/api.ts"
)

for file in "${backend_files[@]}"; do
    check_file "$file" && ((passed++))
    ((total++))
done

echo ""

# 前端文件
echo "前端文件:"
frontend_files=(
    "frontend/package.json"
    "frontend/tsconfig.json"
    "frontend/vite.config.ts"
    "frontend/tailwind.config.js"
    "frontend/postcss.config.js"
    "frontend/.eslintrc.json"
    "frontend/.env.example"
    "frontend/index.html"
    "frontend/src/main.tsx"
    "frontend/src/App.tsx"
    "frontend/src/vite-env.d.ts"
    "frontend/src/types/index.ts"
    "frontend/src/components/Header.tsx"
    "frontend/src/components/PriceCard.tsx"
    "frontend/src/components/IndicatorsCard.tsx"
    "frontend/src/components/SignalCard.tsx"
    "frontend/src/components/PriceChart.tsx"
    "frontend/src/hooks/useWebSocket.ts"
    "frontend/src/services/websocket.ts"
    "frontend/src/styles/index.css"
)

for file in "${frontend_files[@]}"; do
    check_file "$file" && ((passed++))
    ((total++))
done

echo ""
echo "=================================="
echo "📊 统计信息"
echo "=================================="
echo ""

# 代码统计
echo "代码文件统计:"
ts_count=$(find . -name "*.ts" -not -path "*/node_modules/*" | wc -l)
tsx_count=$(find . -name "*.tsx" -not -path "*/node_modules/*" | wc -l)
echo "  TypeScript 文件: $ts_count"
echo "  TSX 组件文件: $tsx_count"
echo "  总计: $((ts_count + tsx_count))"
echo ""

echo "代码行数统计:"
total_lines=$(find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')
echo "  总代码行数: $total_lines"
echo ""

echo "文档统计:"
md_count=$(find . -maxdepth 1 -name "*.md" | wc -l)
echo "  Markdown 文档: $md_count 个"
echo ""

echo "=================================="
echo "✅ 检查结果"
echo "=================================="
echo ""

percentage=$((passed * 100 / total))

if [ $passed -eq $total ]; then
    echo -e "${GREEN}✅ 完美！所有文件都存在 ($passed/$total)${NC}"
    echo ""
    echo "🎉 项目结构完整，可以开始使用！"
    echo ""
    echo "下一步:"
    echo "  1. 运行 ./setup.sh 安装依赖"
    echo "  2. 运行 ./start.sh 启动系统"
elif [ $percentage -ge 90 ]; then
    echo -e "${YELLOW}⚠️  项目基本完整 ($passed/$total, $percentage%)${NC}"
    echo "   但有少量文件缺失，请检查"
elif [ $percentage -ge 70 ]; then
    echo -e "${YELLOW}⚠️  项目不完整 ($passed/$total, $percentage%)${NC}"
    echo "   有较多文件缺失，建议重新克隆项目"
else
    echo -e "${RED}❌ 项目严重不完整 ($passed/$total, $percentage%)${NC}"
    echo "   大量文件缺失，请重新克隆项目"
fi

echo ""
echo "=================================="
