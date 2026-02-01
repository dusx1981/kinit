import React, { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Badge,
  theme,
  Typography,
  Space,
  Tabs,
  Breadcrumb
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  SearchOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  HomeOutlined,
  DashboardOutlined,
  AreaChartOutlined,
  GlobalOutlined,
  SafetyOutlined,
  TeamOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useUserStore, useAppStore, useTabStore } from '@/stores';
import './index.less';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const menuItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: '仪表盘',
    children: [
      { key: '/dashboard/workplace', icon: <HomeOutlined />, label: '工作台' },
      { key: '/dashboard/analysis', icon: <AreaChartOutlined />, label: '分析页' },
      { key: '/dashboard/map', icon: <GlobalOutlined />, label: '地图' },
    ],
  },
  {
    key: 'system',
    icon: <SettingOutlined />,
    label: '系统管理',
    children: [
      { key: '/system/user', icon: <UserOutlined />, label: '用户管理' },
      { key: '/system/role', icon: <SafetyOutlined />, label: '角色管理' },
      { key: '/system/dept', icon: <TeamOutlined />, label: '部门管理' },
      { key: '/system/menu', icon: <MenuOutlined />, label: '菜单管理' },
    ],
  },
];

export const BasicLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed, toggleCollapsed, theme: appTheme } = useAppStore();
  const { userInfo, clearUserInfo } = useUserStore();
  const { activeKey, tabs, addTab, removeTab, setActiveKey } = useTabStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const path = location.pathname;
    const findMenuLabel = (items: any[]): string => {
      for (const item of items) {
        if (item.key === path) return item.label;
        if (item.children) {
          const found = findMenuLabel(item.children);
          if (found) return found;
        }
      }
      return '';
    };
    const label = findMenuLabel(menuItems);
    if (label) {
      addTab({ key: path, label, path, closable: path !== '/dashboard/workplace' });
    }
  }, [location.pathname, addTab]);

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = () => {
    clearUserInfo();
    navigate('/login');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    {
      key: 'divider',
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  const getSelectedKeys = () => {
    return [location.pathname];
  };

  const getOpenKeys = () => {
    const path = location.pathname;
    for (const item of menuItems) {
      if (item.children?.some((child) => child.key === path)) {
        return [item.key];
      }
    }
    return [];
  };

  return (
    <Layout className="basic-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme={appTheme}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="logo">
          <img src="/logo.png" alt="logo" />
          {!collapsed && <Title level={5}>Kinit Admin</Title>}
        </div>
        <Menu
          theme={appTheme}
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            zIndex: 9,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
            <Breadcrumb style={{ marginLeft: 16 }}>
              <Breadcrumb.Item href="/">
                <HomeOutlined />
              </Breadcrumb.Item>
              <Breadcrumb.Item>首页</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', paddingRight: 24, gap: 16 }}>
            <Button type="text" icon={<SearchOutlined />} />
            <Badge count={5} size="small">
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
            <Button
              type="text"
              icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
              onClick={toggleFullscreen}
            />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar src={userInfo?.avatar} icon={<UserOutlined />} />
                <span>{userInfo?.nickname || userInfo?.username || '管理员'}</span>
              </Space>
            </Dropdown>
          </div>
        </Header>
        <div className="tabs-container">
          <Tabs
            type="editable-card"
            activeKey={activeKey}
            onChange={setActiveKey}
            onEdit={(key, action) => {
              if (action === 'remove') {
                removeTab(key as string);
                const targetTab = tabs.find((t) => t.key === key);
                if (targetTab && location.pathname === targetTab.path) {
                  const remainingTabs = tabs.filter((t) => t.key !== key);
                  if (remainingTabs.length > 0) {
                    navigate(remainingTabs[remainingTabs.length - 1].path);
                  } else {
                    navigate('/dashboard/workplace');
                  }
                }
              }
            }}
            items={tabs.map((tab) => ({
              key: tab.key,
              label: (
                <span onClick={() => navigate(tab.path)} style={{ cursor: 'pointer' }}>
                  {tab.label}
                </span>
              ),
              closable: tab.closable,
            }))}
            style={{ background: colorBgContainer, padding: '0 16px' }}
          />
        </div>
        <Content
          style={{
            margin: 24,
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
