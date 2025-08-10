import { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    DatePicker,
    Form,
    Image,
    Input,
    Modal,
    Pagination,
    Popconfirm,
    Row,
    Select,
    Space,
    Upload,
    message,
} from 'antd';
import BaseTable from '~/components/Admin/BaseTable/BaseTable';
import countriesJson from '~/data/countries.json';
import style from './Studio.module.scss';
import classNames from 'classnames/bind';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axiosClient from '~/api/global/axiosClient';
import Highlighter from 'react-highlight-words';
import BaseModal from '~/components/Admin/BaseModal/BaseModal';
import PaginationCustom from '~/components/Admin/PaginationCustom';
import funcUtils from '~/utils/funcUtils';
import { studioApi } from '~/api/admin';
import uploadApi from '~/api/service/uploadApi';
import moment from 'moment';
import Paragraph from 'antd/es/typography/Paragraph';
import dayjs from 'dayjs';
import httpStatus from '~/api/global/httpStatus';
import { HttpStatusCode } from 'axios';
import Search from 'antd/es/input/Search';
import { useSearchEffect } from '~/hooks';

const cx = classNames.bind(style);
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

function AdminMovieStudio() {
    const formatDate = 'DD-MM-YYYY';
    const fontSize = 14;
    const [list, setList] = useState([]);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataEdit, setDataEdit] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [totalItems, setTotalItems] = useState(0); // Tổng số mục
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [pageSize, setPageSize] = useState(10); // Số mục trên mỗi trang
    const [workSomething, setWorkSomething] = useState(false); // Số mục trên mỗi trang
    const [loadingButton, setLoadingButton] = useState(false); // Số mục trên mỗi trang
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [isSearchingTable, setIsSearchingTable] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const showModal = () => {
        setIsModalOpen(true);
    };
    const onChangeUpload = async ({ fileList: newFileList }) => {
        setFileList(newFileList);
        console.log('newFileList', newFileList);
    };
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };
    const handleOk = async () => {
        setLoadingButton(true);
        try {
            const values = await form.validateFields();
            console.log('values', values);
            if (fileList.length > 0) {
                if (!dataEdit) {
                    let imageName = await uploadApi.post(values.image.fileList[0].originFileObj);
                    const dataCreate = {
                        ...values,
                        foundedDate: values.foundedDate.format('YYYY-MM-DD'),
                        image: imageName,
                    };
                    console.log('dataCreate', dataCreate);
                    const resp = await studioApi.create(dataCreate);
                    setWorkSomething(!workSomething);
                    handleResetForm();
                    if (resp.status === HttpStatusCode.Ok) {
                        funcUtils.notify('Thêm thành công', 'success');
                    }
                    setIsModalOpen(false);
                    setFileList([]);
                } else {
                    let imageName = null;
                    if (fileList[0].hasOwnProperty('originFileObj')) {
                        imageName = await uploadApi.put(dataEdit.image, fileList[0].originFileObj);
                    }
                    let dataUpdate = {
                        ...values,
                        image: imageName != null ? imageName : values.image,
                        id: dataEdit.id,
                    };
                    console.log('dataUpdate: ', dataUpdate);
                    const resp = await studioApi.update(dataEdit.id, dataUpdate);
                    // console.log('resp update:', resp.data);
                    // console.log('values update:', values);
                    setList(list.map((item) => (item.id === dataEdit.id ? resp.data : item)));
                    setWorkSomething(!workSomething);
                    if (resp.status === HttpStatusCode.Ok) {
                        funcUtils.notify('Cập nhật thành công', 'success');
                        form.setFieldValue(resp.data);
                    }
                }
            } else {
                funcUtils.notify('Vui lòng chọn ảnh!', 'error');
            }
        } catch (error) {
            if (error.hasOwnProperty('response')) {
                funcUtils.notify(error.response.data, 'error');
            } else {
                console.log(error);
            }
        } finally {
            setLoadingButton(false);
        }
    };
    const handleResetForm = () => {
        form.resetFields();
    };
    const handleCancelModal = () => {
        setIsModalOpen(false);
        handleResetForm();
        setFileList([]);
        if (dataEdit != null) {
            setDataEdit(null);
        }
    };
    const handleEditData = async (record) => {
        try {
            // const resp = await studioApi.getById(record.id);
            setFileList([
                {
                    uid: record.id.toString(),
                    name: record.image,
                    url: uploadApi.get(record.image),
                },
            ]);
            setPreviewTitle(`Logo của hãng ${record.name}`);
            form.setFieldsValue({
                ...record,
                foundedDate: dayjs(record.foundedDate, 'YYYY-MM-DD'),
            });
            setIsModalOpen(true);
            console.log('record: edit:', record);
            setDataEdit(record);
        } catch (error) {
            console.log('error edit: ', error);
        }
    };
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        console.log(selectedKeys);
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleDelete = async (record) => {
        setLoadingButton(true);
        try {
            const resp = await studioApi.delete(record.id);
            if (resp.status === 200) {
                setLoadingButton(false);
                funcUtils.notify('Đã xoá thành công', 'success');
                setWorkSomething(!workSomething);
            }
        } catch (error) {
            if (error.hasOwnProperty('response')) {
                funcUtils.notify(error.response.data, 'error');
            } else {
                funcUtils.notify('Xoá thất bại', 'error');
                console.log(error);
            }
        } finally {
            setLoadingButton(false);
        }
    };
    const onSearchStudio = (value) => {
        setSearchValue(value);
        setIsSearchingTable(true);
    };

    useSearchEffect(searchValue, studioApi, setList, isSearchingTable);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await studioApi.getByPage(currentPage, pageSize);
                const dataFormat = resp.data.map((item) => ({
                    ...item,
                    // foundedDate: moment(item.foundedDate, 'YYYY-MM-DD').format(formatDate),
                }));
                setList(dataFormat);
                setTotalItems(resp.totalItems);
            } catch (error) {
                if (error.hasOwnProperty('response')) {
                    funcUtils.notify(error.response.data, 'error');
                } else {
                    console.log(error);
                }
            }
        };

        fetchData();
    }, [currentPage, pageSize, workSomething]);
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
                    placeholder={`Nhập từ khoá`}
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
                        Làm mới
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
                        Lọc
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Đóng
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
        render: (text) =>
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
            title: 'Tên hãng',
            dataIndex: 'name',
            key: 'name',
            sorter: {
                compare: (a, b) => a.name.localeCompare(b.name),
                multiple: 4,
            },
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Logo',
            dataIndex: 'image',
            key: 'image',
            render: (_, record) => (
                <Space size="middle">
                    <Image
                        width={105}
                        height={80}
                        style={{ objectFit: 'contain' }}
                        alt="ảnh rỗng"
                        src={uploadApi.get(record.image)}
                    />
                </Space>
            ),
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
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Ngày thành lập',
            dataIndex: 'foundedDate',
            key: 'foundedDate',
            render: (foundedDate) => dayjs(foundedDate, 'YYYY-MM-DD').format(formatDate),
        },

        {
            title: 'Thao tác',
            key: 'description',
            render: (_, record) => (
                <Space size="middle">
                    <FontAwesomeIcon
                        icon={solidIcons.faPen}
                        onClick={() => handleEditData(record)}
                        className={cx('icon-pen')}
                    />
                    <Popconfirm
                        title="Bạn có chắc"
                        description="Muốn xoá hay không?"
                        okText="Yes"
                        onConfirm={() => handleDelete(record)}
                        cancelText="No"
                    >
                        <FontAwesomeIcon icon={solidIcons.faTrash} className={cx('icon-trash')} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    const expandedRowRender = (record) => {
        return (
            <div>
                <ul style={{ marginLeft: 52 }}>
                    <li>
                        <b>Website: </b>
                        <span>
                            <a
                                href={record.website}
                                className={cx('table-link-video')}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {record.website}
                            </a>
                        </span>
                    </li>
                    <li>
                        <b>Địa chỉ: </b>
                        <Paragraph style={{ paddingLeft: 35 }}>{record.address}</Paragraph>
                    </li>
                    <li>
                        <b>Mô tả: </b>
                        <Paragraph style={{ paddingLeft: 35 }}>{record.description}</Paragraph>
                    </li>
                </ul>
            </div>
        );
    };
    const config = {
        rules: [
            {
                type: 'object',
                required: true,
                message: 'Vui lòng chọn thời gian!',
            },
        ],
    };
    // Xử lý sự kiện thay đổi trang
    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };
    const validateBirthday = (rule, value) => {
        return new Promise((resolve, reject) => {
            if (value) {
                // Tính tuổi dựa trên ngày sinh
                const today = new Date();
                const birthday = new Date(value);
                const age = today.getFullYear() - birthday.getFullYear();

                // Kiểm tra tuổi
                if (age < 1) {
                    reject('Ngày thành lập phải trước 1 năm');
                } else {
                    resolve();
                }
            } else {
                resolve();
            }
        });
    };
    const handleCancelPreview = () => setPreviewOpen(false);
    return (
        <>
            <Row>
                <Col span={22}>
                    <h1>Hãng phim</h1>
                </Col>
                <Col span={2} className={cx('wrap-act-top-right')}>
                    <Button
                        type="primary"
                        size={'large'}
                        onClick={showModal}
                        icon={<FontAwesomeIcon icon={solidIcons.faPlus} />}
                    >
                        Thêm
                    </Button>
                </Col>
                <Col span={24}>
                    <Search
                        placeholder="Nhập tên hãng phim vào đây..."
                        allowClear
                        // enterButton={false}
                        onChange={(e) => onSearchStudio(e.target.value)}
                        style={{
                            width: 250,
                            marginBottom: 10,
                        }}
                    />
                </Col>
            </Row>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelPreview}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
            <BaseModal
                maskClosable={false}
                forceRender
                className={cx('modal-form')}
                open={isModalOpen}
                title={dataEdit ? 'Cập nhật' : 'Thêm mới'}
                width={'45%'}
                style={{ top: 20 }}
                onOk={handleOk}
                onCancel={handleCancelModal}
                footer={[
                    <Button key="back" onClick={handleCancelModal}>
                        Thoát
                    </Button>,
                    !dataEdit && (
                        <Button key="reset" onClick={handleResetForm}>
                            Làm mới
                        </Button>
                    ),
                    <Button key="submit" type="primary" loading={loadingButton} onClick={handleOk}>
                        {dataEdit ? 'Cập nhật' : 'Thêm'}
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    name="basic"
                    {...formItemLayout}
                    style={{
                        maxWidth: 600,
                    }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Tên hãng"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên hãng phim!',
                            },
                        ]}
                    >
                        <Input
                            style={{ fontFamily: 'inherit', fontSize: fontSize }}
                            placeholder="Nhập tên hãng vào đây"
                        />
                    </Form.Item>

                    <Form.Item label="Logo" name="image" rules={[{ required: true, message: 'Vui lòng chọn logo' }]}>
                        <Upload
                            beforeUpload={(file) => {
                                console.log({ file });
                                return false;
                            }}
                            accept=".png, .jpg"
                            listType="picture-card"
                            onChange={onChangeUpload}
                            onPreview={handlePreview}
                            fileList={fileList}
                            name="banner"
                            maxCount={1}
                        >
                            {fileList.length < 1 && '+ Tải lên'}
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        name="foundedDate"
                        label="Ngày thành lập"
                        {...config}
                        rules={[
                            { required: true, message: 'Vui lòng chọn ngày thành lập' },
                            { validator: validateBirthday },
                        ]}
                    >
                        <DatePicker style={{ width: 200 }} placeholder="Chọn ngày thành lập" format={formatDate} />
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        name="country"
                        label="Quốc gia"
                        rules={[{ required: true, message: 'Vui lòng chọn quốc gia' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Tìm kiếm và chọn quốc gia"
                            // onChange={onGenderChange}
                            allowClear
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={[
                                ...countriesJson.map((item) => ({
                                    value: item.code,
                                    label: item.name,
                                })),
                            ]}
                        />
                        {/* {countriesJson.map((item) => {
                                return (
                                    <Select.Option key={item.code} value={item.code}>
                                        {item.name}
                                    </Select.Option>
                                );
                            })} */}
                        {/* </Select> */}
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập email của hãng phim!',
                            },
                        ]}
                    >
                        <Input style={{ fontFamily: 'inherit', fontSize: fontSize }} placeholder="Nhập email vào đây" />
                    </Form.Item>
                    <Form.Item
                        label="Website"
                        name="website"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập địa website của hãng phim!',
                            },
                        ]}
                    >
                        <Input
                            style={{ fontFamily: 'inherit', fontSize: fontSize }}
                            placeholder="Nhập địa chỉ website vào đây"
                        />
                    </Form.Item>
                    <Form.Item name={'address'} label="Địa chỉ">
                        <Input.TextArea
                            style={{ fontFamily: 'inherit', fontSize: fontSize }}
                            autoSize={{ minRows: 3, maxRows: 5 }}
                            placeholder="Nhập address vào đây"
                        />
                    </Form.Item>
                    <Form.Item name={'description'} label="Mô tả">
                        <Input.TextArea
                            style={{ fontFamily: 'inherit', fontSize: fontSize }}
                            autoSize={{ minRows: 4, maxRows: 6 }}
                            placeholder="Nhập mô tả vào đây"
                        />
                    </Form.Item>
                </Form>
            </BaseModal>
            <BaseTable
                pagination={false}
                columns={columns}
                dataSource={list.map((item) => ({
                    ...item,
                    key: item.id,
                }))}
                expandable={{ expandedRowRender }}
            />

            <PaginationCustom
                current={currentPage}
                pageSize={pageSize}
                total={totalItems}
                onChange={handlePageChange}
            />
        </>
    );
}

export default AdminMovieStudio;
