#!/bin/bash

echo "=================================="
echo "🚀 启动现货黄金交易监控系统"
echo "=================================="

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未检测到 Node.js，请先安装 Node.js"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"
echo "✅ npm 版本: $(npm -v)"
echo ""

# 安装后端依赖
echo "📦 安装后端依赖..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 后端依赖安装失败"
        exit 1
    fi
else
    echo "✓ 后端依赖已存在"
fi

# 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "📝 创建后端环境变量文件..."
    cp .env.example .env
fi

cd ..

# 安装前端依赖
echo "📦 安装前端依赖..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 前端依赖安装失败"
        exit 1
    fi
else
    echo "✓ 前端依赖已存在"
fi

# 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "📝 创建前端环境变量文件..."
    cp .env.example .env
fi

cd ..

echo ""
echo "=================================="
echo "✅ 安装完成！"
echo "=================================="
echo ""
echo "启动方式："
echo "1. 启动后端: cd backend && npm run dev"
echo "2. 启动前端: cd frontend && npm run dev"
echo ""
echo "或者使用以下命令启动："
echo "./start.sh"
echo ""
