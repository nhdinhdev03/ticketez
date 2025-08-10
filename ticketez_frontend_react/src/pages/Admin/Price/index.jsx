import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Col, Row, Form, message, Popconfirm, Upload, Image, Select, Modal } from 'antd';
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
import ModalPrice from './Modal';

dayjs.extend(customParseFormat);
const cx = classNames.bind(style);
const { TextArea } = Input;

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const AdminPrice = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    // const [checkNick, setCheckNick] = useState(false);
    const [resetForm, setResetForm] = useState(false);
    const [showtimeData, setShowtimeData] = useState([]);
    const [editData, setEditData] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [posts, setPosts] = useState([]);

    const [workSomeThing, setWorkSomeThing] = useState(false);

    const [yourSelectedValue, setYourSelectedValue] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    //call api
    const getList = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`price/price-price-seat-type-dto`);
            console.log(res);

            const filteredPosts = res.data.filter((seatType) => seatType.id !== 7);

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
    const fetchDataShowtime = async () => {
        try {
            const resp = await axiosClient.get(`showtime/get/all`);
            const dataShowtime = resp.data;
            setShowtimeData(dataShowtime);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchDataShowtime();
        getList();
    }, [workSomeThing]);

    const columns = [
        // {
        //     title: 'Mã',
        //     render: (_, record) => record.price.id,
        //     width: '10%',
        //     sorter: (a, b) => a.id - b.id,
        // },
        {
            title: 'Ngày áp dụng',
            render: (_, record) =>
                new Date(record.price.startDate).toLocaleDateString() +
                ' - ' +
                new Date(record.price.endDate).toLocaleDateString(),
        },

        {
            title: 'Tên phim',
            render: (_, record) => `${record.price.formatMovie.movie.title} ${record.price.formatMovie.format.name}`,
        },
        {
            title: 'Cụm rạp và chuỗi rạp',
            render: (_, record) =>
                `${record.price.cinemaComplex.name} - ${record.price.cinemaComplex.cinemaChain.name}`,
        },

        {
            title: 'Gồm các loại ghế',
            render: (_, record) =>
                `${record.newPriceSeatTypeDTOs.map((moment, index) => moment.seatType.name).join(',' + '\n')}`,
        },

        {
            title: 'Thao tác',
            render: (_, record) => (
                <Space size="middle">
                    <FontAwesomeIcon
                        icon={faPen}
                        className={cx('icon-pen', 'tw-cursor-pointer')}
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
                        <FontAwesomeIcon icon={faTrash} className={cx('icon-trash', 'tw-cursor-pointer')} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const showModal = () => {
        setEditData(null);
        setYourSelectedValue(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (record) => {
        let shouldContinue = true;

        showtimeData.forEach((time) => {
            if (time.price.id === record.price.id) {
                setShowInfo('errorEdit');
                shouldContinue = false;
                return;
            }
        });

        if (!shouldContinue) {
            return;
        }

        try {
            const res = await axiosClient.delete(`price/${record.price.id}`);
            console.log(res);
            setShowInfo('success');
        } catch (error) {
            // setShowInfo('errorEdit')
            console.log(error);
        }

        setWorkSomeThing(!workSomeThing);
    };

    const handleEditData = (record) => {
        setYourSelectedValue(record);
        setEditData(record);
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        setLoading(true);
    };
    const handleCancel = () => {
        getList();
        setIsModalOpen(false);
    };
    const [showInfo, setShowInfo] = useState('');
    useEffect(() => {
        if (showInfo === 'success') {
            funcUtils.notify('Xóa thành công dữ liệu trong bảng', 'success');
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
            funcUtils.notify('Do tiền này nằm trong suất chiếu nên không thể sửa đổi !', 'error');
            setShowInfo('es');
        }
    }, [showInfo]);

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
                <Modal
                    title="Thêm sơ đồ rạp"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    width={700}
                    destroyOnClose={true}
                    footer={null}
                >
                    <div>
                        <ModalPrice isEdit={editData} record={yourSelectedValue} />
                    </div>
                </Modal>
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

export default AdminPrice;
