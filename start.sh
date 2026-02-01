#!/bin/bash

# Kinit 项目启动脚本
# 用法: ./start.sh [backend|frontend|all]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 项目路径
PROJECT_ROOT="/projects/kinit"
API_DIR="$PROJECT_ROOT/kinit-api"
REACT_DIR="$PROJECT_ROOT/kinit-react-admin"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Kinit 前后台环境启动脚本${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查参数
MODE=${1:-all}

# 启动后端
start_backend() {
    echo -e "${YELLOW}[1/3] 正在启动后端服务 (FastAPI)...${NC}"
    
    # 检查 Python 环境
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}错误: 未找到 python3，请先安装 Python 3.10+${NC}"
        exit 1
    fi
    
    # 检查虚拟环境
    if [ ! -d "$API_DIR/venv" ] && [ ! -d "$API_DIR/.venv" ]; then
        echo -e "${YELLOW}创建 Python 虚拟环境...${NC}"
        cd "$API_DIR"
        python3 -m venv venv
    fi
    
    # 激活虚拟环境
    if [ -d "$API_DIR/venv" ]; then
        source "$API_DIR/venv/bin/activate"
    elif [ -d "$API_DIR/.venv" ]; then
        source "$API_DIR/.venv/bin/activate"
    fi
    
    # 安装依赖
    echo -e "${YELLOW}安装后端依赖...${NC}"
    cd "$API_DIR"
    pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/ --quiet
    
    # 启动后端服务
    echo -e "${GREEN}后端服务启动中，端口: 9000${NC}"
    python main.py run &
    BACKEND_PID=$!
    echo $BACKEND_PID > /tmp/kinit-backend.pid
    
    sleep 3
    echo -e "${GREEN}✓ 后端服务已启动 (PID: $BACKEND_PID)${NC}"
    echo -e "${GREEN}  API 文档: http://localhost:9000/docs${NC}"
    echo ""
}

# 启动前端
start_frontend() {
    echo -e "${YELLOW}[2/3] 正在启动前端服务 (React + Vite)...${NC}"
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}错误: 未找到 Node.js，请先安装 Node.js 18+${NC}"
        exit 1
    fi
    
    # 检查 pnpm
    if ! command -v pnpm &> /dev/null; then
        echo -e "${YELLOW}安装 pnpm...${NC}"
        npm install -g pnpm
    fi
    
    # 安装前端依赖
    echo -e "${YELLOW}安装前端依赖...${NC}"
    cd "$REACT_DIR"
    
    if [ ! -d "node_modules" ]; then
        pnpm install
    fi
    
    # 启动前端服务
    echo -e "${GREEN}前端服务启动中，端口: 4000${NC}"
    pnpm dev &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > /tmp/kinit-frontend.pid
    
    sleep 3
    echo -e "${GREEN}✓ 前端服务已启动 (PID: $FRONTEND_PID)${NC}"
    echo -e "${GREEN}  前端地址: http://localhost:4000${NC}"
    echo ""
}

# 显示访问信息
show_info() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}   所有服务已启动成功！${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${YELLOW}访问地址:${NC}"
    echo -e "  前端界面: ${GREEN}http://localhost:4000${NC}"
    echo -e "  后端 API: ${GREEN}http://localhost:9000${NC}"
    echo -e "  API 文档: ${GREEN}http://localhost:9000/docs${NC}"
    echo -e "  原版前端: ${GREEN}http://localhost:5173${NC} (如果启动了)"
    echo ""
    echo -e "${YELLOW}测试账号:${NC}"
    echo -e "  用户名: ${GREEN}admin${NC}"
    echo -e "  密码:   ${GREEN}123456${NC}"
    echo ""
    echo -e "${YELLOW}常用命令:${NC}"
    echo -e "  停止后端:   ${GREEN}kill \$(cat /tmp/kinit-backend.pid)${NC}"
    echo -e "  停止前端:   ${GREEN}kill \$(cat /tmp/kinit-frontend.pid)${NC}"
    echo -e "  查看日志:   ${GREEN}tail -f /tmp/kinit-*.log${NC}"
    echo ""
    echo -e "${GREEN}按 Ctrl+C 停止所有服务${NC}"
}

# 清理函数
cleanup() {
    echo ""
    echo -e "${YELLOW}正在停止所有服务...${NC}"
    
    if [ -f /tmp/kinit-backend.pid ]; then
        kill $(cat /tmp/kinit-backend.pid) 2>/dev/null || true
        rm -f /tmp/kinit-backend.pid
    fi
    
    if [ -f /tmp/kinit-frontend.pid ]; then
        kill $(cat /tmp/kinit-frontend.pid) 2>/dev/null || true
        rm -f /tmp/kinit-frontend.pid
    fi
    
    echo -e "${GREEN}✓ 所有服务已停止${NC}"
    exit 0
}

# 捕获 Ctrl+C
trap cleanup INT TERM

# 根据参数执行
if [ "$MODE" = "backend" ]; then
    start_backend
elif [ "$MODE" = "frontend" ]; then
    start_frontend
elif [ "$MODE" = "all" ]; then
    start_backend
    start_frontend
    show_info
    
    # 保持脚本运行
    wait
else
    echo -e "${RED}用法: $0 [backend|frontend|all]${NC}"
    exit 1
fi
