import React, { useEffect } from 'react';
import { Card, Row, Col, Statistic, List, Avatar, Tag, Timeline } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  PayCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import * as echarts from 'echarts';
import './index.less';

export const Workplace: React.FC = () => {

  useEffect(() => {
    // 访问量趋势图
    const visitChartDom = document.getElementById('visitChart');
    if (visitChartDom) {
      const visitChart = echarts.init(visitChartDom);
      const visitOption = {
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '访问量',
            type: 'line',
            smooth: true,
            data: [120, 132, 101, 134, 90, 230, 210],
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
              ]),
            },
            itemStyle: {
              color: '#1890ff',
            },
          },
        ],
      };
      visitChart.setOption(visitOption);
    }
  }, []);

  const notices = [
    { title: '系统将于今晚进行例行维护', date: '2小时前', type: '系统' },
    { title: '新版本 v2.0 已发布', date: '1天前', type: '更新' },
    { title: '安全提醒：请及时修改默认密码', date: '2天前', type: '安全' },
  ];

  const projects = [
    { title: 'kinit-react-admin', desc: 'React 后台管理系统', color: '#1890ff' },
    { title: 'kinit-uni', desc: 'uni-app 移动端应用', color: '#52c41a' },
    { title: 'kinit-api', desc: '后端 API 服务', color: '#faad14' },
  ];

  return (
    <div className="workplace-page">
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={126560}
              prefix={<UserOutlined />}
              suffix={<Tag color="success"><ArrowUpOutlined /> 12%</Tag>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总访问量"
              value={8846}
              prefix={<EyeOutlined />}
              suffix={<Tag color="success"><ArrowUpOutlined /> 8%</Tag>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="订单数"
              value={1268}
              prefix={<ShoppingCartOutlined />}
              suffix={<Tag color="error"><ArrowDownOutlined /> 5%</Tag>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总收入"
              value={126560}
              prefix={<PayCircleOutlined />}
              suffix={<Tag color="success"><ArrowUpOutlined /> 15%</Tag>}
              style={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="访问量趋势" extra={<a href="#">更多</a>}>
            <div id="visitChart" style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="公告" extra={<a href="#">更多</a>}>
            <List
              dataSource={notices}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Tag>{item.type}</Tag>
                        <span style={{ color: '#8c8c8c' }}>{item.date}</span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="进行中的项目" extra={<a href="#">全部项目</a>}>
            <List
              grid={{ gutter: 16, xs: 1, sm: 2 }}
              dataSource={projects}
              renderItem={(item) => (
                <List.Item>
                  <Card size="small" className="project-card">
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <Avatar style={{ backgroundColor: item.color }} size="small">
                        {item.title[0].toUpperCase()}
                      </Avatar>
                      <span style={{ marginLeft: 8, fontWeight: 500 }}>{item.title}</span>
                    </div>
                    <div style={{ color: '#8c8c8c', fontSize: 12 }}>{item.desc}</div>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="动态" extra={<a href="#">更多</a>}>
            <Timeline
              items={[
                {
                  children: (
                    <div>
                      <p style={{ marginBottom: 4 }}>管理员 发布了新版本 v2.0</p>
                      <p style={{ color: '#8c8c8c', fontSize: 12 }}>2小时前</p>
                    </div>
                  ),
                },
                {
                  children: (
                    <div>
                      <p style={{ marginBottom: 4 }}>用户 李小明 注册了账号</p>
                      <p style={{ color: '#8c8c8c', fontSize: 12 }}>4小时前</p>
                    </div>
                  ),
                },
                {
                  children: (
                    <div>
                      <p style={{ marginBottom: 4 }}>系统 完成了一次数据备份</p>
                      <p style={{ color: '#8c8c8c', fontSize: 12 }}>昨天</p>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card title="团队">
            <Row gutter={[24, 24]}>
              {['开发组', '设计组', '测试组', '运维组'].map((team) => (
                <Col xs={24} sm={12} md={6} key={team}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar style={{ backgroundColor: '#1890ff' }}>
                      {team[0]}
                    </Avatar>
                    <span style={{ marginLeft: 12 }}>{team}</span>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
