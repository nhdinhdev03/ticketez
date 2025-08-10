import { CloseCircleOutlined } from '@ant-design/icons';
import { faArrowRight, faChevronLeft, faChevronRight, faTicket, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Modal, Row, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import style from './home.module.scss';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import img from '~/assets/img';
import AdminDashboardApi from '~/api/admin/AdminDashboard';
import axiosClient from '~/api/global/axiosClient';
import { animateScroll as scroll } from 'react-scroll';

const cx = classNames.bind(style);

const { Paragraph,Title } = Typography;

const SampleNextArrow = (props) => {
    const { onClick } = props;
    return (
        <div className={cx('control-btn')} onClick={onClick}>
            <button className={cx('next')}>
                <FontAwesomeIcon icon={faChevronRight} />
            </button>
        </div>
    );
};
const SamplePrevArrow = (props) => {
    const { onClick } = props;
    return (
        <div className={cx('control-btn')} onClick={onClick}>
            <button className={cx('prev')}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
        </div>
    );
};

const HomeIndex = () => {
    const [isLoadingPage, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [setLoading] = useState(false);
    const [dataTotalTicket, setDataTotalTicket] = useState(1);
    const [dataTotalUser, setDataTotalUser] = useState(1);
    const [items, setItems] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 2.3,
        slidesToScroll: 2.3,
        initialSlide: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2.3,
                    slidesToScroll: 2.3,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2.3,
                    slidesToScroll: 2.3,
                    initialSlide: 2.3,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2.3,
                    slidesToScroll: 2.3,
                },
            },
        ],
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    };

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

    useEffect(() => {
        //đổ dữ liệu

        const getList = async () => {
            try {
                const [totalTicket, totalUser] = await Promise.all([
                    AdminDashboardApi.getTotalTickets(),
                    AdminDashboardApi.getTotalUser(),
                ]);
                setDataTotalTicket(totalTicket.data);
                setDataTotalUser(totalUser.data);
            } catch (error) {
                console.log(error);
            }
        };
        getList();

        const fetchDataMovie = async () => {
            try {
                const resp = await axiosClient.get(`movie/get/fivemovie`);
                const data = resp.data;
                console.log(data);
                setItems(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDataMovie();
    }, []);

    const totalTickets = dataTotalTicket[0]?.total_tickets;
    const totalUsers = dataTotalUser[0]?.total_user;

    const CustomCloseIcon = ({ onClick }) => (
        <CloseCircleOutlined
            onClick={onClick}
            style={{ fontSize: '30px', color: 'gray', marginTop: '-55px', marginRight: '-55px' }}
        />
    );

    const handleClick = () => {
        scroll.scrollTo(1700);
    };
      

    return (
        <div className=" tw-mt-[20px] tw-text-black tw-container tw-mx-auto tw-px-[150px] tw-leading-normal tw-text-left tw-mb-[30px] ">
            <Row gutter={24} className="">
                <Col lg={8} className="tw-mt-[40px]">
                    <h1>
                        Chào mừng bạn đến với{' '}
                        <span className="tw-text-[var(--primary-background-color)]">TicketEZ</span>
                    </h1>
                    <div className="tw-text-justify tw-leading-relaxed">
                        Đến với{' '}
                        <span className="tw-font-bold  tw-text-[var(--primary-background-color)]">TicketEZ</span>, bạn
                        có thể đặt vé xem phim nhanh chóng và tiện lợi. Chỉ cần vài thao tác đơn giản, bạn có thể tìm
                        kiếm phim, xem lịch chiếu, chọn rạp, suất chiếu, và chỗ ngồi. Chúng tôi cung cấp đa dạng chỗ
                        ngồi từ thường đến VIP, đồng thời hỗ trợ thanh toán bằng nhiều phương thức như thẻ ngân hàng, ví
                        điện tử. Hệ thống rộng lớn của Chúng tôi trải dài toàn quốc, giúp bạn dễ dàng tìm rạp chiếu gần
                        nhất.
                    </div>
                    <Row className="tw-mt-[20px]">
                        <Col lg={10}>
                            <div className="tw-text-4xl tw-text-[var(--primary--text-color)] tw-font-bold">
                                <FontAwesomeIcon icon={faTicket} />{' '}
                                {totalTickets != null
                                    ? totalTickets > 1000000
                                        ? (totalTickets / 1000000).toFixed(1) + 'M'
                                        : totalTickets > 1000
                                        ? (totalTickets / 1000).toFixed(1) + 'k'
                                        : totalTickets
                                    : null}
                            </div>
                            <span className="tw-text-gray-500">Tổng vé đã bán</span>
                        </Col>
                        <Col lg={14}>
                            <div className="tw-text-4xl tw-text-[var(--primary--text-color)] tw-font-bold">
                                <FontAwesomeIcon icon={faUser} />{' '}
                                {totalUsers != null
                                    ? totalUsers > 1000000
                                        ? (totalUsers / 1000000).toFixed(1) + 'M'
                                        : totalUsers > 1000
                                        ? (totalUsers / 1000).toFixed(1) + 'k'
                                        : totalUsers
                                    : null}
                            </div>
                            <span className="tw-text-gray-500">Tổng người dùng đăng kí</span>
                        </Col>
                    </Row>
                    <Button
                        onClick={handleClick}
                        className=" tw-mt-[20px]  tw-bg-[var(--primary--text-color)] tw-text-white tw-w-[50%] tw-h-[50px] tw-font-bold"
                    >
                        <span className="tw-mr-10">Đặt vé ngay</span> <FontAwesomeIcon icon={faArrowRight} />
                    </Button>
                </Col>
                <Col lg={16}>
                    {!isLoadingPage && (
                        <Slider
                            {...settings}
                            style={{
                                with: '100%',
                                alignItems: 'center',
                                display: 'flex',
                                margin: '0 auto',
                                marginTop: '70px',
                                marginLeft: '70px',
                            }}
                        >
                            {items && items.length > 0 ? (
                                items?.map((slide, index) => (
                                    <>
                                        <Link to={`/movie-details/${slide.movie.id}`}>
                                            <div key={slide.movie.id} className={cx('container')}>
                                                <Tag
                                                    className={cx('tag-overlay')}
                                                    color={slide.movie.mpaaRating.colorCode}
                                                >
                                                    {slide.movie.mpaaRating.ratingCode}
                                                </Tag>

                                                {/* <Tag color="#D80032" className={cx('tag-overlay2')}>
                                                <FontAwesomeIcon icon={faTicket} /> ĐẶT TRƯỚC
                                             </Tag> */}
                                                <img
                                                    alt=""
                                                    className={cx('img-overlay')}
                                                    src={`http://localhost:8081/api/upload/${slide.movie.poster}`}
                                                />
                                                <svg
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        showModal(slide);
                                                    }}
                                                    className={cx('icon-overlay')}
                                                    fill="#ffffff"
                                                    height="200px"
                                                    width="200px"
                                                    version="1.1"
                                                    id="Layer_1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                                    viewBox="-51.2 -51.2 614.40 614.40"
                                                    xmlSpace="preserve"
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
                                            <div>
                                                <Title level={5} className={cx('name-movie')} style={{ color: '#000' }}>
                                                    {slide.movie.title} <br />
                                                    <span className={cx('the-loai-phim')}>
                                                        {slide.genres.map((valueGenre, index) => (
                                                            <span className={cx('span')} key={index}>
                                                                {valueGenre.name}
                                                            </span>
                                                        ))}
                                                    </span>
                                                    <br />
                                                </Title>
                                            </div>
                                        </Link>
                                    </>
                                ))
                            ) : (
                                <div>
                                    <img src={img.notFoundLogo} alt="" style={{ marginLeft: '100px' }} />
                                    <span className="tw-text-gray-600 ">Không tìm thấy phim chiếu ngày hôm nay</span>
                                </div>
                            )}
                        </Slider>
                    )}
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
                                                true
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
                                        Đặt vé
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
                </Col>
            </Row>
        </div>
    );
};

export default HomeIndex;
