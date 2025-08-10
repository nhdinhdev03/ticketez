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
    DatePicker,
    Upload,
    Image,
    Select,
    Radio,
} from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

import BaseModal from '~/components/Admin/BaseModal/BaseModal';
import BaseTable from '~/components/Admin/BaseTable/BaseTable';
import funcUtils from '~/utils/funcUtils';

import { actorApi } from '~/api/admin';
import uploadApi from '~/api/service/uploadApi';

import classNames from 'classnames/bind';
import style from './Actor.module.scss';
import PaginationCustom from '~/components/Admin/PaginationCustom';
import countriesJson from '~/data/countries.json';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import CustomCKEditor from '~/pages/Templates/Ckeditor';
dayjs.extend(customParseFormat);
const cx = classNames.bind(style);

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const { TextArea } = Input;
const AdminActor = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

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
                const res = await actorApi.getByPage(currentPage, pageSize);
                // console.log(res);
                setTotalItems(res.totalItems);
                setPosts(res.data);
                setLoading(false);
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
        {
            title: 'Mã',
            dataIndex: 'id',
            width: '5%',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullname',
            width: '20%',

            // ...getColumnSearchProps('fullname'),
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            render: (_, record) => (record.gender ? 'Nam' : 'Nữ'),
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'birthday',
        },

        {
            title: 'Quốc gia',
            dataIndex: 'country',
            key: 'country',
            ...getColumnSearchProps('country'),
            render: (_, record) => {
                let i = countriesJson.findIndex((item) => item.code === record.country);
                return <span>{i > -1 ? countriesJson[i].name : record.country}</span>;
            },
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Ảnh đại diện',
            dataIndex: 'avatar',
            render: (_, record) => (
                <Space size="middle">
                    <Image
                        width={105}
                        height={80}
                        style={{ objectFit: 'contain' }}
                        alt="ảnh rỗng"
                        src={`http://localhost:8081/api/upload/${record.avatar}`}
                    />
                </Space>
            ),
        },
        // {
        //     title: 'Tiểu sử',
        //     dataIndex: 'biography',
        // },
        {
            title: 'Thao tác',
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

    const optionsWithDisabled = [
        {
            value: true,
            label: 'Nam',
        },
        {
            value: false,
            label: 'Nữ',
        },
    ];

    const onChangeUpload = async ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const showModal = () => {
        form.resetFields();
        setEditData(null);
        setOpen(true);
        setResetForm(true);
        setFileList([]);
        form.setFieldsValue({
            gender: true,
        });
    };

    const handleDelete = async (record) => {
        try {
            const res = await actorApi.delete(record.id);
            // console.log(res);
            if (res.status === 200) {
                await uploadApi.delete(record.avatar);
                funcUtils.notify('Xoá thành công', 'success');
            }
        } catch (error) {
            console.log(error);
        }

        setWorkSomeThing(!workSomeThing);
    };

    const handleEditData = (record) => {
        const newUploadFile = {
            uid: record.id.toString(),
            name: record.avatar,
            url: `http://localhost:8081/api/upload/${record.avatar}`,
        };
        setFileList([newUploadFile]);
        setOpen(true);
        setResetForm(false);
        setEditData(record);
        form.setFieldsValue({
            ...record,
            birthday: dayjs(record.birthday, 'DD-MM-YYYY'),
        });
    };
   

    const handleOk = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            // console.log("ádasd",values);
            if (fileList.length > 0) {
                if (editData) {
                    let putData = {
                        id: editData.id,
                        ...values,
                    };
                    if (putData.avatar.file) {
                        // console.log(putData);

                        const file = putData.avatar.fileList[0].originFileObj;
                        const images = await uploadApi.put(editData.avatar, file);
                        putData = {
                            ...putData,
                            avatar: images,
                        };
                    }
                    try {
                        const resPut = await actorApi.update(putData.id, putData);
                        // console.log(resPut);
                        if (resPut.status === 200) {
                            funcUtils.notify('Cập nhật diễn viên thành công', 'success');
                        }
                    } catch (error) {
                        if (error.hasOwnProperty('response')) {
                            message.error(error.response.data);
                        } else {
                            console.log(error);
                        }
                    }
                }
                if (!editData) {
                    try {
                        const file = values.avatar.fileList[0].originFileObj;
                        const images = await uploadApi.post(file);
                        const postData = {
                            ...values,
                            avatar: images,
                        };
                        // console.log(postData);
                        const resPost = await actorApi.create(postData);
                        // console.log('resPost', resPost);
                        if (resPost.status === 200) {
                            funcUtils.notify('Thêm diễn viên thành công', 'success');
                        }
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
        setLoading(false);
    };

    // useEffect(() => {
    //     form.validateFields(['nickname']);
    // }, [checkNick, form]);

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

    const validateBirthday = (rule, value) => {
        return new Promise((resolve, reject) => {
            if (value) {
                // Tính tuổi dựa trên ngày sinh
                const today = new Date();
                const birthday = new Date(value);
                const age = today.getFullYear() - birthday.getFullYear();

                // Kiểm tra tuổi
                if (age < 18) {
                    reject('Ngày sinh đạo diễn phải lớn hơn 13 tuổi');
                } else {
                    resolve();
                }
            } else {
                resolve();
            }
        });
    };
    // 
    
    return (
        <>
            <Row>
                <Col span={22}>
                    <h1 className="tw-mt-[-7px]">Bảng dữ liệu</h1>
                </Col>
                <Col span={2}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
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
                    <Form form={form} name="dynamic_rule" {...formItemLayout}>
                        <Form.Item
                            {...formItemLayout}
                            name="fullname"
                            label="Họ và tên"
                            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                        >
                            <Input placeholder="Họ và tên" />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            name="birthday"
                            label="Ngày sinh"
                            rules={[
                                { required: true, message: 'Vui lòng chọn ngày sinh' },
                                { validator: validateBirthday },
                            ]}
                        >
                            <DatePicker placeholder="Ngày sinh" format="DD-MM-YYYY" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            name="gender"
                            label="Giới tính"
                            rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                        >
                            <Radio.Group options={optionsWithDisabled} optionType="button" buttonStyle="solid" />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            name="country"
                            label="Quốc gia"
                            rules={[{ required: true, message: 'Vui lòng chọn quốc gia' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Tìm kiếm và chọn quốc gia"
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '')
                                        .toLowerCase()
                                        .localeCompare((optionB?.label ?? '').toLowerCase())
                                }
                                options={[
                                    ...countriesJson.map((item) => ({
                                        value: item.code,
                                        label: item.name,
                                    })),
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            name="email"
                            label="Emai"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email' },
                                {
                                    pattern: /^[A-Za-z0-9._%+-]+@gmail\.com$/,
                                    message: 'Email không hợp lệ. Phải có đuôi @email.com',
                                },
                            ]}
                        >
                            <Input placeholder="email..." />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            label="Ảnh đại diện"
                            name="avatar"
                            rules={[{ required: true, message: 'Vui lòng chọn ảnh đại diện' }]}
                        >
                            <Upload
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                accept=".png, .jpg"
                                listType="picture-card"
                                onChange={onChangeUpload}
                                // onPreview={onPreview}
                                fileList={fileList}
                                name="avatar"
                                maxCount={1}
                            >
                                {fileList.length < 2 && '+ Upload'}
                            </Upload>
                        </Form.Item>

                        <Form.Item {...formItemLayout} name="biography" label="Tiểu sử">
                            <CustomCKEditor  />
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
                    birthday: `${('0' + new Date(post.birthday).getDate()).slice(-2)}-${(
                        '0' +
                        (new Date(post.birthday).getMonth() + 1)
                    ).slice(-2)}-${new Date(post.birthday).getFullYear()}`,
                }))}
                expandable={{
                    expandedRowRender: (record) => (
                        <div
                            className=" tw-flex "
                            style={{
                                margin: 0,
                            }}
                        >
                            <h4 className="tw-w-[7%]">Tiểu Sử:</h4>
                            {record.description !== null && (
                                    <span className="tw-w-[90%] " dangerouslySetInnerHTML={{ __html: record.biography }} />
                                )}
                        </div>
                    ),
                    rowExpandable: (record) => record.name !== 'Not Expandable',
                }}
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

export default AdminActor;
