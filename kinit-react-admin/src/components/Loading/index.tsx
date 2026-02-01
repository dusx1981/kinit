import React from 'react';
import { Spin } from 'antd';

interface LoadingProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'large', tip = '加载中...' }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: 200,
      padding: 40
    }}>
      <Spin size={size} tip={tip} />
    </div>
  );
};

export default Loading;
