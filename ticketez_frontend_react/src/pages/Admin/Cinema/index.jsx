import React, { useRef, useState, useEffect } from 'react';
import {
    Button,
    Input,
    Space,
    Col,
    Row,
    Form,
    message,
    Popconfirm,
    Table,
    Card,
    Breadcrumb,
    Switch,
    Select,
    Pagination,
    Tag
} from 'antd';
import { SearchOutlined, PlusOutlined, } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import BaseTable from '~/components/Admin/BaseTable/BaseTable';
import BaseModal from '~/components/Admin/BaseModal/BaseModal';
import style from './Cinema.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { cinemaApi, cinemaComplexApi } from '~/api/admin';
import { cinemaTypeApi } from '~/api/admin';
import funcUtils from '~/utils/funcUtils';
import authApi from '~/api/user/Security/authApi';


const cx = classNames.bind(style);

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const AdminCinema = ({ cinemaComplexId }) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    // const [checkNick, setCheckNick] = useState(false);
    const [resetForm, setResetForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [posts, setPosts] = useState([]);

    const [workSomeThing, setWorkSomeThing] = useState(false);
    const [totalItems, setTotalItems] = useState(0); // Tổng số mục
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [pageSize, setPageSize] = useState(10); // Số mục trên mỗi trang
    const [cinemaType, setCinemaType] = useState([]);
    const [cinemaComplex, setCinemaComplex] = useState([]);
    // console.log(cinemaComplexId);
    // const user = authApi.getUser();
    //api
    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            try {
                const res = await cinemaApi.getCinemaByComplexId(cinemaComplexId.id, currentPage, pageSize);
                const [cinemaType, cinemaComplex] = await Promise.all([cinemaTypeApi.get(), cinemaComplexApi.get()]);
                setCinemaType(cinemaType.data);
                setCinemaComplex(cinemaComplex.data);
                //    const resType = await cinemaTypeApi.getCinemaType();
                // console.log(cinemaType)
                // console.log(cinemaComplex);
                // console.log(res);
                //    console.log(resType);
                console.log('text', res);
                setTotalItems(res.totalItems);

                setPosts(res.data.data);
                setLoading(false);
            } catch (error) {
                if (error.hasOwnProperty('response')) {
                    funcUtils.notify(error.response.data, 'error');
                } else {
                    console.log(error);
                }
            }
        };
        getList();
    }, [cinemaComplexId, currentPage, pageSize, workSomeThing]);

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
        // {
        //     title: 'id',
        //     dataIndex: 'id',
        //     width: '10%',
        //     // ...getColumnSearchProps('id'),
        //     sorter: (a, b) => a.id - b.id,
        //     // defaultSortOrder: 'descend',
        // },
        {
            title: 'Tên rạp',
            dataIndex: 'name',
            width: '20%',
            ...getColumnSearchProps('name'),
        },

        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: '20%',
            render: (status) => (
                <Tag style={{ color: status ? 'red' : 'green' }}>
                    {status ? 'Hoạt động' : 'Ngừng hoạt động'}
                </Tag>
            ),

        },
        {
            title: 'Loại rạp',
            dataIndex: 'cinemaType',
            width: '15%',
            render: (cinemaType) => <span>{cinemaType.typeName}</span>,
        },
        // {
        //     title: 'Cụm rạp',
        //     dataIndex: 'cinemaComplex',
        //     width: '30%',
        //     ...getColumnSearchProps('name'),
        //     render: (cinemaComplex) => <span>{cinemaComplex.name}</span>,
        // },
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
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleDelete(record)}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    const showModal = () => {
        form.resetFields();
        setEditData(null);
        setOpen(true);
        setResetForm(true);
    };

    const handleDelete = async (record) => {
        try {
            const res = await cinemaApi.delete(record.id);
            console.log(res);
            if (res.status === 200) {
                funcUtils.notify(res.data, 'success');
            }
        } catch (error) {
            console.log(error);
            if (error.response.status === 409) {
                funcUtils.notify(error.response.data, 'error');
            }
        }
        setWorkSomeThing(!workSomeThing);
    };

    const handleEditData = (record) => {
        setOpen(true);
        setResetForm(false);
        setEditData(record);
        console.log(record);
        form.setFieldsValue({ ...record, cinemaType: record.cinemaType.id, cinemaComplex: record.cinemaComplex.id });
    };

    const handleOk = async () => {
        setLoading(true);
        try {
            let values = await form.validateFields();
            if (values.status === undefined) {
                values = { ...values, status: true };
            }
            console.log(values.cinemaType);
            console.log(values.cinemaComplex);
            if (editData) {
                const resp = await cinemaApi.put(editData.id, values, values.cinemaType, cinemaComplexId.id);
                console.log(resp);
                funcUtils.notify('Cập nhật thành công', 'success');
            }
            console.log(values);
            if (!editData) {
                try {
                    console.log(values);
                    const resp = await cinemaApi.post(values, values.cinemaType, cinemaComplexId.id);
                    // message.success('Thêm thành công');
                    funcUtils.notify('Thêm thành công', 'success');
                } catch (error) {
                    console.log(error);
                }
            }
            setOpen(false);
            form.resetFields();
            setLoading(false);
            setWorkSomeThing(!workSomeThing);
            // getList();
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
            setLoading(false);
        }
    };
    const handleCancel = () => {
        setOpen(false);
    };

    //form
    const handleResetForm = () => {
        form.resetFields();
        console.log(form);
    };
    const [switchChecked, setSwitchChecked] = useState(false);

    const onChange = (checked) => {
        console.log(`Switch to ${checked}`);
        setSwitchChecked(checked);
      };
    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    return (
        <>
            <Row>
                <Col span={22}>
                    <h1 className={cx('title')}>Danh sách Phòng rạp</h1>
                </Col>
                <Col span={2}>
                    <Button type="primary" className={cx('button-title')} icon={<PlusOutlined />} onClick={showModal}>
                        Thêm
                    </Button>
                </Col>
                <BaseModal
                    maskClosable={false}
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
                        {/* <Form.Item
                                {...formItemLayout}
                                name="id"
                                label="Id"
                                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                            >
                                <Input placeholder="Please input your name" />
                            </Form.Item> */}
                        <Form.Item
                            {...formItemLayout}
                            name="name"
                            label="Tên phòng"
                            rules={[{ required: true, message: 'Vui lòng nhập phòng' }]}
                        >
                            <Input placeholder="Nhập tên phòng chiếu" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="status"
                            label="Trạng thái"
                            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                        >
                            <Switch
                                defaultChecked={switchChecked}
                                onChange={onChange}
                                
                            />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="cinemaType"
                            label="Loại rạp"
                            rules={[{ required: true, message: 'Vui lòng chọn loại phòng' }]}
                        >
                            <Select
                                style={{ width: '100%' }}
                                showSearch
                                placeholder="Chọn loại"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={[
                                    {
                                        value: editData?.cinemaType?.id, // Sử dụng cinemaType từ record khi có
                                        label: editData?.cinemaType?.typeName,
                                    },
                                    ...cinemaType.map((typeName) => ({
                                        value: typeName.id,
                                        label: typeName.typeName,
                                    })),
                                ]}
                                allowClear
                            />
                        </Form.Item>
                        {/* <Form.Item
                            {...formItemLayout}
                            name="cinemaComplex"
                            label="Cụm rạp"
                            rules={[{ required: true, message: 'Vui lòng chọn cụm rạp' }]}
                        >
                            <Select
                                style={{ width: '100%' }}
                                showSearch
                                placeholder="Chọn loại"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={[
                                    {
                                        value: editData?.cinemaComplex?.id, // Sử dụng cinemaType từ record khi có
                                        label: editData?.cinemaComplex?.name,
                                    },
                                    ...cinemaComplex.map((name) => ({
                                        value: name.id,
                                        label: name.name,
                                    })),
                                ]}
                                allowClear
                            />
                        </Form.Item> */}
                    </Form>
                </BaseModal>
            </Row>

            <BaseTable
                columns={columns}
                onClick={() => {
                    handleDelete();
                }}
                // dataSource={posts}
                pagination={false}
                dataSource={posts?.map((post) => ({ ...post, key: post.id }))}
            />
            <div className={cx('wrapp-pagination')}>
                <Pagination
                    showSizeChanger={false}
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalItems}
                    onChange={handlePageChange}
                />
            </div>
        </>
    );
};

export default AdminCinema;
