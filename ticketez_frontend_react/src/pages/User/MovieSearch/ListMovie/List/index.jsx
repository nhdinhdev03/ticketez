import './list.scss';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import getColorForRating from '~/api/service/ColorForRating';
import uploadApi from '~/api/service/uploadApi';
import { Col, Modal, Rate, Row, Tag, Typography } from 'antd';
import { ClockCircleFilled, CloseCircleOutlined } from '@ant-design/icons';
const { Paragraph, Title } = Typography;

function List({ data }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [ellipsis] = useState(true);

    const showModal = (movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    const handleOk = () => {
        // setLoading(true);
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    };
    const CustomCloseIcon = ({ onClick }) => (
        <CloseCircleOutlined
            onClick={onClick}
            style={{ fontSize: '30px', color: 'gray', marginTop: '-55px', marginRight: '-55px' }}
        />
    );
    return (
        <>
            <div className="container-list">
                <Link to={`/movie-details/${data.movie.id}`}>
                    <div className=" tw-flex tw-items-center tw-justify-center">
                        <div className="tw-w-[200px] tw-h-[300px] `tw-overflow-hidden` tw-rounded ">
                            <div className="tag-overlay ">
                                
                                <Tag color={data.movie.mpaaRating.colorCode}>
                                                {data.movie.mpaaRating.ratingCode}
                                            </Tag>
                            </div>
                            <img
                                className="img-overlay"
                                src={uploadApi.get(data.movie.poster)}
                                alt=""
                            />

                            <svg
                                onClick={(e) => {
                                    e.preventDefault();
                                    showModal(data);
                                }}
                                className="icon-overlay"
                                fill="#ffffff"
                                cx={24}
                                cy={24}
                                r={23}
                                height="200px"
                                width="200px"
                                version="1.1"
                                id="Layer_1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                viewBox="-51.2 -51.2 614.40 614.40"
                                xmlSpace="preserve"
                                stroke="#ffffff"
                                strokeWidth="2"
                            >
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g
                                    id="SVGRepo_tracerCarrier"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    stroke="#CCCCCC"
                                    strokeWidth="1.024"
                                ></g>
                                <g id="SVGRepo_iconCarrier">
                                    <g>
                                        <g>
                                            <path d="M256,0C114.608,0,0,114.608,0,256s114.608,256,256,256s256-114.608,256-256S397.392,0,256,0z M256,496C123.664,496,16,388.336,16,256S123.664,16,256,16s240,107.664,240,240S388.336,496,256,496z"></path>
                                        </g>
                                    </g>
                                    <g>
                                        <g>
                                            <polygon points="189.776,141.328 189.776,370.992 388.672,256.16"></polygon>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>

                    <div className=" tw-flex tw-items-center tw-justify-center tw-mt-2">
                        <Title level={5} className="name-movie tw-w-[200px]  ">
                            <div className="tw-group  ">
                                <div className="tw-truncate tw-f ont-medium tw-text-[15px] tw-text-[#262626] tw-mt-1 group-hover:tw-text-[#EB2F96]">
                                    {data.movie.title}
                                </div>
                                <div className="the-loai-phim tw-mt-1 tw-font-bold group-hover:tw-text-[#FEA0CE]">
                                    {data.genres.map((genre,index) => (
                                        <span key={index} className="span tw-font-normal">{genre.name}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="rate-movie tw-mt-1 ">
                                <Rate disabled defaultValue={1} count={1} className="tw-text-[14px] tw-ml-[-25px]" />
                                <span className="tw-text-[13px] tw-ml-2 tw-font-light tw-text-[#525252]">
                                    {data.movie.rating}
                                </span>
                            </div>
                            {/* {slide.movie.rating > 0 ? (
                            <span className='rate-movie' style={{ color: '#ffffff' }}>
                                {slide.movie.rating}
                                <Rate
                                    disabled
                                    defaultValue={1}
                                    style={{ fontSize: '13px', marginLeft: '-20px' }}
                                />
                            </span>
                        ) : (
                            ''
                        )} */}
                        </Title>
                    </div>
                </Link>
                <Modal
                    width={700}
                    closeIcon={<CustomCloseIcon />}
                    onOk={handleOk}
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={[
                        <>
                            <Row gutter={24}>
                                <Col lg={3}>
                                    {selectedMovie ? (
                                        <img
                                            width={80}
                                            height={120}
                                            className="img-modal"
                                            src={`http://localhost:8081/api/upload/${selectedMovie.movie.poster}`}
                                            alt=""
                                        />
                                    ) : (
                                        ''
                                    )}
                                </Col>
                                <Col lg={21} className="name-video-modal">
                                    <Title level={5}>
                                        {selectedMovie ? selectedMovie.movie.title : ''} - {''}
                                        <span className="theloai-modal">
                                            {selectedMovie?.genres.map((valueGenre, index) => (
                                                <span className="span" key={index}>
                                                    {valueGenre.name}
                                                </span>
                                            ))}
                                        </span>{' '}
                                        <br />
                                    </Title>
                                    <Paragraph
                                        ellipsis={
                                            ellipsis
                                                ? {
                                                      rows: 4,
                                                  }
                                                : false
                                        }
                                        style={{ color: 'gray' }}
                                    >
                                        {selectedMovie ? selectedMovie.movie.description : ''}
                                    </Paragraph>
                                </Col>
                            </Row>
                        </>,
                    ]}
                >
                    <iframe
                        style={{
                            width: '107.5%',
                            height: '400px',
                            border: 'none',
                            borderTopLeftRadius: '3px',
                            borderTopRightRadiusRadius: '3px',
                            marginLeft: '-24px',
                            marginTop: '-24px',
                        }}
                        src={selectedMovie ? selectedMovie.movie.videoTrailer : ''}
                        title={selectedMovie ? selectedMovie.movie.title : ''}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </Modal>
            </div>
        </>
    );
}

export default List;
