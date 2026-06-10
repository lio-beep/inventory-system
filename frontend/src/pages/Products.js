import React, { useEffect, useState } from 'react';
import {
  Table, Button, Modal, Form, Input,
  InputNumber, Select, message, Popconfirm, Space, Tag
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import {
  getProducts, createProduct, updateProduct, deleteProduct
} from '../services/api';

const CATEGORIES = ['Electronics', 'Office Supplies', 'Furniture', 'Food & Beverage', 'Clothing'];

function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [form] = Form.useForm();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data.data);
      setFiltered(res.data.data);
    } catch {
      message.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // Search and filter logic
  useEffect(() => {
    let result = products;

    if (searchText) {
      result = result.filter(p =>
        p.Name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedCategory) {
      result = result.filter(p => p.Category === selectedCategory);
    }

    setFiltered(result);
  }, [searchText, selectedCategory, products]);

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      form.setFieldsValue({
        name: product.Name,
        category: product.Category,
        quantity: product.Quantity,
        unitPrice: product.UnitPrice,
      });
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

  const handleReset = () => {
    setSearchText('');
    setSelectedCategory('');
  };

  const columns = [
    { title: 'ID', dataIndex: 'Id', key: 'Id', width: 60 },
    { title: 'Product Name', dataIndex: 'Name', key: 'Name', sorter: (a, b) => a.Name.localeCompare(b.Name) },
    {
      title: 'Category', dataIndex: 'Category', key: 'Category',
      render: (cat) => <Tag color="blue">{cat}</Tag>
    },
    {
      title: 'Quantity', dataIndex: 'Quantity', key: 'Quantity',
      sorter: (a, b) => a.Quantity - b.Quantity,
      render: (qty) => (
        <span style={{ color: qty <= 10 ? '#ff4d4f' : 'inherit', fontWeight: qty <= 10 ? 'bold' : 'normal' }}>
          {qty} {qty <= 10 && '⚠️'}
        </span>
      )
    },
    {
      title: 'Unit Price', dataIndex: 'UnitPrice', key: 'UnitPrice',
      sorter: (a, b) => a.UnitPrice - b.UnitPrice,
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

      {/* Search and Filter */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Search product name..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
          allowClear
        />
        <Select
          placeholder="Filter by category"
          value={selectedCategory || undefined}
          onChange={(val) => setSelectedCategory(val)}
          style={{ width: 200 }}
          allowClear
        >
          {CATEGORIES.map(cat => (
            <Select.Option key={cat} value={cat}>{cat}</Select.Option>
          ))}
        </Select>
        <Button onClick={handleReset}>Reset</Button>
        <span style={{ color: '#888' }}>{filtered.length} product(s) found</span>
      </Space>

      <Table
        rowKey="Id"
        columns={columns}
        dataSource={filtered}
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
            rules={[
              { required: true, message: 'Please enter quantity' },
              { type: 'number', min: 0, message: 'Quantity cannot be negative' }
            ]}>
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Enter quantity" />
          </Form.Item>
          <Form.Item name="unitPrice" label="Unit Price"
            rules={[
              { required: true, message: 'Please enter unit price' },
              { type: 'number', min: 0, message: 'Price cannot be negative' }
            ]}>
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