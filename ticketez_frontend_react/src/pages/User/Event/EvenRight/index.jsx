/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import uploadApi from '~/api/service/uploadApi';
import eventAPI from '~/api/user/event/eventAPI';

const EventRight = () => {
    const location = useLocation();
    const [dataEventByNew, setDataEventByNew] = useState(null);
    const [loading, setLoading] = useState(false);

    const [dataEventByNews, setDataEventByNews] = useState(null);

    const allowedPaths = ['/su-kien/tin-tuc', /^\/su-kien\/tin-tuc\/\d+$/];

    useEffect(() => {
        const getEventByNew = async () => {
            try {
                const isEventPage = allowedPaths.some((path) =>
                    typeof path === 'string' ? location.pathname === path : path.test(location.pathname),
                );
                if (isEventPage) {
                    const res = await eventAPI.getEventByPromotion();
                    setDataEventByNews(res.data);
                } else {
                    const res = await eventAPI.getEventByNew();
                    setDataEventByNews(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        getEventByNew();
    }, [location.pathname]);


    return (
        <>
            {dataEventByNews && dataEventByNews.length > 0 && (
                <Row gutter={[1, 10]} className="tw-mb-[50px]">
                    {dataEventByNews.slice(0, 3).map((event, index) => (
                        <Col key={index} span={24}>
                            {location.pathname === '/su-kien/khuyen-mai' ||
                            /^\/su-kien\/khuyen-mai\/\d+$/.test(location.pathname) ? (
                                <>
                                    <div
                                        className={`tw-relative tw-w-[90%] tw-h-[330px] tw-bg-white tw-shadow-lg tw-shadow-slate-300-500/50  tw-rounded-[20px]`}
                                    >
                                        <Link to={`/su-kien/tin-tuc/${event.id}`}>
                                            <img
                                                src={uploadApi.get(event.banner)}
                                                width="100%"
                                                height={184}
                                                className="tw-mr-[20px] tw-rounded-t-[20px]"
                                            />
                                            <h2
                                                className={`tw-text-left tw-p-[1rem] tw-mt-[-50px] tw-leading-normal tw-line-clamp-1 tw-h-[40px]  tw-w-[350px] tw-text-black hover:tw-text-[var(--primary-background-color)] tw-font-[var(--font-family)]`}
                                            >
                                                {event.name}
                                            </h2>
                                            <span className="tw-text-left tw-ml-[12px] tw-leading-normal tw-line-clamp-2 tw-text-gray-500 tw-mt-[-0px] tw-font-[var(--font-family)]">
                                                {event.name}
                                            </span>
                                            <p
                                                className={`tw-text-left tw-absolute tw-bottom-0 tw-left-0 tw-p-[1rem] tw-text-[var(--primary-background-color)] hover:tw-text-[var(--primany-text-hover-color)] tw-font-[var(--font-family)] tw-cursor-pointer`}
                                            >
                                                Xem chi tiết
                                                <FontAwesomeIcon icon={faChevronRight} className="tw-text-lg" />
                                            </p>
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <div
                                    className={`tw-relative tw-w-[90%] tw-h-[330px] tw-bg-white tw-shadow-lg tw-shadow-slate-300-500/50  tw-rounded-[20px]`}
                                >
                                    <Link to={`/su-kien/khuyen-mai/${event.id}`}>
                                        <img
                                            src={uploadApi.get(event.banner)}
                                            width="100%"
                                            height={184}
                                            className="tw-mr-[20px] tw-rounded-t-[20px]"
                                        />
                                        <h2
                                            className={`tw-text-left tw-p-[1rem] tw-mt-[-50px] tw-leading-normal tw-line-clamp-1 tw-h-[40px]  tw-w-[350px] tw-text-black hover:tw-text-[var(--primary-background-color)] tw-font-[var(--font-family)]`}
                                        >
                                            {event.name}
                                        </h2>
                                        <span className="tw-text-left tw-ml-[12px] tw-leading-normal tw-line-clamp-2 tw-text-gray-500 tw-mt-[-0px] tw-font-[var(--font-family)]">
                                            {event.name}
                                        </span>
                                        <p
                                            className={`tw-text-left tw-absolute tw-bottom-0 tw-left-0 tw-p-[1rem] tw-text-[var(--primary-background-color)] hover:tw-text-[var(--primany-text-hover-color)] tw-font-[var(--font-family)] tw-cursor-pointer`}
                                        >
                                            Xem chi tiết
                                            <FontAwesomeIcon icon={faChevronRight} className="tw-text-lg" />
                                        </p>
                                    </Link>
                                </div>
                            )}
                        </Col>
                    ))}
                </Row>
            )}
        </>
    );
};

export default EventRight;
