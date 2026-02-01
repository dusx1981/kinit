# Kinit React Admin 快速测试指南

## 🚀 快速启动（推荐）

### 方式一：本地开发模式

```bash
# 进入项目目录
cd /projects/kinit/kinit-react-admin

# 一键启动（自动安装依赖并启动）
./start.sh

# 或者手动启动
pnpm install
pnpm dev
```

访问地址：http://localhost:4000

### 方式二：启动后端 + 前端（完整环境）

```bash
# 在根目录启动所有服务
cd /projects/kinit
./start.sh
```

## 📝 测试清单

### ✅ 基础功能测试

1. **登录页面**
   - 访问 http://localhost:4000
   - 查看登录页面是否正常显示
   - 测试账号：`admin`，密码：`123456`
   - 点击登录后应跳转到工作台

2. **工作台页面**
   - 查看统计数据卡片
   - 查看访问量趋势图表
   - 查看公告列表
   - 查看进行中的项目
   - 查看动态时间线

3. **分析页**
   - 点击左侧菜单：Dashboard > 分析页
   - 查看销售额趋势图表
   - 查看访问来源饼图
   - 查看用户行为雷达图

4. **地图页**
   - 点击左侧菜单：Dashboard > 地图
   - 查看用户分布柱状图

5. **标签页功能**
   - 打开多个页面
   - 点击顶部标签切换
   - 关闭标签页

6. **用户菜单**
   - 点击右上角头像
   - 查看下拉菜单
   - 测试退出登录

### ✅ Mock API 测试

Mock API 地址：`http://localhost:4000/api/`

可用的 Mock 接口：
- `POST /api/auth/login` - 登录
- `GET /api/auth/info` - 获取用户信息
- `POST /api/auth/logout` - 登出
- `GET /api/user/list` - 获取用户列表
- `GET /api/dashboard/statistics` - 获取统计数据
- `GET /api/dashboard/visitTrend` - 获取访问趋势
- `GET /api/dashboard/sales` - 获取销售数据
- `GET /api/notice/list` - 获取公告列表

### ✅ 响应式测试

1. **桌面端**
   - 最大化浏览器窗口
   - 检查布局是否正常

2. **平板端**
   - 调整窗口宽度到 768px-1024px
   - 检查侧边栏是否可折叠

3. **移动端**
   - 调整窗口宽度到 <768px
   - 检查响应式布局

## 🔧 常见问题

### Q: 端口被占用
```bash
# 查找并杀死占用 4000 端口的进程
lsof -ti:4000 | xargs kill -9
```

### Q: 依赖安装失败
```bash
# 清除缓存重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Q: 样式加载异常
- 清除浏览器缓存
- 使用无痕模式访问
- 检查浏览器控制台是否有错误

### Q: Mock API 不生效
- 检查 `vite.config.ts` 中的 mock 配置
- 重启开发服务器
- 检查浏览器 Network 面板请求是否到达

## 📊 性能对比测试

同时打开两个前端进行对比：

```bash
# 终端 1: 启动 React 新版
cd /projects/kinit/kinit-react-admin
pnpm dev

# 终端 2: 启动 Vue 原版
cd /projects/kinit/kinit-admin
pnpm dev
```

对比地址：
- React 新版：http://localhost:4000
- Vue 原版：http://localhost:5173

对比项：
- [ ] 首屏加载时间
- [ ] 打包体积大小
- [ ] 内存占用情况
- [ ] 交互响应速度
- [ ] 动画流畅度

## 🐛 问题反馈

如果发现 bug 或问题，请记录：
1. 问题描述
2. 复现步骤
3. 浏览器版本
4. 控制台报错信息

## 📞 技术支持

- 后端 API 文档：http://localhost:9000/docs
- 项目 README：/projects/kinit/kinit-react-admin/README.md
