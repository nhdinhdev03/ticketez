import React from 'react';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import SeatChart from '~/pages/Admin/Seat/SeatChart';
import { Card, Breadcrumb, Select, Col, Row, Button, Modal, InputNumber, Input } from 'antd';
import { SearchOutlined, PlusOutlined, HomeOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import BaseApi from '~/api/global/baseApi';
import axiosClient from '~/api/global/axiosClient';
import style from '../Seat.module.scss';
import funcUtils from '~/utils/funcUtils';
import FirstSeat from '../FirstSeat';
import img, { listIcon } from '~/assets/img';

const cx = classNames.bind(style);

export default function SeatGenerator(props) {
    const { record, iD } = props;

    const [isTableLoaded, setIsTableLoaded] = useState(true);
    // Dữ liệu chuỗi rạp chiếu
    const [cinemaChainDaTa, setCinemaChainDaTa] = useState([]);
    // Dữ liệu cụm rạp
    const [cinemaComplexDaTa, setCinemaComplexDaTa] = useState([]);
    // Dữ liệu rạp
    const [cinemaDaTa, setCinemaDaTa] = useState(record ? record : null);
    // Lưu id rạp
    const [idCinema, setIdCinema] = useState();
    // Lưu id seatChart
    const [idSeatChart, setIdSeatChart] = useState();
    const [inputValue, setInputValue] = useState('');
    const [showInfo, setShowInfo] = useState('');

    const [row, setRow] = useState(5);
    const [col, setCol] = useState(5);
    // ẩn hiện chọn cụm rạp là phải check lúc bấm vào chuỗi rạp
    const [selectedCinemaChain, setSelectedCinemaChain] = useState(false);
    // ẩn hiện chọn rạp là phải check lúc bấm vào cụm rạp
    const [selectedCinemaComplex, setSelectedCinemaComplex] = useState(record ? true : false);
    // Ẩn hiện sơ đồ là phải check lúc bấm vào rập
    const [selectedOptionCinema, setSelectedOptionCinema] = useState(record ? true : false);

    // Sử dụng một biến state để theo dõi sự thay đổi của row và col
    const [firstChartDataChanged, setFirstChartDataChanged] = useState(false);

    const [isInputDisabled, setIsInputDisabled] = useState(false);

    // Lấy dữ liệu chuỗi rạp
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

    // Lấy cụm rạp
    const fetchDataCinemaComplex = async (idCinemaChain) => {
        try {
            const resp = await axiosClient.get(`cinemaComplex/bycimemaChain/${idCinemaChain}`);
            // Lấy giá trị hàng và cột từ dữ liệu trả về từ API
            const dataCinemaComplex = resp.data;
            setCinemaComplexDaTa(dataCinemaComplex);
            setSelectedCinemaChain(true);
        } catch (error) {
            console.error(error);
        }
    };
    // Lấy rạp
    const fetchDataCinema = async (idCInemacomplex) => {
        try {
            const resp = await axiosClient.get(`cinema/by-cinema-complex/${idCInemacomplex}`);
            // Lấy giá trị hàng và cột từ dữ liệu trả về từ API
            const dataCinema = resp.data;
            setCinemaDaTa(dataCinema);
            setSelectedCinemaComplex(true);
        } catch (error) {
            console.error(error);
        }
    };

    const createSeatArray = () => {
        let seatRows = row; // Số hàng
        let seatColumns = col; // Số cột
        // Tạo mảng chú thích hàng ở bên trái dựa vào số hàng
        const rowLabels = Array.from({ length: seatRows }, (_, index) => String.fromCharCode(65 + index));
        const seatState = {
            seat: [],
            seatAvailable: [],
            seatReserved: [],
            vipSeat: [],
            normalSeat: [],
            seatUnavailable: [],
        };
        // Tạo mảng chỗ ngồi
        const rowHeader = rowLabels.map((label) => label + ' ');

        for (let i = 0; i < seatRows; i++) {
            const row = [];
            const rowAvailable = [];
            const rowLabel = rowLabels[i];
            for (let j = 1; j <= seatColumns; j++) {
                const seatNumber = `${rowLabel}${j}`;
                row.push(seatNumber);
                if (!seatState.seatUnavailable.includes(seatNumber)) {
                    rowAvailable.push(seatNumber);
                }
            }

            seatState.seat.push(row);
        }
        // Thêm cột chú thích hàng ở bên trái
        seatState.seatHeader = rowHeader;

        return seatState;
    };
    const [seatState, setSeatState] = useState(createSeatArray());


    // Thêm sơ đồ mới

    const postDataSeatChart = async () => {
        setIsTableLoaded(false);
     
        try {
            const data = {
                name: inputValue,
                rows: row,
                columns: col,
                status: true,
                cinema: {
                    id: record? iD: idCinema,
                },
            };

            const resp = await axiosClient.post(`seatchart`, data);
            setIdSeatChart(resp.data.id);
            // createSeatDB(resp.data.id);
            setShowInfo('success');
            setIsTableLoaded(true);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        if (showInfo === 'success') {
            funcUtils.notify('Thêm thành công sơ đồ', 'success');
        }
        if (showInfo === 'error') {
            funcUtils.notify('Thêm không thành công', 'error');
        }
        if (showInfo === 'errorInput') {
            funcUtils.notify('Thêm không thành công vui lòng nhập tên', 'error');
        }
    }, [showInfo]);

    useEffect(() => {
        fetchDataCinemaChain();
    }, []);

    useEffect(() => {
        setSeatState(createSeatArray());
        // createSeatArray();
        setFirstChartDataChanged(!firstChartDataChanged);
    }, [row, col, idSeatChart]);

    // Chuỗi rạp ----------------------------------------------------
    const optionsCinemaChain = cinemaChainDaTa.map((cinemaChain) => ({
        value: cinemaChain.id,
        label: cinemaChain.name,
    }));

    const onChangeCinemaChain = (value) => {
        fetchDataCinemaComplex(value);
        setSelectedCinemaChain(false);
        setSelectedCinemaComplex(false);
        setSelectedOptionCinema(false);
    };
    const onSearchCinemaChain = (value) => {
  
    };
    // Cụm rạp----------------------------------------------------------

    useEffect(() => {
        fetchDataCinemaChain();
    }, []);

    const options = cinemaComplexDaTa.map((cinema) => ({
        value: cinema.id,
        label: cinema.name,
    }));

    const onChangeCinemaComplex = (value) => {
        fetchDataCinema(value);
        setSelectedCinemaComplex(false);
        setSelectedOptionCinema(false);
    };
    const onSearchCinemaComplex = (value) => {
       
    };

    // Cinema

        const optionsCinema = cinemaDaTa? cinemaDaTa.map((cinema) => ({
            value: cinema.id,
            label: cinema.name,
        })) : null;

    const onChangeCinema = (value) => {
        setSelectedOptionCinema(true);
        setIdCinema(value);
     
    };
    const onSearchCinema = (value) => {
 
    };

    // input rows
    const onChangeRow = (value) => {
        setRow(value);
    
    };
    // Input cols

    const onChangeCol = (value) => {
        setCol(value);
       
    };

    // Input name sơ đồ
    const onChange = (e) => {
        setInputValue(e.target.value);
    };
    // Thêm sơ đồ

    const handelCreate = () => {
        if(inputValue === ''){
            setShowInfo('errorInput')
            return;
        }
        setIsInputDisabled(true);
        postDataSeatChart();
    };

    return (
        <>
            <Row className={cx('container')} style={{ width: '100%' }}>
                <Col style={{ backgroundColor: 'transparent' }} className={cx('col-first')} span={8}>
                    <Card className={cx('card')} title="chỗ nhập liệu" bordered={true} style={{ width: 300 }}>
                        {!record && (
                            <>
                                <p className="tw-font-medium tw-mb-3">Chọn chuỗi rạp :</p>
                                <Select
                                    className={cx('select')}
                                    showSearch
                                    placeholder="Chọn chuỗi rạp"
                                    optionFilterProp="children"
                                    onChange={onChangeCinemaChain}
                                    onSearch={onSearchCinemaChain}
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    options={optionsCinemaChain}
                                />
                            </>
                        )}

                        {selectedCinemaChain && (
                            <>
                                <p className="tw-font-medium tw-mb-3">Chọn cụm rạp :</p>
                                <Select
                                    className={cx('select')}
                                    showSearch
                                    placeholder="Chọn cụm rạp"
                                    optionFilterProp="children"
                                    onChange={onChangeCinemaComplex}
                                    onSearch={onSearchCinemaComplex}
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    options={options}
                                />
                            </>
                        )}
                        {selectedCinemaComplex && (
                            <>
                                <p>Chọn rạp:</p>
                                <Select
                                    className={cx('select')}
                                    showSearch
                                    value={iD ? iD : idCinema}
                                    placeholder="Chọn cụm rạp"
                                    optionFilterProp="children"
                                    onChange={onChangeCinema}
                                    onSearch={onSearchCinema}
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    options={optionsCinema}
                                />
                            </>
                        )}
                        {selectedOptionCinema && (
                            <>
                                <div className={cx('select')}>
                                    <p>Nhập số hàng ghế:</p>
                                    <InputNumber
                                        min={1}
                                        max={20}
                                        defaultValue={5}
                                        onChange={onChangeRow}
                                        disabled={isInputDisabled}
                                    />
                                </div>
                            </>
                        )}
                        {selectedOptionCinema && (
                            <>
                                <div className={cx('select')}>
                                    <p>Nhập số cột ghế:</p>
                                    <InputNumber
                                        min={1}
                                        max={20}
                                        defaultValue={5}
                                        onChange={onChangeCol}
                                        disabled={isInputDisabled}
                                    />
                                </div>
                            </>
                        )}

                        {selectedOptionCinema && (
                            <>
                                <div className={cx('select')} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <p>Nhập tên sơ đồ :</p>
                                    <Input showCount maxLength={20} onChange={onChange} />
                                </div>
                            </>
                        )}

                        {selectedOptionCinema && (
                            <>
                                <div className={cx('select')} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button type="primary" onClick={handelCreate}>
                                        Tạo sơ đồ
                                    </Button>
                                </div>
                            </>
                        )}
                    </Card>
                </Col>
                <Col span={16}>
                    {isTableLoaded && (
                        <Card>
                            <FirstSeat rows={row} columns={col} key={firstChartDataChanged} idSeatChart={idSeatChart} />
                        </Card>
                    )}

                    {!isTableLoaded && (
                        <div className="tw-text-white tw-text-2xl">
                            <img src={img.loading} />
                        </div>
                    )}
                </Col>
            </Row>
        </>
    );
}
