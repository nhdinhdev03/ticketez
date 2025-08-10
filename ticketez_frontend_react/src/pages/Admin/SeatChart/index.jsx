import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Col, Row, Form, message, Popconfirm, Upload, Image, Switch, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import axiosClient from '~/api/global/axiosClient';

import BaseModal from '~/components/Admin/BaseModal/BaseModal';
import BaseTable from '~/components/Admin/BaseTable/BaseTable';
import funcUtils from '~/utils/funcUtils';
import { seatChartApi } from '~/api/admin';
import uploadApi from '~/api/service/uploadApi';
import SeatGenerator from '../Seat/SeatGenerator';

import classNames from 'classnames/bind';
import style from './SeatType.module.scss';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const cx = classNames.bind(style);
const { TextArea } = Input;

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const AdminSeatChart = () => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    // const [checkNick, setCheckNick] = useState(false);
    const [resetForm, setResetForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const [workSomeThing, setWorkSomeThing] = useState(false);

    //call api
    const getList = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`seatchart/getAll`);
            console.log(res);
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
    useEffect(() => {
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
            title: 'Tên sơ đồ',
            dataIndex: 'name',
            width: '30%',
        },
        {
            title: 'Trạng thái',
            render: (_, record) => (record.status ? 'Còn hoạt động' : 'Không còn hoạt động'),
            width: '30%',
        },
        {
            title: 'Chuỗi rạp chiếu',
            render: (_, record) => record.cinema.cinemaComplex.cinemaChain.name,
            width: '30%',
        },
        {
            title: 'Cụm rạp',
            render: (_, record) => record.cinema.cinemaComplex.name,
            width: '30%',
        },
        {
            title: 'rạp',
            render: (_, record) => record.cinema.name,
            width: '30%',
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
                </Space>
            ),
        },
    ];

    const onChangeUpload = async ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const handleEditCancel = () => {
        setOpen(false);
    };
    const handleOkEdit = async () => {
        const values = await form.validateFields();
        let putData = {
            id: editData.id,
            ...values,
        };

        console.log(putData);

        const resp = await axiosClient.patch(`seatchart/${editData.id}`, putData);
        console.log(resp);
        funcUtils.notify('Cập nhật sơ đồ thành công', 'success');
        getList();
        setOpen(false);
    };
    const handleEditData = (record) => {
        setOpen(true);
        setResetForm(false);
        setEditData(record);
        form.setFieldsValue({
            ...record,
        });
    };

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
                <Col span={2}></Col>
                <BaseModal
                    maskClosable={false}
                    open={open}
                    width={'60%'}
                    title={editData ? 'Cập nhật' : 'Thêm mới'}
                    onOk={handleOk}
                    onCancel={handleEditCancel}
                    footer={[
                        <Button key="back" onClick={handleEditCancel}>
                            Thoát
                        </Button>,
                        resetForm && (
                            <Button key="reset" onClick={handleResetForm}>
                                Làm mới
                            </Button>
                        ),
                        <Button key="submit" type="primary" loading={loading} onClick={handleOkEdit}>
                            {editData ? 'Cập nhật' : 'Thêm mới'}
                        </Button>,
                    ]}
                >
                    <Form form={form} name="dynamic_rule" style={{ maxWidth: 1000 }}>
                        <Form.Item
                            {...formItemLayout}
                            name="name"
                            label="Tên ghế"
                            rules={[{ required: true, message: 'Vui lòng tên ghế' }]}
                        >
                            <Input placeholder="Tên ghế" />
                        </Form.Item>

                        <Form.Item {...formItemLayout} name="status" label="Trạng thái" valuePropName="checked">
                            <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" defaultChecked />
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
            <Modal
                title="Tạo sơ đồ"
                open={isModalOpen}
                width={1500}
                destroyOnClose={true}
                footer={null}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div className={cx('modal-content')}>
                    <SeatGenerator />
                </div>
            </Modal>
        </>
    );
};

export default AdminSeatChart;
