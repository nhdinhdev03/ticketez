import React, { useRef, useState, useEffect } from 'react';
import { Button, Input, Space, Col, Row, Form, message, Popconfirm, Table, Card, Breadcrumb } from 'antd';
import { SearchOutlined, PlusOutlined, HomeOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import BaseTable from '~/components/Admin/BaseTable/BaseTable';
import BaseModal from '~/components/Admin/BaseModal/BaseModal';
import style from './Province.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import axiosClient from '~/api/global/axiosClient';

const cx = classNames.bind(style);

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const AdminProvince = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [size, setSize] = useState('large');

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text, record) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        Table.EXPAND_COLUMN,
        {
            title: 'id',
            dataIndex: 'id',
            width: '10%',
            // ...getColumnSearchProps('id'),
            sorter: (a, b) => a.id - b.id,
            // defaultSortOrder: 'descend',
        },
        {
            title: 'name',
            dataIndex: 'name',
            width: '50%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Action',
            render: (_, record) => (
                <Space size="middle">
                    <FontAwesomeIcon
                        icon={faPen}
                        onClick={() => {
                            handleEditData(record);
                        }}
                    />

                    <Popconfirm
                        title="Bạn có chắc"
                        description="Muốn xoá hay không?"
                        onConfirm={handleDelete}
                        okText="Yes"
                        cancelText="No"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // modal
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [checkNick, setCheckNick] = useState(false);
    const [resetForm, setResetForm] = useState(false);
    const [editData, setEditData] = useState(null);

    const showModal = () => {
        form.resetFields();
        setEditData(null);
        setOpen(true);
        setResetForm(true);
    };

    const handleDelete = () => {
        message.success('xoá nè');
    };

    const handleEditData = (record) => {
        setOpen(true);
        setResetForm(false);
        setEditData(record);
        //  message.success(record.id);
        form.setFieldsValue(record);
    };

    const handleOk = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();

            let resp;
            if (editData) {
                //xử lý khi thêm  call api rồi put lên
                //code mẫu
                //  axios
                //      .put('https://jsonplaceholder.typicode.com/posts', values)
                //      .then((response) => {
                //          setPosts(response.data);
                //          console.log(response);
                //          setLoading(false);
                //      })
                //      .catch((error) => {
                //          console.error('Error fetching data:', error);
                //      });
                message.success('cập nhật thành công');
            } else {
                //xử lý thêm  call api rồi push lun tương tự như edit
                message.success('Thêm thành công');
            }

            setOpen(false);
            form.resetFields();
            setLoading(false);
            getList();
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
            setLoading(false);
        }
    };
    const handleCancel = () => {
        setOpen(false);
    };

    useEffect(() => {
        form.validateFields(['nickname']);
    }, [checkNick, form]);

    useEffect(() => {
        getList();
    }, []);

    //form
    const handleResetForm = () => {
        form.resetFields();
        console.log(form);
    };
    //call api
    const [posts, setPosts] = useState([]);
    const getList = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('posts');
            setPosts(res.data);
            setLoading(false);
            console.log(res.data);
            // axios
            //     .get('https://jsonplaceholder.typicode.com/posts')
            //     .then((response) => {
            //         setPosts(response.data);
            //         console.log(response);
            //         setLoading(false);
            //     })
            //     .catch((error) => {
            //         console.error('Error fetching data:', error);
            //     });
        } catch (error) {}
    };

    return (
        <>
            {' '}
            <Card bordered={false} className={cx('card-Breadcrumb')}>
                <Breadcrumb
                    items={[
                        {
                            href: '',
                            title: <HomeOutlined />,
                        },
                        {
                            href: '',
                            title: (
                                <>
                                    <VideoCameraOutlined />
                                    <span> Rạp</span>
                                </>
                            ),
                        },
                        {
                            title: 'Cụm rạp',
                        },
                    ]}
                />
            </Card>
            <Card bordered={false} className={cx('card-chart-donut')}>
                <Row>
                    <Col span={22}>
                        <h1 className={cx('title')}>Tỉnh</h1>
                    </Col>
                    <Col span={2}>
                        <Button
                            type="primary"
                            className={cx('button-title')}
                            icon={<PlusOutlined />}
                            size={size}
                            onClick={showModal}
                        >
                            Thêm
                        </Button>
                    </Col>
                    <BaseModal
                        open={open}
                        width={'60%'}
                        title={editData ? 'Cập nhật' : 'Thêm mới'}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="back" onClick={handleCancel}>
                                Thoát
                            </Button>,
                            resetForm && ( // Conditionally render the "Làm mới" button only when editing
                                <Button key="reset" onClick={handleResetForm}>
                                    Làm mới
                                </Button>
                            ),
                            <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                                {editData ? 'Cập nhật' : 'Thêm mới'}
                            </Button>,
                        ]}
                    >
                        <Form form={form} name="dynamic_rule" style={{ maxWidth: 1000 }}>
                            <Form.Item
                                {...formItemLayout}
                                name="id"
                                label="Id"
                                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                            >
                                <Input placeholder="Please input your name" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="title"
                                label="title"
                                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                            >
                                <Input placeholder="Please input your name" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="body"
                                label="body"
                                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                            >
                                <Input placeholder="Please input your name" />
                            </Form.Item>
                        </Form>
                    </BaseModal>
                </Row>

                <BaseTable
                    columns={columns}
                    onClick={() => {
                        handleDelete();
                    }}
                    // dataSource={posts}
                    dataSource={posts.map((post) => ({ ...post, key: post.id }))}
                    expandable={{
                        expandedRowRender: (record) => (
                            <p
                                style={{
                                    margin: 0,
                                }}
                            >
                                {record.body}
                            </p>
                        ),
                    }}
                />
            </Card>
        </>
    );
};


export default AdminProvince;
