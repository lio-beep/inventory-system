import React, { useEffect, useState } from 'react';
import {
  Table, Button, Modal, Form, Input,
  InputNumber, Select, message, Popconfirm, Space, Tag
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  getProducts, createProduct, updateProduct, deleteProduct
} from '../services/api';

const CATEGORIES = ['Electronics', 'Office Supplies', 'Furniture', 'Food & Beverage', 'Clothing'];

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data.data);
    } catch {
      message.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.Id, values);
        message.success('Product updated!');
      } else {
        await createProduct(values);
        message.success('Product created!');
      }
      setModalOpen(false);
      fetchProducts();
    } catch {
      message.error('Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      message.success('Product deleted!');
      fetchProducts();
    } catch {
      message.error('Failed to delete product');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'Id', key: 'Id', width: 60 },
    { title: 'Product Name', dataIndex: 'Name', key: 'Name' },
    { title: 'Category', dataIndex: 'Category', key: 'Category',
      render: (cat) => <Tag color="blue">{cat}</Tag>
    },
    { title: 'Quantity', dataIndex: 'Quantity', key: 'Quantity',
      render: (qty) => (
        <span style={{ color: qty <= 10 ? '#ff4d4f' : 'inherit', fontWeight: qty <= 10 ? 'bold' : 'normal' }}>
          {qty} {qty <= 10 && '⚠️'}
        </span>
      )
    },
    { title: 'Unit Price', dataIndex: 'UnitPrice', key: 'UnitPrice',
      render: (price) => `₱${parseFloat(price).toFixed(2)}`
    },
    {
      title: 'Actions', key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleOpenModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this product?"
            onConfirm={() => handleDelete(record.Id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Products</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
          Add Product
        </Button>
      </div>

      <Table
        rowKey="Id"
        columns={columns}
        dataSource={products}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Product Name"
            rules={[{ required: true, message: 'Please enter product name' }]}>
            <Input placeholder="Enter product name" />
          </Form.Item>
          <Form.Item name="category" label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}>
            <Select placeholder="Select category">
              {CATEGORIES.map(cat => (
                <Select.Option key={cat} value={cat}>{cat}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="quantity" label="Quantity"
            rules={[{ required: true, message: 'Please enter quantity' }]}>
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Enter quantity" />
          </Form.Item>
          <Form.Item name="unitPrice" label="Unit Price"
            rules={[{ required: true, message: 'Please enter unit price' }]}>
            <InputNumber min={0} step={0.01} style={{ width: '100%' }} placeholder="Enter unit price" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingProduct ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Products;