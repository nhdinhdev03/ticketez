import { Col, Row, Card } from 'antd';
import './showtime.scss';
import ViTri from './ViTri/ViTri';

function ShowTimes() {
    return (
        <>  
            <div className="wrapper tw-shadow-2xl">
                <Card bordered={false} style={{ width: 1088, height: 694.8, overflow: 'hidden' }}>
                    <Row>
                        <Col span={24} className="bo" style={{ backgroundColor: '#ffffff' }}>
                            <ViTri />
                            {/* <Row>
                            <Col
                                span={24}
                                style={{
                                    height: 48,
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <ViTri />
                            </Col>
                            <Col span={24} style={{ height: 642.8 }}>
                                <Row style={{ height: '100%' }}>
                                    <Col span={24} style={{ height: 92.8 }}>
                                        <LoaiRap />
                                    </Col>

                                    <Col span={8} style={{ height: 550 }}>
                                        <CumRap />
                                    </Col>
                                    <Col span={16} style={{ height: 550, backgroundColor: 'brown' }}>
                                        4
                                    </Col>
                                </Row>
                            </Col>
                        </Row> */}
                        </Col>
                        {/* <Col span={24} estyl={{ minHeight: 550, maxHeight: 550, borderTop: '1px solid #e5e5e5' }}>
                        <Row className="bo" style={{ height: '100%' }}>
                            <Col span={8} style={{ height: '100%' }}>
                                3
                            </Col>
                            <Col span={16} style={{ height: '100%', backgroundColor: 'brown' }}>
                                4
                            </Col>
                        </Row>
                    </Col> */}
                    </Row>
                </Card>
            </div>
        </>
    );
}

export default ShowTimes;
