import React, { useState, useEffect, useRef } from 'react';
import { Button, Row, Col, Input } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { List, Skeleton } from 'antd';
import classNames from 'classnames/bind';
import style from './CumRap.module.scss';
import ListPhim from '../ListPhim/ListPhim';
import funcUtils from '~/utils/funcUtils';
import { cinemaComplexUserApi, cinemaUserApi } from '~/api/user/showtime';
import NotFountShowtime from '../NotFountShowtime/NotFountShowtime';
import { LoadingOutlined } from '@ant-design/icons';
import uploadApi from '~/api/service/uploadApi';

const cx = classNames.bind(style);

const CumRap = ({ NameAndProvince }) => {
    const [initLoading, setInitLoading] = useState(true);
    const [search, setSearch] = useState('');
    const so = 100;
    const [list, setList] = useState([]);

    const [cinemaComplex, setCinemaComplex] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (list?.length > 0) {
            setCinemaComplex(list[0]);
        } else {
            setCinemaComplex(null);
        }
    }, [list]);

    useEffect(() => {
        setLoading(true);

        const getCinemaComplexByNameAndProvince = async () => {
            try {
                const res = await cinemaComplexUserApi.getByResultsProvinceIdAndCinemaChainNameAndSearchName(
                    so,
                    NameAndProvince.province.id,
                    NameAndProvince.cinemaChainName,
                    search,
                );
                setList(res.data);
            } catch (error) {
                funcUtils.notify(error.response.data, 'error');
            } finally {
                setLoading(false);
                setInitLoading(false);
            }
        };

        getCinemaComplexByNameAndProvince();
    }, [NameAndProvince, search]);

    const handleCinemaComplex = (data) => {
        setCinemaComplex(data);
    };

    return (
        <>
            <Col
                span={8}
                style={{
                    minHeight: 550,
                    maxHeight: 550,
                    borderTop: '1px solid #e5e5e5',
                    borderRight: '1px solid #e5e5e5',
                }}
            >
                <div className={cx('khung')}>
                    {loading && (
                        <div className={cx('loading')}>
                            <LoadingOutlined className={cx('imgL')} />
                        </div>
                    )}
                    <Row>
                        <Col span={24} style={{ padding: 10 }}>
                            <Input
                                className={cx('cum-rap-inputSearch')}
                                suffix={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                                placeholder="Tìm theo tên rạp ..."
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Col>
                        <Col span={24}>
                            {' '}
                            <List
                                itemLayout="horizontal"
                                // loadMore={loadMore}
                                dataSource={list}
                                renderItem={(item, index) => (
                                    <List.Item
                                        className={cx('list-item', {
                                            active: cinemaComplex === null ? index === 0 : cinemaComplex.id === item.id,
                                        })}
                                        defaultValue={[1]}
                                        onClick={() => handleCinemaComplex(item)}
                                    >
                                        <Skeleton
                                            avatar
                                            title={false}
                                            paragraph={{ rows: 1 }}
                                            loading={item.loading}
                                            active
                                        >
                                            <div className={cx('sau-list')}>
                                                <div className={cx('border-img')}>
                                                    <img
                                                        className={cx('img')}
                                                        src={uploadApi.get(item.cinemaChain.image)}
                                                        alt="lỗi"
                                                    />
                                                </div>
                                                <span className={cx('title')}>{item.name}</span>
                                            </div>
                                            <FontAwesomeIcon className={cx('icon')} icon={faAngleRight} />
                                        </Skeleton>
                                    </List.Item>
                                )}
                            />
                            {list?.length === 0 && (
                                <NotFountShowtime
                                    titleFirst={'Không tìm thấy cụm rạp nào.'}
                                    titleLast={'Bạn hãy thử lại với phim khác hoặc rạp khác nha!'}
                                />
                            )}
                        </Col>
                    </Row>
                </div>
            </Col>
            <Col
                span={16}
                style={{
                    width: '100%',
                    minHeight: 550,
                    maxHeight: 550,
                    borderTop: '1px solid #e5e5e5',
                }}
            >
                <ListPhim cinemaComplex={cinemaComplex} />
            </Col>
        </>
    );
};
export default CumRap;
