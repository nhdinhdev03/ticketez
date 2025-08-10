import React from 'react';
import classNames from 'classnames/bind';
import style from './MovieType.module.scss';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ProductCard from './ProductCard';
import img from '~/assets/img';

const cx = classNames.bind(style);
const SampleNextArrow = (props) => {
    const { onClick } = props;
    return (
        <div className={cx('control-btn')} onClick={onClick}>
            <button className={cx('next')}>
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
                <i class="fa fa-chevron-left"></i>
            </button>
        </div>
    );
};

const MovieType = () => {
   const slides = [];

   for (let i = 0; i <= 20; i++) {
       slides.push({
           id: i,
           img: img.datrungphuongnam,
       });
   }

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        initialSlide: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5,
                    initialSlide: 5,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5,
                },
            },
        ],
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    };
    return (
        <div className={cx('body')} >
            <p className={cx('name-card')}>
                <span className={cx('title-name-card')}>Tìm phim chiếu rạp trên Ticketez</span>
            </p>

            <Slider {...settings} className={cx('slider')}>
                {slides.map((slide, index) => (
                    <div key={index} className={cx('slider')}>
                        <ProductCard imgSrc={slide.img} idSrc={slide.id} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default MovieType;
