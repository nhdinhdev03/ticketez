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
    Radio,
    Modal,
    AutoComplete,
} from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faLockOpen, faLock } from '@fortawesome/free-solid-svg-icons';

import BaseModal from '~/components/Admin/BaseModal/BaseModal';
import BaseTable from '~/components/Admin/BaseTable/BaseTable';
import funcUtils from '~/utils/funcUtils';

import { accountApi } from '~/api/admin';
import uploadApi from '~/api/service/uploadApi';

import classNames from 'classnames/bind';
import style from './Account.module.scss';
import PaginationCustom from '~/components/Admin/PaginationCustom';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useDebounce } from '~/hooks';
import { regex } from '~/utils/regex';
import { ExportOutlined, SearchOutlined,AndroidOutlined, AppleOutlined } from '@ant-design/icons';

import { Tabs } from 'antd';
dayjs.extend(customParseFormat);

const cx = classNames.bind(style);
const { TextArea } = Input;

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const AdminAccount = () => {
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

    const [status, setStatus] = useState(1);
    const [search, setSearch] = useState('');

    const valueSearchDelay = useDebounce(search, 500);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const options = [
        {
            value: 'Bình luận tiêu cực.',
        },
        {
            value: 'Người dùng đã lạm dụng tính năng bình luận bằng cách chia sẻ thông tin giả mạo, thực hiện spam, hoặc tấn công người dùng khác',
        },
        {
            value: 'Người dùng sử dụng bình luận để quảng cáo sản phẩm hoặc dịch vụ, hoặc thực hiện spam.',
        },
        {
            value: 'Người dùng đã đăng bình luận chứa thông tin xuyên tạc hoặc giả mạo.',
        },
        {
            value: 'Người dùng đã sử dụng ngôn ngữ thiếu tôn trọng, đả kích hoặc vi phạm quy định cộng đồng.',
        },
        {
            value: 'Bình luận của người dùng làm tăng cường không khí tranh cãi đến mức không lành mạnh hoặc gây mất trật tự.',
        },
        {
            value: 'Người dùng đã viết những bình luận gây hấn, đe dọa, hoặc gây lo lắng đối với người dùng khác.',
        },
    ];
    const onChangeReason = (ten) => {
        setReason(ten);
    };
    const onSelect = (value) => {
        setReason(value);
    };

    const showModalReason = () => {
        setIsModalOpen(true);
        setReason('');
    };

    const handleCancelReason = () => {
        setIsModalOpen(false);
        setReason('');
    };

    //
    const [isModalOpenLock, setIsModalOpenLock] = useState(false);
    const showModalLock = () => {
        setIsModalOpenLock(true);
    };

    const handleCancelLock = () => {
        setIsModalOpenLock(false);
    };

    //

    //call api
    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            try {
                const res = await accountApi.getByPage(currentPage, pageSize, valueSearchDelay, status);
                setTotalItems(res.totalItems);
                setPosts(res.data);
                setLoading(false);
                // console.log(res.data);
            } catch (error) {
                console.log(error);
                // funcUtils.notify(error.response, 'error');
            }
        };
        getList();
    }, [currentPage, pageSize, workSomeThing, status, valueSearchDelay]);

    const [reason, setReason] = useState('asfjknasjnkfjknasfjknbaskbj');
    // console.log(reason);

    const [accountLockHistory, setAccountLockHistory] = useState('');

    const findByAccountLockHistoryByAccountId = async (accountId) => {
        // console.log(accountId);
        const res = await accountApi.AccountLockHistoryFindByAccount(accountId);
        // console.log(res.data);
        setAccountLockHistory(res.data);
    };

    const [duLieuNe, setDuLieuNe] = useState('');
    const columns = [
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
            title: 'Họ và tên',
            dataIndex: 'fullname',
            // width: '30%',
            // ...getColumnSearchProps('fullname'),
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'birthday',
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            render: (_, record) => (record.gender ? 'Nam' : 'Nữ'),
        },
        {
            title: 'email',
            dataIndex: 'email',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
        },
        {
            title: 'Hoạt động',
            dataIndex: 'status',
            render: (_, record) => {
                const statusText = record.status === 1 ? 'Hoạt động' : 'Khoá ';
                const tagColor = record.status === 1 ? 'green' : 'red';

                return <Tag color={tagColor}>{statusText}</Tag>;
            },
            align: 'center',
        },
        {
            title: 'Thao tác',
            render: (_, record) => (
                <Space size="middle">
                    {record.status === 1 && (
                        <>
                            <FontAwesomeIcon
                                icon={faPen}
                                className={cx('icon-pen')}
                                onClick={() => {
                                    handleEditData(record);
                                }}
                            />
                            {/* space */}
                            <FontAwesomeIcon
                                icon={faLockOpen}
                                className={cx('icon-trash')}
                                onClick={() => {
                                    showModalReason();
                                    // alert(record.id);
                                    setDuLieuNe(record);
                                    setReason('');
                                }}
                            />
                        </>
                    )}
                    <Modal
                        title="Lí do khoá tài khoản"
                        open={isModalOpen}
                        onOk={() => {
                            if (reason.trim() !== '') {
                                handleStatus(duLieuNe);
                                handleCancelReason();
                            } else {
                                funcUtils.notify('Nhập hoặc chọn lí do khoá tài khoản', 'error');
                            }
                        }}
                        okText="Đồng ý"
                        cancelText="Huỷ"
                        onCancel={handleCancelReason}
                    >
                        <AutoComplete
                            value={reason}
                            defaultValue={reason}
                            options={options}
                            style={{
                                width: '100%',
                            }}
                            onSelect={onSelect}
                            filterOption={(inputValue, option) =>
                                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                        >
                            <TextArea
                                value={reason}
                                defaultValue={reason}
                                placeholder="Nhập lí do..."
                                className="custom"
                                style={{
                                    height: 100,
                                }}
                                onChange={(e) => onChangeReason(e.target.value)}
                            />
                        </AutoComplete>
                    </Modal>
                    {/*  */}

                    {/*  */}

                    {record.status !== 1 && (
                        <Popconfirm
                            title={record.status !== 1 && 'Mở khoá tài khoản'}
                            description={record.status !== 1 && 'Chắn chắn mở?'}
                            okText="Đồng ý"
                            cancelText="Huỷ"
                            onConfirm={() => handleStatus(record)}
                        >
                            <FontAwesomeIcon icon={faLock} className={cx('icon-trash')} />
                        </Popconfirm>
                    )}
                    {/*  */}
                    {record.status !== 1 && (
                        <>
                            <ExportOutlined
                                onClick={() => {
                                    showModalLock();
                                    findByAccountLockHistoryByAccountId(record.id);
                                }}
                            />

                            <Modal
                                title="Lý do bị khoá"
                                open={isModalOpenLock}
                                onCancel={handleCancelLock}
                                footer={
                                    <Button key="back" onClick={handleCancelLock}>
                                        Thoát
                                    </Button>
                                }
                            >
                                <p>{accountLockHistory.reason}</p>
                            </Modal>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    const onChangeUpload = async ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const handleStatus = async (record) => {
        // setReason('');
        // setDuLieuNe('');
        try {
            // alert(record.id);
            if (record.id) {
                const status = record.status === 1 ? 2 : 1;
                const res = await accountApi.patchStatus(record.id, status, reason);
                if (res.status === 200 && status === 2) {
                    funcUtils.notify('Khoá tài khoản thành công', 'success');
                } else {
                    funcUtils.notify('Mở tài khoản thành công', 'success');
                }
            }
        } catch (error) {
            console.log(error);
            funcUtils.notify(error.response.data, 'error');
        }

        setWorkSomeThing(!workSomeThing);
    };

    const handleEditData = (record) => {
        // console.log(record);
        const newUploadFile = {
            uid: record.phone.toString(),
            name: record.image,
            url: `http://localhost:8081/api/upload/${record.image}`,
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
            // console.log('values:::::', values);
            if (fileList.length > 0) {
                if (editData) {
                    let upl = {
                        ...values,
                    };
                    // console.log(upl);
                    if (upl.image.fileList) {
                        const file = upl.image.fileList[0].originFileObj;
                        // console.log(file);
                        const image = await uploadApi.put(editData.image, file);
                        upl = {
                            ...upl,
                            image: image,
                        };
                    }
                    await accountApi.patchInfoUser(values.id, upl);
                    funcUtils.notify('Cập nhật tài khoản thành công', 'success');
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

    const handleResetForm = () => {
        form.resetFields();
        setFileList([]);
        // console.log(form);
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

    return (
        <>
            <Row>
                <Col span={22}>
                    <h1 className="tw-mt-[-7px]">Bảng dữ liệu</h1>
                </Col>

                <Col span={24} className=" tw-flex tw-items-center tw-justify-between tw-mb-5">
                    <Tabs
                        defaultActiveKey="1"
                        onChange={handleChange}
                        items={[AppleOutlined, AndroidOutlined].map((Icon, i) => {
                            const id = String(i + 1);
                            
                            return {
                                key: id,
                                label: id === '1' ? 'Hoạt động' : 'Bị khoá',
                                // children: `Tab ${id}`,
                                icon: <Icon />,
                            };
                        })}
                        />
                    {/* <Select
                        defaultValue={1}
                        style={{
                            width: 170,
                        }}
                        onChange={handleChange}
                        options={[
                            {
                                label: 'Danh sách tài khoản',
                                options: [
                                    { label: 'Hoạt động', value: 1 },
                                    { label: 'Bị khoá', value: 2 },
                                ],
                            },
                        ]}
                    /> */}
                    <Input
                        className="tw-w-[200px]"
                        placeholder="Tìm tên người dùng..."
                        onChange={(e) => setSearch(e.target.value)}
                        prefix={<SearchOutlined />}
                    />
                </Col>

                <BaseModal
                    maskClosable={false}
                    open={open}
                    width={'60%'}
                    title="Cập nhật"
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
                        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
                            Cập nhật
                        </Button>,
                    ]}
                >
                    <Form form={form} name="dynamic_rule" onFinish={handleOk} style={{ maxWidth: 1000 }}>
                        <Form.Item name="id" style={{ display: 'none' }}></Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="fullname"
                            label="Họ và tên"
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                        >
                            <Input placeholder="Họ và tên" />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            name="birthday"
                            label="Ngày sinh"
                            rules={[{ required: true, message: 'Vui lòng nhập ngày sinh' }]}
                        >
                            <DatePicker placeholder="Ngày sinh..." format={'DD-MM-YYYY'} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            name="gender"
                            label="Giới tính"
                            rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                        >
                            {/* <Switch checkedChildren="Nam" unCheckedChildren="Nữ" defaultChecked /> */}
                            <Radio.Group options={optionsWithDisabled} optionType="button" buttonStyle="solid" />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            name="email"
                            label="Emai"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email' },
                                {
                                    pattern: regex.Email,
                                    message: 'Email không hợp lệ. ',
                                },
                            ]}
                        >
                            <Input placeholder="email..." />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại' },
                                {
                                    pattern: regex.Phone,
                                    message: 'Số điện thoại không hợp lệ.',
                                },
                            ]}
                        >
                            <Input placeholder="Số điện thoại..." />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            name="address"
                            label="Địa chỉ"
                            rules={[
                                { required: true, message: 'Vui lòng nhập địa chỉ' },
                                {
                                    pattern: regex.Address,
                                    message: 'Số điện thoại không hợp lệ.',
                                },
                            ]}
                        >
                            <Input placeholder="Địa chỉ..." />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            label="Ảnh đại diện"
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
                                {fileList.length < 2 && '+ Upload'}
                            </Upload>
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

export default AdminAccount;
