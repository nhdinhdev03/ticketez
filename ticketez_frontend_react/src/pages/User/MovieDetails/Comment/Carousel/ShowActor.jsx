import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import ProductCard from "./card";
import classNames from 'classnames/bind';
import style from './ShowActor.module.scss';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { movieApi } from "~/api/admin";
import { useParams } from 'react-router-dom';
import funcUtils from './../../../../../utils/funcUtils';
import reviewApi from "~/api/user/review/reviewApi";
import { Card, Avatar, Typography, Image } from 'antd';
import uploadApi from '~/api/service/uploadApi';

const cx = classNames.bind(style);
const SampleNextArrow = (props) => {
    const { onClick } = props;
    return (
        <div className={cx('control-btn')} onClick={onClick}>
            <button className={cx('next')}>
                <i className="fa fa-chevron-right"></i>
            </button>
        </div>
    );
};
const SamplePrevArrow = (props) => {
    const { onClick } = props;
    return (
        <div className={cx('control-btn')} onClick={onClick}>
            <button className={cx('prev')}>
                <i className="fa fa-chevron-left"></i>
            </button>
        </div>
    );
};

const ActorSlider = () => {
    // const slides = Array.from({ length: 12 }, (_, index) => ({
    //     img: ``
    // }));

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 3,
        initialSlide: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 6,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 6,
                    initialSlide: 6
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 6
                }
            }
        ],
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    };
    const [loading, setLoading] = useState(false);
    const { movieId } = useParams();
    const [data, setData] = useState([{ actors: [], directors: [] }]);
    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            try {
                const res = await reviewApi.getActorAndDirectorId(movieId);

                setData({
                    actors: res.data.actorAndDirectorsObj.actors,
                    directors: res.data.actorAndDirectorsObj.directors,
                  });
                setLoading(false);
                // console.log("123", res);
            } catch (error) {
                if (error.hasOwnProperty('response')) {
                    funcUtils.notify(error.response.data, 'error');
                } else {
                    console.log(error);
                }
            }
        };
        getList();
    }, []);
    // console.log("1", data);
    return (

        <div className={cx('body')}>
            <h3 className={cx('title')}>Diễn viên & Đoàn làm phim </h3>
            <Slider {...settings} 
>
        {data.actors?.map((person, index) => (
          <div key={index}  style={{ marginRight: '10px' }}>
            <Card className="tw-w-inherit tw-border-none tw-!important">
              <Avatar 
              
               size={55} src={uploadApi.get(person.avatar)}>
            
              </Avatar>
              <Typography>{person.fullname}</Typography>
            </Card>
          </div>
        ))}
        {data.directors?.map((person, index) => (
          <div key={index}  style={{ marginRight: '10px' }}>
            <Card className="tw-w-inherit tw-border-none tw-!important">
              <Avatar size={55} src={uploadApi.get(person.avatar)}>
                {/* Nếu person.avatarUrl chưa có giá trị, bạn có thể sử dụng một ảnh mặc định */}
              </Avatar>
              <Typography>{person.fullname}</Typography>
            </Card>
          </div>
        ))}
      </Slider>
        </div>
    );
}

export default ActorSlider;
