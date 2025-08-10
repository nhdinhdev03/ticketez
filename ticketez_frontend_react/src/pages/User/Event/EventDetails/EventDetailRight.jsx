/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */

import { Col, Row } from 'antd';
import moment from 'moment';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import uploadApi from '~/api/service/uploadApi';

const EventDetailsRight = (props) => {
    const location = useLocation();

    return (
        <>
            {props.dataEventByRight &&
                props.dataEventByRight.length > 0 &&
                props.dataEventByRight
                    .filter((event) => event.id !== props?.data?.id)
                    .slice(0, 5)
                    .map((event) => (
                        <div key={event.id}>
                            {location.pathname === '/su-kien/tin-tuc' ||
                            /^\/su-kien\/tin-tuc\/\d+$/.test(location.pathname) ? (
                                <Link to={`/su-kien/tin-tuc/${event.id}`}>
                                    <Row className="tw-h-24 tw-mb-[45px]">
                                        <Col lg={8}>
                                            <img
                                                src={uploadApi.get(event.banner)}
                                                width={113}
                                                height={54}
                                                className="tw-rounded-md tw-mt-2 tw-mr-[20px]"
                                            />
                                        </Col>
                                        <Col lg={16}>
                                            <div
                                                className="
                                    tw-leading-normal 
                                    tw-text-left tw-line-clamp-3 tw-max-w-[180px]
                                    tw-mt-2 text-2xl tw-text-[var(--primary-background-color)] tw-font-semibold tw-no-underline  hover:tw-underline"
                                            >
                                                {event.name}
                                            </div>
                                            <span className="tw-leading-normal tw-text-left tw-text-gray-500 tw-line-clamp-3 tw-max-w-[220px] tw-mt-2 tw-text-lg tw-no-underline ">
                                                {moment(event.startDate).format('DD-MM-YYYY ')}
                                            </span>
                                        </Col>
                                    </Row>
                                </Link>
                            ) : (
                                <Link to={`/su-kien/khuyen-mai/${event.id}`}>
                                    <Row className="tw-h-24 tw-mb-[45px]">
                                        <Col lg={8}>
                                            <img
                                                src={uploadApi.get(event.banner)}
                                                width={113}
                                                height={54}
                                                className="tw-rounded-md tw-mt-2 tw-mr-[20px]"
                                            />
                                        </Col>
                                        <Col lg={16}>
                                            <div
                                                className="
                                    tw-leading-normal 
                                    tw-text-left tw-line-clamp-3 tw-max-w-[180px]
                                    tw-mt-2 text-2xl tw-text-[var(--primary-background-color)] tw-font-semibold tw-no-underline  hover:tw-underline"
                                            >
                                                {event.name}
                                            </div>
                                            <span className="tw-leading-normal tw-text-left tw-text-gray-500 tw-line-clamp-3 tw-max-w-[220px] tw-mt-2 tw-text-lg tw-no-underline ">
                                                {moment(event.startDate).format('DD-MM-YYYY ')}
                                            </span>
                                        </Col>
                                    </Row>
                                </Link>
                            )}
                        </div>
                    ))}
        </>
    );
};

export default EventDetailsRight;
