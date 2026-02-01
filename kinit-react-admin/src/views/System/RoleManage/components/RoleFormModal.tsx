import React, { useEffect } from 'react'
import { Modal, Form, Input, InputNumber, Switch } from 'antd'

interface RoleFormModalProps {
  visible: boolean
  title: string
  initialValues: any
  onCancel: () => void
  onSuccess: (values: any) => void
}

export const RoleFormModal: React.FC<RoleFormModalProps> = ({
  visible,
  title,
  initialValues,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm()
  const isEdit = !!initialValues?.id

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
          sort: 0,
          status: true,
        })
      }
    }
  }, [visible, initialValues, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      onSuccess(values)
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
      width={500}
      destroyOnClose
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item
          label="角色名称"
          name="name"
          rules={[
            { required: true, message: '请输入角色名称' },
            { max: 50, message: '角色名称不能超过50个字符' },
          ]}
        >
          <Input placeholder="请输入角色名称" />
        </Form.Item>

        <Form.Item
          label="角色编码"
          name="code"
          rules={[
            { required: true, message: '请输入角色编码' },
            { max: 50, message: '角色编码不能超过50个字符' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: '角色编码只能包含字母、数字和下划线' },
          ]}
        >
          <Input placeholder="请输入角色编码" disabled={isEdit} />
        </Form.Item>

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
          label="角色状态"
          name="status"
          valuePropName="checked"
        >
          <Switch checkedChildren="启用" unCheckedChildren="停用" />
        </Form.Item>

        <Form.Item label="描述" name="description">
          <Input.TextArea
            rows={3}
            placeholder="请输入角色描述"
            maxLength={200}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
