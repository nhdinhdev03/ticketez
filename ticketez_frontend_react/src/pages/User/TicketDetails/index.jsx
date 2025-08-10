import { useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './TicketDetails.module.scss';
import { Col, QRCode, Row, Tag } from 'antd';
import datrungphuongnamImg from '../../../assets/img/datrungphuongnam.jpg';
import logorap from '../../../assets/img/lotte.jpg';
import { useEffect, useState } from 'react';
import uploadApi from '~/api/service/uploadApi';
import moment from 'moment';
import 'moment/locale/vi';
const cx = classNames.bind(style);
const ticketStatus = {
    UNUSED: 0,
    USED: 1,
    EXPIRES: 2,
};
function TicketDetails({ paymentInfoDTO }) {
    // const location = useLocation();
    const [infoTicket, setInfoTicket] = useState({});
    const { booking, paymentInfo, seatBookings, servicesBooking } = paymentInfoDTO;
    // Lấy dữ liệu từ state
    // const paymentInfo = location.state?.paymentInfo;
    useEffect(() => {
        moment.locale('vi');
        console.log('showtime', booking.showtime);
        const movie = {
            ...booking.showtime.formatMovie.movie,
            format: booking.showtime.formatMovie.fomat,
        };

        const showtime = booking.showtime;
        const cinemaComplex = booking.showtime.cinema.cinemaComplex;

        const capitalizeFirstLetter = (inputString) => {
            return `${inputString.charAt(0).toUpperCase()}${inputString.slice(1)}`;
        };
        const info = {
            // ratingCode: movie.mpaaRating.ratingCode,
            movie: {
                title: movie.title,
                poster: movie.poster,
                format: showtime.formatMovie.format.name,
            },
            time: {
                startTime: moment(showtime.startTime).format('HH:mm'),
                endTime: moment(showtime.endTime).format('HH:mm'),
                showDate: capitalizeFirstLetter(moment(showtime.startDate).format('dddd, DD/MM/YYYY')),
            },
            ticketStatus: booking.ticketStatus,
            // seat,
            cinemaComplex: {
                name: cinemaComplex.name,
                image: cinemaComplex.cinemaChain.image,
                address: cinemaComplex.address,
            },
            cinemaName: showtime.cinema.name,
            seatNumber: seatBookings.length.toString().padStart(2, '0'),
            seatNames: seatBookings.map((sb) => sb.seat.name).join(', '),
            servicesBooking:
                servicesBooking.length > 0
                    ? servicesBooking.map((svb) => `${svb.quantity} X ${svb.service.name}`)
                    : 'Không',
            paymentInfo: {
                ticketId: booking.id,
                amount: new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(paymentInfo.amount),
                transactionId: paymentInfo.transactionId,
                payDate: moment(paymentInfo.payDate).format('HH:mm - DD/MM/YYYY'),
            },
        };
        console.log('', info);
        setInfoTicket(info);
    }, []);
    return (
        <>
            {Object.keys(infoTicket).length > 0 && (
                <div className={cx('wrapper')}>
                    <div className={cx('container')}>
                        <div className={cx('wrapper-ticket', 'light')}>
                            <div className={cx('ticket-head')}>
                                <Row>
                                    <Col span={7} className={cx('wrapp-movie-poster')}>
                                        <div className={cx('box-movie-poster')}>
                                            <a href="">
                                                <img
                                                    className={cx('poster')}
                                                    src={uploadApi.get(infoTicket.movie.poster)}
                                                    alt=""
                                                />
                                            </a>
                                        </div>
                                    </Col>
                                    <Col span={17} className={cx('wrapp-movie-info')}>
                                        <ul className={cx('info-movie')}>
                                            <li>{/* <Tag color={getColorForRating('PG-13')}>G-13</Tag> */}</li>
                                            <li className={cx('movie-name')}>
                                                <span>{infoTicket.movie.title}</span>
                                            </li>
                                            <li className={cx('format-movie')}>{infoTicket.movie.format}</li>
                                            {/* <li className={cx('cinema-clx-name')}>Lotte Ninh Kiều</li> */}
                                        </ul>
                                    </Col>
                                </Row>
                            </div>
                            {infoTicket.ticketStatus === ticketStatus.USED && (
                                <div className={cx('status-ticket')}>Vé đã sử dụng</div>
                            )}
                            {infoTicket.ticketStatus === ticketStatus.EXPIRES && (
                                <div className={cx('status-ticket')}>Vé đã hết hạn</div>
                            )}
                            <div className={cx('ticket-body')}>
                                <Row>
                                    <Col span={12} className={cx('wrapp-info-ticket')}>
                                        <ul className={cx('info-ticket')}>
                                            <li className={cx('ticket-title')}>Mã đặt vé</li>
                                            <li className={cx('ticket-body-text')}>
                                                <span className={cx('ticket-id')}>
                                                    {infoTicket.paymentInfo.ticketId}
                                                </span>
                                            </li>
                                        </ul>
                                        <ul className={cx('info-ticket', 'tw-mt-8')}>
                                            <li className={cx('ticket-title')}>Thời gian</li>
                                            <li className={cx('ticket-body-text')}>
                                                <span className={cx('ticket-time')}>
                                                    <span className={cx('start-time')}>
                                                        {infoTicket.time.startTime}
                                                    </span>
                                                    ~<span className={cx('end-time')}>{infoTicket.time.endTime}</span>
                                                </span>
                                            </li>
                                            <li className={cx('ticket-body-text')}>
                                                <span className={cx('show-date')}>{infoTicket.time.showDate}</span>
                                            </li>
                                        </ul>
                                    </Col>
                                    <Col span={12} className={cx('ticket-qrcode-area')}>
                                        <QRCode
                                            value={infoTicket.paymentInfo.ticketId}
                                            // value={'Title: 1, ID: 2'}
                                            bgColor="white"
                                            className={cx('qrcode')}
                                        />
                                    </Col>
                                    <Col span={24}>
                                        <p className={cx('note', 'tw-text-center')}>
                                            Đưa mã này cho nhân viên soát vé để nhận vé vào rạp
                                        </p>
                                    </Col>
                                </Row>
                            </div>
                            <div className={cx('ticket-footer-top')}>
                                <div className={cx('wrapp-info-top')}>
                                    <Row>
                                        <Col span={8}>
                                            <ul className={cx('info-ticket', 'tw-text-start')}>
                                                <li className={cx('ticket-title')}>Phòng chiếu</li>
                                                <li className={cx('ticket-body-text')}>
                                                    <span className={cx('cinema-name')}>{infoTicket.cinemaName}</span>
                                                </li>
                                            </ul>
                                        </Col>
                                        <Col span={8}>
                                            <ul className={cx('info-ticket', 'tw-text-center')}>
                                                <li className={cx('ticket-title')}>Số vé</li>
                                                <li className={cx('ticket-body-text')}>
                                                    <span className={cx('ticket-quatity')}>
                                                        {infoTicket.seatNumber}
                                                    </span>
                                                </li>
                                            </ul>
                                        </Col>
                                        <Col span={8}>
                                            <ul className={cx('info-ticket', 'tw-text-end')}>
                                                <li className={cx('ticket-title')}>Số ghế</li>
                                                <li className={cx('ticket-body-text')}>
                                                    <span className={cx('seats-name')}>{infoTicket.seatNames}</span>
                                                </li>
                                            </ul>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <ul className={cx('info-ticket', 'tw-text-start')}>
                                                <li className={cx('ticket-title')}>Thức ăn kèm</li>
                                                <li className={cx('ticket-body-text')}>
                                                    <ul>
                                                        {Array.isArray(infoTicket.servicesBooking) ? (
                                                            infoTicket.servicesBooking.map((svb) => (
                                                                <li className={cx('cinema-name')}> {svb}</li>
                                                            ))
                                                        ) : (
                                                            <li className={cx('cinema-name')}>
                                                                {infoTicket.servicesBooking}
                                                            </li>
                                                        )}
                                                    </ul>
                                                </li>
                                            </ul>
                                        </Col>
                                    </Row>
                                </div>
                                <div className={cx('wrapp-info-center')}>
                                    <Row>
                                        <Col span={18}>
                                            <ul className={cx('info-ticket')}>
                                                <li className={cx('ticket-title')}>Rạp chiếu</li>
                                                <li className={cx('ticket-body-text')}>
                                                    <span className={cx('cinema-complex-name')}>
                                                        {infoTicket.cinemaComplex.name}
                                                    </span>
                                                </li>
                                                <li className={cx('ticket-body-text')}>
                                                    <p className={cx('cinema-clx-address')}>
                                                        {infoTicket.cinemaComplex.address}
                                                    </p>
                                                </li>
                                            </ul>
                                        </Col>
                                        <Col span={6} className="tw-flex tw-justify-end">
                                            <div className={cx('box-logo-cinema-chain')}>
                                                <img
                                                    className={cx('logo-cinema-chain')}
                                                    src={uploadApi.get(infoTicket.cinemaComplex.image)}
                                                    alt=""
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                            <div className={cx('ticket-footer-bottom')}>
                                <div className={cx('wrapp-info-bottom')}>
                                    <ul className={cx('info-ticket-bottom')}>
                                        <li className={cx('ticket-info-inner')}>
                                            <span className={cx('title')}>Tổng tiền</span>
                                            <span className={cx('total-price')}>{infoTicket.paymentInfo.amount}</span>
                                        </li>
                                        <li className={cx('ticket-info-inner')}>
                                            <span className={cx('title')}>Mã giao dịch</span>
                                            <span className={cx('transaction-id')}>
                                                {infoTicket.paymentInfo.transactionId}
                                            </span>
                                        </li>
                                        <li className={cx('ticket-info-inner')}>
                                            <span className={cx('title')}>Thời gian giao dịch</span>
                                            <span className={cx('paid-datetime')}>
                                                {infoTicket.paymentInfo.payDate}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default TicketDetails;
