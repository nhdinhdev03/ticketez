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
    Tag,
    Select,
    Switch,
} from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faLockOpen, faLock, faTrash } from '@fortawesome/free-solid-svg-icons';

import BaseModal from '~/components/Admin/BaseModal/BaseModal';
import BaseTable from '~/components/Admin/BaseTable/BaseTable';
import funcUtils from '~/utils/funcUtils';

import classNames from 'classnames/bind';
import style from './Discount.module.scss';
import PaginationCustom from '~/components/Admin/PaginationCustom';
import moment from 'moment';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useDebounce } from '~/hooks';
import { PlusOutlined } from '@ant-design/icons';
import { cinemaComplexApi, discountApi } from '~/api/admin';
import cinemaChainApi from '~/api/admin/ManageCombosAndEvents/cinemaChainApi';
dayjs.extend(customParseFormat);

const cx = classNames.bind(style);

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const AdminDiscount = () => {

    const { RangePicker } = DatePicker;
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

    const [selectCinemachain, setCinemaChain] = useState();
    const [selectCinemaComplex, setSelectCinemaComplex] = useState();
    const [status, setStatus] = useState(1);
    const [search, setSearch] = useState('');
    const [dataStartTime, setDataStartTime] = useState();
    const [dataEndTime, setDataEndTime] = useState();
    const valueSearchDelay = useDebounce(search, 500);

    const [statusValue1, setStatusValue1] = useState(true);
    const [statusValue2, setStatusValue2] = useState(true);


    //call api

    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            try {
                const res = await discountApi.getAll(currentPage, pageSize);
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
            const [cinemaComplex] = await Promise.all([ cinemaComplexApi.getPage()]);
            console.log('cinemaComplex', cinemaComplex);
            setSelectCinemaComplex(cinemaComplex.data);
        };

        selectPrice();
    }, []);

    const columns = [
        {
            title: 'Mã',
            dataIndex: 'id',
            // width: '30%',
            // ...getColumnSearchProps('fullname'),
        },
        {
            title: 'title',
            dataIndex: 'title',
        },
        {
            title: 'Code',
            dataIndex: 'couponCode',
        },
        {
            title: 'amount',
            dataIndex: 'amount',
        },
        {
            title: 'Rạp phim phim',
            dataIndex: 'cinemaComplex',
            render: (cinemaComplex) => (cinemaComplex ? cinemaComplex.name : ''),
 
        },
        // {
        //     title: 'Rạp chiếu phim',
        //     dataIndex: 'cinemaComplex',
        //     render: (cinemaComplex) => (cinemaComplex ? cinemaComplex.cinemaChain.name : ''),
        // },
        {
            title: 'Thời Gian bắt đầu',
            dataIndex: 'startDate',
            render: (startDate) => {
                return startDate ? moment(startDate).format('DD-MM-YYYY HH:mm:ss') : '';
            },

        },
        {
            title: 'Thời Gian kết thúc',
            dataIndex: 'endDate',

            render: (endTime) => {
                return endTime ? moment(endTime).format('DD-MM-YYYY HH:mm:ss') : '';
            },
        },
        {
            title: 'status',
            dataIndex: 'status',
            render: (_, record) => {
                const statusText = record.status === true ? 'Hoạt động' : 'Đừng ';
                const tagColor = record.status === true ? 'green' : 'red';

                return <Tag color={tagColor}>{statusText}</Tag>;
            },
            align: 'center',
        },
        {
            title: 'discountType',
            dataIndex: 'discountType',
            render: (_, record) => {
                const statusText = record.discountType === true ? 'Hoạt động' : 'Dừng ';
                const tagColor = record.discountType === true ? 'green' : 'red';

                return <Tag color={tagColor}>{statusText}</Tag>;
            },
            align: 'center',
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

    const handleEditData = (record) => {
        const formattedStartTime = dayjs(record.startDate, 'YYYY-MM-DD HH:mm:ss');
        const formattedEndTime = dayjs(record.endDate, 'YYYY-MM-DD HH:mm:ss');

        form.setFieldsValue({
            ...record,
            status: !!record.status, 
            discountType: !!record.discountType,
            cinemaComplex: record.cinemaComplex?.id,
            'range-time-picker': [formattedStartTime, formattedEndTime],
        });


        setDataStartTime(formattedStartTime);
        setDataEndTime(formattedEndTime);
        setStatusValue1(!!record.status); // Cập nhật statusValue1 với giá trị boolean
        setStatusValue2(!!record.discountType);
        setOpen(true);
        setResetForm(false);
        setEditData(record);
    };
    const handleOk = async () => {
        setLoading(true);
        try {
            let values = await form.validateFields();
            console.log(values.cinemaComplex);
            let putData = {
                ...values,
                startDate: new Date(dataStartTime),
                endDate: new Date(dataEndTime),
            };
            console.log(values);
            if (editData) {
                const resp = await discountApi.put(editData.id, putData , putData.cinemaComplex);
                console.log(resp);
                funcUtils.notify("Cập nhật thành công", 'success');
            }
            if (!editData) {
                try {
                    console.log(values);
                    const resp = await discountApi.post(putData, putData.cinemaComplex);
                    if (resp.status === 200) {
                        funcUtils.notify('Thêm khuyến mãi thành công', 'success');
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


    const handleDelete = async (record) => {
        try {
            const res = await discountApi.delete(record.id);
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

    const handleChange = (value) => {
        console.log(`selected ${value}`);
        setStatus(value);
    };

    const onChangeDate = (dates) => {
        if (dates && dates.length === 2) {
            setDataStartTime(dates[0]);
            setDataEndTime(dates[1]);
        }
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

    const showModal = () => {
        form.resetFields();
        setEditData(null);
        setOpen(true);
        setResetForm(true);
        setFileList([]);
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
                    <Form form={form} name="dynamic_rule" onFinish={handleOk} style={{ maxWidth: 1000 }}>
                        <Form.Item name="id" style={{ display: 'none' }}></Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="title"
                            label="Tên Khuyến mãi"
                            rules={[{ required: true, message: 'Vui lòng nhập tên ưu đãi' }]}
                        >
                            <Input placeholder="title" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="couponCode"
                            label="Mã giảm giá"
                            rules={[{ required: true, message: 'Vui lòng nhập Mã giảm giá' }]}
                        >
                            <Input placeholder="couponCode" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="amount"
                            label="Số lượng"
                            rules={[{ required: true, message: 'Vui lòng nhập Số lượng' }]}
                        >
                            <Input placeholder="amount" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="cinemaComplex"
                            label="Rap chiếu phim "
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
                            name="range-time-picker"
                            label="Ngày giờ" {...rangeConfig} >

                            <RangePicker
                                showTime
                                format="DD-MM-YYYY HH:mm:ss"
                                value={[dataStartTime, dataEndTime]}
                                onChange={onChangeDate}
                            />
                        </Form.Item>
                        <Form.Item label="Trang Thái" name="status">
                            <Switch
                                checked={statusValue1}
                                onChange={(checked) => setStatusValue1(checked)}
                                checkedChildren={'Đang hoạt động'}
                                unCheckedChildren={'Kết Thúc'}
                                defaultChecked
                            />
                        </Form.Item>

                        <Form.Item label="Giảm Giá" name="discountType">
                            <Switch
                                checked={statusValue2}
                                onChange={(checked) => setStatusValue2(checked)}
                                checkedChildren={'Đang hoạt động'}
                                unCheckedChildren={'Kết Thúc'}
                                defaultChecked
                            />
                        </Form.Item>

                    </Form>
                </BaseModal>
            </Row>
            <BaseTable
                loading={loading}
                pagination={false}
                columns={columns}
                dataSource={posts.map((post) => ({
                    ...post,
                    key: post.id,
                //   nameCinemaComplex: post.cinemaComplex.name,
                    birthday: `${('0' + new Date(post.birthday).getDate()).slice(-2)}-${(
                        '0' +
                        (new Date(post.birthday).getMonth() + 1)
                    ).slice(-2)}-${new Date(post.birthday).getFullYear()}`,
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

export default AdminDiscount;
