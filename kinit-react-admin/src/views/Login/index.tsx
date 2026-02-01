import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores';
import { post } from '@/utils/request';
import './index.less';

interface LoginForm {
  username: string;
  password: string;
  remember?: boolean;
}

interface MobileForm {
  mobile: string;
  code: string;
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setToken, setUserInfo } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('account');

  const handleAccountLogin = async (values: LoginForm) => {
    setLoading(true);
    try {
      // 模拟登录
      const res = await post<{ token: string; userInfo: any }>('/auth/login', {
        username: values.username,
        password: values.password,
      });
      
      setToken(res.token);
      setUserInfo(res.userInfo);
      message.success('登录成功');
      navigate('/dashboard/workplace');
    } catch (error) {
      // 使用演示数据
      setToken('demo-token');
      setUserInfo({
        id: '1',
        username: values.mobile,
        nickname: '超级管理员',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        email: 'admin@kinit.com',
        phone: '13800138000',
        roles: ['super_admin'],
        permissions: ['*'],
        deptId: '1',
        deptName: '总公司',
      });
      navigate('/dashboard/workplace');
    } finally {
      setLoading(false);
    }
  };

  const handleMobileLogin = async (values: MobileForm) => {
    setLoading(true);
    try {
      message.success('演示登录成功');
      setToken('demo-token');
      setUserInfo({
        id: '1',
        username: values.mobile,
        nickname: '管理员',
        roles: ['admin'],
      });
      navigate('/dashboard/workplace');
    } finally {
      setLoading(false);
    }
  };

  const accountForm = (
    <Form
      name="account-login"
      initialValues={{ remember: true }}
      onFinish={handleAccountLogin}
      size="large"
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入用户名!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="用户名: admin" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码!' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="密码: 123456" />
      </Form.Item>
      <Form.Item>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住我</Checkbox>
          </Form.Item>
          <a href="/reset">忘记密码?</a>
        </div>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          登录
        </Button>
      </Form.Item>
    </Form>
  );

  const mobileForm = (
    <Form name="mobile-login" onFinish={handleMobileLogin} size="large">
      <Form.Item
        name="mobile"
        rules={[
          { required: true, message: '请输入手机号!' },
          { pattern: /^1\d{10}$/, message: '手机号格式错误!' },
        ]}
      >
        <Input prefix={<MobileOutlined />} placeholder="手机号" />
      </Form.Item>
      <Form.Item
        name="code"
        rules={[{ required: true, message: '请输入验证码!' }]}
      >
        <Input
          prefix={<SafetyOutlined />}
          placeholder="验证码"
          suffix={
            <Button type="link" size="small">
              获取验证码
            </Button>
          }
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          登录
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div className="login-page">
      <div className="login-container">
        <Card className="login-card">
          <div className="login-header">
            <img src="/logo.png" alt="logo" />
            <h2>Kinit React Admin</h2>
            <p>基于 React 18 + Ant Design 的企业级中后台前端解决方案</p>
          </div>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            centered
            items={[
              { key: 'account', label: '账号密码登录', children: accountForm },
              { key: 'mobile', label: '手机号登录', children: mobileForm },
            ]}
          />
          <div className="login-divider">
            <span>其他登录方式</span>
          </div>
          <div className="login-other">
            <Button type="link" icon={<UserOutlined />}>
              Github
            </Button>
            <Button type="link" icon={<UserOutlined />}>
              微信
            </Button>
            <Button type="link" icon={<UserOutlined />}>
              QQ
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
