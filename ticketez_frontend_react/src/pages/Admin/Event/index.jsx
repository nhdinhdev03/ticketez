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
    Tag,
    Switch,
    Upload,
    Descriptions,
    Pagination,
    Radio,
} from 'antd';
import Image from 'antd/lib/image';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import BaseModal from '~/components/Admin/BaseModal/BaseModal';
import BaseTable from '~/components/Admin/BaseTable/BaseTable';
import Highlighter from 'react-highlight-words';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import style from './Event.module.scss';
import moment from 'moment';
import CustomCKEditor from '~/pages/Templates/Ckeditor';
import { eventApi } from '~/api/admin';
import uploadApi from '~/api/service/uploadApi';
import funcUtils from '~/utils/funcUtils';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const cx = classNames.bind(style);

const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
};

const AdminShowtime = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [checkNick] = useState(false);
    const [resetForm, setResetForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [posts, setPosts] = useState([]);
    const [totalItems, setTotalItems] = useState(0); // Tổng số mục
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tạif
    const [pageSize, setPageSize] = useState(10); // Số mục trên mỗi trang
    const [workSomeThing, setWorkSomeThing] = useState(false);

    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            try {
                const res = await eventApi.getPage(currentPage, pageSize);
                setPosts(res.data);
                setTotalItems(res.totalItems);
                setLoading(false);
            } catch (error) {
                console.log(error);
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
                    placeholder={`Nhập để tìm`}
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
                        làm mới
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        thoát
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
            width: '10%',
            defaultSortOrder: 'sorting',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            ...getColumnSearchProps('name'),
        },

        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            render: (startTime) => {
                return startTime ? moment(startTime).format('DD-MM-YYYY HH:mm:ss') : '';
            },
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            render: (endTime) => {
                return endTime ? moment(endTime).format('DD-MM-YYYY HH:mm:ss') : '';
            },
        },
        {
            title: 'Ảnh',
            dataIndex: 'banner',
            width: '10%',
            render: (_, record) => (
                <Space size="middle">
                    <Image src={uploadApi.get(record.banner)} alt="không có ảnh" width={65} loading="lazy" />
                </Space>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            align: 'center',
            render: (_, record) => {
                const statusText = record.status === true ? 'Hoạt động' : 'Kết thúc';
                const tagColor = record.status === true ? 'green' : 'red';

                return <Tag color={tagColor}>{statusText}</Tag>;
            },
            onFilter: (value, record) => record.status === (value === 'true'),
            filters: [
                { text: 'Hoạt động', value: 'true' },
                { text: 'Kết thúc', value: 'false' },
            ],
            filterMultiple: false,
        },
        {
            title: 'Thể loại',
            dataIndex: 'typeEvent',
            align: 'center',
            render: (_, record) => {
                const statusText = record.typeEvent === 0 ? 'Tin tức' : 'Khuyến mãi';
                const tagColor = record.typeEvent === 0 ? '#F4CE14' : '#96C291';

                return <Tag color={tagColor}>{statusText}</Tag>;
            },
            onFilter: (value, record) => record.typeEvent === (value === 0),
            filters: [
                { text: 'Tin tức', value: 0 },
                { text: 'Khuyến mãi', value: 1 },
            ],
            filterMultiple: false,
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
                        okText="Yes"
                        cancelText="No"
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
        form.setFieldsValue({
            status: true,
            'range-time-picker': [],
            typeEvent: 0
        });
    };

    const handleDelete = async (record) => {
        try {
            const res = await eventApi.delete(record.id);
            if (res.status === 200) {
                if (fileList.length > 0) {
                    await uploadApi.deleteUpload(record.banner);
                }
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
        const formattedStartTime = dayjs(record.startDate, 'YYYY-MM-DD HH:mm:ss');
        const formattedEndTime = dayjs(record.endDate, 'YYYY-MM-DD HH:mm:ss');

        const newUploadFile = {
            uid: record.id.toString(),
            url: `http://localhost:8081/api/upload/${record.banner}`,
        };
        setFileList([newUploadFile]);
        form.setFieldsValue({
            ...record,
            status: record.status === true,
            cinemaComplex: record.cinemaComplex?.id,
            'range-time-picker': [formattedStartTime, formattedEndTime],
        });

        setDataStartTime(formattedStartTime);
        setDataEndTime(formattedEndTime);
        setStatusValue(record.status);
        setOpen(true);
        setResetForm(false);
        setEditData(record);
    };

    const [dataStartTime, setDataStartTime] = useState();
    const [dataEndTime, setDataEndTime] = useState();
    const [statusValue, setStatusValue] = useState(true);
    const onChangeDate = (dates) => {
        if (dates && dates.length === 2) {
            setDataStartTime(dates[0]);
            setDataEndTime(dates[1]);
        }
    };

    const handleOk = async () => {
        setLoading(true);
        try {
            let values = await form.validateFields();
             let account = {
                 id: 'admin',
                 phone: '0987654321',
                 fullname: 'Nguyễn Văn A',
                 address: '123 Đường ABC, Quận 1, TP.HCM',
                 email: 'nguyen.va@gmail.com',
                 password: 'admin',
                 birthday: '1990-01-14T17:00:00.000+00:00',
                 gender: true,
                 image: 'image1.jpg',
                 status: 1,
                 createdDate: '2023-01-01T01:00:00.000+00:00',
                 verified: true,
                 points: 0,
             };
                    
            if (fileList.length > 0) {
                if (editData) {
                    
                    let putData = {
                        id: editData.id,
                        ...values,
                        account: account,
                        startDate: new Date(dataStartTime),
                        endDate: new Date(dataEndTime),
                    };

                    if (putData.banner.file) {
                        const file = putData.banner.fileList[0].originFileObj;
                        const images = await uploadApi.put(editData.banner, file);
                        putData = {
                            ...putData,
                            banner: images,
                        };
                    }
                    try {
                        const resPut = await eventApi.put(putData.id, putData);
                        if (resPut.status === 200) {
                            funcUtils.notify('Cập nhật sự kiện thành công', 'success');
                        }
                    } catch (error) {
                        if (error.status === 500) {
                            funcUtils.notify('Lỗi máy chủ nội bộ, vui lòng thử lại sau!', 'error');
                        }
                        console.log(error);
                    }
                    setWorkSomeThing(!workSomeThing);
                } else {
                    try {
                        const file = values.banner.fileList[0].originFileObj;
                        const images = await uploadApi.post(file);
                       
                        const postData = {
                            ...values,
                            account : account,
                            startDate: new Date(dataStartTime),
                            endDate: new Date(dataEndTime),
                            banner: images,
                        };
                        const resPost = await eventApi.post(postData);

                        if (resPost.status === 200) {
                            funcUtils.notify('Thêm sự kiện thành công', 'success');
                        }
                    } catch (error) {
                        if (error.status === 500) {
                            funcUtils.notify('Lỗi máy chủ nội bộ, vui lòng thử lại sau!', 'error');
                        }
                        // upload
                        if (error.response.data.error) {
                            funcUtils.notify(error.response.data.error, 'error');
                        }
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
    };

    useEffect(() => {
        form.validateFields(['nickname']);
    }, [checkNick, form]);


    const handleResetForm = () => {
        form.resetFields();
        setFileList([]);
    };
    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };


    const rangeConfig = {
        rules: [
            {
                type: 'array',
                required: true,
                message: 'Vui lòng chọn ngày giờ',
            },
        ],
    };

    const propsUpload = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };

    const onChangeUpload = async ({ fileList: newFileList }) => {
        setFileList(newFileList);
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

    const [editorData, setEditorData] = useState('');

    const handleEditorChange = (data) => {
        setEditorData(data);
    };

   const optionsWithDisabled = [
       {
           value: 0,
           label: 'Tin tức',
       },
       {
           value: 1,
           label: 'Khuyến mãi',
       },
   ];

   const disabledDate = (current) => {
       // Can not select days before today and today
       return current && current < dayjs().startOf('day');
   };

    return (
        <div>
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
                    style={{ marginTop: '-50px' }}
                    open={open}
                    width={'85%'}
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
                    <Form form={form} style={{ minWidth: 1000 }} {...formItemLayout}>
                        <Form.Item
                            {...formItemLayout}
                            label="Chọn ảnh"
                            name="banner"
                            rules={[{ required: true, message: 'Vui lòng chọn ảnh' }]}
                        >
                            <Upload
                                {...propsUpload}
                                listType="picture-card"
                                onChange={onChangeUpload}
                                onPreview={onPreview}
                                fileList={fileList}
                                name="icon"
                                maxCount={1}
                            >
                                {fileList.length < 2 && '+ Tải lên'}
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="name"
                            label="Nhập tên sự kiện"
                            rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện' }]}
                        >
                            <Input placeholder="Nhập tên sự kiện..." />
                        </Form.Item>
                        <Form.Item name="range-time-picker" label="Chọn ngày giờ" {...rangeConfig}>
                            <RangePicker
                                disabledDate={disabledDate}
                                showTime
                                format="DD-MM-YYYY HH:mm:ss"
                                value={[dataStartTime, dataEndTime]}
                                onChange={onChangeDate}
                            />
                        </Form.Item>
                        <Form.Item label="Trạng thái" name="status">
                            <Switch
                                checked={statusValue === true}
                                onChange={(checked) => setStatusValue(checked ? true : false)}
                                checkedChildren={'Đang hoạt động'}
                                unCheckedChildren={'Kết Thúc '}
                                defaultChecked
                            />
                        </Form.Item>
                        <Form.Item {...formItemLayout} name="typeEvent" label="Thể loại">
                            <Radio.Group options={optionsWithDisabled} optionType="button" buttonStyle="solid" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="description"
                            label="Nhập nội dung"
                            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                        >
                            <CustomCKEditor value={editorData} onChange={handleEditorChange} />
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
                }))}
                expandable={{
                    expandedRowRender: (record) => {
                        return (
                            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                                <Descriptions title="Xem thêm"></Descriptions>
                                <b style={{ marginBottom: '8px' }}>Mô tả: </b>
                                {record.description !== null && (
                                    <span dangerouslySetInnerHTML={{ __html: record.description }} />
                                )}
                            </div>
                        );
                    },
                }}
            />
            <div className={cx('wrapp-pagination')}>
                <Pagination
                    style={{ float: 'right', marginTop: '10px' }}
                    showSizeChanger={false}
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalItems}
                    onChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default AdminShowtime;
