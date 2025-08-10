import { Col, Row, Card } from 'antd';
import './showtime.scss';
import ViTri from './ViTri/ViTri';

function ShowTimes() {
    return (
        <div className="wrapper">
            <Card bordered={false} style={{ width: 1088 }}>
                <Row>
                    <Col span={24} className="bo" style={{ backgroundColor: '#ffffff' }}>
                        <ViTri />
                    </Col>
                </Row>
            </Card>
        </div>
    );
}

export default ShowTimes;
