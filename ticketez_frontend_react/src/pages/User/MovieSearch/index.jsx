import { Row, Col } from 'antd';
import ListMovie from './ListMovie/index';
import MovieShowing from '../Home/MovieShowing';
import MovieUpcoming from '../Home/MovieUpcoming';
import { useEffect, useState } from 'react';
import axiosClient from '~/api/global/axiosClient';
import Home from '../Home/carousel/Home';
function MovieSearch1() {
    const [items, setItems] = useState(null);
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
    useEffect(() => {
        fetchDataMovie();
    }, []);
    return (
        <Row className="">
            <Col span={24} >
                {items && (
                    <Col span={24}>
                        <Home items={items} />
                    </Col>
                )}
            </Col>
            <Col span={24}>
                <MovieShowing />
            </Col>
            <Col span={24}>
                <MovieUpcoming />
            </Col>
            <Col
                span={24}
                className="tw-bg-[#FAFAFA] tw-flex tw-items-start tw-justify-center tw-w-[100%] tw-min-h-[500px] tw-py-[35px]"
            >
                <ListMovie />
            </Col>
        </Row>
    );
}

export default MovieSearch1;
