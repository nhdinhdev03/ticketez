import React, { useRef, useState, useEffect } from 'react';
import { Button, Input, Space, Col, Row, Form, message, Popconfirm, Upload, Image, Select } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import BaseModal from '~/components/Admin/BaseModal/BaseModal';
import BaseTable from '~/components/Admin/BaseTable/BaseTable';
import funcUtils from '~/utils/funcUtils';
import { cinemaComplexApi, serviceApi } from '~/api/admin';
import uploadApi from '~/api/service/uploadApi';
import classNames from 'classnames/bind';
import style from './ServiceCombo.module.scss';
import PaginationCustom from '~/components/Admin/PaginationCustom';
const cx = classNames.bind(style);

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const AdminService = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [selectCinemaComplex, setSelectCinemaComplex] = useState();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    // const [checkNick, setCheckNick] = useState(false);
    const [resetForm, setResetForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [posts, setPosts] = useState([]);
    const [workSomeThing, setWorkSomeThing] = useState(false);
    const [totalItems, setTotalItems] = useState(0); // Tổng số mục
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [pageSize, setPageSize] = useState(10); // Số mục trên mỗi trang

    //call api
    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            try {
                const [res, cinemaComplex] = await Promise.all([
                    serviceApi.getByPage(currentPage, pageSize),
                    cinemaComplexApi.get(),
                ]);
                console.log(cinemaComplex.data);
                console.log(res);
                setTotalItems(res.totalItems);
                setPosts(res.data);
                setLoading(false);
                setSelectCinemaComplex(cinemaComplex.data);
            } catch (error) {
                if (error.hasOwnProperty('response')) {
                    message.error(error.response.data);
                } else {
                    console.log(error);
                }
            }
        };
        getList();
    }, [currentPage, pageSize, workSomeThing]);

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
                    placeholder={`Tìm kiếm ${dataIndex}`}
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
                        Tìm
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        mới
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
                        Lọc
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Đóng
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
        // {
        //     title: 'Mã',
        //     dataIndex: 'id',
        //     width: '10%',
        //     sorter: (a, b) => a.id - b.id,
        // },
        {
            title: 'Tên dịch vụ',
            dataIndex: 'name',
            width: '30%',
            // ...getColumnSearchProps('name'),
        },
        {
            title: 'Ảnh đại diện',
            dataIndex: 'image',
            render: (_, record) => (
                <Space size="middle">
                    <Image
                        width={105}
                        height={80}
                        style={{ objectFit: 'contain' }}
                        alt="ảnh rỗng"
                        src={`http://localhost:8081/api/upload/${record.image}`}
                    />
                </Space>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            width: '10%',
            // ...getColumnSearchProps('description'),
        },
        {
            title: 'Mô tả dịch vụ',
            dataIndex: 'description',
            width: '30%',
            // ...getColumnSearchProps('description'),
        },
        {
            title: 'Rạp',
            dataIndex: 'nameCinemaComplex',
            width: '20%',
            // ...getColumnSearchProps('cinemaComplex'),
        },

        {
            title: 'Thao tác',
            width: '20%',
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
                        okText="Đồng ý"
                        cancelText="Huỷ"
                        onConfirm={() => handleDelete(record)}
                    >
                        <FontAwesomeIcon icon={faTrash} className={cx('icon-trash')} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleEditData = (record) => {
        const newUploadFile = {
            uid: record.id.toString(),
            name: record.image,
            url: `http://localhost:8081/api/upload/${record.image}`,
        };
        setFileList([newUploadFile]);
        setOpen(true);
        setResetForm(false);
        setEditData(record);
        form.setFieldsValue({
            ...record,
            cinemaComplex: record.cinemaComplex?.id,
        });
        console.log(record);
    };

    const onChangeUpload = async ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const showModal = () => {
        form.resetFields();
        setEditData(null);
        setOpen(true);
        setResetForm(true);
        setFileList([]);
    };

    const handleDelete = async (record) => {
        try {
            const res = await serviceApi.delete(record.id);
            console.log(res);
            if (res.status === 200) {
                await uploadApi.delete(record.image);
                funcUtils.notify('Xoá thành công', 'success');
            }
        } catch (error) {
            if (error.hasOwnProperty('response')) {
                message.error(error.response.data);
            } else {
                console.log(error);
            }
        }

        setWorkSomeThing(!workSomeThing);
    };

    const handleOk = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();

            if (fileList.length > 0) {
                if (editData) {
                    let putData = {
                        id: editData.id,
                        ...values,
                    };
                    if (putData.image.file) {
                        console.log(putData);

                        const file = putData.image.fileList[0].originFileObj;
                        const images = await uploadApi.put(editData.image, file);
                        putData = {
                            ...putData,
                            image: images,
                        };
                    }
                    try {
                        const resPut = await serviceApi.put(editData.id, putData, putData.cinemaComplex);
                        console.log(resPut);
                        if (resPut.status === 200) {
                            funcUtils.notify('Cập nhật dịch vụ thành công', 'success');
                        }
                    } catch (error) {
                        if (error.hasOwnProperty('response')) {
                            message.error(error.response.data);
                        } else {
                            console.log(error);
                        }
                        console.log(putData);
                    }
                }
                if (!editData) {
                    try {
                        const file = values.image.fileList[0].originFileObj;
                        const images = await uploadApi.post(file);
                        const postData = {
                            ...values,
                            image: images,
                        };
                        console.log(postData);
                        const resPost = await serviceApi.post(postData, postData.cinemaComplex);
                        console.log('resPost', resPost);
                        if (resPost.status === 200) {
                            funcUtils.notify('Thêm dịch vụ thành công', 'success');
                        }

                        console.log(values);
                    } catch (error) {
                        if (error.hasOwnProperty('response')) {
                            message.error(error.response.data);
                        } else {
                            console.log(error);
                        }
                    }
                }
                setOpen(false);
                form.resetFields();
                setLoading(false);
                setFileList([]);
                setWorkSomeThing(!workSomeThing);
            } else {
                setLoading(false);
                message.error('vui lòng chọn ảnh');
            }
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
        setFileList([]);
        console.log(form);
    };

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    // Xử lý sự kiện thay đổi trang
    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };
    return (
        <>
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
                            label="Tên dịch vụ"
                            rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ' }]}
                        >
                            <Input placeholder="Tên dịch vụ" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="quantity"
                            label="Số lượng"
                            
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                        >
                            <Input placeholder="Số lượng" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="description"
                            label="Mô tả dịch vụ"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả dịch vụ' }]}
                        >
                            <Input placeholder="Mô tả" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="cinemaComplex"
                            label="Chọn "
                            rules={[{ required: true, message: 'Vui lòng chọn' }]}
                        >
                            <Select
                                style={{ width: '100%' }}
                                showSearch
                                placeholder="Chọn "
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={selectCinemaComplex?.map((cinemaComplex) => ({
                                    value: cinemaComplex.id,
                                    label: cinemaComplex.name,
                                }))}
                            />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="Ảnh đại diện"
                            name="image"
                            rules={[{ required: true, message: 'Vui lòng chọn ảnh' }]}
                        >
                            <Upload
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                accept=".png, .jpg"
                                listType="picture-card"
                                onChange={onChangeUpload}
                                onPreview={onPreview}
                                fileList={fileList}
                                name="image"
                                maxCount={1}
                            >
                                {fileList.length < 2 && '+ Upload'}
                            </Upload>
                        </Form.Item>
                    </Form>
                </BaseModal>
            </Row>
            <BaseTable
                pagination={false}
                columns={columns}
                dataSource={posts.map((post) => ({
                    ...post,
                    key: post.id,
                    nameCinemaComplex: post.cinemaComplex.name,
                }))}
            />
            <div className={cx('wrapp-pagination')}>
                <PaginationCustom
                    howSizeChanger={false}
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalItems}
                    onChange={handlePageChange}
                />
            </div>
        </>
    );
};

export default AdminService;
