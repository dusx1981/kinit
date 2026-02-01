import React, { useState, useEffect } from 'react'
import { Modal, Tree, Checkbox, Space, Tag, message, Tabs } from 'antd'
import type { DataNode } from 'antd/es/tree'

interface RolePermissionModalProps {
  visible: boolean
  roleName?: string
  initialPermissions: string[]
  onCancel: () => void
  onSuccess: (permissions: string[]) => void
}

// 菜单和权限树数据
const menuPermissionTree: DataNode[] = [
  {
    title: '仪表盘',
    key: 'dashboard',
    children: [
      { title: '工作台', key: 'dashboard:workplace' },
      { title: '分析页', key: 'dashboard:analysis' },
      { title: '地图', key: 'dashboard:map' },
    ],
  },
  {
    title: '系统管理',
    key: 'system',
    children: [
      {
        title: '用户管理',
        key: 'user',
        children: [
          { title: '查看', key: 'user:view' },
          { title: '新增', key: 'user:create' },
          { title: '编辑', key: 'user:update' },
          { title: '删除', key: 'user:delete' },
          { title: '导出', key: 'user:export' },
        ],
      },
      {
        title: '角色管理',
        key: 'role',
        children: [
          { title: '查看', key: 'role:view' },
          { title: '新增', key: 'role:create' },
          { title: '编辑', key: 'role:update' },
          { title: '删除', key: 'role:delete' },
          { title: '分配权限', key: 'role:permission' },
        ],
      },
      {
        title: '部门管理',
        key: 'dept',
        children: [
          { title: '查看', key: 'dept:view' },
          { title: '新增', key: 'dept:create' },
          { title: '编辑', key: 'dept:update' },
          { title: '删除', key: 'dept:delete' },
        ],
      },
      {
        title: '菜单管理',
        key: 'menu',
        children: [
          { title: '查看', key: 'menu:view' },
          { title: '新增', key: 'menu:create' },
          { title: '编辑', key: 'menu:update' },
          { title: '删除', key: 'menu:delete' },
        ],
      },
    ],
  },
  {
    title: '数据权限',
    key: 'data',
    children: [
      { title: '全部数据', key: 'data:all' },
      { title: '本部门数据', key: 'data:dept' },
      { title: '本人数据', key: 'data:self' },
    ],
  },
]

// 接口权限数据
const apiPermissions = [
  { name: '用户接口', code: 'api:user:*' },
  { name: '角色接口', code: 'api:role:*' },
  { name: '部门接口', code: 'api:dept:*' },
  { name: '菜单接口', code: 'api:menu:*' },
  { name: '系统配置接口', code: 'api:system:*' },
]

export const RolePermissionModal: React.FC<RolePermissionModalProps> = ({
  visible,
  roleName,
  initialPermissions,
  onCancel,
  onSuccess,
}) => {
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [selectedApis, setSelectedApis] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('menu')

  useEffect(() => {
    if (visible) {
      setCheckedKeys(initialPermissions)
      // 从权限中筛选出接口权限
      const apis = initialPermissions.filter((p) => p.startsWith('api:'))
      setSelectedApis(apis)
    }
  }, [visible, initialPermissions])

  const handleCheck = (checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }) => {
    const keys = Array.isArray(checked) ? checked : checked.checked
    setCheckedKeys(keys)
  }

  const handleSubmit = () => {
    // 合并菜单权限和接口权限
    const allPermissions = [...checkedKeys.map(String), ...selectedApis]
    onSuccess(allPermissions)
    message.success('权限已更新')
  }

  const handleCheckAll = (checked: boolean) => {
    if (checked) {
      // 获取所有权限key
      const allKeys: React.Key[] = []
      const traverse = (nodes: DataNode[]) => {
        nodes.forEach((node) => {
          allKeys.push(node.key)
          if (node.children) {
            traverse(node.children)
          }
        })
      }
      traverse(menuPermissionTree)
      setCheckedKeys(allKeys)
    } else {
      setCheckedKeys([])
    }
  }

  const handleExpandAll = (expanded: boolean) => {
    // 可以添加展开/收起全部的逻辑
    message.info(expanded ? '已展开全部节点' : '已收起全部节点')
  }

  const menuTabContent = (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space>
        <Checkbox onChange={(e) => handleCheckAll(e.target.checked)}>全选</Checkbox>
        <Checkbox onChange={(e) => handleExpandAll(e.target.checked)}>展开全部</Checkbox>
      </Space>
      <Tree
        checkable
        checkedKeys={checkedKeys}
        onCheck={handleCheck}
        treeData={menuPermissionTree}
        style={{ maxHeight: 400, overflow: 'auto' }}
      />
    </Space>
  )

  const apiTabContent = (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Checkbox.Group
        value={selectedApis}
        onChange={(values) => setSelectedApis(values as string[])}
      >
        <Space direction="vertical">
          {apiPermissions.map((api) => (
            <Checkbox key={api.code} value={api.code}>
              <Space>
                <span>{api.name}</span>
                <Tag color="blue">{api.code}</Tag>
              </Space>
            </Checkbox>
          ))}
        </Space>
      </Checkbox.Group>
    </Space>
  )

  const dataScopeTabContent = (
    <Space direction="vertical" style={{ width: '100%' }}>
      <p style={{ color: '#666', marginBottom: 16 }}>
        设置数据权限范围，控制角色可以查看和操作的数据范围
      </p>
      <Checkbox.Group
        value={checkedKeys.filter((k) => String(k).startsWith('data:'))}
        onChange={(values) => {
          const otherKeys = checkedKeys.filter((k) => !String(k).startsWith('data:'))
          setCheckedKeys([...otherKeys, ...(values as React.Key[])])
        }}
      >
        <Space direction="vertical">
          <Checkbox value="data:all">
            <Space direction="vertical" size={0}>
              <span style={{ fontWeight: 500 }}>全部数据</span>
              <span style={{ color: '#999', fontSize: 12 }}>可查看和操作所有数据</span>
            </Space>
          </Checkbox>
          <Checkbox value="data:dept">
            <Space direction="vertical" size={0}>
              <span style={{ fontWeight: 500 }}>本部门数据</span>
              <span style={{ color: '#999', fontSize: 12 }}>仅可查看和操作本部门数据</span>
            </Space>
          </Checkbox>
          <Checkbox value="data:self">
            <Space direction="vertical" size={0}>
              <span style={{ fontWeight: 500 }}>本人数据</span>
              <span style={{ color: '#999', fontSize: 12 }}>仅可查看和操作本人创建的数据</span>
            </Space>
          </Checkbox>
        </Space>
      </Checkbox.Group>
    </Space>
  )

  return (
    <Modal
      title={`分配权限 - ${roleName || '角色'}`}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={600}
      bodyStyle={{ maxHeight: 500, overflow: 'auto' }}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="菜单权限" key="menu">
          {menuTabContent}
        </Tabs.TabPane>
        <Tabs.TabPane tab="接口权限" key="api">
          {apiTabContent}
        </Tabs.TabPane>
        <Tabs.TabPane tab="数据权限" key="data">
          {dataScopeTabContent}
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  )
}
