import React from 'react';
import { Card, Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import './index.less';

export const Error500: React.FC = () => {
  return (
    <div className="error-page">
      <Card className="error-card">
        <Result
          status="500"
          title="500"
          subTitle="抱歉，服务器出错了"
          extra={
            <Link to="/dashboard/workplace">
              <Button type="primary">返回首页</Button>
            </Link>
          }
        />
      </Card>
    </div>
  );
};
