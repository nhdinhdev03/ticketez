import React, { useRef, useState, useEffect } from 'react';
import countriesJson from '~/data/countries.json';
import {
    Button,
    Input,
    Space,
    Col,
    Row,
    Form,
    Table,
    Switch,
    Select,
    Pagination,
    Tag,
    Image
} from 'antd';
import { SearchOutlined, PlusOutlined, } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import BaseTable from '~/components/Admin/BaseTable/BaseTable';
import BaseModal from '~/components/Admin/BaseModal/BaseModal';
import style from './CommentModeration.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import funcUtils from '~/utils/funcUtils';
import authApi from '~/api/user/Security/authApi';
import reviewApi from '~/api/user/review/reviewApi';
import uploadApi from '~/api/service/uploadApi';
import moment from 'moment';
import ModalReview from './ModalReview/index';


const cx = classNames.bind(style);

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const AdminComment = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    // const [checkNick, setCheckNick] = useState(false);
    const [resetForm, setResetForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [posts, setPosts] = useState([]);


    const [workSomeThing, setWorkSomeThing] = useState(false);
    const [totalItems, setTotalItems] = useState(0); // Tổng số mục
    const [totalPage, setTotalPage] = useState(0); // Tổng số mục
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [pageSize, setPageSize] = useState(2); // Số mục trên mỗi trang
    const formatDate = 'DD-MM-YYYY';
    
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);
    const [movie, setMovie] = useState([]);



    // const user = authApi.getUser();
    //api
    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            try {
                const res = await reviewApi.getAllMovieAndReview(currentPage, pageSize);

                console.log('text', res);
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
                    placeholder={`Search ${dataIndex}`}
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
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
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
        Table.EXPAND_COLUMN,
        {
            title: 'Tên phim',
            dataIndex: 'title',
            key: 'title',
            sorter: {
                compare: (a, b) => a.title.localeCompare(b.name),
                multiple: 4,
            },
            ...getColumnSearchProps('title'),
        },

        {
            title: 'Poster',
            dataIndex: 'poster',
            key: 'poster',
            render: (_, record) => (
                <Space size="middle">
                    <Image
                        width={105}
                        height={80}
                        style={{ objectFit: 'contain' }}
                        alt="ảnh rỗng"
                        src={uploadApi.get(record.poster)}
                    />
                </Space>
            ),
            // ...getColumnSearchProps('duration'),
        },
        {
            title: 'Banner',
            dataIndex: 'banner',
            key: 'banner',
            render: (_, record) => (
                <Space size="middle">
                    <Image
                        width={105}
                        height={80}
                        style={{ objectFit: 'contain' }}
                        alt="ảnh rỗng"
                        src={uploadApi.get(record.banner)}
                    />
                </Space>
            ),
            // ...getColumnSearchProps('duration'),
        },
        {
            title: 'Thời lượng',
            dataIndex: 'duration',
            key: 'duration',
            // ...getColumnSearchProps('duration'),
        },
        {
            title: 'Ngày phát hành',
            dataIndex: 'releaseDate',
            key: 'releaseDate',
            render: (releaseDate) => moment(releaseDate, 'YYYY-MM-DD').format(formatDate),
        },
        {
            title: 'Quốc gia',
            dataIndex: 'country',
            key: 'country',
            ...getColumnSearchProps('country'),
            render: (_, record) => {
                let i = countriesJson.findIndex((item) => item.code === record.country);
                return <span>{i > -1 ? countriesJson[i].name : record.country}</span>;
            },
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
        },

        {
            title: 'Action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => { openCinemaModal(); 
                    ByMovieAndReview(record);
                        // cinemabyCinemaComplex(record);
                         }}>Xem bình luận</Button>
                </Space>
            ),
        },
    ];
    const ByMovieAndReview = (record) => {
        setMovie(record);
    }
    const openCinemaModal = () => {
        setReviewModalOpen(true);
        // setCinemaModalOpen(true);
        // console.log(record);
      };
    
      const closeReviewModal = () => {
        setReviewModalOpen(false)
        // setCinemaModalOpen(false);
      };
    const showModal = () => {
        form.resetFields();
        setEditData(null);
        setOpen(true);
        setResetForm(true);
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

    const handleEditData = (record) => {
        setOpen(true);
        setResetForm(false);
        setEditData(record);
        console.log(record);
        form.setFieldsValue({ ...record, cinemaType: record.cinemaType.id, cinemaComplex: record.cinemaComplex.id });
    };

    const handleOk = async () => {
        setLoading(true);
        try {
            let values = await form.validateFields();
            if (values.status === undefined) {
                values = { ...values, status: true };
            }
            console.log(values.cinemaType);
            console.log(values.cinemaComplex);
            // if (editData) {
            //     const resp = await cinemaApi.put(editData.id, values, values.cinemaType, cinemaComplexId.id);
            //     console.log(resp);
            //     funcUtils.notify('Cập nhật thành công', 'success');
            // }
            console.log(values);
            // if (!editData) {
            //     try {
            //         console.log(values);
            //         const resp = await cinemaApi.post(values, values.cinemaType, cinemaComplexId.id);
            //         // message.success('Thêm thành công');
            //         funcUtils.notify('Thêm thành công', 'success');
            //     } catch (error) {
            //         console.log(error);
            //     }
            // }
            setOpen(false);
            form.resetFields();
            setLoading(false);
            setWorkSomeThing(!workSomeThing);
            // getList();
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
    const onChange = (checked) => {
        console.log(`switch to ${checked}`);
    };
    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    return (
        <>
            <Row>
                <Col span={22}>
                    <h1 className={cx('title')}>Danh sách bình luận và đánh giá của khách hàng</h1>
                </Col>
                <Col span={2}>
                    {/* <Button type="primary" className={cx('button-title')} icon={<PlusOutlined />} onClick={showModal}>
                        Thêm
                    </Button> */}
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
                            name="fullname"
                            label="Tài khoản"
                            rules={[{ required: true, message: 'Vui lòng nhập rạp' }]}
                        >
                            <Input placeholder="Please input your name" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="comment"
                            label="Bình luận"
                            rules={[{ required: true, message: 'Vui lòng nhập rạp' }]}
                        >
                            <Input placeholder="Please input your name" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="rating"
                            label="Đánh giá"
                            rules={[{ required: true, message: 'Vui lòng nhập rạp' }]}
                        >
                            <Input placeholder="Please input your name" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="movie"
                            label="Thuộc phim"
                            rules={[{ required: true, message: 'Vui lòng nhập rạp' }]}
                        >
                            <Input placeholder="Please input your name" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="status"
                            label="Trạng thái"
                            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                        >
                            <Switch defaultChecked onChange={onChange} />
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
            <BaseModal
        open={isReviewModalOpen}
        width={'80%'}
        title={'TỔNG HỢP BÌNH LUẬN VÀ ĐÁNH GIÁ CỦA KHÁCH HÀNG'}
        onCancel={closeReviewModal}
        
      >
        <ModalReview
         movieId={movie}
         />
      </BaseModal>
        </>
    );
};

export default AdminComment;
