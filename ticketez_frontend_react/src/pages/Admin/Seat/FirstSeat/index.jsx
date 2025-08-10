import React, { useState, useEffect } from 'react';
import { Button, Modal, Divider, Space, Tag, Radio, Col, Row, Card } from 'antd';
import classNames from 'classnames/bind';
import style from './SearChart.module.scss';
// import '~/pages/User/Booking/SeatChart/chart.scss'
import axiosClient from '~/api/global/axiosClient';
import img, { listIcon } from '~/assets/img';

import funcUtils from '~/utils/funcUtils';

const cx = classNames.bind(style);

const radioStyle = {
    display: 'block',
    marginBottom: '10px',
    lineHeight: '1.5', // Chiều cao của Radio.Button
};

const radioStyl = {
    display: 'flex',
    flexDirection: 'column', // Hiển thị các tùy chọn theo chiều dọc
    alignItems: 'flex-start', // Đẩy các tùy chọn về phía trái
};

function SeatChart(props) {
    const { rows, columns, idSeatChart } = props;

    const createSeatArray = () => {
        let seatRows = rows; // Số hàng
        let seatColumns = columns; // Số cột
        // Tạo mảng chú thích hàng ở bên trái dựa vào số hàng
        const rowLabels = Array.from({ length: seatRows }, (_, index) => String.fromCharCode(65 + index));
        const seatState = {
            seat: [],
            way: [],
            normalSeat: [],
        };
        // Tạo mảng chỗ ngồi
        const rowHeader = rowLabels.map((label) => label + ' ');

        for (let i = 0; i < seatRows; i++) {
            const row = [];
            const rowAvailable = [];
            const rowLabel = rowLabels[i];
            for (let j = 1; j <= seatColumns; j++) {
                const seatNumber = `${rowLabel}${j}`;
                row.push(seatNumber);
                seatState.normalSeat.push(seatNumber);
            }

            seatState.seat.push(row);
        }

        // Thêm cột chú thích hàng ở bên trái
        seatState.seatHeader = rowHeader;

        return seatState;
    };
    const [isTableLoaded, setIsTableLoaded] = useState(true);

    const [showSeat, setShowSeat] = useState(true);
    const [reload, setReload] = useState(false);
    const [reload1, setReload1] = useState(false);
    const [allSeats, setAllSeats] = useState([]);
    const [normalSeat, setNormalSeat] = useState([]);
    const [allSeatsLocal, setAllSeatsLocal] = useState([]);
    const [seatState, setSeatState] = useState(createSeatArray());

    const [selectedSeatType, setSelectedSeatType] = useState('way'); // Mặc định ban đầu là 'normal-seat'

    const reSeting = () => {
        setSeatState(createSeatArray());
    };

    useEffect(() => {
        setNormalSeat(seatState.normalSeat);
    });

    const [choseWay, setChoseWay] = useState(1);

    const onClickData = (seat) => {
        const { normalSeat, way } = seatState;
        if (seatState.normalSeat.indexOf(seat) <= -1) {
            return;
        }
        if (selectedSeatType === 'way') {
            while (normalSeat.indexOf(seat) > -1) {
                normalSeat.splice(normalSeat.indexOf(seat), 1);
            }
            while (way.indexOf(seat) > -1) {
                way.splice(way.indexOf(seat), 1);
            }
            const row = seat.charCodeAt(0) - 'A'.charCodeAt(0);
            const column = seatState.seat[row].indexOf(seat);


            if (seatState.seat[row] && seatState.seat[row][column]) {
                let currentSeatName = seat;
                seatState.seat[row][column] = `way${choseWay}`;
                // seatState.seat[row][column] = choseWay + 1;
                setSeatState({
                    ...seatState,
                    way: [...way, `way${choseWay}`],
                });

                setChoseWay(choseWay + 1);
                // Đổi tên
                for (let i = column + 1; i < seatState.seat[row].length; i++) {
                    const temp = seatState.seat[row][i];
                    seatState.seat[row][i] = currentSeatName;
                    const updatedSeat = currentSeatName;
                    const indexToChange = seatState.normalSeat.indexOf(temp);
                    if (indexToChange !== -1) {
                        seatState.normalSeat[indexToChange] = updatedSeat;
                    }
                    currentSeatName = temp;
                }
            }
        }
    };

    const onClickUpdate = async () => {
        setIsTableLoaded(false);
        let check = 0;
        const dataArray = seatState.seatHeader.map((header, rowIndex) =>
            seatState.seat[rowIndex].map((seat_no) => ({
                name: seat_no,
                status: 1,
                description: 'ghế thông thường',
                seatType: {
                    id: seat_no.includes('way') ? 7 : 1,
                },
                seatChart: {
                    id: idSeatChart,
                },
            })),
        );
        const flattenedArray = [].concat(...dataArray);

   

        await new Promise((resolve) => {
            resolve();
        });
        try {
            const resp = await axiosClient.post(`seat`, flattenedArray);
        } catch (error) {
           
        }
        setIsTableLoaded(true);
        // handelUpdate(flattenedArray);
        setShowInfo('success');
    };

    const [showInfo, setShowInfo] = useState('');
    useEffect(() => {
        if (showInfo === 'success') {
            funcUtils.notify('Sửa thành công dữ liệu trong bảng', 'success');
        }
        if (showInfo === 'error') {
            funcUtils.notify('Sửa thành công dữ liệu trong bảng', 'error');
        }
    }, [showInfo]);

    const handelUpdate = async (dataSeat) => {
        let data = dataSeat;

        const respVip = await axiosClient.put(`seat/update`, data);
  
    };

    const onChange = (e) => {
        setSelectedSeatType(e.target.value);
    };
    return (
        <>
            <Card className={cx('card')}>
                <Row>
                    <Col className={cx('div-screen')} span={8} style={{ marginLeft: '140px' }}>
                        <hr className={cx('screen')} />
                        <h6 className={cx('screen-title')}>Màn hình</h6>
                    </Col>
                    <Col span={24}>
                        <Row>
                            <Col span={18}>
                                {isTableLoaded && (
                                    <table className="grid">
                                        {showSeat && (
                                            <tbody>
                                                {seatState.seatHeader.map((header, rowIndex) => (
                                                    <tr key={header}>
                                                        <td className="header-cell protected-element">{header}</td>
                                                        {seatState.seat[rowIndex].map((seat_no) => {
                                                            const seatClassName = `
                                                ${
                                                    seatState.way.indexOf(seat_no) > -1
                                                        ? 'way'
                                                        : seatState.normalSeat.indexOf(seat_no) > -1
                                                        ? 'normal-seat'
                                                        : 'normal-seat'
                                                } protected-element`;
                                                            return (
                                                                <td
                                                                    className={seatClassName}
                                                                    key={seat_no}
                                                                    onClick={() => onClickData(seat_no)}
                                                                >
                                                                    {seat_no}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        )}
                                    </table>
                                )}
                                {!isTableLoaded && (
                                    <div className="tw-text-white tw-text-2xl">
                                        <img src={img.loading} />
                                    </div>
                                )}
                            </Col>
                            <Col span={6} className={cx('col-right-radioBox-btn')}>
                                {idSeatChart && (
                                    <Row>
                                        <Col span={24}>
                                            <Radio.Group style={radioStyl} onChange={onChange} value={selectedSeatType}>
                                                <Radio style={radioStyle} value="way">
                                                    <Tag color="#404040">Đường đi</Tag>
                                                </Radio>
                                                <Button type="primary" danger onClick={reSeting}>
                                                    Mặc định
                                                </Button>
                                            </Radio.Group>
                                        </Col>
                                        <Col span={24} style={{ marginTop: 30 }}>
                                            <div className={cx('custom-btn')}>
                                                <Button
                                                    className={cx('btn')}
                                                    style={{ height: '50px', whiteSpace: 'normal' }}
                                                    type="primary"
                                                    onClick={onClickUpdate}
                                                >
                                                    Tạo ghế và đường đi
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                )}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>
        </>
    );
}

export default SeatChart;
