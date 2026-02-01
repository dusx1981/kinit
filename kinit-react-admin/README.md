# kinit-react-admin

基于 React 18、Ant Design 5、TypeScript 5、Vite 5 的后台管理系统。

## 特性

- **React 18** - 最新的 React 版本，支持并发特性
- **Ant Design 5** - 企业级 UI 设计语言和组件库
- **TypeScript** - 类型安全
- **Vite 5** - 极速构建工具
- **Zustand** - 轻量级状态管理
- **React Router 6** - 声明式路由
- **Axios** - HTTP 客户端
- **ECharts** - 数据可视化

## 项目结构

```
kinit-react-admin
├── src
│   ├── api           # API 接口
│   ├── assets        # 静态资源
│   ├── components    # 公共组件
│   ├── hooks         # 自定义 Hooks
│   ├── layouts       # 布局组件
│   ├── router        # 路由配置
│   ├── stores        # 状态管理
│   ├── styles        # 全局样式
│   ├── utils         # 工具函数
│   ├── views         # 页面组件
│   ├── App.tsx       # 根组件
│   ├── main.tsx      # 入口文件
│   └── vite-env.d.ts # 类型声明
├── types             # 全局类型
├── public            # 公共资源
├── index.html        # HTML 模板
├── package.json      # 项目配置
├── vite.config.ts    # Vite 配置
├── tsconfig.json     # TypeScript 配置
└── README.md         # 项目说明
```

## 开始使用

### 环境要求

- Node.js >= 18
- pnpm >= 8.0.0

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
# 生产环境
pnpm build:pro

# 开发环境
pnpm build:dev
```

### 代码检查

```bash
# ESLint
pnpm lint:eslint

# Prettier
pnpm lint:prettier
```

## 浏览器支持

- Chrome >= 80
- Firefox >= 80
- Safari >= 14
- Edge >= 80

## 许可证

MIT
