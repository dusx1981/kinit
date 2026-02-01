#!/bin/bash

# Docker 环境启动脚本
# 一键启动所有服务（包括数据库）

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Kinit Docker 环境启动${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "错误: 未找到 Docker，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "错误: 未找到 docker-compose，请先安装"
    exit 1
fi

cd /projects/kinit

# 启动所有服务
echo -e "${YELLOW}启动所有 Docker 服务...${NC}"
docker-compose up -d

echo ""
echo -e "${GREEN}✓ 所有服务已启动！${NC}"
echo ""
echo -e "${YELLOW}服务地址:${NC}"
echo -e "  MySQL:    localhost:3306 (user: root, pass: 123456)"
echo -e "  Redis:    localhost:6379"
echo -e "  MongoDB:  localhost:27017"
echo -e "  API:      http://localhost:9000"
echo -e "  Web:      http://localhost (Nginx)"
echo ""
echo -e "${YELLOW}常用命令:${NC}"
echo -e "  查看日志: docker-compose logs -f"
echo -e "  停止服务: docker-compose down"
echo -e "  重启服务: docker-compose restart"
