/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import { faChevronRight, faFireFlameCurved } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { eventApi } from '~/api/admin';
import uploadApi from '~/api/service/uploadApi';
import eventAPI from '~/api/user/event/eventAPI';
import { animateScroll as scroll } from 'react-scroll';
import EventDetailsRight from './EventDetailRight';
import EventDetailsBottom from './EventDetailBottom';

const EventDetails = () => {
    const location = useLocation();
    const [dataEventDetails, setDataEventByNew] = useState(null);
    const [dataEventDetailsRight, setDataEventByNewRight] = useState(null);
    const [loading, setLoading] = useState(false);
    const { eventId } = useParams();

    const allowedPaths = [/^\/su-kien\/tin-tuc\/\d+$/];


    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            try {
                const res = await eventApi.getId(eventId);
                setDataEventByNew(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };

        const getEventByNew = async () => {
            setLoading(true);
            try {
                const isEventPage = allowedPaths.some((path) =>
                    typeof path === 'string' ? location.pathname === path : path.test(location.pathname),
                );

                if (isEventPage) {
                    const res = await eventAPI.getEventByNew();
                    setDataEventByNewRight(res.data);
                } else {
                    const res = await eventAPI.getEventByPromotion();
                    setDataEventByNewRight(res.data);
                }
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };

        getList();
        getEventByNew();
    }, [ eventId, location.pathname]);


    return (
        <>
            <div className="tw-container tw-mx-auto tw-px-[150px] tw-bg-white tw-text-black">
                <Row gutter={22}>
                    <Col lg={16} className="tw-mb-[20px]">
                        <img
                            src={uploadApi.get(dataEventDetails?.banner)}
                            width="100%"
                            height={344}
                            className="tw-rounded-md tw-mt-[59px]"
                        />
                        <div className="tw-font-bold tw-text-[var(--primary-background-color)] tw-text-left tw-text-4xl tw-mt-[-40px] tw-mb-[25px]">
                            {dataEventDetails?.name}
                        </div>
                        <div className=" tw-text-gray-500 tw-text-left tw-text-xl tw-mt-[-20px]  tw-mb-[25px] tw-font-[var(--font-family)]"></div>
                        <div className="  tw-text-left tw-text-xl tw-mb-[25px] tw-font-[var(--font-family)]">
                            {location.pathname === '/su-kien/tin-tuc' ||
                            /^\/su-kien\/tin-tuc\/\d+$/.test(location.pathname) ? (
                                <>
                                    <div className="tw-mt-[30px]">
                                        <span className="tw-text-yellow-500 tw-text-3xl">Tin tức {''}</span>
                                        <span className="tw-text-gray-500">
                                            · {moment(dataEventDetails?.startDate).format('DD-MM-YYYY ')} 👉 {''}
                                            {moment(dataEventDetails?.endDate).format('DD-MM-YYYY ')}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="tw-mt-[30px]">
                                    <span className="tw-text-green-500 tw-text-3xl">Khuyến mãi {''}</span>
                                    <span className="tw-text-gray-500">
                                        · {moment(dataEventDetails?.startDate).format('DD-MM-YYYY ')} 👉 {''}
                                        {moment(dataEventDetails?.endDate).format('DD-MM-YYYY ')}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="tw-text-left tw-leading-normal ">
                            {dataEventDetails?.description !== null && (
                                <span
                                    className=""
                                    dangerouslySetInnerHTML={{ __html: dataEventDetails?.description }}
                                />
                            )}
                        </div>
                    </Col>
                    <Col
                        lg={8}
                        style={{
                            borderLeft: '1px solid #D4D4D4',
                            maxHeight: 'calc(100vh - 100px)',
                        }}
                        className="tw-sticky tw-top-0  overflow-y-auto"
                    >
                        <p className="tw-font-semibold tw-text-[var(--primary-background-color)] tw-text-left tw-text-3xl tw-mt-[19px] tw-mb-[10px]">
                            <FontAwesomeIcon icon={faFireFlameCurved} className="text-2xl mr-1" />
                            {location.pathname === '/su-kien/tin-tuc' ||
                            /^\/su-kien\/tin-tuc\/\d+$/.test(location.pathname)
                                ? ' Tin tức '
                                : ' Khuyến mãi '}
                            liên quan
                        </p>
                        <EventDetailsRight data={dataEventDetails} dataEventByRight={dataEventDetailsRight} />
                    </Col>
                </Row>
                <div>
                    <p className="tw-font-semibold tw-text-[var(--primary-background-color)] tw-text-left tw-text-3xl tw-mt-[19px] tw-mb-[10px]">
                        <FontAwesomeIcon icon={faFireFlameCurved} className="text-2xl tw-mr-2" />
                        {location.pathname === '/su-kien/tin-tuc' || /^\/su-kien\/tin-tuc\/\d+$/.test(location.pathname)
                            ? ' Khuyến mãi '
                            : ' Tin tức '}
                        mới nhất
                    </p>
                    <EventDetailsBottom />
                </div>
            </div>
        </>
    );
};

export default EventDetails;
