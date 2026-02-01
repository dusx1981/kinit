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
  Tree,
  Typography,
  Empty,
  Switch,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  DownOutlined,
  ApartmentOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { DataNode } from 'antd/es/tree'
import { deptApi } from '@/api/dept'
import type { Department } from '@/types/dept'
import { DeptFormModal } from './components/DeptFormModal'
import './index.less'

const { Title } = Typography

interface DeptWithLevel extends Department {
  level: number
}

export const DeptManage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [deptList, setDeptList] = useState<Department[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增部门')
  const [currentDept, setCurrentDept] = useState<Department | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table')

  // 加载部门数据
  const loadDeptData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await deptApi.getDeptTree({ keyword: searchKeyword })
      setDeptList(data || [])
      // 默认展开所有节点
      if (!searchKeyword) {
        const keys: React.Key[] = []
        const collectKeys = (items: Department[]) => {
          items.forEach((item) => {
            if (item.children && item.children.length > 0) {
              keys.push(item.id)
              collectKeys(item.children)
            }
          })
        }
        collectKeys(data || [])
        setExpandedKeys(keys)
      }
    } catch (error) {
      message.error('加载部门数据失败')
    } finally {
      setLoading(false)
    }
  }, [searchKeyword])

  useEffect(() => {
    loadDeptData()
  }, [loadDeptData])

  // 表格列定义
  const columns: ColumnsType<DeptWithLevel> = [
    {
      title: '部门名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        <Space>
          <ApartmentOutlined style={{ color: record.parentId ? '#1890ff' : '#52c41a' }} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '部门编码',
      dataIndex: 'code',
      key: 'code',
      width: 150,
    },
    {
      title: '负责人',
      dataIndex: 'leader',
      key: 'leader',
      width: 120,
      render: (text) => text || '-',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
      render: (text) => text || '-',
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
          >
            新增
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该部门吗？"
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

  // 将树形数据扁平化为表格数据
  const flattenTree = (data: Department[], level = 0): DeptWithLevel[] => {
    const result: DeptWithLevel[] = []
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
    loadDeptData()
  }

  // 处理重置
  const handleReset = () => {
    setSearchKeyword('')
    loadDeptData()
  }

  // 处理新增
  const handleAdd = () => {
    setModalTitle('新增部门')
    setCurrentDept(null)
    setModalVisible(true)
  }

  // 处理新增子部门
  const handleAddChild = (parent: Department) => {
    setModalTitle(`新增子部门 - ${parent.name}`)
    setCurrentDept({ id: '', name: '', code: '', parentId: parent.id, sort: 0, status: 1, createTime: '', updateTime: '' } as Department)
    setModalVisible(true)
  }

  // 处理编辑
  const handleEdit = (dept: Department) => {
    setModalTitle('编辑部门')
    setCurrentDept(dept)
    setModalVisible(true)
  }

  // 处理删除
  const handleDelete = async (_id: string) => {
    try {
      await deptApi.deleteDept(_id)
      message.success('删除成功')
      loadDeptData()
    } catch (error) {
      message.error('删除失败')
    }
  }

  // 处理批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的部门')
      return
    }
    try {
      await deptApi.batchDeleteDept(selectedRowKeys as string[])
      message.success('批量删除成功')
      setSelectedRowKeys([])
      loadDeptData()
    } catch (error) {
      message.error('批量删除失败')
    }
  }

  // 处理状态变更
  const handleStatusChange = async (id: string, status: 0 | 1) => {
    try {
      await deptApi.changeDeptStatus(id, status)
      message.success('状态更新成功')
      loadDeptData()
    } catch (error) {
      message.error('状态更新失败')
    }
  }

  // 处理表单提交成功
  const handleFormSuccess = () => {
    setModalVisible(false)
    loadDeptData()
  }

  // 渲染树形结构
  const renderTree = (data: Department[]): DataNode[] => {
    return data.map((item) => ({
      title: (
        <Space>
          <span style={{ fontWeight: item.parentId ? 'normal' : 'bold' }}>{item.name}</span>
          <Tag color="blue">{item.code}</Tag>
          <Tag color={item.status === 1 ? 'success' : 'default'}>
            {item.status === 1 ? '启用' : '停用'}
          </Tag>
        </Space>
      ),
      key: item.id,
      children: item.children ? renderTree(item.children) : undefined,
    }))
  }

  return (
    <div className="dept-manage-page">
      <Card>
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Space>
              <Title level={4} style={{ margin: 0 }}>
                <TeamOutlined /> 部门管理
              </Title>
              <Tag color="blue">共 {deptList.length} 个部门</Tag>
            </Space>
          </Col>
          <Col>
            <Space>
              <Input
                placeholder="请输入部门名称"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined />}
                style={{ width: 220 }}
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
                新增部门
              </Button>
              {selectedRowKeys.length > 0 && (
                <Popconfirm
                  title="确定批量删除选中的部门吗？"
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
          <Col>
            <Space>
              <Button
                type={viewMode === 'table' ? 'primary' : 'default'}
                onClick={() => setViewMode('table')}
              >
                表格视图
              </Button>
              <Button
                type={viewMode === 'tree' ? 'primary' : 'default'}
                onClick={() => setViewMode('tree')}
              >
                树形视图
              </Button>
            </Space>
          </Col>
        </Row>

        {viewMode === 'table' ? (
          <Table
            columns={columns}
            dataSource={flattenTree(deptList)}
            rowKey="id"
            loading={loading}
            pagination={false}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            scroll={{ x: 1200 }}
            rowClassName={(record) => `dept-level-${record.level}`}
          />
        ) : (
          <Card style={{ minHeight: 400 }}>
            {deptList.length > 0 ? (
              <Tree
                showLine
                showIcon
                defaultExpandAll
                expandedKeys={expandedKeys}
                onExpand={setExpandedKeys}
                treeData={renderTree(deptList)}
                switcherIcon={<DownOutlined />}
              />
            ) : (
              <Empty description="暂无部门数据" />
            )}
          </Card>
        )}
      </Card>

      <DeptFormModal
        visible={modalVisible}
        title={modalTitle}
        initialValues={currentDept}
        deptTree={deptList}
        onCancel={() => setModalVisible(false)}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}
