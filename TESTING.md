# Kinit 前后台测试指南

## 🚀 快速启动（推荐）

### 方法一：本地开发模式（适合开发调试）

```bash
# 一键启动前后端
cd /projects/kinit
./start.sh

# 或者分别启动
./start.sh backend   # 只启动后端
./start.sh frontend  # 只启动前端
./start.sh all       # 启动全部（默认）
```

### 方法二：Docker 模式（适合完整环境）

```bash
# 启动所有服务（包含 MySQL、Redis、MongoDB）
cd /projects/kinit
./start-docker.sh
```

## 📋 环境要求

### 本地开发模式
- **Python**: 3.10+
- **Node.js**: 18+
- **pnpm**: 8.0.0+

### Docker 模式
- **Docker**: 20.10+
- **docker-compose**: 2.0+

## 🔧 手动安装步骤

### 1. 后端（FastAPI）

```bash
cd /projects/kinit/kinit-api

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 安装依赖（使用阿里云镜像加速）
pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/

# 初始化数据库（需要先创建 MySQL 数据库）
python main.py init --env dev

# 启动服务
python main.py run
```

后端服务默认运行在 `http://localhost:9000`

### 2. 前端（React）

```bash
cd /projects/kinit/kinit-react-admin

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

前端服务默认运行在 `http://localhost:4000`

### 3. 原 Vue 前端（可选）

```bash
cd /projects/kinit/kinit-admin

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

原前端默认运行在 `http://localhost:5173`

## 🧪 测试流程

### 1. 基础功能测试

1. **访问前端页面**
   - 打开 http://localhost:4000
   - 应该看到登录页面

2. **登录测试**
   - 用户名: `admin`
   - 密码: `123456`
   - 点击登录，应该跳转到工作台

3. **菜单导航测试**
   - 点击左侧菜单切换页面
   - 测试 Dashboard 下的：工作台、分析页、地图

4. **标签页功能**
   - 打开多个页面，查看顶部标签页
   - 测试关闭标签页

### 2. API 接口测试

1. **查看 API 文档**
   - 打开 http://localhost:9000/docs
   - 这是 FastAPI 自动生成的 Swagger 文档

2. **测试登录接口**
   ```bash
   curl -X POST "http://localhost:9000/api/v1/auth/login" \
     -H "Content-Type: application/json" \
     -d '{
       "username": "admin",
       "password": "123456"
     }'
   ```

### 3. 对比测试

同时打开两个前端进行对比：

- **React 新版**: http://localhost:4000
- **Vue 原版**: http://localhost:5173 (需要先启动)

对比项：
- 页面加载速度
- 交互响应速度
- 界面风格
- 功能完整性

## 🐛 常见问题

### Q: 后端启动失败，提示数据库连接错误
**A**: 需要先启动数据库服务：
```bash
docker-compose up -d kinit-mysql kinit-redis
```

### Q: 前端启动失败，提示端口被占用
**A**: 修改 `vite.config.ts` 中的端口配置，或使用：
```bash
lsof -ti:4000 | xargs kill -9
```

### Q: 登录失败，提示网络错误
**A**: 检查后端是否正常运行：
```bash
curl http://localhost:9000/docs
```

### Q: 样式加载异常
**A**: 清除浏览器缓存，或使用无痕模式访问

## 📊 性能对比

建议对比以下指标：

| 指标 | Vue 版本 | React 版本 |
|-----|---------|-----------|
| 首屏加载时间 | - | - |
| 打包体积 | - | - |
| 内存占用 | - | - |
| 交互响应 | - | - |

## 📝 测试清单

- [ ] 登录页面正常显示
- [ ] 登录功能正常
- [ ] 工作台页面加载
- [ ] 侧边栏菜单正常
- [ ] 标签页功能正常
- [ ] 分析页图表显示
- [ ] 地图页面加载
- [ ] 用户下拉菜单
- [ ] 全屏功能
- [ ] 响应式布局
- [ ] API 接口正常

## 🔗 相关地址

| 服务 | 地址 | 说明 |
|-----|-----|-----|
| React 前端 | http://localhost:4000 | 新版本 |
| Vue 前端 | http://localhost:5173 | 原版 |
| 后端 API | http://localhost:9000 | FastAPI |
| API 文档 | http://localhost:9000/docs | Swagger |
| MySQL | localhost:3306 | 数据库 |
| Redis | localhost:6379 | 缓存 |

## 📞 技术支持

如有问题，请查看：
- 后端 README: `/projects/kinit/kinit-api/README.md`
- 前端 README: `/projects/kinit/kinit-react-admin/README.md`
