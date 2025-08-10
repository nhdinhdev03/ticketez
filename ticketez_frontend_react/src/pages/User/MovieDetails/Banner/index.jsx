/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import uploadApi from '~/api/service/uploadApi';
import classNames from 'classnames/bind';
import style from './Banner.module.scss';
import { Col, Modal, Row, Tag, Typography } from 'antd';
import axiosClient from '~/api/global/axiosClient';
import { CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const cx = classNames.bind(style);
const BannerDetail = () => {
    const { Paragraph, Title } = Typography;
    const { movieId } = useParams();
    const [dataMovie, setDaTaMovie] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [expanded, setExpanded] = useState(false);
    // console.log("123",dataMovie);
    const handleToggle = () => {
        setExpanded(!expanded);
    };

    const fetchDataMovie = async () => {
        try {
            const resp = await axiosClient.get(`movie/${movieId}`);
            const data = resp.data;
            setDaTaMovie(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDataMovie();
    }, [isDataLoaded, movieId]);

    useEffect(() => {
        if (dataMovie !== null) {
            setIsDataLoaded(true);
        }
    }, [dataMovie]);

    const background = {
        width: '100%',
        height: '100%',
    };
    const backgroundImage = {
        backgroundImage: `linear-gradient(to right, black 0%, black 10%, transparent 20%, transparent 80%, black 90%, black 100%), url(${uploadApi.get(
            dataMovie?.movie.poster,
        )})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100%',
        opacity: 0.09,
        position: 'absolute',
        zIndex: 0,
    };
    const imgCustom = {
        zIndex: 20,
    };
    const convertDurationToMinutes = (duration) => {
        // Check if duration is undefined or null
        if (!duration) {
            return 0;
        }

        // Split the duration string into hours, minutes, and seconds
        const [hours = 0, minutes = 0, seconds = 0] = duration.split(':').map(Number);

        // Convert hours and minutes to total minutes
        const totalMinutes = hours * 60 + minutes;

        return totalMinutes;
    };

    const MAX_CHARACTERS = 150;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [setLoading] = useState(false);
    const showModal = (movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };
    const CustomCloseIcon = ({ onClick }) => (
        <CloseCircleOutlined
            onClick={onClick}
            style={{ fontSize: '30px', color: 'gray', marginTop: '-55px', marginRight: '-55px' }}
        />
    );
    const handleOk = () => {
        setLoading(true);
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    };
    const [ellipsis] = useState(true);

    return (
        <div className="background" style={background}>
            <div style={backgroundImage}></div>
            <Row>
                <Col span={3}></Col>
                <Col span={18}>
                    <div className="background-wrapper">
                        <Row>
                            <Col span={4}>
                                <div style={imgCustom} className="tw-mt-20">
                                    <img src={uploadApi.get(dataMovie?.movie.poster)} alt="poster" width="256" />
                                    <div
                                        className="tw-hover:transform tw-hover:scale-190"
                                        style={{
                                            position: 'absolute',
                                            top: '55%',
                                            left: '70%',
                                            transform: 'translate(-50%, -50%)',
                                        }}
                                    >
                                        <svg
                                            onClick={() => showModal(dataMovie)}
                                            style={{ border: '2px solid #fff', borderRadius: '50%' }}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="#fff"
                                            width="60"
                                            height="60"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </Col>
                            <Col span={19}>
                                <div className="tw-mt-20 tw-ms-20 text-left">
                                    <div className=" tw-ms-20 tw-mt-2 tw-text-2xl tw-font-bold tw-text-white tw-md:text-4xl">
                                        <Tag color={dataMovie?.movie.mpaaRating.colorCode}>
                                            {dataMovie?.movie.mpaaRating.ratingCode}
                                        </Tag>
                                    </div>

                                    <div className=" tw-text-5xl tw-ms-20 tw-mt-2  tw-font-bold tw-text-white tw-md:text-4xl">
                                        {dataMovie?.movie.title}
                                    </div>
                                    <ul className="tw-ms-20 tw-mt-4 tw-flex tw-flex-wrap tw-items-center tw-text-2xl tw-text-white tw-text-opacity-60 tw-md:text-base">
                                        <li> {dataMovie?.movie.title}</li>
                                        <li className=" tw-mx-2 tw-text-base tw-font-normal">·</li>
                                        <li className="">
                                            {dataMovie?.movie.releaseDate
                                                ? new Date(dataMovie.movie.releaseDate).getFullYear()
                                                : ''}
                                        </li>

                                        <li className=" tw-mx-2 tw-text-base tw-font-normal">·</li>
                                        <li className="">
                                            {expanded
                                                ? dataMovie?.movie.duration
                                                : convertDurationToMinutes(dataMovie?.movie.duration)}
                                            {expanded ? ' giờ' : ' phút'}
                                        </li>
                                    </ul>
                                    <p className="tw-ms-20 tw-mt-14 tw-italic tw-text-2xl tw-text-white tw-text-opacity-60">
                                        <li> {dataMovie?.movie.title}</li>
                                    </p>
                                    <h3 className=" tw-mt-8 tw-text-xl tw-ms-20 tw-font-bold tw-text-white tw-md:text-xl">
                                        Nội dung
                                    </h3>

                                    <div
                                        className={`tw-mt-4 tw-ms-20 tw-text-xl tw-leading-relaxed tw-text-white tw-text-opacity-70 ${
                                            expanded ? 'tw-h-auto' : 'tw-h-20 overflow-hidden'
                                        }`}
                                    >
                                        {expanded
                                            ? dataMovie?.movie.description
                                            : `${dataMovie?.movie.description.slice(0, MAX_CHARACTERS)}${
                                                  dataMovie?.movie.description.length > MAX_CHARACTERS ? '...' : ''
                                              }`}
                                        {!expanded && dataMovie?.movie.description.length > MAX_CHARACTERS && (
                                            <span
                                                className="tw-read-or-hide tw-cursor-pointer tw-pl-1 tw-hover:underline tw-text-yellow-300"
                                                onClick={handleToggle}
                                            >
                                                ...Xem thêm
                                            </span>
                                        )}
                                        {expanded && (
                                            <span
                                                className="tw-read-or-hide tw-cursor-pointer tw-pl-1 tw-hover:underline tw-text-yellow-300"
                                                onClick={handleToggle}
                                            >
                                                Thu gọn
                                            </span>
                                        )}
                                    </div>
                                    <div className="tw-text-xl tw-ms-20 tw-mt-2 tw-text-white tw-md:text-4xl tw-text-opacity-60">
                                        <Row>
                                            <Col span={4}>
                                                <div>Ngày chiếu</div>
                                                <div className="tw-mt-1 tw-font-bold text-lg tw-text-white tw-text-opacity-90">
                                                    <li className="">
                                                        {moment(dataMovie?.movie.releaseDate).format('DD-MM-YYYY')}
                                                    </li>
                                                </div>
                                            </Col>
                                            <Col span={14}>
                                                {' '}
                                                <div>Thể loại </div>
                                                <div className="tw-mt-1 tw-font-bold tw-text-white tw-text-opacity-90 tw-flex">
                                                    {dataMovie?.genres.map((genre, index) => (
                                                        <React.Fragment key={genre.id}>
                                                            <li>{genre.name}</li>
                                                            {index < dataMovie.genres.length - 1 && (
                                                                <span className="tw-mx-2">|</span>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </Col>
                                            <Col span={6}>
                                                <div>Quốc gia</div>
                                                <div className="tw-mt-1 tw-font-bold tw-text-white tw-text-opacity-90">
                                                    {dataMovie?.movie.country}
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col span={3}></Col>
            </Row>
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
                                        className={cx('img-modal')}
                                        src={`http://localhost:8081/api/upload/${selectedMovie.movie.poster}`}
                                    />
                                ) : (
                                    ''
                                )}
                            </Col>
                            <Col lg={21} className={cx('name-video-modal')}>
                                <Title level={5}>
                                    {selectedMovie ? selectedMovie.movie.title : ''} - {''}
                                    <span className={cx('theloai-modal')}>
                                        {selectedMovie?.genres.map((valueGenre, index) => (
                                            <span className={cx('span')} key={index}>
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
    );
};

export default BannerDetail;
