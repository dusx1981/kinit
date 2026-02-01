import React, { useEffect } from 'react'
import {
  Modal,
  Form,
  Input,
  InputNumber,
  TreeSelect,
  Switch,
  message,
  Row,
  Col,
} from 'antd'
import { deptApi } from '@/api/dept'
import type { Department, DepartmentFormData } from '@/types/dept'

interface DeptFormModalProps {
  visible: boolean
  title: string
  initialValues: Department | null
  deptTree: Department[]
  onCancel: () => void
  onSuccess: () => void
}

export const DeptFormModal: React.FC<DeptFormModalProps> = ({
  visible,
  title,
  initialValues,
  deptTree,
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

  // 将部门树转换为 TreeSelect 所需格式
  const convertToTreeData = (data: Department[]): any[] => {
    return data.map((item) => ({
      title: item.name,
      value: item.id,
      key: item.id,
      children: item.children ? convertToTreeData(item.children) : undefined,
    }))
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const formData: DepartmentFormData = {
        ...values,
        status: values.status ? 1 : 0,
      }

      if (isEdit && initialValues) {
        await deptApi.updateDept(initialValues.id, formData)
        message.success('更新成功')
      } else {
        await deptApi.createDept(formData)
        message.success('创建成功')
      }
      onSuccess()
    } catch (error) {
      console.error('表单提交失败:', error)
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
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="部门名称"
              name="name"
              rules={[
                { required: true, message: '请输入部门名称' },
                { max: 50, message: '部门名称不能超过50个字符' },
              ]}
            >
              <Input placeholder="请输入部门名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="部门编码"
              name="code"
              rules={[
                { required: true, message: '请输入部门编码' },
                { max: 50, message: '部门编码不能超过50个字符' },
                { pattern: /^[a-zA-Z0-9_-]+$/, message: '部门编码只能包含字母、数字、下划线和横线' },
              ]}
            >
              <Input placeholder="请输入部门编码" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="上级部门"
          name="parentId"
        >
          <TreeSelect
            treeData={convertToTreeData(deptTree)}
            placeholder="请选择上级部门（不选则为顶级部门）"
            allowClear
            treeDefaultExpandAll
            disabled={isEdit}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="负责人"
              name="leader"
            >
              <Input placeholder="请输入负责人姓名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="联系电话"
              name="phone"
              rules={[
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
              ]}
            >
              <Input placeholder="请输入联系电话" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { type: 'email', message: '请输入正确的邮箱地址' },
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
          </Col>
          <Col span={12}>
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
          </Col>
        </Row>

        <Form.Item
          label="部门状态"
          name="status"
          valuePropName="checked"
        >
          <Switch checkedChildren="启用" unCheckedChildren="停用" />
        </Form.Item>

        <Form.Item
          label="备注"
          name="remark"
        >
          <Input.TextArea
            rows={3}
            placeholder="请输入备注信息"
            maxLength={200}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
