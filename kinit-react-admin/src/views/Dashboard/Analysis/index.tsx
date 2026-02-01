import React, { useEffect } from 'react';
import { Card, Row, Col, DatePicker, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import './index.less';

const { RangePicker } = DatePicker;

export const Analysis: React.FC = () => {
  useEffect(() => {
    // 销售额图表
    const salesChartDom = document.getElementById('salesChart');
    if (salesChartDom) {
      const salesChart = echarts.init(salesChartDom);
      const salesOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        legend: {
          data: ['销售额', '订单数'],
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        },
        yAxis: [
          {
            type: 'value',
            name: '销售额',
            axisLabel: {
              formatter: '{value} 元',
            },
          },
          {
            type: 'value',
            name: '订单数',
            axisLabel: {
              formatter: '{value} 单',
            },
          },
        ],
        series: [
          {
            name: '销售额',
            type: 'bar',
            data: [12000, 13200, 10100, 13400, 9000, 23000, 21000, 20000, 18000, 22000, 25000, 28000],
            itemStyle: {
              color: '#1890ff',
            },
          },
          {
            name: '订单数',
            type: 'line',
            yAxisIndex: 1,
            data: [120, 132, 101, 134, 90, 230, 210, 200, 180, 220, 250, 280],
            itemStyle: {
              color: '#52c41a',
            },
          },
        ],
      };
      salesChart.setOption(salesOption);
    }

    // 访问来源饼图
    const pieChartDom = document.getElementById('pieChart');
    if (pieChartDom) {
      const pieChart = echarts.init(pieChartDom);
      const pieOption = {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 1048, name: '搜索引擎', itemStyle: { color: '#1890ff' } },
              { value: 735, name: '直接访问', itemStyle: { color: '#52c41a' } },
              { value: 580, name: '邮件营销', itemStyle: { color: '#faad14' } },
              { value: 484, name: '联盟广告', itemStyle: { color: '#f5222d' } },
              { value: 300, name: '视频广告', itemStyle: { color: '#722ed1' } },
            ],
          },
        ],
      };
      pieChart.setOption(pieOption);
    }

    // 用户行为雷达图
    const radarChartDom = document.getElementById('radarChart');
    if (radarChartDom) {
      const radarChart = echarts.init(radarChartDom);
      const radarOption = {
        tooltip: {},
        radar: {
          indicator: [
            { name: '浏览', max: 6500 },
            { name: '点击', max: 16000 },
            { name: '访问', max: 30000 },
            { name: '咨询', max: 38000 },
            { name: '订单', max: 52000 },
            { name: '支付', max: 25000 },
          ],
        },
        series: [
          {
            name: '用户行为 vs 行业平均',
            type: 'radar',
            data: [
              {
                value: [4200, 10000, 20000, 35000, 50000, 18000],
                name: '用户行为',
                itemStyle: { color: '#1890ff' },
                areaStyle: { opacity: 0.3 },
              },
              {
                value: [5000, 14000, 28000, 31000, 42000, 21000],
                name: '行业平均',
                itemStyle: { color: '#52c41a' },
                areaStyle: { opacity: 0.3 },
              },
            ],
          },
        ],
      };
      radarChart.setOption(radarOption);
    }
  }, []);

  return (
    <div className="analysis-page">
      <Card
        title="数据筛选"
        extra={
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <RangePicker
              defaultValue={[dayjs().subtract(30, 'day'), dayjs()]}
              style={{ width: 280 }}
            />
            <Button icon={<ReloadOutlined />}>刷新</Button>
          </div>
        }
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Card title="销售额趋势">
            <div id="salesChart" style={{ height: 350 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="访问来源">
            <div id="pieChart" style={{ height: 350 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="用户行为分析">
            <div id="radarChart" style={{ height: 350 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
