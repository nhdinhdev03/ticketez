import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './BookingInfo.module.scss';
import { TicketDetails } from '..';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { Button, Col, QRCode, Row, Spin, Tag } from 'antd';
import datrungphuongnamImg from '../../../assets/img/datrungphuongnam.jpg';
import logorap from '../../../assets/img/lotte.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import bookingApi from '~/api/user/booking/bookingApi';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import funcUtils from '~/utils/funcUtils';
const cx = classNames.bind(style);
function BookingInfo() {
    const location = useLocation();
    const componentPDF = useRef();
    const navigate = useNavigate();
    const generatePDF = useReactToPrint({
        content: () => componentPDF.current,
        documentTitle: 'Ticket',
        bodyClass: cx('custom-print-body'),
        // onAfterPrint: () => alert('Done'),
    });
    const [paymentStatus, setPaymentStatus] = useState('e');
    const paymentInfoId = location.state?.paymentInfoId;
    const [spin, setSpin] = useState(true);
    const [paymentInfoDTO, setPaymentInfoDTO] = useState({
        paymentInfo: {},
        booking: {},
        seatBookings: [],
        servicesBooking: [],
    });
    const [currentStatusConfig, setCurrentStatusConfig] = useState({});
    const statusConfig = {
        success: {
            title: 'Thành công!',
            btnTitle: 'Vé của tôi',
            color: '#4CAF50',
            icon: solidIcons.faCircleCheck,
            message: 'Thanh toán thành công, bạn có thể kiểm tra các vé của mình ở bên dưới!',
        },
        fail: {
            title: 'Xảy ra lỗi!',
            btnTitle: 'Trở về trang chủ',
            color: '#FF5722',
            icon: solidIcons.faCircleXmark,
            message: 'Không thể xem được thông tin đặt vé.',
        },
    };
    // Lấy dữ liệu từ state
    // let paymentStatus = 'success';
    // const currentStatusConfig = statusConfig[paymentStatus];
    useEffect(() => {
        if (paymentInfoId !== null) {
            funcUtils.notify('Lỗi không tìm thấy paymentInfo');
        }
        const loadData = async () => {
            try {
                const resp = await bookingApi.getPaymentInfoById(paymentInfoId);
                setSpin(false);
                console.log('resp', resp);
                const booking = resp.data.booking;
                const paymentInfo = resp.data.paymentInfo;
                const seatBookings = resp.data.seatBookings;
                const servicesBooking = resp.data.servicesBooking;
                console.log('booking', booking);
                setPaymentInfoDTO({ booking, paymentInfo, seatBookings, servicesBooking });
                setPaymentStatus('success');
                setCurrentStatusConfig(statusConfig['success']);
            } catch (error) {
                setPaymentStatus('fail');
                setSpin(false);
                setCurrentStatusConfig(statusConfig['fail']);
                console.log('error', error);
            }
        };
        loadData();
        // } else {
        //     setPaymentStatus('fail');
        // }
    }, [paymentInfoId]);
    return (
        <>
            <div className={cx('wrapper', 'tw-pt-2')}>
                {paymentStatus == 'success' && <Button onClick={generatePDF}>Tải vé về máy</Button>}
                <div className={cx('container')}>
                    <div style={{ display: 'flex' }}>
                        <div className={cx('wrapper-box-status', 'light')}>
                            <Spin spinning={spin} />
                            <div className={cx('wrapp-icon')}>
                                {currentStatusConfig?.icon != null && (
                                    <FontAwesomeIcon
                                        icon={currentStatusConfig?.icon}
                                        className={cx('icon', paymentStatus)}
                                    />
                                )}
                            </div>
                            <span className={cx('title', paymentStatus)}>{currentStatusConfig?.title}</span>
                            <p className={cx('message')}>{currentStatusConfig?.message}</p>
                            {paymentStatus === 'success' ? (
                                <Button
                                    onClick={() => {
                                        navigate('/booking-history');
                                    }}
                                    className={cx('btn-redirect', paymentStatus)}
                                >
                                    {currentStatusConfig?.btnTitle}
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => {
                                        navigate('/');
                                    }}
                                    className={cx('btn-redirect', paymentStatus)}
                                >
                                    {currentStatusConfig?.btnTitle}
                                </Button>
                            )}
                        </div>

                        {/* <TicketDetails></TicketDetails> */}
                        {paymentStatus === 'success' && (
                            <div className={cx('wrapper-ticket-details', 'light')}>
                                <div ref={componentPDF}>
                                    <TicketDetails paymentInfoDTO={paymentInfoDTO}></TicketDetails>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default BookingInfo;
