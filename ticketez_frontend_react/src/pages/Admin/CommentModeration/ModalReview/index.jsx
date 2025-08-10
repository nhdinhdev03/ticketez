import React, { useRef, useState, useEffect } from 'react';
import countriesJson from '~/data/countries.json';
import {
    Button,
    Input,
    Space,
    Col,
    Row,
    Form,
    message,
    Popconfirm,
    Table,
    Card,
    Breadcrumb,
    Switch,
    Select,
    Pagination,
    Tag,
    Image,
    Radio
} from 'antd';
import { SearchOutlined, PlusOutlined, } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import BaseTable from '~/components/Admin/BaseTable/BaseTable';
import BaseModal from '~/components/Admin/BaseModal/BaseModal';
import style from './ModalReview.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { cinemaTypeApi } from '~/api/admin';
import funcUtils from '~/utils/funcUtils';
import authApi from '~/api/user/Security/authApi';
import reviewApi from '~/api/user/review/reviewApi';
import reviewStatus from './statusReview';



const cx = classNames.bind(style);

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const ModalReview = ({ movieId }) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    // const [checkNick, setCheckNick] = useState(false);
    const [resetForm, setResetForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [posts, setPosts] = useState([]);


    const [workSomeThing, setWorkSomeThing] = useState(false);
    const [totalItems, setTotalItems] = useState(0); // Tổng số mục
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [pageSize, setPageSize] = useState(5); // Số mục trên mỗi trang
    

    // const user = authApi.getUser();
    //api
    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            try {
                const res = await reviewApi.getMovieAndReviewId(movieId.id, currentPage, pageSize, reviewStatus.PENDING);
                console.log('review', res);
                setTotalItems(res.data.totalItems);
                setPosts(res.data.data);
                setLoading(false);
            } catch (error) {
                if (error.hasOwnProperty('response')) {
                    funcUtils.notify(error.response.data, 'error');
                } else {
                    console.log(error);
                }
            }
        };
        getList();
    }, [movieId, currentPage, pageSize, workSomeThing]);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

   
    const columns = [
        Table.EXPAND_COLUMN,
        // {
        //     title: 'Tên phim',
        //     render: (_, record) => `${record.price.formatMovie.movie.title } ${record.price.formatMovie.format.name }`,
        // },
        {
            title: 'Tài khoản',
            render: (_, record) => `${record.account.id}`,
        },
        // {
        //     title: 'Tên tài khoản',
        //     render: (_, record) => `${record.account.fullname}`,
        // },
        {
            title: 'Bình luận',
            dataIndex: 'comment',
            key: 'comment',
            // render: (_, record) => `${record.listMovieAndListReviewObjResp.review.comment }`,

        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
        },

        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: '20%',
            render: (_, record) => { 
                return (
                    
                    <Button 
                    onClick={() => hanldeStatus(record.id)}
                    style={{ color: 'green' }}>
                        {'Duyệt'}
                    </Button>
                );
            },
            
        },

        {
            title: 'Action',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="Bạn có chắc"
                        description="Muốn xoá hay không?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleDelete(record)}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    const hanldeStatus = async (id) => {
        try {
            const resStatus = await reviewApi.patch(id);
            funcUtils.notify('Kiểm duyệt thành công', 'success');
            setWorkSomeThing(!workSomeThing);
    
            // Fetch the updated data and update the state
            const updatedData = await reviewApi.getMovieAndReviewId(movieId.id, currentPage, pageSize, reviewStatus.PENDING);
            setTotalItems(updatedData.data.totalItems);
            setPosts(updatedData.data.data);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
            setLoading(false);
        }
    };
    

    const handleDelete = async (record) => {
        try {
            const res = await reviewApi.delete(record.id);
            console.log(res);
            if (res.status === 200) {
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
    const handleOk = async () => {
        setLoading(true);
        try { 
            // Gọi API để cập nhật trạng thái bình luận
            const resp = await reviewApi.put(editData.id);
    
            if (resp.status === 200) {
                funcUtils.notify('Kiểm duyệt thành công', 'success');
                setOpen(false);
                setWorkSomeThing(!workSomeThing);
            }
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
            setLoading(false);
        }
    };
    const handleCancel = () => {
        setOpen(false);
    };

    //form
    const handleResetForm = () => {
        form.resetFields();
        console.log(form);
    };
    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };
    const optionsWithDisabledStatus = [
        {
            value: 0,
            label: 'Duyệt',
        },
        {
            value: 1,
            label: 'Chưa duyệt',
        },
        // {
        //     value: 2,
        //     label: 'Ân bình luận',
        // },
    ];
    return (
        <>
            <Row>
                <Col span={2}>
                </Col>
                <BaseModal
                    maskClosable={false}
                    open={open}
                    width={'60%'}
                    title={editData ? 'Kiểm duyệt' : 'Thêm mới'}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Thoát
                        </Button>,
                        resetForm && ( // Conditionally render the "Làm mới" button only when editing
                            <Button key="reset" onClick={handleResetForm}>
                                Làm mới
                            </Button>
                        ),
                        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                            {editData ? 'Kiểm duyệt' : 'Thêm mới'}
                        </Button>,
                    ]}
                >
                    <Form form={form} name="dynamic_rule" style={{ maxWidth: 1000 }}>
                        <Form.Item
                            {...formItemLayout}
                            name="account"
                            label="Tài khoản"
                            rules={[{ required: true, message: 'Vui lòng nhập tài khoản' }]}
                        >
                            <Input
                                placeholder="Nhập tài khoản"
                                value={posts.length > 0 ? posts[0].account.id : undefined} // Chọn giá trị mặc định nếu có dữ liệu
                                readOnly // Đặt readOnly để ngăn người dùng chỉnh sửa giá trị
                            />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="comment"
                            label="Bình luận"
                            rules={[{ required: true, message: 'Vui lòng nhập rạp' }]}
                        >
                            <Input.TextArea   readOnly placeholder="Please input your name" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="rating"
                            label="Đánh giá"
                            rules={[{ required: true, message: 'Vui lòng nhập rạp' }]}
                        >
                            <Input  readOnly placeholder="Please input your name" />
                        </Form.Item>
                        {/* <Form.Item
                            {...formItemLayout}
                            name="status"
                            label="Trạng thái"
                            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                        >
                            <Switch defaultChecked onChange={onChange} />
                        </Form.Item> */}
                        <Form.Item
                            {...formItemLayout}
                            name="status"
                            label="Trạng thái"
                            rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                        >
                            {/* <Switch checkedChildren="Nam" unCheckedChildren="Nữ" defaultChecked /> */}
                            <Radio.Group options={optionsWithDisabledStatus} optionType="button" buttonStyle="solid" />
                        </Form.Item>

                    </Form>
                </BaseModal>
            </Row>

            <BaseTable
                columns={columns}
                onClick={() => {
                    handleDelete();
                }}
                // dataSource={posts}
                pagination={false}
                dataSource={posts?.map((post) => ({ ...post, key: post.id }))}
            />
            <div className={cx('wrapp-pagination')}>
                <Pagination
                    showSizeChanger={false}
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalItems}
                    onChange={handlePageChange}
                />
            </div>
        </>
    );
};

export default ModalReview;
