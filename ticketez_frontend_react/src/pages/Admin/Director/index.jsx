import React, { useState, useEffect } from 'react';
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
import { PlusOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

import BaseModal from '~/components/Admin/BaseModal/BaseModal';
import BaseTable from '~/components/Admin/BaseTable/BaseTable';
import funcUtils from '~/utils/funcUtils';

import { directorApi } from '~/api/admin';
import uploadApi from '~/api/service/uploadApi';

import classNames from 'classnames/bind';
import style from './Director.module.scss';
import PaginationCustom from '~/components/Admin/PaginationCustom';
import countriesJson from '~/data/countries.json';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { regex } from '~/utils/regex';
import CustomCKEditor from '~/pages/Templates/Ckeditor';
dayjs.extend(customParseFormat);
const cx = classNames.bind(style);

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
const { TextArea } = Input;

const AdminDirector = () => {
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
                const res = await directorApi.getByPage(currentPage, pageSize);
                // console.log(res);
                setTotalItems(res.totalItems);
                setPosts(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        getList();
    }, [currentPage, pageSize, workSomeThing]);

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
            // ...getColumnSearchProps('country'),
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
            const res = await directorApi.delete(record.id);
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
            if (fileList.length > 0) {
                if (editData) {
                    let putData = {
                        id: editData.id,
                        ...values,
                    };
                    if (putData.avatar.file) {
                        const file = putData.avatar.fileList[0].originFileObj;
                        const images = await uploadApi.put(editData.avatar, file);
                        putData = {
                            ...putData,
                            avatar: images,
                        };
                    }

                    try {
                        const resPut = await directorApi.update(putData.id, putData);
                        // console.log(resPut);
                        if (resPut.status === 200) {
                            funcUtils.notify('Cập nhật đạo diễn thành công', 'success');
                        }
                    } catch (error) {
                        funcUtils.notify(error.response.data, 'error');
                        console.log(error);
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
                        const resPost = await directorApi.create(postData);
                        // console.log('resPost', resPost);
                        if (resPost.status === 200) {
                            funcUtils.notify('Thêm đạo diễn thành công', 'success');
                        }
                    } catch (error) {
                        funcUtils.notify(error.response.data, 'error');
                        console.log(error);
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

    //form
    const handleResetForm = () => {
        form.resetFields();
        setFileList([]);
        console.log(form);
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

    return (
        <>
            <Row>
                <Col span={22}>
                    <h1 className="tw-mt-[-7px]">Bảng dữ liệu</h1>
                </Col>
                <Col span={2}>
                    <Button type="primary"  icon={<PlusOutlined />} onClick={showModal}>
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
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên' },
                                {
                                    pattern: regex.Vi,
                                    message: 'Tên không chứa ký tự đặc biệt',
                                },
                            ]}
                        >
                            <Input placeholder="Họ và tên" />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            name="birthday"
                            label="Ngày sinh"
                            rules={[{ required: true, message: 'Vui lòng nhập ngày' }, { validator: validateBirthday }]}
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
                                    pattern: regex.Email,
                                    message: 'Email không hợp lệ.',
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
                            {/* <TextArea rows={4} placeholder="Tiểu sử" /> */}
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

export default AdminDirector;
