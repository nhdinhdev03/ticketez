import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Col, Row, Form, message, Popconfirm, Upload, Image, ColorPicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import axiosClient from '~/api/global/axiosClient';

import BaseModal from '~/components/Admin/BaseModal/BaseModal';
import BaseTable from '~/components/Admin/BaseTable/BaseTable';
import funcUtils from '~/utils/funcUtils';

import { seatTypeApi } from '~/api/admin';
import uploadApi from '~/api/service/uploadApi';

import classNames from 'classnames/bind';
import style from './SeatType.module.scss';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { regex } from '~/utils/regex';

dayjs.extend(customParseFormat);
const cx = classNames.bind(style);
const { TextArea } = Input;

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const AdminSeatType = () => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    // const [checkNick, setCheckNick] = useState(false);
    const [resetForm, setResetForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [posts, setPosts] = useState([]);
    const [openColor, setOpenColor] = useState(false);

    const [workSomeThing, setWorkSomeThing] = useState(false);

    //call api
    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            try {
                const res = await axiosClient.get(`seatType/getAll`);
                console.log(res);

                const filteredPosts = res.data.filter(
                    (seatType) => seatType.id !== 7 && seatType.id !== 8 && seatType.id !== 9,
                );

                setPosts(filteredPosts);
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
    }, [workSomeThing]);

    const columns = [
        // {
        //     title: 'Mã',
        //     dataIndex: 'id',
        //     width: '10%',
        //     sorter: (a, b) => a.id - b.id,
        // },
        {
            title: 'tên loại ghế',
            dataIndex: 'name',
        },
        {
            title: 'Tên viết tắt',
            dataIndex: 'nickName',
        },
        {
            title: 'Màu ghế',
            render: (_, record) => <ColorPicker disabled value={record.color} showText />,
        },
        {
            title: 'Sức chứa',
            dataIndex: 'width',
        },
        {
            title: 'Ảnh ghế',
            dataIndex: 'avatar',
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
            const res = await seatTypeApi.delete(record.id);
            console.log(res);
            setShowInfo('success');
        } catch (error) {
            setShowInfo('errorEdit');
            console.log(error);
        }

        setWorkSomeThing(!workSomeThing);
    };

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
        });
    };
    const [showInfo, setShowInfo] = useState('');
    useEffect(() => {
        if (showInfo === 'success') {
            funcUtils.notify('xóa thành công dữ liệu trong bảng', 'success');
            setShowInfo('es');
        }
        if (showInfo === 'errorFormat') {
            funcUtils.notify('Vui lòng chọn loại phim', 'error');
            setShowInfo('es');
        }
        if (showInfo === 'errorCinemaComplex') {
            funcUtils.notify('Vui lòng chọn cụm rạp', 'error');
            setShowInfo('es');
        }
        if (showInfo === 'errorEdit') {
            funcUtils.notify('Loại ghế này đang được sử dụng !', 'error');
            setShowInfo('es');
        }
    }, [showInfo]);

    const handleOk = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();

            console.log(fileList);
            if (fileList.length > 0) {
                if (editData) {
                    let putData = {
                        id: editData.id,
                        ...values,
                    };

                    if (putData.image.file) {
                        const file = putData.image.fileList[0].originFileObj;
                        const images = await uploadApi.put(editData.image, file);
                        putData = {
                            ...putData,
                            image: images,
                        };
                    }
                    if (
                        values.color &&
                        typeof values.color === 'object' &&
                        typeof values.color.toHexString === 'function'
                    ) {
                        var newcolor = values.color.toHexString();
                        putData = {
                            ...putData,
                            color: newcolor,
                        };
                    } else {
                        // Nếu không phải đối tượng có toHexString, giữ nguyên giá trị color
                        var newcolor1 = values.color;
                        putData = {
                            ...putData,
                            color: newcolor1,
                        };
                    }
                    console.log(putData);
                    try {
                        const resPut = await axiosClient.put(`seatType/${putData.id}`, putData);
                        console.log(resPut);
                        if (resPut.status === 200) {
                            funcUtils.notify('Cập nhật loại ghế thành công', 'success');
                        }
                    } catch (error) {
                        if (error.hasOwnProperty('response')) {
                            message.error(error.response.data);
                        } else {
                            console.log(error);
                        }
                    }
                } else {
                    const file = values.image.fileList[0].originFileObj;
                    const images = await uploadApi.post(file);
                    let postData = {
                        // id: editData.id,
                        ...values,
                        image: images,
                    };
                    if (
                        values.color &&
                        typeof values.color === 'object' &&
                        typeof values.color.toHexString === 'function'
                    ) {
                        var newcolor = values.color.toHexString();
                        postData = {
                            ...postData,
                            color: newcolor,
                        };
                    } else {
                        // Nếu không phải đối tượng có toHexString, giữ nguyên giá trị color
                        var newcolor1 = values.color;
                        postData = {
                            ...postData,
                            color: newcolor1,
                        };
                    }

                    console.log(postData);
                    try {
                        const resPost = await axiosClient.post(`seatType`, postData);
                        console.log(resPost);
                        if (resPost.status === 200) {
                            funcUtils.notify('Cập nhật loại ghế thành công', 'success');
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
    };

    const handleColorChange = (color) => {
        form.setFieldsValue({ color });
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
                            label="Tên ghế"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên ghế' },
                                {
                                    pattern: regex.Vi,
                                    message: 'Tên không chứa ký tự đặc biệt',
                                },
                            ]}
                        >
                            <Input placeholder="Tên ghế" />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            name="nickName"
                            label="Tên viết tắt"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên viết tắt ghế' },
                                {
                                    pattern: regex.Vi,
                                    message: 'Tên không chứa ký tự đặc biệt',
                                },
                            ]}
                        >
                            <Input placeholder="Tên ghế" />
                        </Form.Item>

                        <Form.Item {...formItemLayout} name="color" label="Màu ghế">
                            <ColorPicker showText onChange={handleColorChange} />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="width"
                            label="Sức chứa "
                            initialValue={1}
                            rules={[
                                { required: true, message: 'Vui lòng nhập Sức chứa ghế' },
                                { pattern: /^[0-9]*$/, message: 'Vui lòng chỉ nhập số' },
                            ]}
                        >
                            <Input width={200} placeholder="Sức chứa ghế" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="description"
                            label="Mô tả"
                            rules={[{ required: true, message: 'Vui lòng nhập miêu tả' }]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            label="Ảnh ghế"
                            name="image"
                            rules={[{ required: true, message: 'Vui lòng chọn ảnh đại diện' }]}
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
                                {fileList.length < 1 && '+ Upload'}
                            </Upload>
                        </Form.Item>
                    </Form>
                </BaseModal>
            </Row>
            <BaseTable
                columns={columns}
                dataSource={posts.map((post) => ({
                    ...post,
                    key: post.id,
                }))}
            />
        </>
    );
};

export default AdminSeatType;
