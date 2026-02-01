import React from 'react';
import { Card, Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import './index.less';

export const Error403: React.FC = () => {
  return (
    <div className="error-page">
      <Card className="error-card">
        <Result
          status="403"
          title="403"
          subTitle="抱歉，您没有权限访问此页面"
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
