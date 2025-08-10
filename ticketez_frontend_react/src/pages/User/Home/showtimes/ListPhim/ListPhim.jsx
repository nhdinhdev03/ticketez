import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Modal, Tag } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import classNames from 'classnames/bind';
import style from './ListPhim.module.scss';

import SeatChart from '../../../Booking/SeatChart';
import moment from 'moment-timezone';

import { movieUserApi } from '~/api/user/showtime';
import NotFountShowtime from '../NotFountShowtime/NotFountShowtime';
import uploadApi from '~/api/service/uploadApi';
import { Link } from 'react-router-dom';
import Mapbox from '~/components/Mapbox';

const cx = classNames.bind(style);

function ListPhim({ cinemaComplex }) {
    const [day, setDay] = useState(1);
    const [weekDays, setWeekDays] = useState([]);
    const daysOfWeekInVietnamese = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const [loading, setLoading] = useState(false);

    const [showtime, setShowtime] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleOk = () => {
        setIsModalVisible(false); // Đóng modal khi ấn nút OK
    };

    const handleCancel = () => {
        setIsModalVisible(false); // Đóng modal khi ấn nút Hủy
    };
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
    // console.log(chooseDay);
    const handleDayClick = (index) => {
        setDay(index + 1);
        const selectedDay = weekDays[index];
        const formatSelectedDay = selectedDay.format('YYYY-MM-DD');
        setChooseDay(formatSelectedDay);
        // console.log('Ngày được chọn:', selectedDay.format('DD-MM-YYYY'));
    };
    // -----------------movie by ccx-----------------------------------------------

    const [movieData, setMovieData] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        setLoading(true);
        const getMovies = async () => {
            try {
                if (cinemaComplex) {
                    const resMovie = await movieUserApi.getMovieAllByCinemaComplexAndDate(cinemaComplex.id, chooseDay);
                    setData(resMovie);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        getMovies();
    }, [cinemaComplex, chooseDay]);

    // console.log('data', data.length);

    const handShowtime = (value) => {
        setShowtime(value);
        console.log(showtime);
        setIsModalVisible(true);
    };

    // modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancelModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Row
                className={cx({
                    wrapper: data.length !== 0,
                    wrapperCheck: data.length === 0,
                })}

                // className={cx("wrapper")}
            >
                {loading && (
                    <div className={cx('loading')}>
                        <LoadingOutlined className={cx('imgL')} />
                    </div>
                )}
                <Col span={24} className={cx('col1')}>
                    <Row>
                        <Col span={24} className={cx('col1-dia-chi')}>
                            {cinemaComplex?.id && (
                                <Row className={cx('container')}>
                                    <Col span={2} style={{ display: 'flex', alignItems: 'center' }}>
                                        <div className={cx('border-img')}>
                                            <img
                                                className={cx('img')}
                                                src={uploadApi.get(cinemaComplex?.cinemaChain?.image ?? '')}
                                                alt="l"
                                            />
                                        </div>
                                    </Col>
                                    <Col span={22}>
                                        <Row>
                                            <Col span={24} className={cx('ten-rap')}>
                                                <Link to={'/movie-cinema-complex/'+ cinemaComplex?.id} className=" tw-text-[var(--primary--text-color)] tw-min-w-[100px] hover:tw-text-[var(--primany-text-hover-color)] tw-cursor-pointer ">
                                                    {'Lịch chiếu phim ' + (cinemaComplex?.name ?? '')}
                                                </Link>
                                            </Col>
                                            <Col span={24} className={cx('container-info')}>
                                                <div className={cx('chi-tiet-dia-chi')}>
                                                    {cinemaComplex?.address ?? ''}
                                                </div>
                                                <div className={cx('ban-do')} onClick={showModal}>
                                                    [Bản đồ]
                                                </div>
                                                <Modal
                                                    title="Bản đồ"
                                                    open={isModalOpen}
                                                    onCancel={handleCancelModal}
                                                    className="modal-map-lg"
                                                    footer={
                                                        <Button
                                                            className="modal-footer-btn-close"
                                                            onClick={handleCancelModal}
                                                        >
                                                            ĐÓNG
                                                        </Button>
                                                    }
                                                >
                                                    <div className="map-lg-content">
                                                        <Mapbox
                                                            latitude={cinemaComplex.latitude}
                                                            longitude={cinemaComplex.longitude}
                                                            address={cinemaComplex.address}
                                                            title={cinemaComplex.name}
                                                        />
                                                    </div>
                                                </Modal>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            )}
                        </Col>
                        <Col span={24} className={cx('col1-chon-ngay')}>
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
                                Ưu đãi 89K/vé 2D cả tuần không giới hạn; 69K/vé 2D, tối đa 1 vé/tháng khi thanh toán
                                bằng Ví Trả Sau
                            </div>
                        </Col> */}
                    </Row>
                </Col>
                <Col span={24} className={cx('col2')}>
                    {data.listMovieObjResp?.map((data, index) => (
                        <Row key={index} className={cx('container-movie')}>
                            <Col span={4} className={cx('col1-movie')}>
                                <div className={cx('border-movie')}>
                                    <Link to={'movie-details/' + data.movie.id}>
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

                                        <div className={cx('ten-phim')}>{data.movie.title}</div>
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
                        <NotFountShowtime
                            titleFirst={'Úi, Suất chiếu không tìm thấy.'}
                            titleLast={'Bạn hãy thử tìm ngày khác nhé'}
                        />
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
        </>
    );
}

export default ListPhim;
