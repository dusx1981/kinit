import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, TreeSelect, Switch, Space } from 'antd';

interface UserFormModalProps {
  visible: boolean;
  title: string;
  initialValues: any;
  deptOptions: { label: string; value: string }[];
  roleOptions: { label: string; value: string }[];
  onCancel: () => void;
  onSuccess: (values: any) => void;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  visible,
  title,
  initialValues,
  deptOptions,
  roleOptions,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!initialValues?.id;

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          status: initialValues.status === 1,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: true,
        });
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSuccess(values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

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
        <Space style={{ width: '100%' }}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
              { max: 20, message: '用户名不能超过20个字符' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' },
            ]}
            style={{ width: 260 }}
          >
            <Input placeholder="请输入用户名" disabled={isEdit} />
          </Form.Item>

          <Form.Item
            label="昵称"
            name="nickname"
            rules={[
              { required: true, message: '请输入昵称' },
              { max: 50, message: '昵称不能超过50个字符' },
            ]}
            style={{ width: 260 }}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>
        </Space>

        {!isEdit && (
          <Form.Item
            label="初始密码"
            name="password"
            rules={[
              { required: true, message: '请输入初始密码' },
              { min: 6, message: '密码至少6个字符' },
              { max: 20, message: '密码不能超过20个字符' },
            ]}
          >
            <Input.Password placeholder="请输入初始密码" />
          </Form.Item>
        )}

        <Space style={{ width: '100%' }}>
          <Form.Item
            label="所属部门"
            name="deptId"
            rules={[{ required: true, message: '请选择所属部门' }]}
            style={{ width: 260 }}
          >
            <TreeSelect
              treeData={[
                {
                  title: '总公司',
                  value: '1',
                  children: [
                    { title: '技术部', value: '1-1' },
                    { title: '产品部', value: '1-2' },
                    { title: '市场部', value: '1-3' },
                  ],
                },
              ]}
              placeholder="请选择所属部门"
            />
          </Form.Item>

          <Form.Item
            label="角色"
            name="roleIds"
            rules={[{ required: true, message: '请选择角色' }]}
            style={{ width: 260 }}
          >
            <Select
              mode="multiple"
              placeholder="请选择角色"
              options={roleOptions}
            />
          </Form.Item>
        </Space>

        <Space style={{ width: '100%' }}>
          <Form.Item
            label="手机号"
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
            ]}
            style={{ width: 260 }}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱地址' },
            ]}
            style={{ width: 260 }}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
        </Space>

        <Form.Item
          label="用户状态"
          name="status"
          valuePropName="checked"
        >
          <Switch checkedChildren="启用" unCheckedChildren="停用" />
        </Form.Item>

        <Form.Item label="备注" name="remark">
          <Input.TextArea
            rows={3}
            placeholder="请输入备注信息"
            maxLength={200}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
