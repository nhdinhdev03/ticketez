import { Col, Row } from 'antd';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import uploadApi from '~/api/service/uploadApi';

const Top3Movie = (props) => {
    return (
        <div>
            <Row gutter={15} className="tw-mt-20 tw-cursor-pointer ">
                {props?.data?.splice(0, 3).map((value, index) => (
                    <Col lg={8} key={index}>
                        <Link to={`/movieTop/${value.article.id}`}>
                            <div className=" tw-relative   tw-overflow-hidden tw-rounded-lg  tw-poster-square tw-aspect-[4/3] hover:tw-opacity-[0.7]">
                                <div className="tw-absolute tw-top-0 tw-aspect-[2/3] tw-h-full tw-drop-shadow tw-poster-1">
                                    <img
                                        src={uploadApi.get(value?.movies[0]?.poster)}
                                        alt=""
                                        width={170}
                                        height={255}
                                        className="tw-absolute tw-inset-0 tw-h-full tw-w-full tw-rounded-lg tw-object-cover tw-z-[4] tw-border-solid tw-border-[2px] tw-border-white"
                                    />
                                </div>
                                <div className="tw-absolute tw-top-0 tw-aspect-[2/3] tw-h-full tw-drop-shadow tw-poster-2">
                                    <img
                                        src={uploadApi.get(value?.movies[1]?.poster)}
                                        alt=""
                                        width={170}
                                        height={255}
                                        className="tw-absolute tw-inset-0 tw-h-full tw-w-full tw-rounded-lg tw-object-cover tw-z-[3] tw-ml-[50px] tw-border-solid tw-border-[2px] tw-border-white"
                                    />
                                </div>
                                <div className="tw-absolute tw-top-0 tw-aspect-[2/3] tw-h-full tw-drop-shadow tw-poster-2">
                                    <img
                                        src={uploadApi.get(value?.movies[2]?.poster)}
                                        alt=""
                                        width={170}
                                        height={255}
                                        className="tw-absolute tw-inset-0 tw-h-full tw-w-full tw-rounded-lg tw-object-cover tw-ml-[100px]  tw-z-[2] tw-border-solid tw-border-[2px] tw-border-white"
                                    />
                                </div>
                                <div className="tw-absolute tw-top-0 tw-aspect-[2/3] tw-h-full tw-drop-shadow tw-poster-2">
                                    <img
                                        src={uploadApi.get(value?.movies[3]?.poster)}
                                        alt=""
                                        width={170}
                                        height={255}
                                        className="tw-absolute tw-inset-0 tw-h-full tw-w-full tw-rounded-lg tw-object-cover tw-ml-[150px] tw-z-[1] tw-border-solid tw-border-[2px] tw-border-white"
                                    />
                                </div>
                                <div className="tw-absolute tw-top-0 tw-aspect-[2/3] tw-h-full tw-drop-shadow tw-poster-2">
                                    <img
                                        src={uploadApi.get(value?.movies[4]?.poster)}
                                        alt=""
                                        width={170}
                                        height={255}
                                        className="tw-absolute tw-inset-0 tw-h-full tw-w-full tw-rounded-lg tw-object-cover tw-ml-[195px] tw-border-solid tw-border-[2px] tw-border-white"
                                    />
                                </div>
                            </div>
                            <div className="tw-text-left tw-mt-2 tw-leading-relaxed">
                                <h2 className="tw-mt-4 tw-text-[var(--primary--text-color)] tw-no-underline  hover:tw-underline">
                                    {value.article.title}
                                </h2>
                                <span className=" tw-line-clamp-2 tw-text-gray-400 tw-mt-1">
                                    {value.article.content}
                                </span>
                                <span className=" tw-line-clamp-2 tw-text-gray-400 tw-mt-1">
                                    {moment(value.article.create_date).format('DD-MM-YYYY')}
                                </span>
                            </div>
                        </Link>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Top3Movie;
