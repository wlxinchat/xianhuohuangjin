#!/bin/bash

echo "=================================="
echo "🐳 使用 Docker 启动黄金交易监控系统"
echo "=================================="

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: 未检测到 Docker，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ 错误: 未检测到 Docker Compose，请先安装 Docker Compose"
    exit 1
fi

echo "✅ Docker 版本: $(docker --version)"
echo "✅ Docker Compose 版本: $(docker-compose --version 2>/dev/null || docker compose version)"
echo ""

# 停止并删除旧容器
echo "🧹 清理旧容器..."
docker-compose down 2>/dev/null || docker compose down 2>/dev/null

# 构建并启动服务
echo "🔨 构建 Docker 镜像..."
docker-compose build || docker compose build

if [ $? -ne 0 ]; then
    echo "❌ Docker 镜像构建失败"
    exit 1
fi

echo ""
echo "🚀 启动服务..."
docker-compose up -d || docker compose up -d

if [ $? -ne 0 ]; then
    echo "❌ 服务启动失败"
    exit 1
fi

echo ""
echo "=================================="
echo "✅ 系统启动成功！"
echo "=================================="
echo "📡 后端服务: http://localhost:3012"
echo "🌐 前端应用: http://localhost:3011"
echo "🔌 WebSocket: ws://localhost:3012"
echo ""
echo "查看日志: docker-compose logs -f"
echo "停止服务: docker-compose down"
echo "=================================="
