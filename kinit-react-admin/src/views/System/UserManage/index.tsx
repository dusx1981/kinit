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
  Row,
  Col,
  Select,
  Avatar,
  Switch,
  Tooltip,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  EyeOutlined,
  LockOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { UserFormModal } from './components/UserFormModal'
import './index.less'

interface UserItem {
  id: string
  username: string
  nickname: string
  avatar?: string
  email: string
  phone: string
  status: 0 | 1
  deptId: string
  deptName: string
  roleIds: string[]
  roleNames: string[]
  createTime: string
  lastLoginTime?: string
}

export const UserManage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [userList, setUserList] = useState<UserItem[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [searchKeyword, setSearchKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<number | undefined>()
  const [deptFilter, setDeptFilter] = useState<string | undefined>()
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增用户')
  const [currentUser, setCurrentUser] = useState<UserItem | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // Mock 部门数据
  const deptOptions = [
    { label: '总公司', value: '1' },
    { label: '技术部', value: '1-1' },
    { label: '产品部', value: '1-2' },
    { label: '市场部', value: '1-3' },
  ]

  // Mock 角色数据
  const roleOptions = [
    { label: '超级管理员', value: '1' },
    { label: '系统管理员', value: '2' },
    { label: '普通用户', value: '3' },
    { label: '访客', value: '4' },
  ]

  // Mock 用户数据
  const mockUserList: UserItem[] = [
    {
      id: '1',
      username: 'admin',
      nickname: '超级管理员',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      email: 'admin@kinit.com',
      phone: '13800138000',
      status: 1,
      deptId: '1',
      deptName: '总公司',
      roleIds: ['1'],
      roleNames: ['超级管理员'],
      createTime: '2024-01-01 00:00:00',
      lastLoginTime: '2024-02-01 12:30:00',
    },
    {
      id: '2',
      username: 'zhangsan',
      nickname: '张三',
      email: 'zhangsan@example.com',
      phone: '13800138001',
      status: 1,
      deptId: '1-1',
      deptName: '技术部',
      roleIds: ['2'],
      roleNames: ['系统管理员'],
      createTime: '2024-01-02 00:00:00',
      lastLoginTime: '2024-02-01 10:15:00',
    },
    {
      id: '3',
      username: 'lisi',
      nickname: '李四',
      email: 'lisi@example.com',
      phone: '13800138002',
      status: 1,
      deptId: '1-1',
      deptName: '技术部',
      roleIds: ['3'],
      roleNames: ['普通用户'],
      createTime: '2024-01-03 00:00:00',
      lastLoginTime: '2024-01-31 16:45:00',
    },
    {
      id: '4',
      username: 'wangwu',
      nickname: '王五',
      email: 'wangwu@example.com',
      phone: '13800138003',
      status: 0,
      deptId: '1-2',
      deptName: '产品部',
      roleIds: ['3'],
      roleNames: ['普通用户'],
      createTime: '2024-01-04 00:00:00',
    },
    {
      id: '5',
      username: 'zhaoliu',
      nickname: '赵六',
      email: 'zhaoliu@example.com',
      phone: '13800138004',
      status: 1,
      deptId: '1-2',
      deptName: '产品部',
      roleIds: ['3'],
      roleNames: ['普通用户'],
      createTime: '2024-01-05 00:00:00',
      lastLoginTime: '2024-02-01 09:00:00',
    },
  ]

  // 加载用户数据
  const loadUserData = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      let filtered = [...mockUserList]

      if (searchKeyword) {
        filtered = filtered.filter(
          (item) =>
            item.username.includes(searchKeyword) ||
            item.nickname.includes(searchKeyword) ||
            item.email.includes(searchKeyword) ||
            item.phone.includes(searchKeyword)
        )
      }

      if (statusFilter !== undefined) {
        filtered = filtered.filter((item) => item.status === statusFilter)
      }

      if (deptFilter) {
        filtered = filtered.filter((item) => item.deptId === deptFilter)
      }

      setUserList(filtered)
      setPagination((prev) => ({ ...prev, total: filtered.length }))
      setLoading(false)
    }, 500)
  }, [searchKeyword, statusFilter, deptFilter])

  useEffect(() => {
    loadUserData()
  }, [loadUserData])

  // 表格列定义
  const columns: ColumnsType<UserItem> = [
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
      width: 200,
      render: (text, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <Space direction="vertical" size={0}>
            <span style={{ fontWeight: 500 }}>{record.nickname}</span>
            <span style={{ fontSize: 12, color: '#999' }}>{text}</span>
          </Space>
        </Space>
      ),
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      key: 'deptName',
      width: 120,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '角色',
      dataIndex: 'roleNames',
      key: 'roleNames',
      width: 200,
      render: (roles) => (
        <Space size={4}>
          {roles.map((role: string) => (
            <Tag key={role} color="green" style={{ margin: 0 }}>
              {role}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 220,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <span>{record.phone}</span>
          <span style={{ fontSize: 12, color: '#999' }}>{record.email}</span>
        </Space>
      ),
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
          checkedChildren="启用"
          unCheckedChildren="停用"
          disabled={record.username === 'admin'}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看">
            <Button type="text" size="small" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              disabled={record.username === 'admin'}
            />
          </Tooltip>
          <Tooltip title="重置密码">
            <Button
              type="text"
              size="small"
              icon={<LockOutlined />}
              disabled={record.username === 'admin'}
            />
          </Tooltip>
          <Popconfirm
            title="确定删除该用户吗？"
            description="删除后无法恢复，请谨慎操作！"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
            disabled={record.username === 'admin'}
          >
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              disabled={record.username === 'admin'}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 处理搜索
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }))
    loadUserData()
  }

  // 处理重置
  const handleReset = () => {
    setSearchKeyword('')
    setStatusFilter(undefined)
    setDeptFilter(undefined)
    setPagination((prev) => ({ ...prev, current: 1 }))
    loadUserData()
  }

  // 处理新增
  const handleAdd = () => {
    setModalTitle('新增用户')
    setCurrentUser(null)
    setModalVisible(true)
  }

  // 处理编辑
  const handleEdit = (user: UserItem) => {
    setModalTitle('编辑用户')
    setCurrentUser(user)
    setModalVisible(true)
  }

  // 处理删除
  const handleDelete = (id: string) => {
    setUserList((prev) => prev.filter((item) => item.id !== id))
    message.success('删除成功')
  }

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的用户')
      return
    }
    setUserList((prev) => prev.filter((item) => !selectedRowKeys.includes(item.id)))
    setSelectedRowKeys([])
    message.success('批量删除成功')
  }

  // 处理状态变更
  const handleStatusChange = (id: string, status: 0 | 1) => {
    setUserList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    )
    message.success('状态更新成功')
  }

  // 处理表单提交成功
  const handleFormSuccess = (values: any) => {
    if (currentUser) {
      // 编辑
      setUserList((prev) =>
        prev.map((item) =>
          item.id === currentUser.id
            ? {
                ...item,
                ...values,
                status: values.status ? 1 : 0,
                deptName: deptOptions.find((d) => d.value === values.deptId)?.label || item.deptName,
                roleNames: roleOptions
                  .filter((r) => values.roleIds?.includes(r.value))
                  .map((r) => r.label),
              }
            : item
        )
      )
      message.success('更新成功')
    } else {
      // 新增
      const newUser: UserItem = {
        id: Date.now().toString(),
        ...values,
        status: values.status ? 1 : 0,
        deptName: deptOptions.find((d) => d.value === values.deptId)?.label || '',
        roleNames: roleOptions
          .filter((r) => values.roleIds?.includes(r.value))
          .map((r) => r.label),
        createTime: new Date().toLocaleString(),
      }
      setUserList((prev) => [...prev, newUser])
      message.success('创建成功')
    }
    setModalVisible(false)
  }

  return (
    <div className="user-manage-page">
      <Card>
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Space>
              <span style={{ fontSize: 16, fontWeight: 500 }}>
                <UserOutlined /> 用户管理
              </span>
              <Tag color="blue">共 {pagination.total} 个用户</Tag>
            </Space>
          </Col>
          <Col>
            <Space>
              <Input
                placeholder="请输入用户名/昵称"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
              />
              <Select
                placeholder="部门"
                value={deptFilter}
                onChange={setDeptFilter}
                allowClear
                style={{ width: 120 }}
                options={deptOptions}
              />
              <Select
                placeholder="状态"
                value={statusFilter}
                onChange={setStatusFilter}
                allowClear
                style={{ width: 100 }}
                options={[
                  { label: '启用', value: 1 },
                  { label: '停用', value: 0 },
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
                新增用户
              </Button>
              {selectedRowKeys.length > 0 && (
                <Popconfirm
                  title="确定批量删除选中的用户吗？"
                  onConfirm={handleBatchDelete}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button danger icon={<DeleteOutlined />}>
                    批量删除 ({selectedRowKeys.length})
                  </Button>
                </Popconfirm>
              )}
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={userList}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => {
              setPagination((prev) => ({ ...prev, current: page, pageSize: pageSize || 10 }))
            },
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
            getCheckboxProps: (record) => ({
              disabled: record.username === 'admin',
            }),
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <UserFormModal
        visible={modalVisible}
        title={modalTitle}
        initialValues={currentUser}
        deptOptions={deptOptions}
        roleOptions={roleOptions}
        onCancel={() => setModalVisible(false)}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}
