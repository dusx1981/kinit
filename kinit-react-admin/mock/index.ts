import { MockMethod } from 'vite-plugin-mock'

// 部门数据
const deptData = [
  {
    id: '1',
    name: '总公司',
    code: ' headquarter',
    parentId: null,
    sort: 0,
    status: 1,
    leader: '张总',
    phone: '13800138000',
    email: 'ceo@company.com',
    remark: '公司最高管理层',
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-01 00:00:00',
    children: [
      {
        id: '1-1',
        name: '技术部',
        code: 'tech',
        parentId: '1',
        sort: 0,
        status: 1,
        leader: '李经理',
        phone: '13800138001',
        email: 'tech@company.com',
        remark: '负责产品研发',
        createTime: '2024-01-01 00:00:00',
        updateTime: '2024-01-01 00:00:00',
        children: [
          {
            id: '1-1-1',
            name: '前端组',
            code: 'frontend',
            parentId: '1-1',
            sort: 0,
            status: 1,
            leader: '王组长',
            phone: '13800138002',
            email: 'frontend@company.com',
            remark: '负责前端开发',
            createTime: '2024-01-02 00:00:00',
            updateTime: '2024-01-02 00:00:00',
          },
          {
            id: '1-1-2',
            name: '后端组',
            code: 'backend',
            parentId: '1-1',
            sort: 1,
            status: 1,
            leader: '刘组长',
            phone: '13800138003',
            email: 'backend@company.com',
            remark: '负责后端开发',
            createTime: '2024-01-02 00:00:00',
            updateTime: '2024-01-02 00:00:00',
          },
        ],
      },
      {
        id: '1-2',
        name: '产品部',
        code: 'product',
        parentId: '1',
        sort: 1,
        status: 1,
        leader: '赵经理',
        phone: '13800138004',
        email: 'product@company.com',
        remark: '负责产品规划',
        createTime: '2024-01-01 00:00:00',
        updateTime: '2024-01-01 00:00:00',
      },
      {
        id: '1-3',
        name: '市场部',
        code: 'marketing',
        parentId: '1',
        sort: 2,
        status: 1,
        leader: '陈经理',
        phone: '13800138005',
        email: 'marketing@company.com',
        remark: '负责市场推广',
        createTime: '2024-01-01 00:00:00',
        updateTime: '2024-01-01 00:00:00',
      },
    ],
  },
]

export default [
  // 登录接口
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body

      if (username === 'admin' && password === '123456') {
        return {
          code: 200,
          message: '登录成功',
          data: {
            token: 'mock-token-' + Date.now(),
            userInfo: {
              id: '1',
              username: 'admin',
              nickname: '系统管理员',
              avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
              email: 'admin@kinit.com',
              phone: '13800138000',
              roles: ['super_admin'],
              permissions: ['*'],
              deptId: '1',
              deptName: '总公司',
            },
          },
        }
      }

      return {
        code: 401,
        message: '用户名或密码错误',
        data: null,
      }
    },
  },

  // 获取用户信息
  {
    url: '/api/auth/info',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          id: '1',
          username: 'admin',
          nickname: '系统管理员',
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          email: 'admin@kinit.com',
          phone: '13800138000',
          roles: ['super_admin'],
          permissions: ['*'],
          deptId: '1',
          deptName: '总公司',
        },
      }
    },
  },

  // 登出
  {
    url: '/api/auth/logout',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '登出成功',
        data: null,
      }
    },
  },

  // 获取用户列表
  {
    url: '/api/user/list',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10 } = query

      const users = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        username: `user${i + 1}`,
        nickname: `用户${i + 1}`,
        email: `user${i + 1}@example.com`,
        phone: `1380013${String(i + 1).padStart(4, '0')}`,
        status: i % 3 === 0 ? 0 : 1,
        deptId: i % 2 === 0 ? '1-1' : '1-2',
        deptName: i % 2 === 0 ? '技术部' : '产品部',
        roleIds: [i % 2 === 0 ? '2' : '3'],
        roleNames: [i % 2 === 0 ? '系统管理员' : '普通用户'],
        createTime: new Date(Date.now() - i * 86400000).toISOString(),
      }))

      const start = (page - 1) * pageSize
      const end = start + parseInt(pageSize)

      return {
        code: 200,
        message: 'success',
        data: {
          list: users.slice(start, end),
          total: users.length,
        },
      }
    },
  },

  // 部门管理接口
  {
    url: '/api/dept/tree',
    method: 'get',
    response: ({ query }) => {
      const { keyword } = query

      if (keyword) {
        // 过滤部门
        const filterDept = (depts: any[]): any[] => {
          return depts.filter((dept) => {
            if (dept.name.includes(keyword) || dept.code.includes(keyword)) {
              return true
            }
            if (dept.children) {
              dept.children = filterDept(dept.children)
              return dept.children.length > 0
            }
            return false
          })
        }
        return {
          code: 200,
          message: 'success',
          data: filterDept(JSON.parse(JSON.stringify(deptData))),
        }
      }

      return {
        code: 200,
        message: 'success',
        data: deptData,
      }
    },
  },

  {
    url: '/api/dept/list',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: deptData,
      }
    },
  },

  {
    url: '/api/dept',
    method: 'post',
    response: ({ body }) => {
      return {
        code: 200,
        message: '创建成功',
        data: {
          id: Date.now().toString(),
          ...body,
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
        },
      }
    },
  },

  {
    url: '/api/dept/:id',
    method: 'put',
    response: ({ body, query }) => {
      return {
        code: 200,
        message: '更新成功',
        data: {
          ...body,
          updateTime: new Date().toISOString(),
        },
      }
    },
  },

  {
    url: '/api/dept/:id',
    method: 'delete',
    response: () => {
      return {
        code: 200,
        message: '删除成功',
        data: null,
      }
    },
  },

  {
    url: '/api/dept/:id/status',
    method: 'put',
    response: () => {
      return {
        code: 200,
        message: '状态更新成功',
        data: null,
      }
    },
  },

  // 获取统计数据
  {
    url: '/api/dashboard/statistics',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          totalUsers: 126560,
          totalVisits: 8846,
          totalOrders: 1268,
          totalIncome: 126560,
          userGrowth: 12,
          visitGrowth: 8,
          orderGrowth: -5,
          incomeGrowth: 15,
        },
      }
    },
  },

  // 获取访问量趋势
  {
    url: '/api/dashboard/visitTrend',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          values: [120, 132, 101, 134, 90, 230, 210],
        },
      }
    },
  },

  // 获取销售数据
  {
    url: '/api/dashboard/sales',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          sales: [12000, 13200, 10100, 13400, 9000, 23000, 21000, 20000, 18000, 22000, 25000, 28000],
          orders: [120, 132, 101, 134, 90, 230, 210, 200, 180, 220, 250, 280],
        },
      }
    },
  },

  // 获取公告列表
  {
    url: '/api/notice/list',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: [
          { id: 1, title: '系统将于今晚进行例行维护', date: '2小时前', type: '系统' },
          { id: 2, title: '新版本 v2.0 已发布', date: '1天前', type: '更新' },
          { id: 3, title: '安全提醒：请及时修改默认密码', date: '2天前', type: '安全' },
          { id: 4, title: '国庆假期系统维护通知', date: '3天前', type: '通知' },
          { id: 5, title: '新增数据分析功能', date: '5天前', type: '功能' },
        ],
      }
    },
  },
] as MockMethod[]
