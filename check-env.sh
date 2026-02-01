#!/bin/bash

# 环境检测脚本
# 检查前后端环境是否就绪

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Kinit 环境检测${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检测 Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓ Python: $PYTHON_VERSION${NC}"
else
    echo -e "${RED}✗ Python3 未安装${NC}"
fi

# 检测 Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js 未安装${NC}"
fi

# 检测 pnpm
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    echo -e "${GREEN}✓ pnpm: $PNPM_VERSION${NC}"
else
    echo -e "${RED}✗ pnpm 未安装${NC}"
    echo -e "${YELLOW}  安装命令: npm install -g pnpm${NC}"
fi

# 检测 Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✓ Docker: $DOCKER_VERSION${NC}"
else
    echo -e "${YELLOW}⚠ Docker 未安装（可选）${NC}"
fi

echo ""
echo -e "${YELLOW}项目文件检测:${NC}"

# 检测后端
cd /projects/kinit
if [ -d "kinit-api/venv" ] || [ -d "kinit-api/.venv" ]; then
    echo -e "${GREEN}✓ 后端虚拟环境已创建${NC}"
else
    echo -e "${YELLOW}⚠ 后端虚拟环境未创建${NC}"
fi

if [ -d "kinit-react-admin/node_modules" ]; then
    echo -e "${GREEN}✓ 前端依赖已安装${NC}"
else
    echo -e "${YELLOW}⚠ 前端依赖未安装${NC}"
fi

if [ -d "kinit-admin/node_modules" ]; then
    echo -e "${GREEN}✓ 原 Vue 前端依赖已安装${NC}"
else
    echo -e "${YELLOW}⚠ 原 Vue 前端依赖未安装${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   检测完成！${NC}"
echo -e "${GREEN}========================================${NC}"
