import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, DatePicker, Form, Popconfirm, Row, Select, Space, message } from 'antd';
import Image from 'antd/lib/image';
import React, { useRef, useState, useEffect } from 'react';
import priceServiceApi from '~/api/admin/ManageCombosAndEvents/priceServiceApi';
import style from './PriceService.module.scss';
import classNames from 'classnames/bind';
import BaseTable from '~/components/Admin/BaseTable/BaseTable';
import BaseModal from '~/components/Admin/BaseModal/BaseModal';
import { PlusOutlined } from '@ant-design/icons';
import funcUtils from '~/utils/funcUtils';
import Input from 'antd/es/input/Input';
import moment from 'moment';
import { cinemaComplexApi, serviceApi } from '~/api/admin';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const cx = classNames.bind(style);

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

function AdminPriceService() {
    const { RangePicker } = DatePicker;
    const searchInput = useRef(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [selectService, setService] = useState();
    const [selectCinemaComplex, setSelectCinemaComplex] = useState();
    // const [checkNick, setCheckNick] = useState(false);
    const [resetForm, setResetForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [posts, setPosts] = useState([]);
    const [workSomeThing, setWorkSomeThing] = useState(false);
    const [totalItems, setTotalItems] = useState(0); // Tổng số mục
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [pageSize, setPageSize] = useState(10); // Số mục trên mỗi trang

    const [dataStartTime, setDataStartTime] = useState();
    const [dataEndTime, setDataEndTime] = useState();

    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            try {
                const res = await priceServiceApi.getAll(currentPage, pageSize);
                console.log(res);
                setTotalItems(res.totalItems);
                setPosts(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        getList();
    }, [currentPage, pageSize, workSomeThing]);

    useEffect(() => {
        const selectPrice = async () => {
            const [service, cinemaComplex] = await Promise.all([serviceApi.getAll(), cinemaComplexApi.getPage()]);
            console.log('service', service);
            console.log('cinemaComplex', cinemaComplex);
            setService(service.data);
            setSelectCinemaComplex(cinemaComplex.data);
        };

        selectPrice();
    }, []);

    const columns = [
        {
            title: 'Mã',
            dataIndex: 'id',
            width: '10%',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Tên dịch vụ',
            dataIndex: 'service',
            render: (service) => (service ? service.name : ''),
        },
        {
            title: 'Giá dịch vụ',
            dataIndex: 'price',
            width: '10%',
            // ...getColumnSearchProps('name'),
        },
        {
            title: 'Rạp phim',
            dataIndex: 'service',
            render: (service) => (service ? service.cinemaComplex.name : ''),
        },
        {
            title: 'Thời Gian bắt đầu',
            dataIndex: 'startDate',
            render: (startDate) => {
                return startDate ? moment(startDate).format('DD-MM-YYYY ') : '';
            },
            // ...getColumnSearchProps('description'),
        },
        {
            title: 'Thời Gian kết thúc',
            dataIndex: 'endDate',

            render: (endTime) => {
                return endTime ? moment(endTime).format('DD-MM-YYYY ') : '';
            },
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

    const showModal = () => {
        form.resetFields();
        setEditData(null);
        setOpen(true);
        setResetForm(true);
        setFileList([]);
    };

    const handleDelete = async (record) => {
        try {
            const res = await priceServiceApi.delete(record.id);
            console.log(res);
            if (res.status === 200) {
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

    const handleEditData = (record) => {
        const formattedStartTime = dayjs(record.startDate, 'YYYY-MM-DD ');
        const formattedEndTime = dayjs(record.endDate, 'YYYY-MM-DD ');

        form.setFieldsValue({
            ...record,
            status: record.status === 1,
            service: record.service?.id,
            cinemaComplex: record.service.cinemaComplex?.id,
            'range-time-picker': [formattedStartTime, formattedEndTime],
        });
        console.log(record.startDate);

        setDataStartTime(formattedStartTime);
        setDataEndTime(formattedEndTime);
        setOpen(true);
        setResetForm(false);
        setEditData(record);
    };

    const handleOk = async () => {
        setLoading(true);
        try {
            let values = await form.validateFields();
            console.log(values.service);
            let putData = {
                ...values,
                startDate: new Date(dataStartTime),
                endDate: new Date(dataEndTime),
            };
            console.log(values);
            if (editData) {
                const resp = await priceServiceApi.put(editData.id, putData, putData.service);
                console.log(resp);
                funcUtils.notify('Cập nhật thành công', 'success');
            }
            if (!editData) {
                try {
                    console.log(values);
                    const resp = await priceServiceApi.post(putData, putData.service, putData.cinemaComplex);
                    if (resp.status === 200) {
                        funcUtils.notify('Thêm giá dịch vụ thành công', 'success');
                    }
                } catch (error) {
                    console.log(error);
                    funcUtils.notify(error.response.data, 'error');
                }
            }
            setOpen(false);
            form.resetFields();
            setLoading(false);
            setWorkSomeThing([!workSomeThing]);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
            setLoading(false);
        }
    };
    const handleCancel = () => {
        setOpen(false);
    };

    const rangeConfig = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
        rules: [
            {
                type: 'array',
                required: true,
                message: 'Please select time!',
            },
        ],
    };

    const onChangeDate = (dates) => {
        if (dates && dates.length === 2) {
            setDataStartTime(dates[0]);
            setDataEndTime(dates[1]);
        }
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
                            name="service"
                            label="Chọn Tên dịch vụ"
                            rules={[{ required: true, message: 'Vui lòng chọn' }]}
                        >
                            <Select
                                style={{ width: '100%' }}
                                showSearch
                                placeholder="Chọn Rap"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={selectService?.map((service) => ({
                                    value: service.id,
                                    label: service.name,
                                }))}
                            />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            name="price"
                            label="Giá dịch vụ"
                            rules={[{ required: true, message: 'Vui lòng nhập giá dịch vụ' }]}
                        >
                            <Input placeholder="Giá dịch vụ" />
                        </Form.Item>

                        {/* <Form.Item
                        {...formItemLayout}
                        name="cinemaComplex"
                        label="Chọn Rạp"
                        rules={[{ required: true, message: 'Vui lòng chọn' }]}
                    >


                        <Select
                            style={{ width: '100%' }}
                            showSearch
                            placeholder="Chọn Rap"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={selectCinemaComplex?.map((cinemaComplex) => ({
                                value: cinemaComplex.id,
                                label: cinemaComplex.name,

                            }))}

                        />
                    </Form.Item> */}
                        <Form.Item name="range-time-picker" label="Ngày giờ" {...rangeConfig}>
                            <RangePicker
                                showTime
                                format="DD-MM-YYYY "
                                value={[dataStartTime, dataEndTime]}
                                onChange={onChangeDate}
                            />
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
                    //  nameCinemaComplex: post.cinemaComplex.name,
                }))}
            />
        </>

        // <BaseTable
        //     pagination={false}
        //     columns={columns}
        //     dataSource={posts.map((post) => ({
        //         ...post,
        //         key: post.id,
        //         //  nameCinemaComplex: post.cinemaComplex.name,
        //     }))}
        // />
        // </>
    );
}

export default AdminPriceService;
