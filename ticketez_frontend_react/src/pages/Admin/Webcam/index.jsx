import { useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './Webcam.module.scss';
import { Button, Col, Form, Input, QRCode, Row, Tag, Watermark } from 'antd';
import datrungphuongnamImg from '../../../assets/img/datrungphuongnam.jpg';
import logorap from '../../../assets/img/lotte.jpg';
import { useEffect, useRef, useState } from 'react';
import uploadApi from '~/api/service/uploadApi';
import moment from 'moment';
import 'moment/locale/vi';
import { QrReader } from 'react-qr-reader';
import axiosClient from '~/api/global/axiosClient';
import { bookingApi } from '~/api/user';
import { data, info } from 'autoprefixer';
import funcUtils from '~/utils/funcUtils';
import { TicketDetails } from '~/pages/User';
import { useReactToPrint } from 'react-to-print';

const cx = classNames.bind(style);

function Webcam({ paymentInfoDTO }) {
    // const location = useLocation();
    const isScanningRef = useRef(false);
    const componentPDF = useRef(null);
    const [bookingId, setBookingId] = useState('');
    const [dataDTO, setDataDTO] = useState({});
    const [bookingNew, setBookingNew] = useState(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [print, setPrint] = useState(false);
    const [bookingIdInput, setBookingIdInput] = useState('');

    const generatePDF = useReactToPrint({
        content: () => componentPDF.current,
        documentTitle: 'Ticket',
        // bodyClass: cx('custom-print-body'),
    });

    const ticketStatus = {
        UNUSED: 0,
        USED: 1,
        EXPIRES: 2,
    };
    useEffect(() => {
        const get = async () => {
            try {
                if (bookingId) {
                    setDataDTO({});
                    const res = await bookingApi.getBookingPaymentInfoSeatBooking(bookingId);

                    if (res.data.booking.ticketStatus === ticketStatus.UNUSED) {
                        const bookingNew = {
                            ...res.data.booking,
                            ticketStatus: ticketStatus.USED,
                        };
                        const resBookingNew = await bookingApi.update(bookingNew.id, bookingNew);

                        setDataDTO({
                            ...res.data,
                            booking: resBookingNew.data,
                        });
                        funcUtils.notify('Thông tin chính xác', 'success');
                        setPrint(true);
                    } else if (res.data.booking.ticketStatus === ticketStatus.USED) {
                        setDataDTO({
                            ...res.data,
                        });
                        funcUtils.notify('Vé đã được xác nhận trước đó', 'warning');
                        setPrint(false);
                    } else {
                        setDataDTO({
                            ...res.data,
                        });
                        funcUtils.notify('Vé đã được hết hạn', 'warning');
                        setPrint(false);
                    }
                    // if (dataDTO.booking.ticketStatus === 1) {
                    //     funcUtils.notify('Vé đã sử dụng ', 'warning');
                    // } else if (dataDTO.booking.ticketStatus === 2) {
                    //     funcUtils.notify('Vé hết hạn ', 'warning');
                    // }

                    setIsCorrect(true);
                }
            } catch (error) {
                console.log(error);
                funcUtils.notify('Vé không chính xác', 'error');
                setDataDTO({});
                setIsCorrect(false);
            } finally {
                isScanningRef.current = false;
            }
        };
        if (!isScanningRef.current) {
            isScanningRef.current = true;
            get();
        }
        return () => {
            componentPDF.current = null;
        };
    }, [bookingId, isScanningRef]);
    useEffect(() => {
        if (print && Object.keys(dataDTO).length > 0) {
            var timeoutId = setTimeout(() => {
                generatePDF();
            }, 500);
        }
        return () => {
            clearTimeout(timeoutId);
        };
    }, [print]);
    const handleSubmit = () => {
        setBookingId(bookingIdInput);
    };

    const handleInputChange = (e) => {
        setBookingIdInput(e.target.value);
    };
    return (
        <>
            <Row>
                <Col span={12} className=" tw-px-20" style={{ textAlign: 'center' }}>
                    <h2 className=" tw-flex tw-justify-center tw-items-center">Soát vé</h2>
                    <span>Đưa mã QR code vào camera để tiến hành soát vé</span>

                    <QrReader
                        scanDelay={1500}
                        className="tw-w-[100%]"
                        onResult={(result, error) => {
                            if (!!result) {
                                console.log('result', result);
                                setBookingId(result?.text);
                            }
                            if (!!error) {
                                console.info(error);
                            }
                        }}
                    />
                    {/* <p>{bookingId}</p>1 */}
                    <Form onFinish={handleSubmit} layout="vertical">
                        <Row gutter={16}>
                            <Col span={19}>
                                {' '}
                                <Form.Item
                                    label="Mã đặt vé:"
                                    name="myInput"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập mã!',
                                        },
                                    ]}
                                >
                                    <Input
                                        value={bookingIdInput}
                                        placeholder="Nhập mã đặt vé vào đây"
                                        onChange={handleInputChange}
                                        style={{ fontFamily: 'inherit' }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={5} style={{ display: 'flex', alignItems: 'end', justifyContent: 'end' }}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Soát vé
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col span={12} className=" ">
                    <ul>
                        <li style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                            {isCorrect === true && <Button onClick={generatePDF}>In vé</Button>}
                        </li>
                        {/* <li style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                            <Button onClick={generatePDF}>In vé</Button>
                        </li> */}
                        <li>
                            {Object.keys(dataDTO).length > 0 && (
                                <div ref={componentPDF} style={{ paddingTop: 20 }}>
                                    <TicketDetails paymentInfoDTO={dataDTO} />
                                </div>
                            )}
                        </li>
                    </ul>
                </Col>
            </Row>
        </>
    );
}

export default Webcam;
