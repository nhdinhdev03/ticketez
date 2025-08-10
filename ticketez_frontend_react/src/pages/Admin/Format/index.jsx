import React, { useRef, useState, useEffect } from 'react';
import { Button, Input, Space, Col, Row, Form, message, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import BaseModal from '~/components/Admin/BaseModal/BaseModal';
import BaseTable from '~/components/Admin/BaseTable/BaseTable';
import Highlighter from 'react-highlight-words';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import style from './Format.module.scss';
import axiosClient from '~/api/global/axiosClient';
import moment from 'moment';
import { formatApi } from '~/api/admin';
import funcUtils from '~/utils/funcUtils';
const cx = classNames.bind(style);

;

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const AdminFormat = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [size, setSize] = useState('large');
    const condition = true;
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [checkNick, setCheckNick] = useState(false);
    const [resetForm, setResetForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [workSomeThing, setWorkSomeThing] = useState(false);

    useEffect(() => {
        const getList = async () => {
            try {
                const res = await formatApi.getAll()
                setPosts(res.data);
                console.log(res);
            } catch (error) {
                console.log(error);
            }
        };
        getList();
    }, [workSomeThing]);


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
        {
            title: 'Mã',
            dataIndex: 'id',
            width: '10%',
            sorter: (a, b) => a.id - b.id,
            ...getColumnSearchProps('id'),


        },
        {
            title: 'Dạng Phim',
            dataIndex: 'name',
            width: '30%',
            ...getColumnSearchProps('fullName'),
        },
        {
            title: 'Mô Tả',
            dataIndex: 'description',
            ...getColumnSearchProps('description'),
        },
        {
            title: 'Action',
            render: (_, record) => (
                <Space size="middle">
                    <FontAwesomeIcon
                        icon={faPen}
                        className={cx('icon-pen')}
                        onClick={() => {
                            handleEditData(record);
                        }}
                    />

                    <Popconfirm
                        title="Bạn có chắc"
                        description="Muốn xoá hay không?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleDelete(record)}
                    >
                        <FontAwesomeIcon icon={faTrash} className={cx('icon-trash')} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    // modal


    const showModal = () => {
        form.resetFields();
        setEditData(null);
        setOpen(true);
        setResetForm(true);
    };


    const handleDelete = async (record) => {
        try {
            const res = await formatApi.delete(record.id);
            console.log(res);
            if (res.status === 200) {
                funcUtils.notify("Xoá thành công", 'success');
            }
        } catch (error) {
            console.log(error);
            funcUtils.notify(error.response.data, 'error');
        }

        setWorkSomeThing(!workSomeThing);
    };



    const handleEditData = (record) => {
        setOpen(true);
        setResetForm(false);
        setEditData(record);
        form.setFieldsValue({
            ...record,
        });
    };


 const handleOk = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
  
                if (editData) {
                    let putData = {
                        id: editData.id,
                        ...values,
                    };
                    try {
                        const resPut = await formatApi.put(putData.id, putData);
                        console.log(resPut);
                        if (resPut.status === 200) {
                            funcUtils.notify('Cập nhật Dạng phim thành công', 'success');
                        }
                    } catch (error) {
                        funcUtils.notify(error.response.data, 'error');
                        console.log(error);
                    }
                }
                if (!editData) {
                    try {
                        const postData = {
                            ...values,
                        };
                        console.log(postData);
                        const resPost = await formatApi.post(postData);
                        console.log('resPost', resPost);
                        if (resPost.status === 200) {
                            funcUtils.notify('Thêm Dạng phim thành công', 'success');
                        }
                    } catch (error) {
                        funcUtils.notify(error.response.data, 'error');
                        console.log(error);
                    }
                }
                setOpen(false);
                form.resetFields();
                setLoading(false);
    
                setWorkSomeThing(!workSomeThing);
            
            
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


  

    //form
    const handleResetForm = () => {
        form.resetFields();
        console.log(form);
    };




    return (

        <div className={cx('card-chart-donut', condition ? 'bordered' : '')}>
            <Row>
                <Col span={22}>
                    <h1 className={cx('title')}>Bảng dữ liệu</h1>
                </Col>
                <Col span={2}>
                    <Button type="primary" className={cx('button-title')} icon={<PlusOutlined />} onClick={showModal}>
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
                        resetForm && (
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
                            name="name"
                            label="Tên dạng phim"
                            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                        >
                            <Input placeholder="Please input your name" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="description"
                            label="Mô tả"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                        >
                            <Input placeholder="Please input your description" />
                        </Form.Item>
                    </Form>
                </BaseModal>
            </Row>

            <BaseTable
                columns={columns}
                onClick={() => {
                    handleDelete();
                }}
                dataSource={posts.map((post) => ({
                    ...post,
                    key: post.id,
                }))}

            />
        </div>
    );
};

export default AdminFormat;
