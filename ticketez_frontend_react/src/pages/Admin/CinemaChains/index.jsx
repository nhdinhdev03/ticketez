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
    Table,
    Card,
    Image,
    Upload,
} from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import BaseTable from '~/components/Admin/BaseTable/BaseTable';
import BaseModal from '~/components/Admin/BaseModal/BaseModal';
import style from './CinemaChains.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faL, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import funcUtils from '~/utils/funcUtils';
import uploadApi from '~/api/service/uploadApi';
import cinemaChainApi from '~/api/admin/managementCinema/cinemaChainApi';

const { TextArea } = Input;


const cx = classNames.bind(style);

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};


const AdminCinemaChains = () =>  {
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
    const [cinemaChain, setCinemaChain] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [fileListBanner, setFileListBanner] = useState([]);

    //api
    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            try {
                const res = await cinemaChainApi.get();
                setCinemaChain(res.data);
                console.log(res);
                setTotalItems(res.totalItems);
                setPosts(res.data);
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
    }, [workSomeThing]);
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
        // {
        //     title: 'id',
        //     dataIndex: 'id',
        //     width: '10%',
        //     // ...getColumnSearchProps('id'),
        //     sorter: (a, b) => a.id - b.id,
        //     // defaultSortOrder: 'descend',
        // },
        {
            title: 'Tên loại',
            dataIndex: 'name',
            width: '20%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Ảnh chuỗi rạp',
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
            title: 'Banner',
            dataIndex: 'banner',
            render: (_, record) => (
                <Space size="middle">
                    <Image
                        width={155}
                        height={100}
                        style={{ objectFit: 'contain' }}
                        alt="ảnh rỗng"
                        src={`http://localhost:8081/api/upload/${record.banner}`}
                    />
                </Space>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            width: '20%',
        },
        {
            title: 'Action',
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
    const showModal = () => {
        form.resetFields();
        setEditData(null);
        setOpen(true);
        setResetForm(true);
    };

    const handleDelete = async (record) => {
        try {
            const res = await cinemaChainApi.delete(record.id);
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
        const newUploadFile = {
            uid: record.id.toString(),
            name: record.image,
            url: `http://localhost:8081/api/upload/${record.image}`,
        };
        const newUploadBanner = {
            uid: record.id.toString(),
            name: record.banner,
            url: `http://localhost:8081/api/upload/${record.banner}`,
        };
        setFileList([newUploadFile]);
        setFileListBanner([newUploadBanner]);
        setOpen(true);
        setResetForm(false);
        setEditData(record);
        console.log(record);
        form.setFieldsValue({ 
            ...record,
        });
    };

    const handleOk = async () => {
        setLoading(true);
        try {
            let values = await form.validateFields();
            if(fileList.length > 0 ){
                if (editData) {
                    let putData = {
                        id: editData.id,
                        ...values,
                    };
                    if(putData.image.file){
                        console.log(putData);

                        const file = putData.image.fileList[0].originFileObj;
                        const images = await uploadApi.put(editData.image, file);
                        putData = {
                            ...putData,
                            image: images,
                        };
                    }
                    if(putData.banner.file){
                        console.log(putData);

                        const filebaner = putData.banner.fileList[0].originFileObj;
                        const banners = await uploadApi.put(editData.banner, filebaner);
                        putData = {
                            ...putData,
                            banner: banners,
                        };
                    }
                    try {
                        const resp = await cinemaChainApi.put(putData.id, putData);
                        console.log(resp);
                        if (resp.status === 200) {
                            funcUtils.notify('Cập nhật thành công', 'success');
                        }
                    } catch (error) {
                        if (error.hasOwnProperty('response')) {
                            message.error(error.response.data);
                        } else {
                            console.log(error);
                        }
                    }                  
                    
                }
                console.log(values);
                if (!editData) {
                    try {
                        const file = values.image.fileList[0].originFileObj;
                        const filebaner = values.banner.fileList[0].originFileObj;
                        const images = await uploadApi.post(file);
                        const banners = await uploadApi.post(filebaner);
                        const postData = {
                            ...values,
                            image: images,
                            banner: banners,
                        };
                        console.log(postData);
                        const resPost = await cinemaChainApi.post(postData);
                        console.log('resPost', resPost);
                        if (resPost.status === 200) {
                            funcUtils.notify('Thêm thành công', 'success');
                        }
                    } catch (error) {
                        if (error.hasOwnProperty('response')) {
                            message.error(error.response.data);
                        } else {
                            console.log(error);
                        }
                    }
                }
                setOpen(false);
                form.resetFields();
                setLoading(false);
                setFileList([]);
                setWorkSomeThing(!workSomeThing);
             
            }
            else {
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

    //form
    const handleResetForm = () => {
        form.resetFields();
        setFileList([]);
        console.log(form);
    };
    const onChange = (e) => {
        console.log('Change:', e.target.value);
      };

      const onChangeUpload = async ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };
      const onChangeUploadBanner = async ({ fileListBanner: newFileListBanner }) => {
        setFileListBanner(newFileListBanner);
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
                    <h1 className={cx('title')}>Bảng dữ liệu Loại chuỗi Rạp</h1>
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
                        resetForm && ( // Conditionally render the "Làm mới" button only when editing
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
                        {/* <Form.Item
                                {...formItemLayout}
                                name="id"
                                label="Id"
                                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                            >
                                <Input placeholder="Please input your name" />
                            </Form.Item> */}
                        <Form.Item
                            {...formItemLayout}
                            name="name"
                            label="Tên loại rạp"
                            rules={[{ required: true, message: 'Vui lòng nhập loại rạp' }]}
                        >
                            <Input placeholder="Nhập tên loại rạp" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="Ảnh chuỗi rạp"
                            name="image"
                            rules={[{ required: true, message: 'Vui lòng chọn ảnh' }]}
                        >
                            <Upload
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                accept=".png, .jpg, .webp"
                                listType="picture-card"
                                onChange={onChangeUpload}
                                // onPreview={onPreview}
                                fileList={fileList}
                                name="image"
                                maxCount={1}
                            >
                                {fileList.length < 2 && '+ Upload'}
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="Ảnh nền"
                            name="banner"
                            rules={[{ required: true, message: 'Vui lòng chọn ảnh nền' }]}
                        >
                            <Upload
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                accept=".png, .jpg, .webp"
                                listType="picture-card"
                                onChange={onChangeUploadBanner}
                                // onPreview={onPreview}
                                fileList={fileListBanner}
                                name="banner"
                                maxCount={1}
                            >
                                {fileList.length < 2 && '+ Upload'}
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="description"
                            label="Mô tả chi tiết"
                            rules={[{ required: true, message: 'Vui lòng chọn mô tả' }]}
                        >
                           <TextArea
                            showCount
                            maxLength={100}
                            style={{
                                height: 120,
                                marginBottom: 24,
                            }}
                            onChange={onChange}
                            placeholder="Nhập mô tả "
                            />
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
                dataSource={posts.map((post) => ({ ...post, key: post.id }))}
              
            />
        </>
    );

};

export default AdminCinemaChains;
