/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import { faChevronCircleLeft, faChevronCircleRight, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import style from './listphi.module.scss';
import { Button, Col, Divider, Row, Tag } from 'antd';
import Slider from 'react-slick';
import { useEffect, useState } from 'react';
import funcUtils from '~/utils/funcUtils';
import { Link, useLocation, useParams } from 'react-router-dom';
import { movieApi } from '~/api/admin';
import { MovieShowingUserAPI } from '~/api/user/carousel';
import uploadApi from '~/api/service/uploadApi';
import { animateScroll as scroll } from 'react-scroll';
import reviewApi from '~/api/user/review/reviewApi';
import { LoadingOutlined } from '@ant-design/icons';
import img from '~/assets/img';

const cx = classNames.bind(style);
function MovieDetailsListMovieRight() {
    const SampleNextArrow = (props) => {
        const { onClick } = props;
        return (
            <div className={cx('control-btn')} onClick={onClick}>
                <button className={cx('next')}>
                    <FontAwesomeIcon icon={faChevronCircleRight} />

                    <i class="fa fa-chevron-right"></i>
                </button>
            </div>
        );
    };
    const SamplePrevArrow = (props) => {
        const { onClick } = props;
        return (
            <div className={cx('control-btn')} onClick={onClick}>
                <button className={cx('prev')}>
                    <FontAwesomeIcon icon={faChevronCircleLeft} />
                    <i class="fa fa-chevron-left"></i>
                </button>
            </div>
        );
    };

    const settings = {
        dots: false,
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 2,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    };

    const [loading, setLoading] = useState(false);
    const [dataGenres, setDataGenres] = useState(false);
    const [dataMovieShowingByGenres, setDataMovieShowingByGenres] = useState(null);
    const [selectedButton, setSelectedButton] = useState(null);
    const { movieId } = useParams();

    useEffect(() => {
        if (movieId) {
            const getList = async () => {
                setLoading(true);
                try {
                    const res = await movieApi.getById(movieId);
                    setDataGenres(res.data.genres);
                    setLoading(false);
                } catch (error) {
                    if (error.hasOwnProperty('response')) {
                        funcUtils.notify(error.response.data, 'error');
                    } else {
                        console.log(error);
                    }
                }
            };
            getList();
        }
        if (selectedButton == null) {
            const getListDataMovieShowingByGenres = async () => {
                setLoading(true);
                try {
                    const res = await MovieShowingUserAPI.getMovieShowing();
                    setDataMovieShowingByGenres(res.listMovieObjResp);
                    setLoading(false);
                } catch (error) {
                    if (error.hasOwnProperty('response')) {
                        funcUtils.notify(error.response.data, 'error');
                    } else {
                        console.log(error);
                    }
                }
            };
            getListDataMovieShowingByGenres();
        } else {
            const getListDataMovieShowingByGenres = async () => {
                setLoading(true);
                try {
                    const res = await reviewApi.getMovieByShowtimeShowingByGenres(selectedButton);
                    setDataMovieShowingByGenres(res.data.listMovieObjResp);
                    setLoading(false);
                } catch (error) {
                    if (error.hasOwnProperty('response')) {
                        funcUtils.notify(error.response.data, 'error');
                    } else {
                        console.log(error);
                    }
                }
            };
            getListDataMovieShowingByGenres();
        }
    }, [movieId, selectedButton]);

    const handleButtonClick = (value) => {
        setSelectedButton(value);
    };

    const scrollToTop = () => {
        scroll.scrollTo(0);
    };

    const location = useLocation();
     const isMovieDetailsPage = location.pathname.startsWith('/movie-details/');
    return (
        <div className=" tw-text-black tw-font-[var(--font-family)] ">
            {/* <div>thể loại có thể bạn thích</div> */}
            <div>
                {isMovieDetailsPage && (
                    <Slider
                        {...settings}
                        style={{
                            maxWidth: '400px',
                            display: 'flex',
                            margin: '0 auto',
                        }}
                        className="tw-ml-[15px] tw-mt-[-22px]"
                    >
                        <Button
                            className={`tw-w-[100px] hover:tw-bg-[var(--primary-background-color)] hover:tw-text-[var(--primany-text-background-color)] hover:tw-border-[var(--primary-background-color)] ${
                                selectedButton === null
                                    ? 'tw-bg-[var(--primary-background-color)] tw-text-white tw-border-[var(--primary-background-color)]'
                                    : 'tw-bg-gray-200 tw-border-gray-200'
                            }`}
                            onClick={() => handleButtonClick(null)}
                        >
                            Tất cả
                        </Button>
                        {dataGenres && dataGenres.length > 0
                            ? dataGenres?.map((value) => (
                                  <div key={value.id} className=" tw-pr-[10px]">
                                      <Button
                                          className={` hover:tw-bg-[var(--primary-background-color)] hover:tw-text-[var(--primany-text-background-color)] hover:tw-border-[var(--primary-background-color)] ${
                                              selectedButton === value.id
                                                  ? 'tw-bg-[var(--primary-background-color)] tw-text-white tw-border-[var(--primary-background-color)]'
                                                  : 'tw-bg-gray-200 tw-border-gray-200'
                                          }`}
                                          onClick={() => handleButtonClick(value.id)}
                                      >
                                          <span className="tw-max-w-[100px] tw-line-clamp-1">{value.name}</span>
                                      </Button>
                                  </div>
                              ))
                            : null}
                    </Slider>
                )}
            </div>
            {loading && (
                <div style={{ height: '100px' }}>
                    <div className={cx('loading')}>
                        <LoadingOutlined className={cx('imgL')} />
                    </div>
                </div>
            )}
            {!loading && (
                <>
                    {dataMovieShowingByGenres && dataMovieShowingByGenres.length > 1 ? (
                        dataMovieShowingByGenres
                            .filter((event) => event.movie.id != movieId)
                            .map((value, index) => (
                                <>
                                    <Link to={`/movie-details/${value.movie.id}`} onClick={scrollToTop}>
                                        <Row key={index}>
                                            <Col lg={8}>
                                                <div className="tw-relative tw-overflow-hidden tw-mt-[-10px]  tw-m-0 tw-w-[84px] tw-h-[124px] tw-ml-[20px] tw-rounded-lg">
                                                    <img
                                                        src={uploadApi.get(value.movie.poster)}
                                                        className={cx('img-overlay')}
                                                        alt=""
                                                        width={'84px'}
                                                        height={'124px'}
                                                    />
                                                    <div className="tw-absolute tw-left-0 tw-bottom-[-56px] tw-ml-[7px] tw-m-4">
                                                        <span className="tw-text-6xl tw-shadow-2xl tw-text-white tw-font-[var(--font-family)]">
                                                            {index + 1}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg={16} className="tw-leading-normal tw-text-left tw-mt-[-10px]">
                                                <Tag color={value.movie.mpaaRating.colorCode}>
                                                    {value.movie.mpaaRating.ratingCode}
                                                </Tag>
                                                <br />
                                                <span className="tw-mt-2 tw-line-clamp-2 tw-text-gray-950 tw-font-[var(--font-family)] hover:tw-text-[var(--primary--text-color)]">
                                                    {value.movie.title}
                                                </span>
                                                <span className={cx('the-loai-phim')} style={{ color: '#ffffff80' }}>
                                                    <p className="tw-text-gray-500 tw-mt-1 tw-text-lg">
                                                        {value.genres.map((valueGenre, index) => (
                                                            <span className={cx('span')} key={index}>
                                                                {valueGenre.name}
                                                            </span>
                                                        ))}
                                                    </p>
                                                </span>

                                                {value.movie.rating > 0 ? (
                                                    <div className="tw-mt-1">
                                                        <FontAwesomeIcon
                                                            icon={faStar}
                                                            className="tw-text-yellow-500 tw-text-lg"
                                                        />
                                                        <span className="tw-text-gray-500 "> {value.movie.rating}</span>
                                                    </div>
                                                ) : null}
                                            </Col>
                                        </Row>
                                    </Link>
                                    <Divider className=" tw-mb-[30px] tw-ml-[20px] tw-mt-[20px]" />
                                </>
                            ))
                    ) : (
                        <div>
                            <img src={img.notFoundLogo} alt="" className="tw-ml-[120px]" />
                            <span className="tw-text-gray-400 tw-text-xl tw-leading-normal tw-ml-[-230px]">
                                Không tìm thấy thể loại này trong phim đang chiếu
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default MovieDetailsListMovieRight;
