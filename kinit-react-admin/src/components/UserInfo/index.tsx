import React from 'react';
import { Avatar, Dropdown, Space, Typography, Tag } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useUserStore } from '@/stores';

const { Text } = Typography;

interface UserInfoProps {
  showDropdown?: boolean;
}

export const UserInfo: React.FC<UserInfoProps> = ({ showDropdown = true }) => {
  const { userInfo, clearUserInfo } = useUserStore();

  const handleLogout = () => {
    clearUserInfo();
    window.location.href = '/login';
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账号设置',
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

  const content = (
    <Space>
      <Avatar 
        src={userInfo?.avatar} 
        icon={<UserOutlined />}
        size="default"
      />
      <Space direction="vertical" size={0}>
        <Text strong>{userInfo?.nickname || userInfo?.username || '管理员'}</Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {userInfo?.roles?.map(role => (
            <Tag key={role} color="blue" style={{ fontSize: 12, lineHeight: '16px', padding: '0 4px' }}>
              {role}
            </Tag>
          ))}
        </Text>
      </Space>
    </Space>
  );

  if (showDropdown) {
    return (
      <Dropdown menu={{ items: menuItems }} placement="bottomRight">
        <div style={{ cursor: 'pointer' }}>{content}</div>
      </Dropdown>
    );
  }

  return content;
};
