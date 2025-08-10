import MySelect from '~/components/Admin/SelectSeach';
import classNames from 'classnames/bind';
import style from './Seat.module.scss';
import { useState, useEffect } from 'react';
import SeatChart from '~/pages/Admin/Seat/SeatChart';
import { Card, Breadcrumb, Select, Col, Row, Button, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, HomeOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import BaseApi from '~/api/global/baseApi';
import axiosClient from '~/api/global/axiosClient';
import SeatGenerator from './SeatGenerator';


const cx = classNames.bind(style);

function AdminSeat() {
    
    // Dữ liệu chuỗi rạp chiếu
    const [cinemaChainDaTa, setCinemaChainDaTa] = useState([]);
    // Dữ liệu cụm rạp
    const [cinemaComplexDaTa, setCinemaComplexDaTa] = useState([]);
    // Dữ liệu rạp
    const [cinemaDaTa, setCinemaDaTa] = useState([]);
    // Dữ liệu bảng đồ
    const [seatChartDaTa, setSeatChartDaTa] = useState([]);
    // Dữ liệu xuất chiếu
    const [showTimeBySeatChartID, setShowTimeBySeatChartID] = useState([]);
    // Dữ liệu booking
    const [bookingData, setBookingData] = useState([]);
    // Dữ liệu seatBooking
    const [seatBookingData, setSeatBookingData] = useState([]);
    const [row, setRow] = useState();
    const [col, setCol] = useState();
    const [idSeatChart, setIdSeatChart] = useState();
    // Dữ liệu tên ghế đã đặt
    const [nameSeat, setNameSeat] = useState([]);

    // ẩn hiện chọn cụm rạp là phải check lúc bấm vào chuỗi rạp
    const [selectedCinemaChain, setSelectedCinemaChain] = useState(false);
    // ẩn hiện chọn rạp là phải check lúc bấm vào cụm rạp
    const [selectedCinemaComplex, setSelectedCinemaComplex] = useState(false);
    // Ẩn hiện sơ đồ là phải check lúc bấm vào rập
    const [selectedOptionCinema, setSelectedOptionCinema] = useState(false);

    // Ẩn hiên xuất chiếu là phải check lúc chọn vào biểu đồ
    const [selectedOption, setSelectedOption] = useState(false);
    // ẩn hiện ghế là phải chọn xuất chiếu
    const [selectedOptionShowTime, setSelectedOptionShowTime] = useState(false);

    // Sử dụng một biến state để theo dõi sự thay đổi của row và col
    const [seatChartDataChanged, setSeatChartDataChanged] = useState(false);

    // MOdal setting
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        fetchDataSeatChart(idCinema);
        setSelectedOptionCinema(false);
        setSelectedOption(false);
        setSelectedOptionShowTime(false);
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        fetchDataSeatChart(idCinema);
        setSelectedOptionCinema(false);
        setSelectedOption(false);
        setSelectedOptionShowTime(false);
        setIsModalOpen(false);
    };

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
            console.log(dataCinema);
            setCinemaDaTa(dataCinema);
            setSelectedCinemaComplex(true);
        } catch (error) {
            console.error(error);
        }
    };
    // Lấy sơ đồ

    const fetchDataSeatChart = async (idCInema) => {
        try {
            const resp = await axiosClient.get(`seatchart/by-cinema/${idCInema}`);
            // Lấy giá trị hàng và cột từ dữ liệu trả về từ API
            const dataSeatChart = resp.data;
            console.log(dataSeatChart);
            setSeatChartDaTa(dataSeatChart);
            setSelectedOptionCinema(true);
        } catch (error) {
            console.error(error);
        }
    };

    // Lấy xuất chiếu

    const fetchDataShowTimeBySeatChart = async (value) => {
        try {
            const resp = await axiosClient.get(`showtime/get-showtime-by-seatchart/${value}`);
            // Lấy giá trị hàng và cột từ dữ liệu trả về từ API
            const dataChildSeatChart = resp.data;
            setShowTimeBySeatChartID(dataChildSeatChart);

            setSelectedOption(true);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDataBooking = async (value) => {
        setSeatBookingData([]);
        console.log(value);
        try {
            const resp = await axiosClient.get(`booking/by-show-time/${value}`);
            const data = resp.data;
            data.forEach((element) => {
                console.log(element.id);
                fetchDataSeatBooking(element.id);
            });

            setBookingData(data);
            setSelectedOption(true);

            console.log(seatBookingData);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDataSeatBooking = async (value) => {
        try {
            const resp = await axiosClient.get(`seatBooking/name-seat/${value}`);
            const data = resp.data;
            console.log(data);
            data.forEach((newItem) => {
                // Kiểm tra xem newItem đã tồn tại trong mảng hay chưa
                if (!seatBookingData.includes(newItem)) {
                    // Nếu chưa tồn tại, thì thêm vào mảng
                    setSeatBookingData((prev) => [...prev, newItem]);
                }
            });

            setSelectedOption(true);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDataSeat = async (value) => {
        try {
            const resp = await axiosClient.get(`seatchart/${value}`);
            // Lấy giá trị hàng và cột từ dữ liệu trả về từ API
            const rowData = resp.data.rows;
            const colData = resp.data.columns;
            setIdSeatChart(resp.data.id);
            setRow(rowData);
            setCol(colData);
            setSelectedOptionShowTime(false);
            setSelectedOptionShowTime(true);

            console.log(`Rows: ${rowData}, Columns: ${colData}`);
        } catch (error) {
            console.error(error);
        }
    };
    // Gọi lại ghế khi có thay đổi để cập nhật lại ghế
    useEffect(() => {
        setSeatChartDataChanged(!seatChartDataChanged);
    }, [row, col, seatBookingData, idSeatChart]);

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
        setSelectedOption(false);
        setSelectedOptionShowTime(false);

        console.log(`selected ${value}`);
    };
    const onSearchCinemaChain = (value) => {
        console.log('search:', value);
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
        setSelectedOption(false);
        setSelectedOptionShowTime(false);
    };
    const onSearchCinemaComplex = (value) => {
        console.log('search:', value);
    };

    // Rạp-----------------------------------------------------

    const optionsCinema = cinemaDaTa.map((cinema) => ({
        value: cinema.id,
        label: cinema.name,
    }));

    const [idCinema, setIdCinema] = useState('');
    const onChangeCinema = (value) => {
        setIdCinema(value);
        fetchDataSeatChart(value);
        setSelectedOptionCinema(false);
        setSelectedOption(false);
        setSelectedOptionShowTime(false);
    };
    const onSearchCinema = (value) => {
        console.log('search:', value);
    };

    // Xuất chiếu-------------------------------------------

    const optionsChildShowTime = showTimeBySeatChartID.map((showTime) => ({
        value: showTime.id,
        label: showTime.startTime + showTime.endTime,
    }));
    // Booking---------------------------------------------------

    // hành động khi chọn xuất chiếu
    const onChangeShowTime = (value) => {
        console.log(`selected ${value}`);
        fetchDataBooking(value);
        // fetchDataSeat(value);
    };
    // sơ đồ rạp-----------------------------------------------------------------------

    const optionsSeatchart = seatChartDaTa.map((seatChart) => ({
        value: seatChart.id,
        label: seatChart.name,
    }));

    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    // useEffect(() => {
    //     if (row !== undefined && col !== undefined && selectedOption) {
    //         setSelectedOption('2222');
    //         console.log("----------------------------------------------------------------");
    //     }
    // }, [row, col, selectedOption]);

    // hành động khi chọn sơ đồ
    const onChange = (value) => {
        setSeatBookingData([]);
        fetchDataSeat(value);
        fetchDataShowTimeBySeatChart(value);

        setSelectedOption(false);

        console.log(`selected ${value}`);
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    return (
        <>
            <Row className={cx('container')} style={{ width: '100%' }}>
                <Col style={{ backgroundColor: 'transparent' }} className={cx('col-first')} span={8}>
                    <Card className={cx('card')} title="Ghế" bordered={true} style={{ width: 300 }}>
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
                                <p className="tw-font-medium tw-mb-3">Chọn rạp :</p>
                                <Select
                                    className={cx('select')}
                                    showSearch
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
                                <div className="tw-flex tw-items-center tw-mb-4">
                                    <p className="tw-font-medium tw-mb-3 tw-mr-4">Chọn sơ đồ :</p>
                                    <Button
                                        className="tw-ms-6"
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={showModal}
                                    >
                                        Thêm sơ đồ
                                    </Button>
                                </div>

                                <Modal
                                    title="Thêm sơ đồ rạp"
                                    open={isModalOpen}
                                    onOk={handleOk}
                                    onCancel={handleCancel}
                                    width={1000}
                                    footer={null}
                                >
                                    <div className={cx('modal-content')}>
                                        <SeatGenerator record ={cinemaDaTa} iD={idCinema}/>
                                    </div>
                                </Modal>

                                <Select
                                    className={cx('select')}
                                    showSearch
                                    placeholder="Chọn sơ đồ rạp"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onSearch={onSearch}
                                    filterOption={filterOption}
                                    options={optionsSeatchart}
                                />
                            </>
                        )}

                        {selectedOption && (
                            <>
                                <p className="tw-font-medium tw-mb-3">Chọn xuất chiếu :</p>
                                <Select
                                    className={cx('select')}
                                    showSearch
                                    placeholder="Chọn suất chiếu"
                                    optionFilterProp="children"
                                    onChange={onChangeShowTime}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    options={optionsChildShowTime}
                                />
                            </>
                        )}
                    </Card>
                </Col>
                <Col span={16}>
                    {selectedOptionShowTime && (
                        <SeatChart
                            rows={row}
                            columns={col}
                            nameSeat={seatBookingData}
                            idSeatChart={idSeatChart}
                            key={seatChartDataChanged}
                        />
                    )}
                </Col>
            </Row>
        </>
    );
}

export default AdminSeat;
