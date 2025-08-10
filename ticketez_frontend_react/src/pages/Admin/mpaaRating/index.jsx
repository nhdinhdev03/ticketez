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
    Upload,
    Image,
    Pagination,
    Tag,
    ColorPicker,
} from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import BaseTable from '~/components/common/BaseTable/BaseTable';
import BaseModal from '~/components/common/BaseModal/BaseModal';
import Highlighter from 'react-highlight-words';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import style from './mpaaRating.module.scss';
import TextArea from 'antd/es/input/TextArea';
import mpaaRatingApi from '~/api/admin/managementMovie/mpaaRating';
import uploadApi from '~/api/service/uploadApi';
import funcUtils from '~/utils/funcUtils';

const cx = classNames.bind(style);

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const AdminMpaaRating = () => {
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

    //phân trang
    const [totalItems, setTotalItems] = useState(0); // Tổng số mục
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tạif
    const [pageSize, setPageSize] = useState(10); // Số mục trên mỗi trang
    const [workSomeThing, setWorkSomeThing] = useState(false);

    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            try {
                const res = await mpaaRatingApi.getByPage(currentPage, pageSize);
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
            title: '#',
            dataIndex: 'id',
            width: '6%',
            defaultSortOrder: 'sorting',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Biểu tượng phân loại',
            dataIndex: 'icon',
            render: (_, record) => (
                <Space size="middle">
                    <Image
                        width={105}
                        height={80}
                        style={{ objectFit: 'contain' }}
                        alt="ảnh rỗng"
                        src={`http://localhost:8081/api/upload/${record.icon}`}
                    />
                </Space>
            ),
        },
        {
            title: 'Tên phân loại',
            dataIndex: 'ratingCode',
            width: '15%',
            ...getColumnSearchProps('ratingCode'),
        },
        {
            title: 'Mã màu',
            dataIndex: 'colorCode',
            render: (_, record) => (
                <Space size="middle">
                    <Tag color={record.colorCode}>{record.colorCode}</Tag>
                </Space>
            ),
        },

        {
            title: 'Mô tả',
            dataIndex: 'description',
            ...getColumnSearchProps('description'),
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
            const res = await mpaaRatingApi.delete(record.id);
            if (res.status === 200) {
                if (fileList.length > 0) {
                    await uploadApi.delete(record.icon);
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
        const newUploadFile = {
            uid: record.id.toString(),
            name: record.avatar,
            url: `http://localhost:8081/api/upload/${record.icon}`,
        };
        setFileList([newUploadFile]);
        setOpen(true);
        setResetForm(false);
        setEditData(record);
        form.setFieldsValue({
            ...record,
        });
    };

    const handleOk = async () => {
        setLoading(true);
        try {
            let values = await form.validateFields();

            if (fileList.length > 0) {
                if (editData) {
                    // Kiểm tra nếu colorCode là một đối tượng và có thuộc tính toHexString

                    let putData = {
                        id: editData.id,
                        ...values,
                    };
                    if (putData.icon.file) {
                        const file = putData.icon.fileList[0].originFileObj;
                        const images = await uploadApi.put(editData.icon, file);
                        putData = {
                            ...putData,
                            icon: images,
                        };
                    }
                    if (
                        values.colorCode &&
                        typeof values.colorCode === 'object' &&
                        typeof values.colorCode.toHexString === 'function'
                    ) {
                        var newColorCode = values.colorCode.toHexString();
                        putData = {
                            ...putData,
                            colorCode: newColorCode,
                        };
                    } else {
                        // Nếu không phải đối tượng có toHexString, giữ nguyên giá trị colorCode
                        var newColorCode1 = values.colorCode;
                        putData = {
                            ...putData,
                            colorCode: newColorCode1,
                        };
                    }
                    try {
                        const resPut = await mpaaRatingApi.update(putData.id, putData);
                        if (resPut.status === 200) {
                            funcUtils.notify('Cập nhật phân loại thành công', 'success');
                        }
                    } catch (error) {
                        if (error.status === 500) {
                            funcUtils.notify('Lỗi máy chủ nội bộ, vui lòng thử lại sau!', 'error');
                        }
                        console.log(error);
                    }
                } else {
                    try {
                        const file = values.icon.fileList[0].originFileObj;
                        const images = await uploadApi.post(file);
                        const postData = {
                            ...values,
                            colorCode: values.colorCode.toHexString(),
                            icon: images,
                        };
                        const resPost = await mpaaRatingApi.create(postData);
                        if (resPost.status === 200) {
                            funcUtils.notify('Thêm phân loại thành công', 'success');
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
            message.error('Có lỗi xảy ra vui lòng thử lại');
            setLoading(false);
        }
    };
    const handleCancel = () => {
        setOpen(false);
    };

    //phân trang
    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    useEffect(() => {
        form.validateFields(['nickname']);
    }, [checkNick, form]);

    //form
    const handleResetForm = () => {
        form.resetFields();
        setFileList([]);
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

    return (
        <div>
            <Row>
                <Col span={22}>
                    <h1>Bảng dữ liệu</h1>
                </Col>
                <Col span={2}>
                    <Button
                        type="primary"
                        className={cx('button-title , tw-mt-[20px]')}
                        icon={<PlusOutlined />}
                        onClick={showModal}
                    >
                        Thêm
                    </Button>
                </Col>
                <BaseModal
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
                            name="colorCode"
                            label="Chọn mã màu"
                            rules={[{ required: true, message: 'Vui lòng chọn mã màu' }]}
                        >
                            <ColorPicker
                                showText
                                trigger="hover"
                                presets={[
                                    {
                                        label: 'Recommended',
                                        colors: [
                                            '#000000',
                                            '#000000E0',
                                            '#000000A6',
                                            '#00000073',
                                            '#00000040',
                                            '#00000026',
                                            '#0000001A',
                                            '#00000012',
                                            '#0000000A',
                                            '#00000005',
                                            '#F5222D',
                                            '#FA8C16',
                                            '#FADB14',
                                            '#8BBB11',
                                            '#52C41A',
                                            '#13A8A8',
                                            '#1677FF',
                                            '#2F54EB',
                                            '#722ED1',
                                            '#EB2F96',
                                            '#F5222D4D',
                                            '#FA8C164D',
                                            '#FADB144D',
                                            '#8BBB114D',
                                            '#52C41A4D',
                                            '#13A8A84D',
                                            '#1677FF4D',
                                            '#2F54EB4D',
                                            '#722ED14D',
                                            '#EB2F964D',
                                        ],
                                    },
                                    {
                                        label: 'Recent',
                                        colors: [],
                                    },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="Ảnh"
                            name="icon"
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
                            name="ratingCode"
                            label="Tên phân loại"
                            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                        >
                            <Input placeholder="Vui lòng nhập tên phân loại" />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            name="description"
                            label="Mô tả"
                            rules={[{ required: true, message: 'Vui lòng nhập ngày' }]}
                        >
                            <TextArea placeholder="Vui lòng nhập mô tả phân loại" />
                        </Form.Item>
                    </Form>
                </BaseModal>
            </Row>

            <BaseTable
                pagination={false}
                columns={columns}
                onClick={() => {
                    handleDelete();
                }}
                dataSource={posts.map((post) => ({
                    ...post,
                    key: post.id,
                }))}
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

export default AdminMpaaRating;
