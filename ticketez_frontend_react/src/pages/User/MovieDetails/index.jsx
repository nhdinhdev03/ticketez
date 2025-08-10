import { Col, Row } from 'antd';
import ViTri from './showtimesDetails/ViTri/ViTri';
import Binhluan from './Comment/binhluan';
import ActorSlider from './Comment/Carousel/ShowActor';
import { useEffect } from 'react';
import Banner from './Banner';
import MovieDetailsListMovieRight from './ListPhimDangChieu';

function MovieDetails() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <>
            <Row style={{ display: 'flex', justifyContent: 'center' }}>
                <Col span={24} style={{ background: 'black', height: 480 }}>
                    <Banner />
                </Col>
                <Col
                    span={24}
                    style={{ display: 'flex', justifyContent: 'center', background: '#ffffff', minHeight: 2000 }}
                >
                    <Row style={{ width: 1088, height: 'auto' }}>
                        <Col span={16}>
                            <Row>
                                <Col span={24} style={{}}>
                                    <ViTri />
                                </Col>
                                <Col
                                    span={24}
                                    style={{
                                        backgroundColor: '#ffffff',
                                        display: 'flex',
                                        marginTop: 50,
                                        minHeight: 600,
                                    }}
                                >
                                    <Binhluan />
                                </Col>
                                <Col
                                    span={24}
                                    style={{
                                        backgroundColor: '#ffffff',
                                        display: 'flex',
                                        marginTop: 50,
                                        minHeight: 100,
                                    }}
                                >
                                    {/* overflowY: 'auto' */}
                                    <ActorSlider />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <MovieDetailsListMovieRight />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}

export default MovieDetails;
