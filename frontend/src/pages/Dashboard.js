import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Alert } from 'antd';
import {
  ShoppingOutlined,
  AppstoreOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { getDashboardStats } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data.data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Dashboard</h2>
      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <Card loading={loading}>
            <Statistic
              title="Total Products"
              value={stats?.totalProducts ?? 0}
              prefix={<ShoppingOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card loading={loading}>
            <Statistic
              title="Total Categories"
              value={stats?.totalCategories ?? 0}
              prefix={<AppstoreOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card loading={loading}>
            <Statistic
              title="Low Stock Products"
              value={stats?.lowStockProducts ?? 0}
              prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;