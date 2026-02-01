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
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  SafetyOutlined,
  UserOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { RoleFormModal } from './components/RoleFormModal'
import { RolePermissionModal } from './components/RolePermissionModal'
import './index.less'

interface Role {
  id: string
  name: string
  code: string
  description?: string
  status: 0 | 1
  sort: number
  createTime: string
  userCount: number
  permissions: string[]
}

export const RoleManage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [roleList, setRoleList] = useState<Role[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [searchKeyword, setSearchKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<number | undefined>()
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增角色')
  const [currentRole, setCurrentRole] = useState<Role | null>(null)
  const [permissionModalVisible, setPermissionModalVisible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // Mock 角色数据
  const mockRoleList: Role[] = [
    {
      id: '1',
      name: '超级管理员',
      code: 'super_admin',
      description: '系统超级管理员，拥有所有权限',
      status: 1,
      sort: 0,
      createTime: '2024-01-01 00:00:00',
      userCount: 1,
      permissions: ['*'],
    },
    {
      id: '2',
      name: '系统管理员',
      code: 'admin',
      description: '系统管理员，负责系统配置和用户管理',
      status: 1,
      sort: 1,
      createTime: '2024-01-01 00:00:00',
      userCount: 3,
      permissions: ['user:*', 'role:*', 'dept:*', 'menu:*', 'system:*'],
    },
    {
      id: '3',
      name: '普通用户',
      code: 'user',
      description: '普通用户，拥有基本操作权限',
      status: 1,
      sort: 2,
      createTime: '2024-01-02 00:00:00',
      userCount: 45,
      permissions: ['user:view', 'dept:view'],
    },
    {
      id: '4',
      name: '访客',
      code: 'guest',
      description: '访客用户，仅拥有查看权限',
      status: 0,
      sort: 3,
      createTime: '2024-01-03 00:00:00',
      userCount: 12,
      permissions: ['user:view'],
    },
  ]

  // 加载角色数据
  const loadRoleData = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      let filtered = [...mockRoleList]
      
      if (searchKeyword) {
        filtered = filtered.filter(
          (item) =>
            item.name.includes(searchKeyword) ||
            item.code.includes(searchKeyword) ||
            item.description?.includes(searchKeyword)
        )
      }
      
      if (statusFilter !== undefined) {
        filtered = filtered.filter((item) => item.status === statusFilter)
      }
      
      setRoleList(filtered)
      setPagination((prev) => ({ ...prev, total: filtered.length }))
      setLoading(false)
    }, 500)
  }, [searchKeyword, statusFilter])

  useEffect(() => {
    loadRoleData()
  }, [loadRoleData])

  // 表格列定义
  const columns: ColumnsType<Role> = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text, record) => (
        <Space>
          <SafetyOutlined style={{ color: record.code === 'super_admin' ? '#ff4d4f' : '#1890ff' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      key: 'userCount',
      width: 100,
      align: 'center',
      render: (count) => (
        <Space>
          <UserOutlined />
          <span>{count}</span>
        </Space>
      ),
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
          checkedChildren="启用"
          unCheckedChildren="停用"
          disabled={record.code === 'super_admin'}
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
      width: 250,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => handleAssignPermission(record)}
          >
            分配权限
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={record.code === 'super_admin'}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该角色吗？"
            description="删除后无法恢复，请谨慎操作！"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
            disabled={record.code === 'super_admin'}
          >
            <Button
              type="link"
              danger
              size="small"
              icon={<DeleteOutlined />}
              disabled={record.code === 'super_admin'}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 处理搜索
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }))
    loadRoleData()
  }

  // 处理重置
  const handleReset = () => {
    setSearchKeyword('')
    setStatusFilter(undefined)
    setPagination((prev) => ({ ...prev, current: 1 }))
    loadRoleData()
  }

  // 处理新增
  const handleAdd = () => {
    setModalTitle('新增角色')
    setCurrentRole(null)
    setModalVisible(true)
  }

  // 处理编辑
  const handleEdit = (role: Role) => {
    setModalTitle('编辑角色')
    setCurrentRole(role)
    setModalVisible(true)
  }

  // 处理删除
  const handleDelete = (id: string) => {
    setRoleList((prev) => prev.filter((item) => item.id !== id))
    message.success('删除成功')
  }

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的角色')
      return
    }
    setRoleList((prev) => prev.filter((item) => !selectedRowKeys.includes(item.id)))
    setSelectedRowKeys([])
    message.success('批量删除成功')
  }

  // 处理状态变更
  const handleStatusChange = (id: string, status: 0 | 1) => {
    setRoleList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    )
    message.success('状态更新成功')
  }

  // 处理分配权限
  const handleAssignPermission = (role: Role) => {
    setCurrentRole(role)
    setPermissionModalVisible(true)
  }

  // 处理表单提交成功
  const handleFormSuccess = (values: any) => {
    if (currentRole) {
      // 编辑
      setRoleList((prev) =>
        prev.map((item) =>
          item.id === currentRole.id ? { ...item, ...values, status: values.status ? 1 : 0 } : item
        )
      )
      message.success('更新成功')
    } else {
      // 新增
      const newRole: Role = {
        id: Date.now().toString(),
        ...values,
        status: values.status ? 1 : 0,
        createTime: new Date().toLocaleString(),
        userCount: 0,
        permissions: [],
      }
      setRoleList((prev) => [...prev, newRole])
      message.success('创建成功')
    }
    setModalVisible(false)
  }

  // 处理权限分配成功
  const handlePermissionSuccess = (permissions: string[]) => {
    if (currentRole) {
      setRoleList((prev) =>
        prev.map((item) =>
          item.id === currentRole.id ? { ...item, permissions } : item
        )
      )
      message.success('权限分配成功')
    }
    setPermissionModalVisible(false)
  }

  return (
    <div className="role-manage-page">
      <Card>
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Space>
              <span style={{ fontSize: 16, fontWeight: 500 }}>
                <SafetyOutlined /> 角色管理
              </span>
              <Tag color="blue">共 {pagination.total} 个角色</Tag>
            </Space>
          </Col>
          <Col>
            <Space>
              <Input
                placeholder="请输入角色名称或编码"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined />}
                style={{ width: 220 }}
              />
              <Select
                placeholder="状态"
                value={statusFilter}
                onChange={setStatusFilter}
                allowClear
                style={{ width: 120 }}
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
                新增角色
              </Button>
              {selectedRowKeys.length > 0 && (
                <Popconfirm
                  title="确定批量删除选中的角色吗？"
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
          dataSource={roleList}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({ ...prev, current: page, pageSize: pageSize || 10 }))
            },
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
            getCheckboxProps: (record) => ({
              disabled: record.code === 'super_admin',
            }),
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <RoleFormModal
        visible={modalVisible}
        title={modalTitle}
        initialValues={currentRole}
        onCancel={() => setModalVisible(false)}
        onSuccess={handleFormSuccess}
      />

      <RolePermissionModal
        visible={permissionModalVisible}
        roleName={currentRole?.name}
        initialPermissions={currentRole?.permissions || []}
        onCancel={() => setPermissionModalVisible(false)}
        onSuccess={handlePermissionSuccess}
      />
    </div>
  )
}
