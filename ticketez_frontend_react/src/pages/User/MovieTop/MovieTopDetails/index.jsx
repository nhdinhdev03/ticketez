import { Anchor, Button, Col, Divider, Modal, Row, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import articleApi from '~/api/admin/managementMovie/article';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import uploadApi from '~/api/service/uploadApi';
import classNames from 'classnames/bind';
import style from './movieDetail.module.scss';
import { CloseCircleOutlined } from '@ant-design/icons';
const { Paragraph, Title } = Typography;
const cx = classNames.bind(style);
const MovieTopDetails = () => {
    const [data, setData] = useState(null);
    const { articleId } = useParams();

    useEffect(() => {
        const getList = async () => {
            try {
                const res = await articleApi.getById(articleId);
                setData(res.data.listMovieObjResp);
            } catch (error) {
                console.log(error);
            }
        };

        getList();
    }, [articleId]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [setLoading] = useState(false);
    const [ellipsis] = useState(true);

    const showModal = (movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setLoading(true);
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

        console.log(" dd", data);
    return (
        <div className="tw-min-h-[1000px]">
            {data?.map((value, index) => (
                <div key={index}>
                    <div>
                        <img alt="" className=" tw-w-[100%] tw-h-[500px] " src={uploadApi.get(value.article.banner)} />
                    </div>
                    <div className="tw-container tw-mx-auto tw-px-[150px] tw-leading-none tw-text-black tw-text-left">
                        <Row gutter={15} className="tw-mt-[-50px]">
                            <Col lg={16}>
                                <h1 className="tw-text-black tw-font-semibold">{value.article.title}</h1>
                                <span className=" tw-line-clamp-2 tw-text-gray-600  tw-mt-4 tw-mb-4">
                                    {moment(value.article.create_date).format('DD-MM-YYYY')}
                                </span>
                                <span className="tw-text-gray-600 tw-font-normal tw-text-2xl tw-mb-4">
                                    {value.article.content}
                                </span>
                                <div>
                                    <Tag
                                        color="#E0E0E0"
                                        className="tw-w-[100px] tw-h-[7px] tw-ml-[350px] tw-mt-5  tw-mb-[20px]"
                                    ></Tag>
                                </div>
                                {value?.listMovieandGens?.map((movie, indexValue) => (
                                    <Row gutter={35} key={indexValue} className="tw-mt-5">
                                        <Col lg={5}>
                                            <div className="tw-relative">
                                                <img
                                                    alt=""
                                                    className="tw-aspect-[2/3] tw-w-[158px] tw-h-[237px]  tw-rounded-lg tw-absolute"
                                                    src={uploadApi.get(movie.movie.poster)}
                                                />
                                                <svg
                                                    className={cx(
                                                        'icon',
                                                        'tw-absolute tw-w-[50px] tw-h-[50px] tw-fill-white tw-top-[90px] tw-left-[55px] tw-cursor-pointer',
                                                    )}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        showModal(movie);
                                                    }}
                                                    viewBox="-51.2 -51.2 614.40 614.40"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                                    stroke="#ffffff"
                                                    strokeWidth="0.00512"
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
                                        </Col>
                                        <Col lg={17} className="tw-min-h-[237px]">
                                            <div className="tw-text-left  tw-leading-loose">
                                                <h1 id={`movie-${index}-${indexValue}`} className="tw-mt-[-12px]">
                                                    {movie.movie.title}
                                                </h1>
                                                <div className="tw-mt-[-20px]">
                                                    <span className="tw-font-bold"> Thể loại: </span>{' '}
                                                    <span className={cx('the-loai-phim')}>
                                                        {movie?.genres?.map((genres, index) => (
                                                            <span className={cx('span')} key={index}>
                                                                {' '}
                                                                {genres.name}{' '}
                                                            </span>
                                                        ))}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="tw-font-bold"> năm: </span>{' '}
                                                    <span> {moment(movie.movie.releaseDate).format('YYYY')}</span>
                                                </div>
                                                <div>
                                                    <span className="tw-font-bold"> Thời gian: </span>{' '}
                                                    <span> {movie.movie.duration} </span>
                                                </div>
                                                <div>
                                                    <span className="tw-font-bold"> Nội dung phim: </span>
                                                    <span>{movie.movie.description}</span>
                                                </div>
                                                <div>
                                                    <span className="tw-font-bold "> Quốc gia: </span>
                                                    <span>{movie.movie.country}</span>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg={2}>
                                            <Tag color="#176b87" className="tw-w-[40px] tw-h-[40px] tw-text-center ">
                                                <h1 className="tw-mt-[12px]">{indexValue + 1}</h1>
                                            </Tag>
                                        </Col>
                                        <Divider className=" tw-mb-[30px] tw-mt-[20px]" />
                                    </Row>
                                ))}
                            </Col>
                            <Col lg={8}>
                                <h1 className="tw-text-black tw-font-semibold">Mục lục</h1>
                                <Anchor
                                    replace
                                    items={value.listMovieandGens.map((movie, indexValue) => ({
                                        key: `movie-${index}-${indexValue - 1}`,
                                        href: `#movie-${index}-${indexValue - 1}`,
                                        title: (
                                            <div className="tw-p-[10px] tw-text-gray-500 tw-text-2xl ">
                                                {movie.movie.title}
                                            </div>
                                        ),
                                    }))}
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
            ))}
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
                                        alt=""
                                        width={80}
                                        height={130}
                                        className={cx('img-modal')}
                                        src={`http://localhost:8081/api/upload/${selectedMovie.movie.poster}`}
                                    />
                                ) : (
                                    ''
                                )}
                            </Col>
                            <Col lg={21} className={cx('name-video-modal', 'tw-pl-[20px]')}>
                                <Title level={5}>
                                    {selectedMovie ? selectedMovie.movie.title : ''} - {''}
                                    <span className={cx('theloai-modal')}>
                                        {selectedMovie?.genres.map((valueGenre, index) => (
                                            <span className={cx('span')} key={index}>
                                                {valueGenre.name}
                                            </span>
                                        ))}
                                    </span>
                                </Title>
                                <Paragraph
                                    ellipsis={
                                        ellipsis
                                            ? {
                                                  rows: 3,
                                              }
                                            : false
                                    }
                                    style={{ color: 'gray' }}
                                >
                                    {selectedMovie ? selectedMovie.movie.description : ''}
                                </Paragraph>
                            </Col>
                        </Row>
                        <div className="tw-mt-[-20px]">
                            <Button
                                href={`/movie-details/${selectedMovie?.movie.id}`}
                                className="tw-bg-[var(--primary--text-color)]  tw-border-[var(--primary--text-color))] tw-text-white tw-font-medium"
                            >
                               Xem chi tiết
                            </Button>
                            <Button
                                onClick={handleCancel}
                                className="tw-bg-gray-500 tw-border-gray-500 tw-text-white tw-font-medium"
                            >
                                Đóng
                            </Button>
                        </div>
                    </>,
                ]}
            >
                <iframe
                    style={{
                        width: '107.5%',
                        height: '400px',
                        border: 'none',
                        borderTopLeftRadius: '3px',
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
    );
};

export default MovieTopDetails;
