import React, { useState } from 'react';
import { Form, Input, Button, Card, Steps, message } from 'antd';
import { SafetyOutlined, LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.less';

const { Step } = Steps;

export const Reset: React.FC = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();

  const steps = [
    {
      title: '验证身份',
      icon: <SafetyOutlined />,
    },
    {
      title: '重置密码',
      icon: <LockOutlined />,
    },
    {
      title: '完成',
      icon: <CheckCircleOutlined />,
    },
  ];

  const handleNext = async () => {
    try {
      await form.validateFields();
      if (current === 0) {
        // 模拟验证
        message.success('验证成功');
        setCurrent(1);
      } else if (current === 1) {
        message.success('密码重置成功');
        setCurrent(2);
      }
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const handleDone = () => {
    navigate('/login');
  };

  const renderContent = () => {
    if (current === 0) {
      return (
        <Form form={form} layout="vertical">
          <Form.Item
            name="mobile"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号!' },
              { pattern: /^1\d{10}$/, message: '手机号格式错误!' },
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="code"
            label="验证码"
            rules={[{ required: true, message: '请输入验证码!' }]}
          >
            <Input.Search
              enterButton="获取验证码"
              placeholder="请输入验证码"
            />
          </Form.Item>
        </Form>
      );
    }
    if (current === 1) {
      return (
        <Form form={form} layout="vertical">
          <Form.Item
            name="password"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码!' },
              { min: 6, message: '密码至少6位!' },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            rules={[
              { required: true, message: '请确认密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
        </Form>
      );
    }
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <CheckCircleOutlined style={{ fontSize: 72, color: '#52c41a' }} />
        <h2 style={{ marginTop: 24 }}>密码重置成功</h2>
        <p style={{ color: '#8c8c8c' }}>请使用新密码登录系统</p>
      </div>
    );
  };

  return (
    <div className="reset-page">
      <Card className="reset-card" title="重置密码">
        <Steps current={current} style={{ marginBottom: 40 }}>
          {steps.map((step) => (
            <Step key={step.title} title={step.title} icon={step.icon} />
          ))}
        </Steps>
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          {renderContent()}
          <div style={{ marginTop: 24 }}>
            {current < 2 && (
              <Button type="primary" block onClick={handleNext}>
                {current === 0 ? '下一步' : '提交'}
              </Button>
            )}
            {current === 2 && (
              <Button type="primary" block onClick={handleDone}>
                去登录
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
