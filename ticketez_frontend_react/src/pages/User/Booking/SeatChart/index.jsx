import React, { useState, useEffect } from 'react';
import { Button, Modal, Divider, Space, Tag, Radio, Col, Row, Card } from 'antd';
import classNames from 'classnames/bind';
import style from '~/pages/Admin/Seat/SeatChart/SearChart.module.scss';
import '../SeatChart/chart.scss';
import axiosClient from '~/api/global/axiosClient';
import { ShoppingOutlined } from '@ant-design/icons';
import funcUtils from '~/utils/funcUtils';
import { BookingCombo, BookingDetail } from '../..';
import { sassFalse } from 'sass';
import img, { listIcon } from '~/assets/img';
import uploadApi from '~/api/service/uploadApi';
import authApi from '~/api/user/Security/authApi';
import priceSeatApi from '~/api/admin/managementSeat/priceApi';
import priceServiceApi from '~/api/admin/ManageCombosAndEvents/priceServiceApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(style);
function SeatChart(props) {
    const { showtime } = props;

    const [isModalOpenBooking, setIsModalOpenBooking] = useState(false);
    const showModal = () => {
        setIsModalOpenBooking(true);
    };
    const handleOk = () => {
        setIsModalOpenBooking(false);
    };
    const handleCancel = () => {
        console.log('seatChoose', seatChoose);
        deleteSeatChoose();
        setIsModalOpenBooking(false);
    };

    const [isModalOpenSeatType, setIsModalOpenSeatType] = useState(false);
    const showModalSeatType = () => {
        setIsModalOpenSeatType(true);
    };
    const handleOkSeatType = () => {
        setIsModalOpenSeatType(false);
    };
    const handleCancelSeatType = () => {
        setIsModalOpenSeatType(false);
    };
    const createSeatArray = () => {
        // console.log(allSeats);
        let seatRows = showtime.seatChart.rows; // Số hàng
        let seatColumns = showtime.seatChart.columns; // Số cột

        const rowLabels = Array.from({ length: seatRows }, (_, index) => String.fromCharCode(65 + index));
        const seatState = seatArray.seatType;
        // Tạo mảng chỗ ngồi
        const rowHeader = rowLabels.map((label) => label + ' ');
        var mangHaiChieu = new Array(seatRows);
        for (var i = 0; i < seatRows; i++) {
            mangHaiChieu[i] = new Array(seatColumns);
        }

        var index = 0;
        for (var i = 0; i < seatRows; i++) {
            for (var j = 0; j < seatColumns; j++) {
                if (index < allSeats.length) {
                    mangHaiChieu[i][j] = allSeats[index];
                    index++;
                }
            }
        }
        for (var i = 0; i < seatRows; i++) {
            const row = [];
            const rowAvailable = [];
            const rowLabel = rowLabels[i];
            for (let j = 0; j < seatColumns; j++) {
                const seatNumber = `${mangHaiChieu[i][j].name}`;
                row.push(seatNumber);
            }
            seatState.seat.push(row);
        }

        seatState.seatHeader = rowHeader;

        return seatState;
    };

    const [showSeat, setShowSeat] = useState(false);
    const [reload, setReload] = useState(false);
    const [allSeats, setAllSeats] = useState([]);
    const [seatState, setSeatState] = useState();
    // SeatChoose
    const [seatBookingData, setSeatBookingData] = useState([]);
    // seatBooking
    const [seatBookingData2, setSeatBookingData2] = useState([]);
    const [prices, setPrices] = useState([]);
    const [seatType, setSeatType] = useState();
    const [seatTypeBySeatChart, setSeatTypeBySeatChart] = useState([]);
    const [seatArray, setSeatArray] = useState({
        seatType: { seat: [] },
    });

    const getDataSeatArray = async () => {
        if (seatType) {
            // Tạo seatType
            const newObj = { ...seatArray };
            const newtest = { ...seatArray };
            // Tạo list ghế
            for (const seatTypeItem of seatType) {
                newObj.seatType[seatTypeItem.nickName] = [];
            }
            for (const seatTypeItem of seatType) {
                for (const seatItem of allSeats) {
                    if (seatTypeItem.id === seatItem.seatType.id) {
                        const respVip = await axiosClient.get(
                            `seat/by-seatchart-and-seattype/${showtime.seatChart.id}/${seatTypeItem.id}`,
                        );
                        const newVipSeats = respVip.data.map((seat) => seat.name);
                        for (const key in newObj.seatType) {
                            if (newObj.seatType.hasOwnProperty(key)) {
                                if (key === seatTypeItem.nickName) {
                                    newObj.seatType[key] = newVipSeats;
                                }
                            }
                        }
                    }
                }
            }
            setSeatArray(newObj);
        }
    };

    const fetchDaTaSeatType = async () => {
        const respAll = await axiosClient.get(`seatType/getAll`);
        setSeatType(respAll.data);
    };

    const fetchDaTaSeatTypeBySeatChart = async () => {
        const respAll = await axiosClient.get(`seatType/bySeatChart/${showtime.seatChart.id}`);
        setSeatTypeBySeatChart(respAll.data);
    };

    const fetchDataSeatChoose = async () => {
        try {
            const resp = await axiosClient.get(
                `seat-choose/find-seat-choose-by-seat-char-id-and-showtime-id/${showtime.seatChart.id}/${showtime.id}`,
            );
            const data = resp.data;
            if (data.length <= 0) {
                setSeatBookingData([]);
            }
            data.forEach((newItem) => {
                if (!seatBookingData.includes(newItem)) {
                    setSeatBookingData((prev) => [...prev, newItem]);
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDataSeatBooking = async () => {
        try {
            const resp = await axiosClient.get(
                `seatBooking/find-seat-booking-by-seat-char-id-and-showtime-id/${showtime.seatChart.id}/${showtime.id}`,
            );
            const data = resp.data;
            if (data.length <= 0) {
                setSeatBookingData2([]);
            }
            data.forEach((newItem) => {
                if (!seatBookingData2.includes(newItem)) {
                    setSeatBookingData2((prev) => [...prev, newItem]);
                }
            });
        } catch (error) {
            console.error(error);
        }
    };
    const [account, setAccount] = useState(null);
    const [isService, setIsService] = useState(false);
    const [priceService, setPriceService] = useState([]);
    useEffect(() => {
        const loadServices = async () => {
            try {
                const resp = await priceServiceApi.findByCplx(showtime.cinema.cinemaComplex.id);
                console.log('priceService: 11 ', resp);
                setPriceService(resp.data);
                if (resp.data.length >= 0) {
                    setIsService(true);
                } else {
                    setIsService(false);
                }
            } catch (error) {
                setIsService(false);
            }
        };
        try {
            const acc = authApi.getUser();
            loadServices();
            if (acc != null) {
                setAccount(acc);
            }
        } catch (error) {
            console.log('error - get acc: ', error);
        }
        // setCinemaComplexId(showtime.cinema.cinemaComplex.id);
    }, [isModalOpenBooking]);
    useEffect(() => {
        const fetchDataInterval = setInterval(() => {
            fetchDataSeatChoose();
            fetchDataSeatBooking();
        }, 1000);

        // Để ngăn fetchDataSeatChoose chạy ngay khi component bị unmounted
        return () => {
            clearInterval(fetchDataInterval);
        };
    }, []);

    useEffect(() => {
        if (allSeats.length > 0 && seatBookingData.length > 0 && !seatState.seatReserved.length > 0) {
            setSeatState(createSeatArray());
            console.log('useEffect reload createSeatArray run');
        }
    }, [seatBookingData]);

    const fetchDataSeat = async () => {
        try {
            const respAll = await axiosClient.get(`seat/by-seatchart/${showtime.seatChart.id}`);
            setAllSeats(respAll.data);

            const respPrice = await axiosClient.get(`price/findByShowtimeId/${showtime.id}`);
            const currentDate = new Date();

            // Lọc ra các phần tử có startDate và endDate trong khoảng ngày hiện tại
            // const filteredPrices = respPrice.data.filter((price) => {
            //     const startDate = new Date(price.price.startDate);
            //     const endDate = new Date(price.price.endDate);

            //     return startDate <= currentDate && endDate >= currentDate;
            // });

            setPrices(respPrice.data);

            if (seatBookingData.length > 0) {
                setReload(true);
            }
            if (allSeats.length > 0) {
                setSeatState(createSeatArray());
                setShowSeat(true);
                setReload(false);
            } else {
                setReload(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDaTaSeatType();
        fetchDataSeat();
        getDataSeatArray();
        fetchDaTaSeatTypeBySeatChart();
    }, [reload]);

    // Lấy price từ ghế

    // Check giá theo ngày
    const moment = require('moment');

    const getSeatPrice = (priceOneSeat) => {
        if (priceOneSeat === null) {
            return;
        }
        const currentDate = moment();
        const dayOfWeek = currentDate.day();

        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            return priceOneSeat.weekdayPrice;
        } else if (dayOfWeek === 6 || dayOfWeek === 0) {
            return priceOneSeat.weekendPrice;
        } else {
            return null;
        }
    };

    const [priceSeats, setPriceSeats] = useState(0);
    const findPriceBySeatType = (seatStateArray, seat, seatTypeId) => {
        console.log(seatStateArray);
        console.log(seat);
        console.log(seatTypeId);
        let result = null;
        let finalRS = null;
        seatStateArray.forEach((seatItem) => {
            if (seatItem === seat) {
                const price = prices.find((price) => {
                    return price.newPriceSeatTypeDTOs.some((seatType) => seatType.seatType.id === seatTypeId);
                });
                console.log(prices);
                if (price) {
                    result = price.newPriceSeatTypeDTOs;

                    result.map((newPriceSeatTypeDTO, index) => {
                        if (newPriceSeatTypeDTO.seatType.id === seatTypeId) {
                            finalRS = newPriceSeatTypeDTO;
                        }
                    });
                }
            }
        });

        return finalRS;
    };
    const onClickData = async (seat, rowIndex) => {
        const { seatReserved, seatAvailable, vipSeat, normalSeat, seatUnavailable } = seatState;

        var firstArray = seatState.seat[rowIndex].slice(0, 1);
        var stringFirstArray = firstArray[0];
        var lastArray = seatState.seat[rowIndex].slice(-1);
        var stringLastArray = lastArray[0];
        var nextToFirstElement = seatState.seat[rowIndex][1];
        var stringNextToFirstElement = nextToFirstElement[0];
        var nextToLastElement = seatState.seat[rowIndex][seatState.seat[rowIndex].length - 2];
        var stringNextToLastElement = nextToLastElement[0];

        // }
        const objectsWithData = Object.keys(seatState).reduce((result, key) => {
            if (Array.isArray(seatState[key]) && seatState[key].length > 0 && key !== 'seat' && key !== 'seatHeader') {
                result[key] = seatState[key];
            }
            return result;
        }, {});

        const filteredObjectsWithNames = Object.keys(objectsWithData).reduce((result, key) => {
            if (objectsWithData[key].length > 0) {
                result.push({ name: key, data: objectsWithData[key] });
            }
            return result;
        }, []);
        const rs = {};
        filteredObjectsWithNames.forEach(({ name, data }, index) => {
            seatType.forEach((value) => {
                if (value.nickName === name) {
                    const priceResult = findPriceBySeatType(data, seat, value.id);

                    if (priceResult !== null) {
                        Object.assign(rs, {
                            seatType: value,
                            weekdayPrice: priceResult.weekdayPrice,
                            weekendPrice: priceResult.weekendPrice,
                        });
                    }
                }
            });
        });
        const seatPrices = getSeatPrice(rs);
        if (seatReserved.indexOf(seat) > -1) {
            setPriceSeats(priceSeats - seatPrices);
            seatReserved.splice(seatReserved.indexOf(seat), 1);
            setSeatState({
                ...seatState,
                seatReserved: [...seatReserved],
            });
            removeDataFromDuplicateSeatByName(seat);
        } else {
            if (seatState.seatReserved.length > 7) {
                funcUtils.notify('Chỉ được chọn tối đa 8 ghế', 'warning');
                return;
            }
            if (seatState.seatReserved.indexOf(stringFirstArray) === -1) {
                if (seat === nextToFirstElement) {
                    funcUtils.notify('Không được bỏ trống ghế ngoài cùng bên trái', 'warning');
                    return;
                }
            }
            if (seatState.seatReserved.indexOf(stringLastArray) === -1) {
                if (seat === nextToLastElement) {
                    funcUtils.notify('Không được bỏ trống ghế ngoài cùng bên phải', 'warning');
                    return;
                }
            }
            Object.keys(seatState).forEach((key) => {
                seatType.forEach((seatType) => {
                    if (seatType.nickName === key) {
                        setSeatState({
                            ...seatState,
                            seatReserved: [...seatReserved, seat],
                        });
                    }
                });
            });
            setPriceSeats(priceSeats + seatPrices);
        }
    };

    // Lọc ghế trùng
    const [duplicateSeat, setDuplicateSeat] = useState([]);
    const [seatBooking, setSeatBooking] = useState([]);
    const fetchData = async () => {
        try {
            if (!seatState || !seatState.seatReserved || seatState.seatReserved.length === 0) {
                throw new Error('No seats are reserved.');
            }
            console.log(seatState.seatReserved);
            const responses = await Promise.all(
                seatState.seatReserved.map(async (seat) => {
                    const respSeatChose = await axiosClient.get(
                        `seat/by-seatchart-name/${showtime.seatChart.id}/${seat}`,
                    );
                    return respSeatChose.data;
                }),
            );
            const newData = responses.flatMap((data) => data);
            const uniqueData = [...new Set(newData)];

            // Kiểm tra xem uniqueData có dữ liệu mới hay không trước khi cập nhật state
            if (uniqueData.length > 0) {
                setDuplicateSeat((prev) => {
                    const newSeatIds = new Set(uniqueData.map((seat) => seat.id));
                    const updatedPrev = prev.filter((prevSeat) => !newSeatIds.has(prevSeat.id));
                    return [...updatedPrev, ...uniqueData];
                });
            }
        } catch (error) {
            console.error(error.message);
        }
    };
    const removeDataFromDuplicateSeatByName = (seatNamesToRemove) => {
        setDuplicateSeat((prev) => {
            const updatedPrev = prev.filter((prevSeat) => {
                const shouldKeep = !seatNamesToRemove.includes(prevSeat.name);
                return shouldKeep;
            });

            return updatedPrev;
        });
    };

    useEffect(() => {
        fetchData();
    }, [seatState ? seatState.seatReserved : null]);

    const [seatChoose, setSeatChoose] = useState([]);
    const onCreateDaTaSeatChoose = async () => {
        try {
            console.log(duplicateSeat);
            setSeatBooking(duplicateSeat);
            const currentTime = new Date();
            const vietnamTimezoneOffset = 7 * 60;
            // Chuyển múi giờ hiện tại thành múi giờ Việt Nam
            currentTime.setMinutes(currentTime.getMinutes() + vietnamTimezoneOffset);
            const formattedTime = currentTime.toISOString();
            const data = duplicateSeat.map((s) => ({
                account,
                lastSelectedTime: formattedTime,
                seat: s,
                showtime: showtime,
            }));
            await Promise.all([]);
            try {
                const resp = await axiosClient.post(`seat-choose`, data);
                setSeatChoose(resp.data);
                console.log(data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu từ server', error);
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu từ server', error);
        }
    };
    // Xóa ghế chọn
    const deleteSeatChoose = async () => {
        try {
            const resp = await axiosClient.post(`seat-choose/deleteMultiple`, seatChoose);
        } catch (error) {
            console.log('error: ', error);
        }
    };

    // useEffect(() => {
    //     deleteSeatChoose();
    // },[]);
    useEffect(() => {
        fetchDataSeat();
    }, [reload]);

    const handleButtonClick = () => {
        if (account == null) {
            funcUtils.notify('Vui lòng đăng nhập trước khi tiến hành mua vé', 'warning');
            return;
        }
        onCreateDaTaSeatChoose();
        showModal();
    };

    const deleteSeat = () => {
        // setSeatState({ seatReserved: [] });
        setDuplicateSeat([]);
        setSeatState({
            ...seatState,
            seatReserved: [],
        });
        setPriceSeats(0);
    };
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        if (seatState && seatState.seatReserved) {
            const hasData = seatState.seatReserved.length > 0 ? true : false;
            setHasData(hasData);
        }
    }, [seatState ? seatState.seatReserved : null]);

    // Lấy thời gian bắt đầu phim--------------------------------------------------
    const startDate = new Date(showtime.startTime);
    const startHour = startDate.getHours();
    const startMinute = startDate.getMinutes();
    const startSecond = startDate.getSeconds();
    const formattedStartTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
    // Lấy thời gian kết thúc phim
    const endDate = new Date(showtime.endTime);
    const endHour = endDate.getHours();
    const endMinute = endDate.getMinutes();
    const endSecond = endDate.getSeconds();
    const formattedEndTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

    // Lấy ngày hiện tại
    const currentDate = new Date();

    // Lấy ngày và tháng từ đối tượng ngày
    const dayOfMonth = startDate.getDate();
    const month = startDate.getMonth() + 1;

    const isToday =
        startDate.getDate() === currentDate.getDate() &&
        startDate.getMonth() === currentDate.getMonth() &&
        startDate.getFullYear() === currentDate.getFullYear();

    const [isTableLoaded, setIsTableLoaded] = useState(false);

    useEffect(() => {
        // Simulate a delay (replace this with your actual data fetching logic)
        const fetchData = async () => {
            // Simulate data fetching delay
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Set isTableLoaded to true when data is fetched
            setIsTableLoaded(true);
        };

        fetchData();
    }, []);
    return (
        <>
            <Card className="card" style={{ display: 'flex' }}>
                <Row className="ca">
                    <Col span={24}>
                        <Row>
                            {' '}
                            <Col span={7}></Col>
                            <Col span={10}>
                                <hr className={cx('screen')} />
                            </Col>
                            <Col span={7}></Col>
                        </Row>
                        <Row className="tw-text-center">
                            <Col span={24}>
                                <h6 className={cx('screen-title')}>Màn hình</h6>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        {isTableLoaded && (
                            <table className="grid">
                                {showSeat && (
                                    <tbody>
                                        {seatState.seatHeader.map((header, rowIndex) => (
                                            <tr key={header}>
                                                <td className="header-cell protected-element">{header}</td>
                                                {seatState.seat[rowIndex].map((seat_no) => {
                                                    let width = 1;
                                                    const seatClassName =
                                                        seatBookingData2.indexOf(seat_no) > -1
                                                            ? '#404040'
                                                            : seatBookingData.indexOf(seat_no) > -1
                                                            ? '#404040'
                                                            : seatState.seatReserved.indexOf(seat_no) > -1
                                                            ? '#16A34A'
                                                            : Object.keys(seatState)
                                                                  .map((key) => {
                                                                      let color = null;
                                                                      if (seatState[key].indexOf(seat_no) > -1) {
                                                                          seatType.forEach((seat) => {
                                                                              if (seat.nickName === key) {
                                                                                  color = seat.color;
                                                                                  if (seat.width >= 2) {
                                                                                      width = seat.width;
                                                                                  }
                                                                              }
                                                                          });
                                                                      }

                                                                      return color;
                                                                  })
                                                                  .filter(Boolean)
                                                                  .join(' ') || 'reserved';
                                                    const style = {
                                                        backgroundColor: seatClassName,
                                                        pointerEvents: seatClassName === '#404040' ? 'none' : 'auto',
                                                        visibility: seatClassName === '#121B2B' ? 'hidden' : 'visible',
                                                        textIndent: seatClassName === '#121B2B' ? '-9999px' : '0',
                                                        transform: width >2 ? `scaleX(${width})` : seatState.coupleSeat.indexOf(seat_no) > -1 ? `scaleX(${2})` : null,
                                                        transformOrigin: 'top left',
                                                    };
                                                    return (
                                                        <td
                                                            className={`protected-element`}
                                                            style={style}
                                                            key={seat_no}
                                                            onClick={() => onClickData(seat_no, rowIndex)}
                                                        >
                                                            {seat_no}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                )}
                            </table>
                        )}
                        {/* ghế  */}
                        {!isTableLoaded && (
                            <div
                                className="tw-text-white tw-text-2xl"
                                style={{ marginLeft: '60px', position: 'relative', bottom: '60px' }}
                            >
                                <img src={img.loading} alt="Loading" />
                            </div>
                        )}
                    </Col>
                </Row>
            </Card>

            <Row className="tw-bg-white">
                <Col span={24}>
                    <div className="tw-pt-5 ">
                        <Space size={[0, 200]} wrap>
                            <div style={{ display: 'flex', overflowX: 'auto', maxWidth: '600px' }}>
                                {seatTypeBySeatChart &&
                                    seatTypeBySeatChart.map((value) => {
                                        if (value.id === 7) {
                                            return null;
                                        }
                                        return (
                                            <Tag className={cx('')} key={value.id} color={value.color}>
                                                {value.name}
                                            </Tag>
                                        );
                                    })}
                                {seatType &&
                                    seatType.map((value) => {
                                        if (value.id === 7) {
                                            return null;
                                        }
                                        if (value.id === 9 || value.id === 8) {
                                            return (
                                                <Tag className={cx('')} key={value.id} color={value.color}>
                                                    {value.name}
                                                </Tag>
                                            );
                                        }
                                    })}
                            </div>
                        </Space>
                    </div>
                </Col>
                <Col span={24}>
                    <div onClick={showModalSeatType} class="tw-pt-5  hover:tw-cursor-pointer hover:tw-opacity-60">
                        <span class="tw-border-b-2 tw-mr-4 tw-underline">Xem chi tiết</span>
                        <span>hình ảnh và thông tin ghế</span>
                    </div>
                    <Modal
                        title="Chi tiết loại ghế"
                        open={isModalOpenSeatType}
                        onOk={handleOkSeatType}
                        onCancel={handleCancelSeatType}
                        footer={false}
                    >
                        {seatTypeBySeatChart &&
                            seatTypeBySeatChart.map((value) => {
                                if (value.id === 7) {
                                    return null;
                                }
                                if (value.id === 8) {
                                    return null;
                                }
                                if (value.id === 8) {
                                    return null;
                                }
                                return (
                                    <div className={cx('tagg')} key={value.id}>
                                        <div class="tw-overflow-x-hidden tw-rounded-lg tw-shadow-xl">
                                            <div className="tw-relative tw-aspect-2">
                                                <img
                                                    src={uploadApi.get(value.image)}
                                                    alt="image"
                                                    style={{ height: '200px', objectFit: 'cover' }}
                                                />
                                            </div>
                                            <ul className="tw-px-4 tw-py-3">
                                                <li>
                                                    <b>{value.name}</b>
                                                </li>
                                                <li>
                                                    <ul>
                                                        <li>{value.description}&nbsp;</li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                );
                            })}
                    </Modal>
                </Col>
                <Col span={24}>
                    <div className="tw-mt-6">
                        <b className="tw-text-3xl tw-line-clamp-1 tw-md:line-clamp-none">
                            {showtime.formatMovie.movie.title}
                        </b>
                    </div>
                    <div className="tw-mb-4">
                        <span className="tw-block tw-text-tiny tw-text-orange-500 tw-lg:text-sm">
                            {formattedStartTime} ~ {formattedEndTime} {isToday ? 'Hôm nay' : null}, {dayOfMonth}/{month}{' '}
                            · {showtime.formatMovie.movie.title} · {showtime.formatMovie.format.name}
                        </span>
                    </div>
                    {/* <hr /> */}
                    <div className="tw-opacity-90"></div>
                </Col>

                <Col span={24} style={{ borderTop: '1px solid gainsboro', borderBottom: '1px solid gainsboro' }}>
                    <div className="tw-mt-3 tw-mb-3">
                        <div
                            style={{ height: 37 }}
                            className="tw-flex tw-items-center tw-justify-between tw-space-x-3 tw-py-1.5"
                        >
                            <span className="tw-shrink-0 tw-text-gray-500">Chỗ ngồi</span>
                            {seatState &&
                                seatState.seatReserved &&
                                // {seatState.seatReserved.length > 0 && (

                                seatState.seatReserved?.length > 0 && (
                                    <div
                                        style={{ border: '1px solid' }}
                                        className=" tw-flex-wrap tw-flex tw-items-center tw-space-x-2 tw-rounded-lg tw-border tw-border-gray-200 tw-px-3 tw-py-1"
                                    >
                                        {seatState.seatReserved.map((isReserved, index, array) => (
                                            <React.Fragment key={index}>
                                                <div>
                                                    <span>{isReserved}</span>
                                                </div>
                                                {index < array.length - 1 && ','}
                                            </React.Fragment>
                                        ))}
                                        {seatState.seatReserved.length > 0 && (
                                            <svg
                                                onClick={deleteSeat}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="rgb(239 68 68)"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                aria-hidden="true"
                                                className="tw-h-6 tw-shrink-0 tw-cursor-pointer tw-text-white tw-transition-all tw-hover:opacity-70"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                ></path>
                                            </svg>
                                        )}
                                    </div>
                                )}
                        </div>
                    </div>
                </Col>

                <Col
                    span={12}
                    style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', padding: '5px 0px' }}
                >
                    <ul className="" style={{ height: '100%' }}>
                        <li>
                            <span className="tw-block tw-text-gray-500 tw-text-2xl "> Tạm tính</span>
                        </li>
                        <li>
                            <b className="tw-text-2xl">
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                }).format(priceSeats)}
                            </b>
                        </li>
                    </ul>
                </Col>
                <Col span={12}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            height: '100%',
                            padding: '5px 0px',
                        }}
                    >
                        <Button
                            style={{
                                width: '150px',
                                height: '44px',
                                backgroundColor: hasData ? '#176b87' : 'gray',
                                fontWeight: 'bolder',
                            }}
                            className={`btn ${
                                hasData === false ? 'bg-gray-500' : ''
                            } tw-text-white tw-hover:bg-gray-600 tw-focus:outline-none`}
                            type="primary"
                            onClick={handleButtonClick}
                            // icon={<ShoppingOutlined style={{ fontSize: '20px' }} />}
                            disabled={hasData === false}
                        >
                            <FontAwesomeIcon icon={faCartShopping} className="tw-mr-2" />
                            Mua vé
                        </Button>
                    </div>
                </Col>

                {/* <Col span={24}>
                    <Row>
                        <Col span={15}></Col>
                        <Col span={9}></Col>
                    </Row>
                </Col> */}
            </Row>
            {account != null && isService && (
                <BookingCombo
                    priceServices={priceService}
                    seatBooking={seatBooking}
                    showtime={showtime}
                    open={isModalOpenBooking}
                    onCancel={handleCancel}
                    destroyOnClose={true}
                />
            )}
            {account != null && isService === false && (
                <BookingDetail
                    showtime={showtime}
                    seatBooking={seatBooking}
                    open={isModalOpenBooking}
                    onCancel={handleCancel}
                    destroyOnClose={true}
                />
            )}
        </>
    );
}

export default SeatChart;
