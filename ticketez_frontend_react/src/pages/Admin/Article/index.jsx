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
    Upload,
    Image,
    Pagination,
    DatePicker,
    Select,
    Descriptions,
    Switch,
    Tag,
    Divider,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import BaseTable from '~/components/common/BaseTable/BaseTable';
import BaseModal from '~/components/common/BaseModal/BaseModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import TextArea from 'antd/es/input/TextArea';
import uploadApi from '~/api/service/uploadApi';
import funcUtils from '~/utils/funcUtils';
import articleApi from '~/api/admin/managementMovie/article';
import dayjs from 'dayjs';
import { movieApi } from '~/api/admin';
import moment from 'moment';
import classNames from 'classnames/bind';
import style from './Article.module.scss';
import genreApi from '~/api/admin/managementMovie/genreApi';
import formatMovieApi from '~/api/admin/managementMovie/formatMovieApi';

const cx = classNames.bind(style);
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
const { Option } = Select;

const Article = () => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [checkNick] = useState(false);
    const [resetForm, setResetForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataMovie, setDataMovie] = useState([]);
    const [dataGenre, setListDataGenre] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [posts, setPosts] = useState([]);
    const [statusValue, setStatusValue] = useState(true);
    const [valueSelectMovie, setValueSelectMovie] = useState([]);
    const [valueSelectGenre, setValueSelectGenre] = useState([]);
    //phân trang
    const [totalItems, setTotalItems] = useState(0); // Tổng số mục
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tạif
    const [pageSize, setPageSize] = useState(10); // Số mục trên mỗi trang
    const [workSomeThing, setWorkSomeThing] = useState(false);
    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            try {
                const res = await articleApi.getPageArticle(currentPage, pageSize);
                setPosts(res.data.listMovieObjResp);
                setTotalItems(res.data.totalItems);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        getList();

       if(valueSelectGenre){
         const getListMovie = async () => {
             setLoading(true);
             try {
                 const res = await formatMovieApi.getMovieByGenre(valueSelectGenre);
                 setDataMovie(res.data);
                 setLoading(false);
             } catch (error) {
                 console.log(error);
             }
         };
         getListMovie();
       }

        const getListGenre = async () => {
            setLoading(true);
            try {
                const res = await genreApi.getAll();
                setListDataGenre(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        getListGenre();
    }, [currentPage, pageSize, valueSelectGenre, workSomeThing]);
    console.log(dataMovie);
    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            width: '6%',
            defaultSortOrder: 'sorting',
            render: (_, record) => (
                <Space size="middle">
                    <span>{record.article.id}</span>
                </Space>
            ),
        },
        {
            title: 'Tên',
            dataIndex: 'title',
            render: (_, record) => (
                <Space size="middle">
                    <span>{record.article.title}</span>
                </Space>
            ),
        },
        {
            title: 'Ảnh',
            dataIndex: 'banner',
            render: (_, record) => (
                <Space size="middle">
                    <Image
                        width={105}
                        height={80}
                        style={{ objectFit: 'contain' }}
                        alt="ảnh rỗng"
                        src={`http://localhost:8081/api/upload/${record.article.banner}`}
                    />
                </Space>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'create_date',
            width: '10%',
            render: (_, record) => (
                <Space size="middle">
                    <span>{moment(record.article.create_date).format('DD-MM-YYYY')}</span>
                </Space>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'content',
            width: '30%',
            render: (_, record) => (
                <Space size="middle">
                    <span>{record.article.content}</span>
                </Space>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            align: 'center',
            width: '15%',
            render: (_, record) => {
                const statusText = record.article.status === true ? 'Hoạt động' : 'Kết thúc';
                const tagColor = record.article.status === true ? '#9ADE7B' : '#C70039';

                return <Tag color={tagColor}>{statusText}</Tag>;
            },
            onFilter: (value, record) => record.article.status === (value === 'true'),
            filters: [
                { text: 'Hoạt động', value: 'true' },
                { text: 'Kết thúc', value: 'false' },
            ],
            filterMultiple: false,
        },
        {
            title: 'Thao tác',
            width: '10%',
            render: (_, record) => (
                <Space size="middle">
                    <FontAwesomeIcon
                        icon={faPen}
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
                        <FontAwesomeIcon icon={faTrash} />
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
        form.setFieldsValue({
            status: true,
        });
    };

    const handleDelete = async (record) => {
        try {
            const res = await articleApi.delete(record.article.id);
            if (res.status === 200) {
                if (fileList.length > 0) {
                    await uploadApi.delete(record.article.icon);
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

    const handleEditData = async (record) => {
        // const  a = await Promise.all([onChangSelectMovie(movieId)]);
        const formattedEndTime = dayjs(record.article.create_date, 'YYYY-MM-DD HH:mm:ss');
        const newUploadFile = {
            uid: record.article.id.toString(),
            name: record.article.banner,
            url: `http://localhost:8081/api/upload/${record.article.banner}`,
        };
        setFileList([newUploadFile]);
        setOpen(true);
        setResetForm(false);
        setEditData(record);
        setStatusValue(record.article.status);
        form.setFieldsValue({
            ...record.article,
            status: record.article.status === true,
            create_date: formattedEndTime,
        });
    };

    const handleOk = async () => {
        setLoading(true);
        try {
            let values = await form.validateFields();
            if (fileList.length > 0) {
                if (editData) {
                    let putData = {
                        id: editData.id,
                        ...values,
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
                        const resPut = await articleApi.update(putData.id, putData);
                        if (resPut.status === 200) {
                            funcUtils.notify('Cập nhật danh sách phim thành công', 'success');
                        }
                    } catch (error) {
                        if (error.status === 500) {
                            funcUtils.notify('Lỗi máy chủ nội bộ, vui lòng thử lại sau!', 'error');
                        }
                        console.log(error);
                    }
                } else {
                    try {
                        const file = values.banner.fileList[0].originFileObj;
                        const images = await uploadApi.post(file);
                        const postData = {
                            movies: valueSelectMovie,
                            article: {
                                // ...values,
                                title: values.title,
                                create_date: values.create_date,
                                content: values.content,
                                status: values.status,
                                banner: images,
                            },
                        };
                        const resPost = await articleApi.create(postData);
                        if (resPost.status === 200) {
                            funcUtils.notify('Thêm danh sách phim thành công', 'success');
                        }
                    } catch (error) {
                        if (error.status === 500) {
                            funcUtils.notify('Lỗi máy chủ nội bộ, vui lòng thử lại sau!', 'error');
                        }
                        // upload
                        if (error.response.data.error) {
                            funcUtils.notify(error.response.data.error, 'error');
                        }
                        funcUtils.notify(error.response.data, 'error');
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

    const onChangSelectMovie = (values) => {
        let movies = values.map((id) => {
            return dataMovie.find((o) => o.id === id);
        });
        setValueSelectMovie(movies);
    };
    const onChangSelectGenre = (values) => {

        setValueSelectGenre(values);
    };

    return (
        <div>
            <Row>
                <Col span={22}>
                    <h1>Bảng dữ liệu</h1>
                </Col>
                <Col span={2}>
                    <Button type="primary" className=" tw-mt-[20px]" icon={<PlusOutlined />} onClick={showModal}>
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
                        <Form.Item label="Trạng thái" name="status" {...formItemLayout}>
                            <Switch
                                checked={statusValue === true}
                                onChange={(checked) => setStatusValue(checked ? true : false)}
                                checkedChildren={'Đang hoạt động'}
                                unCheckedChildren={'Kết Thúc '}
                                defaultChecked
                            />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            name="title"
                            label="Nhập tên"
                            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                        >
                            <Input placeholder="Vui lòng nhập tên " />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="create_date"
                            label="Chọn ngày"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                        >
                            <DatePicker placeholder="Chọn ngày" format={'DD-MM-YYYY'} />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="content"
                            label="Nhập mô tả"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                        >
                            <TextArea placeholder="Vui lòng nhập mô tả" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="genres"
                            label="Chọn thể loại"
                            rules={[{ required: true, message: 'Vui lòng tìm kiếm hoặc chọn thể loại' }]}
                        >
                            <Select
                                style={{ width: '100%' }}
                                onChange={(value) => onChangSelectGenre(value)}
                                // disabled={!selectedOption3}
                                showSearch
                                placeholder="Tìm kiếm hoặc chọn thể loại"
                                optionFilterProp="children"
                                optionLabelProp="label"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {dataGenre && dataGenre.length > 0
                                    ? dataGenre.map((genre) => (
                                          <Option key={genre.id} value={genre.id} label={genre.name}>
                                              <Space style={{ justifyContent: 'flex-start', display: 'flex' }}>
                                                  <span>{genre.name}</span>
                                              </Space>
                                          </Option>
                                      ))
                                    : null}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="movie"
                            label="Chọn phim"
                            rules={[{ required: true, message: 'Vui lòng tìm kiếm hoặc chọn phân loại phim' }]}
                        >
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                onChange={(value) => onChangSelectMovie(value)}
                                // disabled={!selectedOption3}
                                showSearch
                                placeholder="Tìm kiếm hoặc chọn phim"
                                optionFilterProp="children"
                                optionLabelProp="label"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {dataMovie && dataMovie.length > 0
                                    ? dataMovie.map((formatMovie) => (
                                          <Option key={formatMovie.movie.id} value={formatMovie.movie.id} label={formatMovie.movie.title}>
                                              <Space style={{ justifyContent: 'flex-start', display: 'flex' }}>
                                                  <div>
                                                      <span role="img" aria-label="China">
                                                          <img
                                                              alt=""
                                                              className="tw-w-[40px] tw-h-[50px] tw-rounded-md"
                                                              src={uploadApi.get(formatMovie.movie.poster)}
                                                          />
                                                      </span>
                                                  </div>
                                                  <span>{formatMovie.movie.title}</span>
                                              </Space>
                                          </Option>
                                      ))
                                    : null}
                            </Select>
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
                    key: post.article.id,
                }))}
                expandable={{
                    expandedRowRender: (record) => {
                        return (
                            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                                <Descriptions title="Danh sách phim"></Descriptions>
                                <Row>
                                    {record.listMovieandGens.map((value, index) => (
                                        <Col lg={8} key={index}>
                                            <Row>
                                                <Col lg={6}>
                                                    <img
                                                        alt=""
                                                        src={uploadApi.get(value.movie.poster)}
                                                        width="100%"
                                                        height={150}
                                                    />
                                                </Col>
                                                <Col lg={17} className="tw-ml-3">
                                                    <div>
                                                        <Tag color={value.movie.mpaaRating.colorCode}>
                                                            {value.movie.mpaaRating.ratingCode}
                                                        </Tag>
                                                    </div>
                                                    <div>
                                                        <span className="tw-text-gray-400">Bộ phim:</span>{' '}
                                                        <span className="tw-text-left tw-text-gray-950">
                                                            {value.movie.title}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="tw-text-gray-400">Thời lượng:</span>{' '}
                                                        <span className="tw-text-left tw-text-gray-950">
                                                            {value.movie.duration}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="tw-text-gray-400">Quốc Gia:</span>{' '}
                                                        <span className="tw-text-left tw-text-gray-950">
                                                            {value.movie.country}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="tw-text-gray-400">Thể loại:</span>{' '}
                                                        <span
                                                            className={cx(
                                                                'the-loai-phim',
                                                                'tw-text-left tw-text-gray-950',
                                                            )}
                                                        >
                                                            {value.genres.map((genres, index) => (
                                                                <span key={index} className={cx('span')}>
                                                                    {genres.name}
                                                                </span>
                                                            ))}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <FontAwesomeIcon
                                                            icon={faStar}
                                                            className="tw-text-yellow-400 "
                                                        />{' '}
                                                        <span className="tw-text-left tw-text-gray-950 ">
                                                            {value.movie.rating}
                                                        </span>
                                                    </div>
                                                </Col>
                                                <Divider />
                                            </Row>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        );
                    },
                }}
            />
            <div>
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

export default Article;
