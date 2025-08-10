import React, { useState, useEffect } from 'react';
import { Button, Modal, Row, Col, Input } from 'antd';
import { EnvironmentOutlined, AimOutlined } from '@ant-design/icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import style from './ViTri.module.scss';
import LoaiRap from '../LoaiRap/LoaiRap';
import funcUtils from '~/utils/funcUtils';
import { provinceUserApi } from '~/api/user/showtime/writeApi';

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
    // console.log(dataProvinces);
    // console.log(searchName);

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

    // console.log(provinces);

    return (
        <Row style={{ height: '100%' }}>
            <Col
                span={24}
                style={{
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div className={cx('wrapper-vitri')}>
                    <span className={cx('title')}>Vị trí </span>
                    <Button className={cx('btn-first')} onClick={showModal} icon={<EnvironmentOutlined />}>
                        {provinces.name}
                        <span className={cx('btn-first-icon-right')}>
                            <FontAwesomeIcon icon={faAngleDown} />
                        </span>
                    </Button>
                    <Modal
                        maskClosable={false}
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
            </Col>
            <Col span={24} style={{ height: 642.8 }}>
                <LoaiRap province={provinces} />
            </Col>
        </Row>
    );
}

export default ViTri;
