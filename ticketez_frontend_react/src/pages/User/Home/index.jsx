import React, { useState, useEffect } from 'react';
import './home.scss';
import axiosClient from '~/api/global/axiosClient';

import { Col, Row } from 'antd';
import ShowTimes from './showtimes';
import MovieShowing from './MovieShowing';
import MovieUpcoming from './MovieUpcoming';
import HomeIndex from './Home';
import authApi from '~/api/user/Security/authApi';

const Homes = () => {
    const [items, setItems] = useState(null);
    const deleteSeatChooseByAccount = async () => {
        try {
            const acc = authApi.getUser();
            if (acc != null) {
                const respSeactChoose = await axiosClient.post('seat-choose/deleteSeatChoose-ServiceChooseByAcc', acc);
                console.log('respSeactChoose', respSeactChoose);
            }
        } catch (error) {
            console.log('respSeactChoose', error);
        }
    };
    const fetchDataMovie = async () => {
        try {
            const resp = await axiosClient.get(`movie/get/fivemovie`);
            const data = resp.data;
            // console.log(data);
            setItems(data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        deleteSeatChooseByAccount();
        fetchDataMovie();
    }, []);

    return (
        <>
            <Row className="home">
                <Col span={24}>
                    <Col span={24}>
                        <HomeIndex items={items} />
                    </Col>
                    {/* {items && (
                        <Col span={24}>
                            <Home items={items} />
                        </Col>
                    )} */}
                </Col>
                <Col span={24}>
                    <MovieShowing />
                </Col>
                <Col span={24}>
                    <MovieUpcoming />
                </Col>
                {/* <Col span={24}>
                    <MovieType />
                </Col> */}
                <Col span={24}>
                    <h1 className="tw-text-[var(--primary--text-color)] tw-text-center">Lịch chiếu</h1>
                </Col>

                <Col
                    span={24}
                    style={{
                        // backgroundColor: '#ffffff',
                        height: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '-160px',
                    }}
                >
                    <ShowTimes />
                </Col>
            </Row>
        </>
    );
};

export default Homes;
