#!/bin/bash

echo "=================================="
echo "🚀 启动现货黄金交易监控系统"
echo "=================================="

# 检查依赖是否已安装
if [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  检测到依赖未安装，请先运行: ./setup.sh"
    exit 1
fi

# 启动后端
echo "🔧 启动后端服务..."
cd backend
npm run dev &
BACKEND_PID=$!
echo "✅ 后端服务已启动 (PID: $BACKEND_PID)"
cd ..

# 等待后端启动
sleep 3

# 启动前端
echo "🎨 启动前端应用..."
cd frontend
npm run dev &
FRONTEND_PID=$!
echo "✅ 前端应用已启动 (PID: $FRONTEND_PID)"
cd ..

echo ""
echo "=================================="
echo "✅ 系统启动成功！"
echo "=================================="
echo "📡 后端服务: http://localhost:3001"
echo "🌐 前端应用: http://localhost:3000"
echo "🔌 WebSocket: ws://localhost:3001"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo "=================================="

# 等待用户中断
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
