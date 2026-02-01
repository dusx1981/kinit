import React, { useEffect } from 'react'
import { Modal, Form, Input, InputNumber, TreeSelect, Switch, Radio } from 'antd'
import type { DataNode } from 'antd/es/tree'

interface MenuFormData {
  id?: string
  name: string
  path?: string
  component?: string
  icon?: string
  parentId?: string | null
  sort: number
  status: number
  type: 0 | 1 | 2
  permission?: string
  isFrame?: boolean
  isCache?: boolean
  children?: MenuFormData[]
}

interface MenuFormModalProps {
  visible: boolean
  title: string
  initialValues: MenuFormData | null
  menuTree: MenuFormData[]
  onCancel: () => void
  onSuccess: () => void
}

export const MenuFormModal: React.FC<MenuFormModalProps> = ({
  visible,
  title,
  initialValues,
  menuTree,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm()
  const isEdit = !!initialValues?.id
  const menuType = Form.useWatch('type', form)

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          status: initialValues.status === 1,
        })
      } else {
        form.resetFields()
        form.setFieldsValue({
          type: 0,
          sort: 0,
          status: true,
          isFrame: false,
          isCache: true,
        })
      }
    }
  }, [visible, initialValues, form])

  // 将菜单树转换为 TreeSelect 所需格式
  const convertToTreeData = (data: MenuFormData[]): DataNode[] => {
    return data.map((item) => ({
      title: item.name,
      value: item.id || '',
      key: item.id || '',
      disabled: item.type === 2, // 按钮不能作为父节点
      children: item.children ? convertToTreeData(item.children) : undefined,
    }))
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const formData = {
        ...values,
        status: values.status ? 1 : 0,
      }
      console.log('提交数据:', formData)
      onSuccess()
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  return (
    <Modal
      title={title}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item
          label="菜单类型"
          name="type"
          rules={[{ required: true, message: '请选择菜单类型' }]}
        >
          <Radio.Group disabled={isEdit}>
            <Radio.Button value={0}>目录</Radio.Button>
            <Radio.Button value={1}>菜单</Radio.Button>
            <Radio.Button value={2}>按钮</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="上级菜单"
          name="parentId"
        >
          <TreeSelect
            treeData={convertToTreeData(menuTree)}
            placeholder="请选择上级菜单（不选则为顶级菜单）"
            allowClear
            treeDefaultExpandAll
          />
        </Form.Item>

        <Form.Item
          label="菜单名称"
          name="name"
          rules={[
            { required: true, message: '请输入菜单名称' },
            { max: 50, message: '菜单名称不能超过50个字符' },
          ]}
        >
          <Input placeholder="请输入菜单名称" />
        </Form.Item>

        {(menuType === 0 || menuType === 1) && (
          <Form.Item
            label="路由路径"
            name="path"
            rules={[
              { required: true, message: '请输入路由路径' },
              { pattern: /^\//, message: '路由路径必须以 / 开头' },
            ]}
          >
            <Input placeholder="例如：/system/user" />
          </Form.Item>
        )}

        {menuType === 1 && (
          <Form.Item
            label="组件路径"
            name="component"
            rules={[{ required: true, message: '请输入组件路径' }]}
          >
            <Input placeholder="例如：System/UserManage" />
          </Form.Item>
        )}

        {menuType === 2 && (
          <Form.Item
            label="权限标识"
            name="permission"
            rules={[
              { required: true, message: '请输入权限标识' },
              { pattern: /^[a-zA-Z0-9:]+$/, message: '权限标识格式不正确' },
            ]}
          >
            <Input placeholder="例如：user:create" />
          </Form.Item>
        )}

        {(menuType === 0 || menuType === 1) && (
          <Form.Item
            label="菜单图标"
            name="icon"
          >
            <Input placeholder="请输入 Ant Design 图标名称" />
          </Form.Item>
        )}

        <Form.Item
          label="显示排序"
          name="sort"
          rules={[{ required: true, message: '请输入排序序号' }]}
        >
          <InputNumber
            min={0}
            max={9999}
            style={{ width: '100%' }}
            placeholder="序号越小越靠前"
          />
        </Form.Item>

        <Form.Item
          label="菜单状态"
          name="status"
          valuePropName="checked"
        >
          <Switch checkedChildren="显示" unCheckedChildren="隐藏" />
        </Form.Item>

        {menuType === 1 && (
          <>
            <Form.Item
              label="是否缓存"
              name="isCache"
              valuePropName="checked"
            >
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>

            <Form.Item
              label="是否外链"
              name="isFrame"
              valuePropName="checked"
            >
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  )
}
