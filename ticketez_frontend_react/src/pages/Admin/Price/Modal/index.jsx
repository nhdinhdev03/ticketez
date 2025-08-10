import React, { useState, useEffect } from 'react';
import { Card, Breadcrumb, Select, Col, Row, Button, Modal, DatePicker, Space, Tag } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import axiosClient from '~/api/global/axiosClient';
import { InputNumber } from 'antd';
import funcUtils from '~/utils/funcUtils';
import dayjs from 'dayjs';
import img, { listIcon } from '~/assets/img';

import { data } from 'autoprefixer';
const ModalPrice = (props) => {
    const { isEdit, record } = props;
    const [cinemaComplexDaTa, setCinemaComplexDaTa] = useState([]);
    const [movieData, setMovieData] = useState([]);
    // Dữ liệu chuỗi rạp chiếu
    const [cinemaChainDaTa, setCinemaChainDaTa] = useState([]);
    const [formatDaTa, setFormatDaTa] = useState([]);
    // Check xem showtime có trong price không mới được sửa
    // ẩn hiện chọn cụm rạp là phải check lúc bấm vào chuỗi rạp
    const [selectedCinemaChain, setSelectedCinemaChain] = useState(false);
    // Ẩn hiện foramtmovie
    const [selectedFormat, setSelectedFormat] = useState(false);
    // lưu dữ liệu showtime
    const [showtimeData, setShowtimeData] = useState([]);
    // Lưu dữ liệu seatType
    const [seatTypeData, setSeatTypeData] = useState([]);
    // lưu dữ liệu của các seatType theo cinemaComplex để bắt lỗi
    const [seatTypeByCinemaComplexData, setSeatTypeByCinemaComplexData] = useState([]);
    // Lưu dữ liệu format movie
    const [formatMovieData, setFormatMovieData] = useState([]);
    // Lưu id cinemaComplex
    const [cinemaComplexChoose, setCinemaComplexChoose] = useState(record ? record.price.cinemaComplex.id : null);
    const [movieChoose, setMovieChoose] = useState(record ? record.price.formatMovie.movie.id : null);
    //   lưu id formatMovie
    const [formatMovieChoose, setFormatMovieChoose] = useState(record ? record.price.formatMovie.id : null);
    //   Lưu ngày bắt đầu chọn
    const [startDateChoose, setStartDateChoose] = useState(record ? dayjs(record.price.startDate) : dayjs());
    //  Lưu ngày kết thúc chọn
    const [endDateChoose, setEndDateChoose] = useState(record ? dayjs(record.price.endDate) : dayjs());
    //    các seatType trong modal
    const [seatTypeOnModal, setSeatTypeOnModal] = useState([]);
    // lưu giá khi chọn

    const [newPriceSeatTypeDTOs, setNewPriceSeatTypeDTOs] = useState(
        props.record && props.record.newPriceSeatTypeDTOs ? props.record.newPriceSeatTypeDTOs : null,
    );

    useEffect(() => {
        console.log(newPriceSeatTypeDTOs);
    }, [newPriceSeatTypeDTOs]);

    // Trường hợp sửa giá ngày
    const onchangeDay = (seatTypeId, value) => {
        setNewPriceSeatTypeDTOs((prevState) => {
            const updatedState = [...prevState];
            const seatIndex = updatedState.findIndex((moment) => moment.seatType.id === seatTypeId);
            if (seatIndex !== -1) {
                updatedState[seatIndex].weekdayPrice = value;
            }
            return updatedState;
        });
    };

    // trường hợp sửa giá tháng

    const onchangeWeek = (seatTypeId, value) => {
        console.log(`onchangeWeek - Seat Type ID: ${seatTypeId}, New Value: ${value}`);
        setNewPriceSeatTypeDTOs((prevState) => {
            const updatedState = [...prevState];
            const seatIndex = updatedState.findIndex((moment) => moment.seatType.id === seatTypeId);
            if (seatIndex !== -1) {
                updatedState[seatIndex].weekendPrice = value;
            }
            return updatedState;
        });
    };
    // Trường hợp sửa giá mặc định

    const handelCreateSeatType = () => {
        // Bắt lỗi khi tạo giá cho loại ghế mà cinemacomplex đó nó không có loại ghế đó every là tất cả
        if (
            seatTypeByCinemaComplexData &&
            seatTypeByCinemaComplexData.every((seatType) => seatType.id !== seatTypeOnModal)
        ) {
            console.log(seatTypeByCinemaComplexData);
            setShowInfo('errorNoLikeSeatType');
            showModal(true);
            return;
        }

        // Bắt lỗi ghế đã có rồi mà chọn thêm nữa some là ít nhất
        const seatTypes = newPriceSeatTypeDTOs ? newPriceSeatTypeDTOs.map((item) => item.seatType) : null;
        if (seatTypes && seatTypes.some((seatType) => seatTypeOnModal === seatType.id)) {
            setShowInfo('errorSeatTypeAlreadyExists');
            showModal(true);
            return;
        }
        const selectedSeatType = seatTypeData.find((seatType) => seatTypeOnModal === seatType.id);

        const newSeatType = {
            weekdayPrice: 90000,
            weekendPrice: 100000,
            seatType: selectedSeatType,
        };
        console.log(newSeatType);

        setNewPriceSeatTypeDTOs((prevState) => {
            // Kiểm tra xem prevState có tồn tại không
            const newState = prevState ? [...prevState, newSeatType] : [newSeatType];
            return newState;
        });
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        handelCreateSeatType();
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const fetchDataCinemaChain = async () => {
        try {
            const resp = await axiosClient.get(`cinemaChain/get/all`);
            // Lấy giá trị hàng và cột từ dữ liệu trả về từ API
            const dataCinemaChain = resp.data;
            setCinemaChainDaTa(dataCinemaChain);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDataCinemaComplex = async (idCinemaChain) => {
        try {
            const resp = await axiosClient.get(`cinemaComplex/bycimemaChain/${idCinemaChain}`);
            const dataCinemaComplex = resp.data;
            setCinemaComplexDaTa(dataCinemaComplex);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDataSeatTypeByCinemaComplex = async (idCinemaComplex) => {
        try {
            const resp = await axiosClient.get(
                `seatType/byCinemaComplexId/${idCinemaComplex ? idCinemaComplex : cinemaComplexChoose}`,
            );
            const dataSeatType = resp.data;

            setSeatTypeByCinemaComplexData(dataSeatType);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAllDataCinemaComplex = async () => {
        try {
            const resp = await axiosClient.get(`cinemaComplex/get/all`);
            const dataCinemaComplex = resp.data;
            setCinemaComplexDaTa(dataCinemaComplex);
        } catch (error) {
            console.error(error);
        }
    };
    const fetchDataSeatType = async () => {
        try {
            const resp = await axiosClient.get(`seatType/getAll`);
            const dataSeatType = resp.data;

            // Lọc ra các mục có id không phải 7, 8, 9
            const filteredSeatTypeData = dataSeatType.filter((seatType) => ![7, 8, 9].includes(seatType.id));

            setSeatTypeData(filteredSeatTypeData);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDataMovie = async () => {
        try {
            const resp = await axiosClient.get(`movie/get/all`);
            const dataMovie = resp.data;
            setMovieData(dataMovie);
        } catch (error) {
            console.error(error);
        }
    };
    const fetchDataFormat = async () => {
        try {
            const resp = await axiosClient.get(`format/get/all`);
            // Lấy giá trị hàng và cột từ dữ liệu trả về từ API
            const dataFormat = resp.data;
            setFormatDaTa(dataFormat);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDataFormatMovie = async (formatId) => {
        try {
            const resp = await axiosClient.get(`formatMovie/by-formatId/${formatId}`);
            const dataFormatMovie = resp.data;
            setFormatMovieData(dataFormatMovie);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAllDataFormatMovie = async () => {
        try {
            const resp = await axiosClient.get(`formatMovie`);
            const dataFormatMovie = resp.data;
            setFormatMovieData(dataFormatMovie);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDataShowtime = async () => {
        try {
            const resp = await axiosClient.get(`showtime/by-id-price/${record.price.id}`);
            const dataShowtime = resp.data;
            setShowtimeData(dataShowtime);
        } catch (error) {
            console.error(error);
        }
    };

    const optionsCinemaChain = cinemaChainDaTa.map((cinemaChain) => ({
        value: cinemaChain.id,
        label: cinemaChain.name,
    }));

    const optionsFormat = formatDaTa.map((format) => ({
        value: format.id,
        label: format.name,
    }));
    const options = cinemaComplexDaTa.map((cinema) => ({
        value: cinema.id,
        label: cinema.name,
    }));

    const optionsMovieSelect = movieData.map((movie) => ({
        value: movie.id,
        label: movie.title,
    }));

    const optionsSeatTypeSelect = seatTypeData.map((seatType) => ({
        value: seatType.id,
        label: seatType.name,
        color: seatType.color,
    }));

    const optionFormatMovieSelect = formatMovieData.map((formatMovie) => ({
        value: formatMovie.id,
        label: formatMovie.format.name + ' ' + formatMovie.movie.title,
    }));

    // useEffect(() => {
    //     fetchDataCinemaChain();
    //     fetchDataFormat();
    //     fetchAllDataCinemaComplex();
    //     fetchDataSeatType();
    //     fetchDataMovie();
    //     fetchAllDataFormatMovie();
    //     fetchDataShowtime();
    //     fetchDataSeatTypeByCinemaComplex();
    // }, [record]);

    const [isTableLoaded, setIsTableLoaded] = useState(false);

    useEffect(() => {
        setIsTableLoaded(false);
        const fetchData = async () => {
            // Sử dụng Promise.all để đợi tất cả các promise hoàn thành
            await Promise.all([
                fetchDataCinemaChain(),
                fetchDataFormat(),
                fetchAllDataCinemaComplex(),
                fetchDataSeatType(),
                fetchDataMovie(),
                fetchAllDataFormatMovie(),
                fetchDataShowtime(),
                fetchDataSeatTypeByCinemaComplex(),
            ]);

            // Tất cả các promise đã hoàn thành, set setIsTableLoaded(true)
            setIsTableLoaded(true);
        };

        fetchData();
    }, [record]);

    const onChangeCinemaChain = (value) => {
        fetchDataCinemaComplex(value);
        setSelectedCinemaChain(true);
        console.log(`selected ${value}`);
    };
    const onSearchCinemaChain = (value) => {
        console.log('search:', value);
    };
    const onChangeFormat = (value) => {
        fetchDataFormatMovie(value);
        setSelectedFormat(true);
        console.log(`selected ${value}`);
    };
    const onSearchFormat = (value) => {
        console.log('search:', value);
    };

    const onSearchCinemaComplex = (value) => {};

    const onChangeCinemaComplex = (value) => {
        setCinemaComplexChoose(value);
        fetchDataSeatTypeByCinemaComplex(value);
    };
    const onSearchMovie = (value) => {};

    const onChangeMovie = (value) => {
        setMovieChoose(value);
    };

    const onSearchFormatMovie = (value) => {};

    const onChangeFormatMovie = (value) => {
        setFormatMovieChoose(value);
    };
    const onSearchSeatType = (value) => {};

    const onChangeSeatType = (value) => {
        setSeatTypeOnModal(value);
    };
    const onChangeStartDate = (date, dateString) => {
        if (date === null) {
            return;
        }
        const formattedDate = date.format('YYYY-MM-DD');

        setStartDateChoose(date);
    };
    const onChangeEndDate = (date, dateString) => {
        if (date === null) {
            return;
        }
        const formattedDate = date.format('YYYY-MM-DD');

        setEndDateChoose(date);
    };

    const disabledStartDate = (current) => {
        if (endDateChoose && current.isAfter(endDateChoose)) {
            return true;
        }
        return false;
    };

    const disabledEndDate = (current) => {
        if (startDateChoose && current.isBefore(startDateChoose)) {
            return true;
        }
        return false;
    };
    const validate = () => {
        if (cinemaComplexChoose === null) {
            setShowInfo('errorCinemaComplex');
            return false;
        }
        if (formatMovieChoose === null) {
            setShowInfo('errorFormat');
            return false;
        }
    };
    const [showInfo, setShowInfo] = useState('');
    useEffect(() => {
        if (showInfo === 'success') {
            funcUtils.notify('Sửa thành công dữ liệu trong bảng', 'success');
            setShowInfo('es');
        }
        if (showInfo === 'errorFormat') {
            funcUtils.notify('Vui lòng chọn loại phim', 'error');
            setShowInfo('es');
        }
        if (showInfo === 'errorCinemaComplex') {
            funcUtils.notify('Vui lòng chọn cụm rạp', 'error');
            setShowInfo('es');
        }
        if (showInfo === 'errorEdit') {
            funcUtils.notify('Do tiền này nằm trong suất chiếu nên không thể sửa đổi !', 'error');
            setShowInfo('es');
        }
        if (showInfo === 'errorNoLikeSeatType') {
            funcUtils.notify('Ghế này không tồn tại trong rạp !', 'error');
            setShowInfo('es');
        }
        if (showInfo === 'errorSeatTypeAlreadyExists') {
            funcUtils.notify('Ghế này đã tồn tại trong giá !', 'error');
            setShowInfo('es');
        }
    }, [showInfo]);

    const handelCreateAndUpdate = async () => {
        if (validate() === false) {
            return;
        }
        setIsTableLoaded(false);
        const dataPrice = {
            id: record && record.price ? record.price.id : 0,

            startDate: startDateChoose.format('YYYY-MM-DD'),
            endDate: endDateChoose.format('YYYY-MM-DD'),
            status: true,
            formatMovie: {
                id: formatMovieChoose,
            },
            cinemaComplex: {
                id: cinemaComplexChoose,
            },
        };
        if (isEdit) {
            console.log(dataPrice);
            try {
                const resp = await axiosClient.put(`price/${dataPrice.id}`, dataPrice);
                console.log(resp);
            } catch (error) {
                console.log(error);
                return;
            }
            // // xóa cái cũ
            const listDataIDPriceSeatType = newPriceSeatTypeDTOs.map((priceSeatType) =>
                priceSeatType.id ? priceSeatType.id : 0,
            );
            console.log(newPriceSeatTypeDTOs);
            // // Xóa ghế cũ
            try {
                const resp = await axiosClient.post(`price_seat_type/deleteMultiple`, listDataIDPriceSeatType);
                console.log(resp);
            } catch (error) {
                console.log(error.response);
                return;
            }
            // Thêm(cập nhật) ghế mới
            const PriceSeatType = newPriceSeatTypeDTOs.map((priceSeatType) => ({
                weekdayPrice: priceSeatType.weekdayPrice,
                weekendPrice: priceSeatType.weekendPrice,
                seatType: priceSeatType.seatType,
                price: record.price,
            }));

            // console.log(PriceSeatType);
            try {
                const resp = await axiosClient.post(`price_seat_type`, PriceSeatType);
                console.log(resp);
            } catch (error) {
                console.log(error.response);
                return;
            }

            // Xóa giá cũ
        } else {
            let respPrice;
            try {
                respPrice = await axiosClient.post(`price`, dataPrice);
                console.log(respPrice);
            } catch (error) {
                console.log(error);
                return;
            }
            console.log(respPrice);
            const PriceSeatType = newPriceSeatTypeDTOs.map((priceSeatType) => ({
                weekdayPrice: priceSeatType.weekdayPrice,
                weekendPrice: priceSeatType.weekendPrice,
                seatType: priceSeatType.seatType,
                price: {
                    id: respPrice.data.id,
                },
            }));

            console.log(PriceSeatType);
            try {
                const resp = await axiosClient.post(`price_seat_type`, PriceSeatType);
                console.log(resp);
            } catch (error) {
                console.log(error.response);
                return;
            }
        }
        setIsTableLoaded(true);
        setShowInfo('success');
    };

    // Sửa giá
    const [isFirstRowVisible, setIsFirstRowVisible] = useState(record ? true : false);

    const editPrice = () => {
        if (showtimeData.length > 0) {
            setShowInfo('errorEdit');
            return;
        }
        setIsFirstRowVisible(!isFirstRowVisible);
        //   const currentTime = dayjs();
        // showtimeData.forEach((showtimeData) => {
        //     const isAfterStartTime = currentTime.isAfter(dayjs(showtimeData.startTime));
        //     const isBeforeEndTime = currentTime.isBefore(dayjs(showtimeData.endTime));

        //     if (isAfterStartTime && isBeforeEndTime) {
        //       setShowInfo('errorEdit');
        //       return;
        //     }
        //   });
    };
    return (
        <>
            {isTableLoaded && (
                <Row>
                    <Col span={24}>
                        <p className="tw-font-medium tw-mb-3">Chọn chuỗi rạp :</p>
                        <Select
                        
                            className="tw-w-96"
                            showSearch
                            defaultValue={record ? record.price.cinemaComplex.cinemaChain.id : null}
                            placeholder="Chọn chuỗi rạp"
                            optionFilterProp="children"
                            onChange={onChangeCinemaChain}
                            onSearch={onSearchCinemaChain}
                            filterOption={(input, option) =>
                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            disabled={isFirstRowVisible === true}
                            options={optionsCinemaChain}
                        />
                    </Col>
                    <Col span={24}>
                        <p className="tw-font-medium tw-mb-2">Chọn cụm rạp :</p>
                        <Select
                           className="tw-w-96"
                            showSearch
                            placeholder="Chọn cụm rạp"
                            optionFilterProp="children"
                            onChange={onChangeCinemaComplex}
                            onSearch={onSearchCinemaComplex}
                            filterOption={(input, option) =>
                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            options={options}
                            value={cinemaComplexChoose ? cinemaComplexChoose : null}
                            disabled={isFirstRowVisible === true || selectedCinemaChain === false}
                        />
                    </Col>
                    <Col span={24}>
                        <p className="tw-font-medium tw-mb-3">Phân loại phim :</p>
                        <Select
                            defaultValue={record ? record.price.formatMovie.format.id : null}
                            className="tw-w-96"
                            showSearch
                            placeholder="Chọn phân loại phim"
                            optionFilterProp="children"
                            onChange={onChangeFormat}
                            onSearch={onSearchFormat}
                            filterOption={(input, option) =>
                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            disabled={isFirstRowVisible === true}
                            options={optionsFormat}
                        />
                    </Col>
                    <Col span={24}>
                        <p className="tw-font-medium tw-mb-2">Chọn loại phim :</p>
                        <Select
                         className="tw-w-96"
                            showSearch
                            placeholder="Chọn loại phim"
                            optionFilterProp="children"
                            onChange={onChangeFormatMovie}
                            onSearch={onSearchFormatMovie}
                            filterOption={(input, option) =>
                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            options={optionFormatMovieSelect}
                            value={formatMovieChoose ? formatMovieChoose : null}
                            disabled={isFirstRowVisible === true || selectedFormat === false}
                        />
                    </Col>
                    {/* <Col span={24}>
                    <p className="tw-font-medium tw-mb-2">Chọn phim :</p>
                    <Select
                        className="tw-width-100"
                        showSearch
                        placeholder="Chọn cụm rạp"
                        optionFilterProp="children"
                        onChange={onChangeMovie}
                        onSearch={onSearchMovie}
                        filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        options={optionsMovieSelect}
                        defaultValue={record ? record.price.formatMovie.movie.id : null}
                    />
                </Col> */}
                    <Col span={24} className="tw-mb-5">
                        <Row>
                            <Col span={12}>
                                <p className="tw-font-medium tw-mb-2">Ngày bắt đầu :</p>
                                <DatePicker
                                    defaultValue={record ? dayjs(record.price.startDate) : dayjs()}
                                    onChange={onChangeStartDate}
                                    locale="vi"
                                    disabledDate={disabledStartDate}
                                    disabled={isFirstRowVisible === true}
                                />
                            </Col>
                            <Col span={12}>
                                <p className="tw-font-medium tw-mb-2">Ngày kết thúc :</p>
                                <DatePicker
                                    defaultValue={record ? dayjs(record.price.endDate) : dayjs()}
                                    onChange={onChangeEndDate}
                                    locale="vi"
                                    disabledDate={disabledEndDate}
                                    disabled={isFirstRowVisible === true}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <hr />
                        <Row>
                            <Col span={16} className="tw-mt-8"></Col>
                            {record && (
                                <a
                                    onClick={editPrice}
                                    className="tw-mt-8 tw-mb-8 tw-ms-16 tw-py-2 tw-px-4 tw-bg-blue-500 tw-text-white tw-rounded-md tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-blue-600"
                                    type="primary"
                                >
                                    Sửa giá
                                </a>
                            )}
                        </Row>
                        <Row></Row>
                        {isFirstRowVisible && (
                            <Row>
                                <div className="tw-overflow-x-auto">
                                    <table className="tw-min-w-full ">
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #ccc' }}>
                                                <th className="tw-py-2 tw-px-4 ">Loại ghế</th>
                                                <th className="tw-py-2 tw-px-4 ">Giá trong tuần ( t2 → t5)</th>
                                                <th className="tw-py-2 tw-px-4 ">Giá cuối tuần (t6 → Chủ nhật)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {record &&
                                                record.newPriceSeatTypeDTOs &&
                                                record.newPriceSeatTypeDTOs.map((moment, index) => (
                                                    <tr key={index} style={{ borderBottom: '1px solid #ccc' }}>
                                                        <td
                                                            className="tw-pl-20 tw-py-2 tw-px-4"
                                                            style={{
                                                                borderRight: '1px solid #ccc',
                                                                paddingRight: '8px',
                                                            }}
                                                        >
                                                            <Tag color={moment.seatType.color}>
                                                                {moment.seatType.name}
                                                            </Tag>
                                                        </td>
                                                        <td
                                                            className="tw-pl-20 tw-py-2 tw-px-4"
                                                            style={{
                                                                borderRight: '1px solid #ccc',
                                                                paddingRight: '8px',
                                                            }}
                                                        >
                                                            {new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            }).format(moment.weekdayPrice)}
                                                        </td>
                                                        <td
                                                            className="tw-pl-20 tw-py-2 tw-px-4"
                                                            style={{ paddingRight: '8px' }}
                                                        >
                                                            {new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            }).format(moment.weekendPrice)}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Row>
                        )}
                        {!isFirstRowVisible && (
                            <Row>
                                <div className="tw-overflow-x-auto">
                                    <table className="tw-min-w-full ">
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #ccc' }}>
                                                <th className="tw-py-2 tw-px-4 ">Loại ghế</th>
                                                <th className="tw-py-2 tw-px-4 ">Giá trong tuần ( t2 → t5)</th>
                                                <th className="tw-py-2 tw-px-4 ">Giá cuối tuần (t6 → Chủ nhật)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newPriceSeatTypeDTOs &&
                                                newPriceSeatTypeDTOs.map((moment, index) => (
                                                    <tr key={index} style={{ borderBottom: '1px solid #ccc' }}>
                                                        <td
                                                            className="tw-pl-20 tw-py-2 tw-px-4"
                                                            style={{
                                                                borderRight: '1px solid #ccc',
                                                                paddingRight: '8px',
                                                            }}
                                                        >
                                                            <Tag color={moment.seatType.color}>
                                                                {moment.seatType.name}
                                                            </Tag>
                                                        </td>
                                                        <td
                                                            className="tw-pl-20 tw-py-2 tw-px-4"
                                                            style={{
                                                                borderRight: '1px solid #ccc',
                                                                paddingRight: '8px',
                                                            }}
                                                        >
                                                            <InputNumber
                                                                min={1}
                                                                max={1000000}
                                                                onChange={(value) =>
                                                                    onchangeDay(moment.seatType.id, value)
                                                                }
                                                                value={moment.weekdayPrice} // Assuming moment.weekendPrice is a numeric value
                                                                formatter={(value) =>
                                                                    new Intl.NumberFormat('vi-VN', {
                                                                        style: 'currency',
                                                                        currency: 'VND',
                                                                    }).format(value)
                                                                }
                                                                parser={(value) => Number(value.replace(/[^\d.]/g, ''))} // Optional: Parse the formatted value back to a number
                                                            />
                                                        </td>
                                                        <td
                                                            className="tw-pl-20 tw-py-2 tw-px-4"
                                                            style={{ paddingRight: '8px' }}
                                                        >
                                                            <InputNumber
                                                                min={1}
                                                                max={1000000}
                                                                onChange={(value) =>
                                                                    onchangeWeek(moment.seatType.id, value)
                                                                }
                                                                value={moment.weekendPrice}
                                                                formatter={(value) =>
                                                                    new Intl.NumberFormat('vi-VN', {
                                                                        style: 'currency',
                                                                        currency: 'VND',
                                                                    }).format(value)
                                                                }
                                                                parser={(value) => Number(value.replace(/[^\d.]/g, ''))}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Button
                                    style={{ marginTop: '20px', marginLeft: '200px' }}
                                    icon={<PlusOutlined />}
                                    type="dashed"
                                    onClick={showModal}
                                >
                                    Thêm ghế
                                </Button>

                                <Modal title="Chọn loại ghế" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                    <Select
                                        className="tw-width-100"
                                        showSearch
                                        placeholder="Chọn loại ghế"
                                        optionFilterProp="children"
                                        onChange={onChangeSeatType}
                                        onSearch={onSearchSeatType}
                                        // defaultValue={1}
                                    >
                                        {optionsSeatTypeSelect.map((option) => (
                                            <Select.Option
                                                key={option.value}
                                                value={option.value}
                                                style={{ color: option.color }}
                                            >
                                                {option.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Modal>
                            </Row>
                        )}
                    </Col>

                    <Col span={24}>
                        <Button
                            onClick={handelCreateAndUpdate}
                            className={`tw-mt-5 ${
                                isFirstRowVisible === true ? 'tw-cursor-not-allowed tw-opacity-50' : 'tw-type-primary'
                            }`}
                            type="primary"
                            disabled={isFirstRowVisible === true}
                        >
                            {isEdit ? 'Cập nhât' : 'Thêm'}
                        </Button>
                    </Col>
                </Row>
            )}{' '}
            {!isTableLoaded && (
                <div className="tw-text-white tw-text-2xl">
                    <img src={img.loading} />
                </div>
            )}
        </>
    );
};

export default ModalPrice;
