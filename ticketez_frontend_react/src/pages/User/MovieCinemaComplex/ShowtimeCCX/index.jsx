import { Row, Col } from 'antd';

import React, { useState, useEffect } from 'react';
import { Button, Modal, Inpu, Tag } from 'antd';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import { movieUserApi } from '~/api/user/showtime';
import { useParams } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import SeatChart from '~/pages/User/Booking/SeatChart';
import classNames from 'classnames/bind';
import style from './ShowtimeCCX.module.scss';
import uploadApi from '~/api/service/uploadApi';
import NotFountShowtime from '../../Home/showtimes/NotFountShowtime/NotFountShowtime';
const cx = classNames.bind(style);

function Showtime() {
    const [day, setDay] = useState(1);
    const [weekDays, setWeekDays] = useState([]);
    const daysOfWeekInVietnamese = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

    useEffect(() => {
        const currentTimeInVietnam = moment.tz('Asia/Ho_Chi_Minh');
        const nextWeekDays = [];
        for (let i = 0; i < 7; i++) {
            const currentDay = currentTimeInVietnam.clone().add(i, 'days');
            nextWeekDays.push(currentDay);
        }
        setWeekDays(nextWeekDays);
    }, []);
    const [chooseDay, setChooseDay] = useState(moment().format('YYYY-MM-DD'));
    const handleDayClick = (index) => {
        setDay(index + 1);
        const selectedDay = weekDays[index];
        const formatSelectedDay = selectedDay.format('YYYY-MM-DD');
        setChooseDay(formatSelectedDay);
    };

    //
    const [loading, setLoading] = useState(false);
    const { ccxId } = useParams();
    // console.log('ccxId', ccxId);
    const [data, setData] = useState([]);

    useEffect(() => {
        setLoading(true);
        const getMovies = async () => {
            try {
                if (ccxId) {
                    const resMovie = await movieUserApi.getMovieAllByCinemaComplexAndDate(ccxId, chooseDay);
                    setData(resMovie);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        getMovies();
    }, [ccxId, chooseDay]);

    //
    const [showtime, setShowtime] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleCancel = () => {
        setIsModalVisible(false); // Đóng modal khi ấn nút Hủy
    };
    const handleOk = () => {
        setIsModalVisible(false); // Đóng modal khi ấn nút OK
    };
    const handShowtime = (value) => {
        setShowtime(value);
        console.log(showtime);
        setIsModalVisible(true);
    };

    return (
        <Col span={24} className=" tw-min-h-[500px] tw-flex tw-justify-center tw-items-start  ">
            <Row
                className=" tw-w-[766px] tw-bg-[#FFFFFF] "
                style={{ borderRadius: '0.1rem', border: '1px solid #eaeaea' }}
            >
                <Col span={24} className={cx('col1')}>
                    {weekDays.map((days, index) => (
                        <div
                            key={index}
                            className={cx('container-day', { active: day === index + 1 })}
                            onClick={() => handleDayClick(index)}
                        >
                            <div className={cx('ngay')}>{days.date()}</div>
                            <div className={cx('thu')}>
                                {index === 0 ? 'Hôm nay' : daysOfWeekInVietnamese[days.day()]}
                            </div>
                        </div>
                    ))}
                </Col>
                {/* <Col span={24} className={cx('col1-su-kien')}>
                    <div className={cx('title-event')}>
                        Ưu đãi 89K/vé 2D cả tuần không giới hạn; 69K/vé 2D, tối đa 1 vé/tháng khi thanh toán bằng Ví Trả
                        Sau
                    </div>
                </Col> */}

                <Col span={24} className={cx('col2')}>
                    {loading && (
                        <div className={cx('loading-ccx')}>
                            <LoadingOutlined className={cx('imgL-ccx')} />
                        </div>
                    )}
                    {data.listMovieObjResp?.map((data, index) => (
                        <Row key={index} className={cx('container-movie')}>
                            <Col span={4} className={cx('col1-movie')}>
                                <div className={cx('border-movie')}>
                                    <Link to={'/movie-details/' + data.movie.id}>
                                        <img
                                            className={cx('img-movie')}
                                            src={uploadApi.get(data.movie.poster)}
                                            alt=""
                                        />
                                    </Link>
                                </div>
                            </Col>
                            <Col span={20} className={cx('col2-movie')}>
                                <Row>
                                    <Col span={24} className={cx('container-thong-tin-phim')}>
                                        <Tag color={data.movie.mpaaRating.colorCode}>
                                            {data.movie.mpaaRating.ratingCode}
                                        </Tag>

                                        <div className={cx('ten-phim')}> {data.movie.title}</div>
                                        <div className={cx('the-loai-phim')}>
                                            {data.genres.map((valueGenre, index) => (
                                                <span className={cx('span')} key={index}>
                                                    {valueGenre.name}
                                                </span>
                                            ))}
                                        </div>
                                    </Col>

                                    {data.listFormatAndShowtimes.map((valueFormat, index) => {
                                        if (valueFormat.name ?? valueFormat.showtimes.length > 0) {
                                            return (
                                                <Col key={index} span={24} className={cx('container-suat-chieu')}>
                                                    <div className={cx('title')}>{valueFormat.format.name}</div>
                                                    <div className={cx('suat-chieu')}>
                                                        {valueFormat.showtimes.map((valueShowtime, index) => (
                                                            <Button
                                                                key={index}
                                                                className={cx('btn-suat-chieu')}
                                                                danger
                                                                onClick={() => handShowtime(valueShowtime)}
                                                            >
                                                                <span className={cx('gio-bat-dau')}>
                                                                    {moment(valueShowtime.startTime).format('HH:mm')}
                                                                </span>
                                                                <span className={cx('gio-ket-thuc')}>
                                                                    {moment(valueShowtime.endTime).format('HH:mm')}
                                                                </span>
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </Col>
                                            );
                                        }
                                        return null;
                                    })}
                                </Row>
                            </Col>
                        </Row>
                    ))}
                    {data.length === 0 && (
                        <div className="tw-mb-[150px]">
                            <NotFountShowtime
                                titleFirst={'Úi, Suất chiếu không tìm thấy.'}
                                titleLast={'Bạn hãy thử tìm ngày khác nhé'}
                            />
                        </div>
                    )}
                </Col>
            </Row>
            <Modal
                title="Sơ đồ rạp phim"
                visible={isModalVisible}
                footer={null}
                onOk={handleOk}
                onCancel={handleCancel}
                width={800}
                style={{ marginBottom: '20px' }}
                destroyOnClose={true}
            >
                <SeatChart showtime={showtime}></SeatChart>
            </Modal>
        </Col>
    );
}

export default Showtime;
