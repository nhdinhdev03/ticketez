import React, { useRef, useState, useEffect } from 'react';
import { Button, Input, Space, Col, Row, Form, message, Popconfirm, Table, DatePicker, Pagination, Select, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, HomeOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import BaseTable from '~/components/Admin/BaseTable/BaseTable';
import BaseModal from '~/components/Admin/BaseModal/BaseModal';
import style from './CinemaComplex.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { cinemaComplexApi, provinceApi } from '~/api/admin';
import funcUtils from '~/utils/funcUtils';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { TimePicker } from 'antd';
import cinemaChainsApi from '~/api/admin/managementCinema/cinemaChainApi';
import Mapbox from '~/components/Mapbox';
import MapboxCcx from './MapboxCcx/mapbox';
import AdminCinema from './../Cinema/index';
import AdminProvince from './Province';

dayjs.extend(customParseFormat);

const cx = classNames.bind(style);

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
const AdminCinemaComplex = () => {
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
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [pageSize, setPageSize] = useState(10); // Số mục trên mỗi trang
    const [province, setProvince] = useState([]);
    const [cinemaChains, setCinemaChains] = useState([]);
    const [openingTime, setOpeningTime] = useState(null);
    const [closingTime, setClosingTime] = useState(null);
    const [isCinemaModalOpen, setCinemaModalOpen] = useState(null);
    const [isProvinceModalOpen, setProvinceModalOpen] = useState(null);
    const [cinemaComplex, setCinemaComplex] = useState(null);


    const [popupInfoFromMapbox, setPopupInfoFromMapbox] = useState({ latitude: 0, longitude: 0, address: "" });

    const handlePopupInfoChange = (newPopupInfo) => {
        setPopupInfoFromMapbox(newPopupInfo);
    };

    // console.log(popupInfoFromMapbox);


    //call api
    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            try {
                const res = await cinemaComplexApi.getPage(currentPage, pageSize);
                const [province, cinemaChains] = await Promise.all([provinceApi.get(), cinemaChainsApi.get()]);
                setProvince(province.data);
                setCinemaChains(cinemaChains.data)

                console.log(res);
                //    console.log(resType);
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
    }, [currentPage, pageSize, workSomeThing])


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
            title: 'Cụm rạp',
            dataIndex: 'name',
            width: '25%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            width: '30%',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            with: '10%',

        },
        {
            title: 'Thuộc tỉnh',
            dataIndex: 'province',
            render: (province) => <span>{province.name}</span>
        },
        {
            title: 'Thuộc loại',
            dataIndex: 'cinemaChain',

            render: (cinemaChains) => <span>{cinemaChains.name}</span>
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
                    <Button onClick={() => { openCinemaModal(); cinemabyCinemaComplex(record); }}>Phòng chiếu</Button>

                </Space>
            ),
        },
    ];

    const cinemabyCinemaComplex = (record) => {
        setCinemaComplex(record);
        // console.log('123',record);
    }

    const openCinemaModal = () => {
        setCinemaModalOpen(true);
        // console.log(record);
    };

    const openProvinceModal = () => {
        setProvinceModalOpen(true);
        // console.log(record);
    };

    const closeProvinceModal = () => {
        setProvinceModalOpen(false);
    };
    const closeCinemaModal = () => {
        setCinemaModalOpen(false);
    };
    const showModal = () => {
        form.resetFields();
        setEditData(null);
        setOpen(true);
        setResetForm(true);
    };

    const handleDelete = async (record) => {
        try {
            const res = await cinemaComplexApi.delete(record.id);
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
    const [mapCinema, setMapCinema] = useState({ longitude: 105.72801667411835, latitude: 9.296098750825891, address: "" })
    const handleEditData = (record) => {
        setMapCinema({ longitude: record.longitude, latitude: record.latitude, address: record.address })
        const formattedStartime = dayjs(record.openingTime, 'HH:mm:ss');
        const formattedEndtime = dayjs(record.closingTime, 'HH:mm:ss');
        setOpen(true);
        setResetForm(false);
        setEditData(record);
        // console.log(record.longitude);
        // console.log(record.latitude);
        // console.log(record.address);
        console.log(mapCinema);
        form.setFieldsValue({
            ...record,
            openingTime: formattedStartime,
            closingTime: formattedEndtime,
            province: record.province.id,
            cinemaChain: record.cinemaChain.id
        });
    };


    const handleOk = async () => {
        setLoading(true);
        try {
            let values = await form.validateFields();
            // console.log(values.province);
            // console.log(values.cinemaChain);

            const startTime = values.openingTime.format('HH:mm:ss');
            const endTime = values.closingTime.format('HH:mm:ss');

            if (startTime >= endTime) {
                message.error('Giờ kết thúc phải sau giờ bắt đầu');
                setLoading(false);
                return;
            }
            // const isDuplicateCoordinate = posts.some(
            //     post =>
            //         post.id !== editData?.id &&
            //         post.longitude === popupInfoFromMapbox.longitude &&
            //         post.latitude === popupInfoFromMapbox.latitude
            // );

            // if (isDuplicateCoordinate) {
            //     message.error('Tọa độ đã tồn tại. Vui lòng chọn tọa độ khác.');
            //     setLoading(false);
            //     return;
            // }
            if (editData) {
                values = {
                    ...values,
                    openingTime: values.openingTime.format('HH:mm:ss'),
                    closingTime: values.closingTime.format('HH:mm:ss'),
                    latitude: popupInfoFromMapbox.latitude,
                    longitude: popupInfoFromMapbox.longitude,
                    address: popupInfoFromMapbox.address,
                }
                const resp = await cinemaComplexApi.put(editData.id, values, values.province, values.cinemaChain);
                console.log(resp);
                funcUtils.notify('Cập nhật thành công', 'success');
            }
            // console.log(values);
            if (!editData) {
                try {
                    values = {
                        ...values,
                        openingTime: values.openingTime.format('HH:mm:ss'),
                        closingTime: values.closingTime.format('HH:mm:ss'),
                        latitude: popupInfoFromMapbox.latitude,
                        longitude: popupInfoFromMapbox.longitude,
                        address: popupInfoFromMapbox.address,
                    }
                    console.log(values);
                    const resp = await cinemaComplexApi.post(values, values.province, values.cinemaChain);
                    // message.success('Thêm thành công');
                    console.log(resp);
                    funcUtils.notify('Thêm thành công', 'success');
                } catch (error) {
                    // console.log(error);
                    funcUtils.notify('Thêm thất bại', 'error');
                }
            }
            setOpen(false);
            form.resetFields();
            setLoading(false);
            setWorkSomeThing(!workSomeThing);
            // getList();
        } catch (errorInfo) {
            // console.log('Failed:', errorInfo);
            setLoading(false);
        }
    };
    const handleCancel = () => {
        setOpen(false);
        setMapCinema({
            longitude: 105.72801667411835, latitude: 9.296098750825891, address: ""
        })
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
    dayjs.extend(customParseFormat);
    const onChangeStartTime = (time, timeString) => {
        setOpeningTime(timeString);
        // console.log(setOpeningTime);
    };
    const onChangeEndTime = (time, timeString) => {
        setClosingTime(timeString);
        // console.log(setClosingTime)
    };

    const expandedRowRender = (record) => {
        return (
            <div className={cx('flex')}>
                <div className={cx('flex-1 p-4 m-2')}>
                    <ul className={cx('wrapp-more-info')}>
                        <li>
                            <span>
                                <b>Giờ mở cửa: </b> {record.openingTime}
                            </span>
                        </li>
                        <li>
                            <span>
                                <b>Giờ đóng cửa: </b> {record.closingTime}
                            </span>
                        </li>
                        <li>
                            <span>
                                <b>Kinh độ: </b> {record.longitude}
                            </span>
                        </li>
                        <li>
                            <span>
                                <b>Vĩ độ: </b> {record.latitude}
                            </span>
                        </li>
                        <li>
                            <span>
                                <b>Địa chỉ: </b> {record.address}
                            </span>
                        </li>
                    </ul>
                </div>
                <div className={cx('w-[300px] h-[400px] p-3')}>
                    <Mapbox
                        latitude={record.latitude}
                        longitude={record.longitude}
                        address={record.address}
                    />
                </div>
            </div>
        );
    };

    const [selectedProvince, setSelectedProvince] = useState("");
    console.log("213123", selectedProvince);

    return (
        <>
            <Row>
                <Col span={22}>
                    <h1 className={cx('title')}>Bảng dữ liệu</h1>
                </Col>
                <Col span={2}>
                    <Button
                        type="primary"
                        className={cx('button-title')}
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

                        <Form.Item
                            {...formItemLayout}
                            name="name"
                            label="Cụm rạp"
                            rules={[{ required: true, message: 'Vui lòng nhập cụm rạp' }]}
                        >
                            <Input placeholder="Nhập cụm rạp" />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại' },
                                { pattern: /^[0-9]+$/, message: 'Số điện thoại chỉ được nhập số' },
                            ]}
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="openingTime"
                            label="Giờ bắt đầu"
                            rules={[
                                { required: true, message: 'Vui lòng nhập' },
                                () => ({
                                    validator(_, value) {
                                        const startTime = value.format('HH:mm:ss');
                                        const endTime = form.getFieldValue('closingTime')?.format('HH:mm:ss');

                                        if (endTime && startTime >= endTime) {
                                            return Promise.reject('Giờ kết thúc phải sau giờ bắt đầu');
                                        }

                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >

                            <TimePicker value={openingTime} onChange={onChangeStartTime} defaultOpenValue={dayjs('00:00', 'HH:mm')} />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="closingTime"
                            label="Giờ kết thúc"
                            rules={[
                                { required: true, message: 'Vui lòng nhập' },
                                () => ({
                                    validator(_, value) {
                                        const startTime = form.getFieldValue('openingTime')?.format('HH:mm:ss');
                                        const endTime = value.format('HH:mm:ss');

                                        if (startTime && startTime >= endTime) {
                                            return Promise.reject('Giờ kết thúc phải sau giờ bắt đầu');
                                        }

                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >

                            <TimePicker value={closingTime} onChange={onChangeEndTime} defaultOpenValue={dayjs('00:00', 'HH:mm')} />

                        </Form.Item>
                        <Row gutter={10} style={{ paddingLeft: 10 }}>
                            <Col span={22}>
                                <Form.Item
                                    {...formItemLayout}
                                    name="province"
                                    label="Thuộc tỉnh"
                                    rules={[{ required: true, message: 'Vui lòng chọn tỉnh' }]}
                                >
                                    <Select
                                        style={{ width: '100%' }}
                                        showSearch
                                        placeholder="Chọn tỉnh"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={[
                                            {
                                                value: editData?.province?.id,
                                                label: editData?.province?.name,
                                            },
                                            ...province.map((namepr) => ({
                                                value: namepr.id,
                                                label: namepr.name,
                                                name: namepr.name, // Thêm thuộc tính name vào option
                                            })),
                                        ]}
                                        allowClear
                                        onChange={(value, option) => {
                                            setSelectedProvince(option?.label || ''); // Lấy giá trị của thuộc tính name
                                            // Có thể thêm logic hiển thị vị trí trên MapboxCcx ở đây
                                        }}
                                    />

                                </Form.Item>
                            </Col>
                            <Col span={2}>
                                <Button onClick={() => {
                                    openProvinceModal();
                                    // cinemabyCinemaComplex(record); 
                                }}>+</Button>
                            </Col>
                        </Row>

                        <Form.Item
                            {...formItemLayout}
                            name="cinemaChain"
                            label="Thuộc loại"
                            rules={[{ required: true, message: 'Vui lòng chọn loại rạp' }]}
                        >
                            <Select
                                style={{ width: '100%' }}
                                showSearch
                                placeholder="Chọn loại"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={[
                                    {
                                        value: editData?.cinemaChains?.id, // Sử dụng cinemaType từ record khi có
                                        label: editData?.cinemaChains?.name,
                                    },
                                    ...cinemaChains.map((namepr) => ({
                                        value: namepr.id,
                                        label: namepr.name,
                                    })),
                                ]}
                                allowClear
                            />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            // name="address"
                            // label="Địa chỉ"
                            rules={[{ required: true, message: 'Vui lòng nhập tỉnh' }]}
                        >
                            {/* <Input placeholder="Please input your name" /> */}
                            <MapboxCcx onPopupInfoChange={handlePopupInfoChange}
                                latitude={mapCinema.latitude} longitude={mapCinema.longitude}
                                province={selectedProvince}
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
                // dataSource={posts}Pagination = false 
                pagination={false}
                expandable={{ expandedRowRender }}
                dataSource={posts.map((post) => ({ ...post, key: post.id }))}

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
                open={isCinemaModalOpen}
                width={'80%'}
                title={'QUẢN LÝ PHÒNG CỦA RẠP'}
                onCancel={closeCinemaModal}

            >
                <AdminCinema cinemaComplexId={cinemaComplex} />
            </BaseModal>
            <Modal
                open={isProvinceModalOpen}
                width={'80%'}
                title={'QUẢN LÝ CÁC TỈNH'}
                onCancel={closeProvinceModal}
            >
                <AdminProvince></AdminProvince>
            </Modal>
        </>
    );
};

export default AdminCinemaComplex;
