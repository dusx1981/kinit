import React from 'react';
import { Card, Result, Button } from 'antd';

import { Link } from 'react-router-dom';
import './index.less';

export const Error404: React.FC = () => {
  return (
    <div className="error-page">
      <Card className="error-card">
        <Result
          status="404"
          title="404"
          subTitle="抱歉，您访问的页面不存在"
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
