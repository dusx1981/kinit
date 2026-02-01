#!/bin/bash

# 快速测试脚本 - 启动 React 前端

cd /projects/kinit/kinit-react-admin

echo "=========================================="
echo "  Kinit React Admin 快速启动"
echo "=========================================="
echo ""

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    pnpm install
fi

# 启动服务
echo "🚀 启动开发服务器..."
echo ""
echo "启动完成后可访问:"
echo "  - 前端页面: http://localhost:4000"
echo "  - Mock API: http://localhost:4000/api/"
echo ""
echo "测试账号: admin / 123456"
echo ""
echo "按 Ctrl+C 停止服务"
echo "=========================================="
echo ""

pnpm dev
