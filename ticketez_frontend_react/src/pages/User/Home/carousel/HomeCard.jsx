/* eslint-disable jsx-a11y/alt-text */
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row, Col } from 'antd';
import React from 'react';
import uploadApi from '~/api/service/uploadApi';
import { Link } from 'react-router-dom';

const HomeCard = ({ item: { movie, actors, genres } }) => {
    const style = {
        background:
            'linear-gradient(to right, black 0%, black 10%, transparent 20%, transparent 80%, black 90%, black 100%)',
    };

    const backgroundImage = {
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.3) 20%, rgba(0, 0, 0, 0) 80%, rgba(0, 0, 0, 0) 100%), url(${uploadApi.get(
            movie.banner,
        )})`,

        backgroundRepeat: 'no-repeat',
        // backgroundSize: 'cover',
        // backgroundPosition: 'center',
        width: '100%',
        height: '100%',
        opacity: 0.8,
        position: 'absolute',
        zIndex: 0,
    };

    return (
        <>
            <Row className="tw-bg-black">
                {' '}
                <div style={backgroundImage}></div>
                <Col>
                    <Row>
                        <Col style={{height:'1000px'}} span={18} className="col-title">
                            <div className="movie-title">{movie.title}</div>
                            <div className="rating ">
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star-half"></i>
                                <label>{movie.rating}(Đánh giá)</label>
                                <span className="border">GP</span>
                                <label>{movie.duration}</label>
                            </div>
                            <p className="description">{movie.description}</p>
                            <div className="cast">
                                <p className="tw-flex tw-items-center ">
                                    <span className="tw-mr-2">Diễn viên: </span>

                                    {actors.map((actor, index) => (
                                        <React.Fragment key={actor.id}>
                                            <li>{actor.fullname}</li>
                                            {index < actors.length - 1 && (
                                                <span className="tw-mx-2 tw-text-white">,</span>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </p>
                                <p className="tw-flex tw-items-center">
                                    <span className="tw-mr-2">Thể loại: </span>
                                    <div className="tw-mt-1 tw-font-bold tw-text-white tw-text-opacity-90 tw-flex">
                                        {genres.map((genre, index) => (
                                            <React.Fragment key={genre.id}>
                                                <li>{genre.name}</li>
                                                {index < genres.length - 1 && <span className="tw-mx-2">,</span>}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </p>
                            </div>
                            <Link to={`/movie-details/${movie.id}`}>
                                <button className="tw-mt-8 border tw-bg-[var(--pink-color)] tw-shadow-pink-900 tw-cursor-pointer hover:border hover:border-[var(--border-color)]">
                                    <FontAwesomeIcon icon={faPlay} />{' '}
                                    <span className="tw-hover:underline">Xem ngay</span>
                                </button>
                            </Link>
                        </Col>
                        <Col span={6}>
                            <div className="palyButton ">
                                <Link to={`/singlepage/${movie.id}`}>
                                    <button>
                                        <div className="img">
                                            <img src="./images/play-button.png" alt="" />
                                            <img src="./images/play.png" className="change" />
                                        </div>
                                        XEM TRAILER
                                    </button>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default HomeCard;
