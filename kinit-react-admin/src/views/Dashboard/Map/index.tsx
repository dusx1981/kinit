import React, { useEffect, useRef } from 'react';
import { Card } from 'antd';
import './index.less';

export const MapPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 这里可以集成高德地图或百度地图
    // 示例中使用 ECharts 地图
    const initMap = async () => {
      const echarts = await import('echarts');
      if (mapRef.current) {
        const chart = echarts.init(mapRef.current);
        
        // 由于没有中国地图数据，这里使用简单的散点图模拟
        const simpleOption = {
          title: {
            text: '用户分布',
            subtext: '模拟数据',
            left: 'center',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京', '重庆'],
            axisTick: {
              alignWithLabel: true,
            },
          },
          yAxis: {
            type: 'value',
            name: '用户数',
          },
          series: [
            {
              name: '用户数',
              type: 'bar',
              barWidth: '60%',
              data: [4500, 3800, 3200, 3500, 2800, 2200, 2000, 1800, 2500, 2100],
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#83bff6' },
                  { offset: 0.5, color: '#188df0' },
                  { offset: 1, color: '#188df0' },
                ]),
              },
            },
          ],
        };

        chart.setOption(simpleOption);

        window.addEventListener('resize', () => {
          chart.resize();
        });
      }
    };

    initMap();
  }, []);

  return (
    <div className="map-page">
      <Card title="用户分布地图" extra={<a href="#">查看详情</a>}>
        <div ref={mapRef} style={{ height: 500 }} />
      </Card>
    </div>
  );
};
