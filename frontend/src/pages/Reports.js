import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Alert, Tag } from 'antd';
import {
  ShoppingOutlined,
  DatabaseOutlined,
  DollarOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { getReport } from '../services/api';

function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await getReport();
        setReport(res.data.data);
      } catch {
        setError('Failed to load report data');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'Id', key: 'Id', width: 60 },
    { title: 'Product Name', dataIndex: 'Name', key: 'Name' },
    { title: 'Category', dataIndex: 'Category', key: 'Category',
      render: (cat) => <Tag color="blue">{cat}</Tag>
    },
    { title: 'Quantity', dataIndex: 'Quantity', key: 'Quantity',
      render: (qty) => (
        <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
          {qty} ⚠️
        </span>
      )
    },
    { title: 'Unit Price', dataIndex: 'UnitPrice', key: 'UnitPrice',
      render: (price) => `₱${parseFloat(price).toFixed(2)}`
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Inventory Report</h2>
      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card loading={loading}>
            <Statistic
              title="Total Products"
              value={report?.summary?.totalProducts ?? 0}
              prefix={<ShoppingOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card loading={loading}>
            <Statistic
              title="Total Quantity"
              value={report?.summary?.totalQuantity ?? 0}
              prefix={<DatabaseOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card loading={loading}>
            <Statistic
              title="Total Inventory Value"
              value={report?.summary?.totalInventoryValue ?? 0}
              prefix={<DollarOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <span>
            <WarningOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
            Low Stock Products (Quantity ≤ 10)
          </span>
        }
        loading={loading}
      >
        <Table
          rowKey="Id"
          columns={columns}
          dataSource={report?.lowStockProducts ?? []}
          pagination={false}
          locale={{ emptyText: '✅ No low stock products!' }}
        />
      </Card>
    </div>
  );
}

export default Reports;