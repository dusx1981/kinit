import React, { useState, useEffect, useCallback } from 'react'
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Popconfirm,
  message,
  Switch,
  Row,
  Col,
  Select,
  Tree,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  MenuOutlined,
  DownOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { MenuFormModal } from './components/MenuFormModal'
import './index.less'

interface MenuItem {
  id: string
  name: string
  path: string
  component?: string
  icon?: string
  parentId: string | null
  sort: number
  status: 0 | 1
  type: 0 | 1 | 2 // 0: 目录 1: 菜单 2: 按钮
  permission?: string
  createTime: string
  children?: MenuItem[]
}

export const MenuManage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [menuList, setMenuList] = useState<MenuItem[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [typeFilter, setTypeFilter] = useState<number | undefined>()
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增菜单')
  const [currentMenu, setCurrentMenu] = useState<MenuItem | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table')

  // Mock 菜单数据
  const mockMenuList: MenuItem[] = [
    {
      id: '1',
      name: '仪表盘',
      path: '/dashboard',
      icon: 'DashboardOutlined',
      parentId: null,
      sort: 0,
      status: 1,
      type: 0,
      createTime: '2024-01-01 00:00:00',
      children: [
        {
          id: '1-1',
          name: '工作台',
          path: '/dashboard/workplace',
          component: 'Dashboard/Workplace',
          icon: 'HomeOutlined',
          parentId: '1',
          sort: 0,
          status: 1,
          type: 1,
          permission: 'dashboard:workplace',
          createTime: '2024-01-01 00:00:00',
        },
        {
          id: '1-2',
          name: '分析页',
          path: '/dashboard/analysis',
          component: 'Dashboard/Analysis',
          icon: 'AreaChartOutlined',
          parentId: '1',
          sort: 1,
          status: 1,
          type: 1,
          permission: 'dashboard:analysis',
          createTime: '2024-01-01 00:00:00',
        },
        {
          id: '1-3',
          name: '地图',
          path: '/dashboard/map',
          component: 'Dashboard/Map',
          icon: 'GlobalOutlined',
          parentId: '1',
          sort: 2,
          status: 1,
          type: 1,
          permission: 'dashboard:map',
          createTime: '2024-01-01 00:00:00',
        },
      ],
    },
    {
      id: '2',
      name: '系统管理',
      path: '/system',
      icon: 'SettingOutlined',
      parentId: null,
      sort: 1,
      status: 1,
      type: 0,
      createTime: '2024-01-01 00:00:00',
      children: [
        {
          id: '2-1',
          name: '用户管理',
          path: '/system/user',
          component: 'System/UserManage',
          icon: 'UserOutlined',
          parentId: '2',
          sort: 0,
          status: 1,
          type: 1,
          permission: 'system:user',
          createTime: '2024-01-01 00:00:00',
          children: [
            {
              id: '2-1-1',
              name: '查看',
              path: '',
              parentId: '2-1',
              sort: 0,
              status: 1,
              type: 2,
              permission: 'user:view',
              createTime: '2024-01-01 00:00:00',
            },
            {
              id: '2-1-2',
              name: '新增',
              path: '',
              parentId: '2-1',
              sort: 1,
              status: 1,
              type: 2,
              permission: 'user:create',
              createTime: '2024-01-01 00:00:00',
            },
            {
              id: '2-1-3',
              name: '编辑',
              path: '',
              parentId: '2-1',
              sort: 2,
              status: 1,
              type: 2,
              permission: 'user:update',
              createTime: '2024-01-01 00:00:00',
            },
            {
              id: '2-1-4',
              name: '删除',
              path: '',
              parentId: '2-1',
              sort: 3,
              status: 1,
              type: 2,
              permission: 'user:delete',
              createTime: '2024-01-01 00:00:00',
            },
          ],
        },
        {
          id: '2-2',
          name: '角色管理',
          path: '/system/role',
          component: 'System/RoleManage',
          icon: 'SafetyOutlined',
          parentId: '2',
          sort: 1,
          status: 1,
          type: 1,
          permission: 'system:role',
          createTime: '2024-01-01 00:00:00',
        },
        {
          id: '2-3',
          name: '部门管理',
          path: '/system/dept',
          component: 'System/DeptManage',
          icon: 'TeamOutlined',
          parentId: '2',
          sort: 2,
          status: 1,
          type: 1,
          permission: 'system:dept',
          createTime: '2024-01-01 00:00:00',
        },
        {
          id: '2-4',
          name: '菜单管理',
          path: '/system/menu',
          component: 'System/MenuManage',
          icon: 'MenuOutlined',
          parentId: '2',
          sort: 3,
          status: 1,
          type: 1,
          permission: 'system:menu',
          createTime: '2024-01-01 00:00:00',
        },
      ],
    },
  ]

  // 加载菜单数据
  const loadMenuData = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      let filtered = [...mockMenuList]

      if (searchKeyword) {
        filtered = filtered.filter(
          (item) =>
            item.name.includes(searchKeyword) ||
            item.path?.includes(searchKeyword) ||
            item.permission?.includes(searchKeyword)
        )
      }

      if (typeFilter !== undefined) {
        filtered = filtered.filter((item) => item.type === typeFilter)
      }

      setMenuList(filtered)

      // 默认展开所有节点
      const keys: React.Key[] = []
      const collectKeys = (items: MenuItem[]) => {
        items.forEach((item) => {
          if (item.children && item.children.length > 0) {
            keys.push(item.id)
            collectKeys(item.children)
          }
        })
      }
      collectKeys(filtered)
      setExpandedKeys(keys)

      setLoading(false)
    }, 500)
  }, [searchKeyword, typeFilter])

  useEffect(() => {
    loadMenuData()
  }, [loadMenuData])

  // 表格列定义
  const columns: ColumnsType<MenuWithLevel> = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        <Space>
          <span>{text}</span>
          {record.type === 0 && <Tag color="blue">目录</Tag>}
          {record.type === 1 && <Tag color="green">菜单</Tag>}
          {record.type === 2 && <Tag>按钮</Tag>}
        </Space>
      ),
    },
    {
      title: '路由路径',
      dataIndex: 'path',
      key: 'path',
      width: 200,
      render: (text) => text || '-',
    },
    {
      title: '组件路径',
      dataIndex: 'component',
      key: 'component',
      width: 200,
      render: (text) => text || '-',
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
      key: 'permission',
      width: 150,
      render: (text) => (text ? <Tag color="purple">{text}</Tag> : '-'),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (status, record) => (
        <Switch
          checked={status === 1}
          onChange={(checked) => handleStatusChange(record.id, checked ? 1 : 0)}
          checkedChildren="显示"
          unCheckedChildren="隐藏"
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => handleAddChild(record)}
            disabled={record.type === 2}
          >
            新增
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该菜单吗？"
            description="删除后无法恢复，请谨慎操作！"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

interface MenuWithLevel extends MenuItem {
  level: number
}

  // 将树形数据扁平化为表格数据
  const flattenTree = (data: MenuItem[], level = 0): MenuWithLevel[] => {
    const result: MenuWithLevel[] = []
    data.forEach((item) => {
      result.push({ ...item, level })
      if (item.children && item.children.length > 0) {
        result.push(...flattenTree(item.children, level + 1))
      }
    })
    return result
  }

  // 处理搜索
  const handleSearch = () => {
    loadMenuData()
  }

  // 处理重置
  const handleReset = () => {
    setSearchKeyword('')
    setTypeFilter(undefined)
    loadMenuData()
  }

  // 处理新增
  const handleAdd = () => {
    setModalTitle('新增菜单')
    setCurrentMenu(null)
    setModalVisible(true)
  }

  // 处理新增子菜单
  const handleAddChild = (parent: MenuItem) => {
    setModalTitle(`新增${parent.type === 0 ? '菜单' : '按钮'} - ${parent.name}`)
    setCurrentMenu({ id: '', name: '', path: '', parentId: parent.id, sort: 0, status: 1, type: parent.type === 0 ? 1 : 2, createTime: '' } as MenuItem)
    setModalVisible(true)
  }

  // 处理编辑
  const handleEdit = (menu: MenuItem) => {
    setModalTitle('编辑菜单')
    setCurrentMenu(menu)
    setModalVisible(true)
  }

  // 处理删除
  const handleDelete = (_id: string) => {
    message.success('删除成功')
    loadMenuData()
  }

  // 处理状态变更
  const handleStatusChange = (_id: string, _status: 0 | 1) => {
    message.success('状态更新成功')
    loadMenuData()
  }

  // 处理表单提交成功
  const handleFormSuccess = () => {
    setModalVisible(false)
    loadMenuData()
  }

  // 渲染树形结构
  const renderTree = (data: MenuItem[]): any[] => {
    return data.map((item) => ({
      title: (
        <Space>
          <span style={{ fontWeight: item.parentId ? 'normal' : 'bold' }}>{item.name}</span>
          {item.type === 0 && <Tag color="blue">目录</Tag>}
          {item.type === 1 && <Tag color="green">菜单</Tag>}
          {item.type === 2 && <Tag>按钮</Tag>}
          {item.permission && <Tag color="purple">{item.permission}</Tag>}
        </Space>
      ),
      key: item.id,
      children: item.children ? renderTree(item.children) : undefined,
    }))
  }

  return (
    <div className="menu-manage-page">
      <Card>
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Space>
              <span style={{ fontSize: 16, fontWeight: 500 }}>
                <MenuOutlined /> 菜单管理
              </span>
              <Tag color="blue">共 {flattenTree(menuList).length} 个菜单</Tag>
            </Space>
          </Col>
          <Col>
            <Space>
              <Input
                placeholder="请输入菜单名称"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined />}
                style={{ width: 220 }}
              />
              <Select
                placeholder="类型"
                value={typeFilter}
                onChange={setTypeFilter}
                allowClear
                style={{ width: 120 }}
                options={[
                  { label: '目录', value: 0 },
                  { label: '菜单', value: 1 },
                  { label: '按钮', value: 2 },
                ]}
              />
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                新增菜单
              </Button>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button type={viewMode === 'table' ? 'primary' : 'default'} onClick={() => setViewMode('table')}>
                表格视图
              </Button>
              <Button type={viewMode === 'tree' ? 'primary' : 'default'} onClick={() => setViewMode('tree')}>
                树形视图
              </Button>
            </Space>
          </Col>
        </Row>

        {viewMode === 'table' ? (
          <Table
            columns={columns}
            dataSource={flattenTree(menuList)}
            rowKey="id"
            loading={loading}
            pagination={false}
            scroll={{ x: 1200 }}
            rowClassName={(record) => `menu-level-${record.level}`}
          />
        ) : (
          <Card style={{ minHeight: 400 }}>
            <Tree showLine showIcon defaultExpandAll expandedKeys={expandedKeys} onExpand={setExpandedKeys} treeData={renderTree(menuList) as any} switcherIcon={<DownOutlined />} />
          </Card>
        )}
      </Card>

      <MenuFormModal visible={modalVisible} title={modalTitle} initialValues={currentMenu} menuTree={menuList} onCancel={() => setModalVisible(false)} onSuccess={handleFormSuccess} />
    </div>
  )
}
