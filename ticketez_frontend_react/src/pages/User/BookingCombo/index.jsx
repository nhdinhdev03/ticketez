import { Button, Col, Divider, Input, Modal, Row } from 'antd';
import { useEffect, useState } from 'react';
import styles from './BookingCombo.module.scss';
import classNames from 'classnames/bind';
import comboPic from './../../../assets/img/combo-1.png';
import Paragraph from 'antd/es/typography/Paragraph';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as solidIcon from '@fortawesome/free-solid-svg-icons';
import { serviceApi } from '~/api/admin';
import priceSeatApi from '~/api/admin/managementSeat/priceApi';
import priceServiceApi from '~/api/admin/ManageCombosAndEvents/priceServiceApi';
import uploadApi from '~/api/service/uploadApi';
import { BookingDetail } from '..';
import authApi from '~/api/user/Security/authApi';
import funcUtils from '~/utils/funcUtils';
const cx = classNames.bind(styles);
function BookingCombo(props) {
    const { priceServices, showtime, seatBooking } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [comboQuantities, setComboQuantities] = useState({});
    const [total, setTotal] = useState(0.0);
    const [listCombo, setListCombo] = useState({});
    const [selectedCombos, setSelectedCombos] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [account, setAccount] = useState({});
    useEffect(() => {
        console.log('priceService', priceServices);
        setLoaded(true);
        const account = authApi.getUser();
        setAccount(account);
        const loadCombo = async () => {
            // try {
            //     const resp = await priceServiceApi.findByCplx(2);
            //     setListCombo(resp.data);
            //     console.log('combo', resp.data);
            // } catch (error) {
            //     console.log('combo', error);
            // }
        };

        // if (isModalOpen) {
        loadCombo();
        // }
        return () => {
            setComboQuantities({});
            // setTotal({});
            setTotal(0);
        };
    }, [priceServices]);
    const showModal = () => {
        let listChoice = [];

        // Tạo ra list combo đã chọn để chuyển qua trang thông tin chi tiết
        Object.keys(comboQuantities).forEach((key) => {
            const price = priceServices.find((price) => price.service.id === parseInt(key) && comboQuantities[key] > 0);

            if (price) {
                const serviceChoose = {
                    service: price.service,
                    account: account,
                    quantity: comboQuantities[key],
                    price: price.price * comboQuantities[key],
                };
                listChoice.push(serviceChoose);
            }
        });
        // console.log('selectCombo_bookingcombo', selectedCombos);
        setSelectedCombos(listChoice);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handlePlus = async (service, price) => {
        // let priceDb = priceServices.find((pr) => service.id === pr.service.id);
        try {
            const resp = await serviceApi.getById(service.id);
            const serviceDb = resp.data;
            if (serviceDb != null) {
                if (serviceDb.quantity <= comboQuantities[serviceDb.id]) {
                    funcUtils.notify(`Rất tiếc số lượng chỉ còn ${serviceDb.quantity} sản phẩm`, 'warning');
                    return;
                }
            }
            setTotal((pr) => (pr += price));
            setComboQuantities((prevQuantities) => ({
                ...prevQuantities,
                [service.id]: (prevQuantities[service.id] || 0) + 1,
            }));
        } catch (error) {
            console.log('error', error);
        }
    };

    const handleMinus = (service, price) => {
        if (comboQuantities[service.id] > 0) {
            setTotal((pr) => (pr -= price));
            setComboQuantities((prevQuantities) => ({
                ...prevQuantities,
                [service.id]: prevQuantities[service.id] - 1,
            }));
        }
    };

    const [ellipsis, setEllipsis] = useState(true);
    return (
        <>
            {/* {priceServices.lenght > 0 && ( */}
            <div className={cx('wrapper')}>
                {/* <Button onClick={showModal}>Open</Button> */}
                <BookingDetail
                    showtime={showtime}
                    seatBooking={seatBooking}
                    selectedCombos={selectedCombos}
                    open={isModalOpen}
                    onCancel={handleCancel}
                    destroyOnClose={true}
                />
                <Modal
                    {...props}
                    title="Combo - bắp nước"
                    // open={isModalOpen}
                    width={520}
                    // onCancel={handleCancel}
                    footer={[
                        <div key="wrappFooter" className={cx('wrapp-footer-modal')}>
                            <div className={cx('info-total')}>
                                <span className={cx('title')}>Tổng cộng: </span>
                                <span className={cx('amount')}>
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(total)}
                                </span>
                            </div>
                            <Button type="primary" onClick={showModal} className={cx('btn-continue')}>
                                Tiếp tục
                            </Button>
                        </div>,
                    ]}
                >
                    <Row>
                        {loaded &&
                            priceServices.map((combo) => (
                                <Col key={combo.service.id} className={cx('wrapp-content')} span={24}>
                                    <Row gutter={10}>
                                        <Col span={8}>
                                            <div className={cx('wrapp-box-image')}>
                                                <img
                                                    className={cx('image')}
                                                    src={uploadApi.get(combo.service.image)}
                                                    alt=""
                                                />
                                            </div>
                                        </Col>
                                        <Col span={16}>
                                            <div className={cx('wrapp-box-info')}>
                                                <ul>
                                                    <li className={cx('combo-header')}>
                                                        <span className={cx('combo-name-inner')}>
                                                            {combo.service.name}
                                                        </span>
                                                        <span> - </span>
                                                        <span className={cx('price-combo-inner')}>
                                                            {new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            }).format(combo.price)}
                                                        </span>
                                                    </li>
                                                    <li className={cx('combo-description')}>
                                                        <Paragraph
                                                            ellipsis={
                                                                ellipsis
                                                                    ? {
                                                                          rows: 4,
                                                                          expandable: true,
                                                                          symbol: 'Xem thêm',
                                                                      }
                                                                    : false
                                                            }
                                                        >
                                                            {combo.service.description}
                                                        </Paragraph>
                                                    </li>
                                                    <li className={cx('wrapp-quatity')}>
                                                        <div className={cx('wrapp-action')}>
                                                            <span
                                                                className={cx('btn-number', {
                                                                    disabled:
                                                                        comboQuantities[combo.service.id] <= 0 ||
                                                                        comboQuantities[combo.service.id] === undefined,
                                                                })}
                                                                onClick={() => handleMinus(combo.service, combo.price)}
                                                            >
                                                                <FontAwesomeIcon icon={solidIcon.faCircleMinus} />
                                                            </span>
                                                            <Input
                                                                readOnly
                                                                className={cx('number')}
                                                                value={comboQuantities[combo.service.id] || 0}
                                                            />
                                                            <span
                                                                className={cx('btn-number')}
                                                                onClick={() => handlePlus(combo.service, combo.price)}
                                                            >
                                                                <FontAwesomeIcon icon={solidIcon.faCirclePlus} />
                                                            </span>
                                                        </div>
                                                        <div className={cx('wrapp-info-quantity')}>
                                                            Combo hiện có: <b>{combo.service.quantity} </b>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </Col>
                                        <Divider />
                                    </Row>
                                </Col>
                            ))}
                    </Row>
                </Modal>
            </div>
            {/* )} */}
        </>
    );
}

export default BookingCombo;
