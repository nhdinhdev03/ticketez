import React, { useState, useEffect } from 'react';
import { Button, Modal, Row, Col, Input, Tooltip } from 'antd';
import { EnvironmentOutlined, AimOutlined } from '@ant-design/icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import style from './ViTri.module.scss';
import funcUtils from '~/utils/funcUtils';
import moment from 'moment-timezone';
import { provinceUserApi } from '~/api/user/showtime/writeApi';
import ListPhim from '../ListPhim/ListPhim';

import cinemaChainApi from '~/api/admin/managementCinema/cinemaChainApi';
import uploadApi from '~/api/service/uploadApi';
import { useParams } from 'react-router-dom';
import { movieApi } from '~/api/admin';

const cx = classNames.bind(style);

function ViTri() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [provinces, setProvinces] = useState({
        id: 2,
        name: 'Hồ Chí Minh',
    });
    const [searchName, setSearchName] = useState('');
    const [dataProvinces, setDataProvinces] = useState([]);

    useEffect(() => {
        const getProvince = async () => {
            try {
                const res = await provinceUserApi.getAllProvinceByName(searchName);
                if (res) {
                    setDataProvinces(res);
                } else {
                    setDataProvinces([]);
                    funcUtils.notify('Không nhận được dữ liệu từ API', 'error');
                }
            } catch (error) {
                funcUtils.notify(error.response.data, 'error');
            }
        };
        getProvince();
    }, [searchName]);

    const showModal = () => {
        setIsModalOpen(true);
        setSearchName('');
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSetProvince = (province) => {
        setProvinces(province);
        setIsModalOpen(false);
    };

    // ngay

    const [day, setDay] = useState(1);
    const [weekDays, setWeekDays] = useState([]);
    const daysOfWeekInVietnamese = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

    useEffect(() => {
        const currentTimeInVietnam = moment.tz('Asia/Ho_Chi_Minh');
        const nextWeekDays = [];
        for (let i = 0; i < 30; i++) {
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

    // loại rạp
    const [cinemaChainName, setCinemaChainName] = useState('tất cả');
    const [dataCinemaChainName, setDataCinemaChainName] = useState([]);
    const [dataMovieByID, setDataMovieByID] = useState([]);
    const { movieId } = useParams();
    useEffect(() => {
        if (movieId) {
            const getList = async () => {
                try {
                    const res = await movieApi.getById(movieId);
                    setDataMovieByID(res.data);
                } catch (error) {
                    if (error.hasOwnProperty('response')) {
                        funcUtils.notify(error.response.data, 'error');
                    } else {
                        console.log(error);
                    }
                }
            };
            getList();
        }
        const getCinemaChain = async () => {
            try {
                const res = await cinemaChainApi.get();
                if (res && res.data) {
                    setDataCinemaChainName(res.data);
                } else {
                    funcUtils.notify('Không nhận được dữ liệu từ API', 'error');
                }
            } catch (error) {
                funcUtils.notify(error.response ? error.response.data : 'An error occurred', 'error');
            }
        };
        getCinemaChain();
    }, [movieId]);

    // value props
    const value = {
        chooseDay,
        cinemaChainName,
        provinces,
    };

    return (
        <Row style={{ display: 'flex', paddingTop: 15 }}>
            <Col
                span={24}
                style={{
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div className={cx('khungne')}>
                    <span className={cx('ten-phim')}>
                        <Tooltip title={dataMovieByID?.movie?.title}>Lịch chiếu: {dataMovieByID?.movie?.title}</Tooltip>
                    </span>
                    <div className={cx('wrapper-vitri')}>
                        <Button className={cx('btn-first')} onClick={showModal} icon={<EnvironmentOutlined />}>
                            {provinces.name}
                            <span className={cx('btn-first-icon-right')}>
                                <FontAwesomeIcon icon={faAngleDown} />
                            </span>
                        </Button>
                        <Modal
                            className={cx('modal', 'slideIn')}
                            footer={
                                <Button className={cx('modal-footer-btn-close')} onClick={handleCancel}>
                                    Đóng
                                </Button>
                            }
                            open={isModalOpen}
                            onOk={handleOk}
                            closeIcon={false}
                            onCancel={handleCancel}
                        >
                            <div className={cx('icon-close')}>
                                <FontAwesomeIcon icon={faXmark} onClick={handleCancel} />
                            </div>

                            <Row className={cx('modal-header')}>
                                <Col span={24} className={cx('modal-header-col1')}>
                                    <span className={cx('modal-header-col1-title')}>Chọn địa điểm</span>
                                    <Input
                                        className={cx('modal-header-col1-inputSearch')}
                                        suffix={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                                        placeholder="Tìm địa điểm ..."
                                        onChange={(e) => setSearchName(e.target.value)}
                                        value={searchName}
                                    />
                                </Col>
                                <Col span={24} className={cx('modal-header-col2')}>
                                    {Array.isArray(dataProvinces) ? (
                                        dataProvinces.map((province, index) => (
                                            <Button
                                                key={index}
                                                type={province.id === provinces.id ? '' : 'text'}
                                                className={cx('btn', {
                                                    'btn-active': province.id === provinces.id,
                                                    'btn-text': province.id !== provinces.id,
                                                })}
                                                onClick={() => handleSetProvince(province)}
                                            >
                                                {province.name}
                                            </Button>
                                        ))
                                    ) : (
                                        <div>Loading...</div>
                                    )}
                                </Col>
                            </Row>
                        </Modal>

                        {/* <Button className={cx('btn-second')} icon={<AimOutlined />}>
                            Gần bạn
                        </Button> */}
                    </div>
                </div>
            </Col>
            <Col span={24} style={{ marginTop: 5, height: '100%', width: '100%' }}>
                <Row className={cx('wrapper')}>
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
                    <Col span={24} className={cx('col2')}>
                        <div className={cx('wrapper-loai-rap')}>
                            <div
                                className={cx('container', { active: cinemaChainName === 'tất cả' })}
                                onClick={() => setCinemaChainName('tất cả')}
                            >
                                <div className={cx('border')}>
                                    <img
                                        className={cx('img')}
                                        src="https://homepage.momocdn.net/next-js/_next/static/public/cinema/dexuat-icon.svg"
                                        alt=""
                                    />
                                </div>
                                <div className={cx('title')}>Tất cả</div>
                            </div>
                            {dataCinemaChainName.map((name, index) => (
                                <div
                                    key={index}
                                    className={cx('container', { active: cinemaChainName === name.name })}
                                    onClick={() => setCinemaChainName(name.name)}
                                >
                                    <div className={cx('border')}>
                                        <img className={cx('img')} src={uploadApi.get(name.image)} alt="" />
                                    </div>
                                    <div className={cx('title')}>{name.name} </div>
                                </div>
                            ))}
                        </div>
                    </Col>
                    <Col span={24} className={cx('col3')}>
                        <ListPhim propsValue={value} />
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default ViTri;
