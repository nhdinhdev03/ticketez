import React, { useState, useEffect } from 'react';
import { Button, Modal, Divider, Space, Tag, Radio, Col, Row, Card } from 'antd';
import classNames from 'classnames/bind';
import style from './SearChart.module.scss';
// import '~/pages/User/Booking/SeatChart/chart.scss'
import axiosClient from '~/api/global/axiosClient';
import funcUtils from '~/utils/funcUtils';
import { SyncOutlined } from '@ant-design/icons';
import img, { listIcon } from '~/assets/img';

const cx = classNames.bind(style);

const radioStyle = {
    display: 'block',
    marginBottom: '10px',
    lineHeight: '1.5',
};

const radioStyl = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
};

function SeatChart(props) {
    const { rows, columns, nameSeat, idSeatChart } = props;

    const createSeatArray = () => {
        let seatRows = rows;
        let seatColumns = columns;
        const rowLabels = Array.from({ length: seatRows }, (_, index) => String.fromCharCode(65 + index));
        const seatState = seatArray.seatType;
        const rowHeader = rowLabels.map((label) => label + ' ');
        var mangHaiChieu = new Array(seatRows);
        for (var i = 0; i < seatRows; i++) {
            mangHaiChieu[i] = new Array(seatColumns);
        }
        var index = 0;
        for (var i = 0; i < seatRows; i++) {
            for (var j = 0; j < seatColumns; j++) {
                if (index < allSeats.length) {
                    mangHaiChieu[i][j] = allSeats[index];
                    index++;
                }
            }
        }
        for (var i = 0; i < seatRows; i++) {
            const row = [];
            const rowAvailable = [];
            const rowLabel = rowLabels[i];
            for (let j = 0; j < seatColumns; j++) {
                const seatNumber = `${mangHaiChieu[i][j].name}`;
                row.push(seatNumber);
            }
            seatState.seat.push(row);
        }
        seatState.seatHeader = rowHeader;

        return seatState;
    };

    const [showSeat, setShowSeat] = useState(false);
    const [reload, setReload] = useState(false);
    const [allSeats, setAllSeats] = useState([]);
    const [seatState, setSeatState] = useState();
    const [selectedSeatType, setSelectedSeatType] = useState('normalSeat');
    const [seatType, setSeatType] = useState();
    const [seatArray, setSeatArray] = useState({
        seatType: { seat: [], seatUnavailable: nameSeat },
    });

    const getDataSeatArray = async () => {
        if (seatType) {
            // Tạo seatType
            const newObj = { ...seatArray };
            const newtest = { ...seatArray };
            // Tạo list ghế
            for (const seatTypeItem of seatType) {
                newObj.seatType[seatTypeItem.nickName] = [];
            }
            for (const seatTypeItem of seatType) {
                for (const seatItem of allSeats) {
                    if (seatTypeItem.id === seatItem.seatType.id) {
                        const respVip = await axiosClient.get(
                            `seat/by-seatchart-and-seattype/${idSeatChart}/${seatTypeItem.id}`,
                        );
                        const newVipSeats = respVip.data.map((seat) => seat.name);
                        for (const key in newObj.seatType) {
                            if (newObj.seatType.hasOwnProperty(key)) {
                                if (key === seatTypeItem.nickName) {
                                    newObj.seatType[key] = newVipSeats;
                                }
                            }
                        }
                    }
                }
            }
            setSeatArray(newObj);
        }
    };
    const fetchDaTaSeatType = async () => {
        const respAll = await axiosClient.get(`seatType/getAll`);
        setSeatType(respAll.data);
    };
    const fetchDataSeat = async () => {
        try {
            const respAll = await axiosClient.get(`seat/by-seatchart/${idSeatChart}`);
            setAllSeats(respAll.data);
            if (allSeats.length > 0) {
                setSeatState(createSeatArray());
                setShowSeat(true);
                setReload(false);
            } else {
                setReload(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDaTaSeatType();
        fetchDataSeat();
        getDataSeatArray();
        console.log(seatArray);
    }, [reload]);

    const onClickUpdate = () => {
        const listSeatUpdate = Object.keys(seatState).flatMap((key) => {
            const seatTypeMatch = seatType.find((seatType) => seatType.nickName === key);

            if (seatTypeMatch) {
                return seatState[key].map((seat) => ({
                    name: seat,
                    type: seatTypeMatch.id,
                }));
            }

            return [];
        });
        const updatedSeat = allSeats.map((allSeat) => {
            const matchingItem = listSeatUpdate.find((seat) => allSeat.name === seat.name);
            if (matchingItem) {
                return {
                    ...allSeat,
                    seatType: {
                        id: matchingItem.type,
                    },
                    seatChart: {
                        id: idSeatChart,
                    },
                };
            }
            return allSeat;
        });

        const flattenedArray = [].concat(...updatedSeat);

        handelUpdate(flattenedArray);
        setShowInfo('success');
    };
    const [showInfo, setShowInfo] = useState('');
    useEffect(() => {
        if (showInfo === 'success') {
            funcUtils.notify('Sửa thành công dữ liệu trong bảng', 'success');
            setShowInfo('s');
        }
        if (showInfo === 'error') {
            funcUtils.notify('Sửa thành công dữ liệu trong bảng', 'error');
            setShowInfo('s');
        }
    }, [showInfo]);

    const handelUpdate = async (dataSeat) => {
        let data = dataSeat;
        try {
            const respVip = await axiosClient.put(`seat/update`, data);
        } catch (error) {}
    };
    useEffect(() => {}, [seatState]);

    const onClickData = (seat) => {
        const { seatReserved, seatAvailable, vipSeat, normalSeat, seatUnavailable, coupleSeat } = seatState;
        seatType.forEach((value, index) => {
            if (value.nickName === selectedSeatType) {
                Object.keys(seatState).forEach((key) => {
                    // Xóa dữ liệu cũ tránh bị trùng
                    while (seatState[key].indexOf(seat) > -1) {
                        seatState[key].splice(seatState[key].indexOf(seat), 1);
                    }
                    seatType.forEach((seatType) => {
                        if (seatType.nickName === key && key === selectedSeatType) {
                            setSeatState({
                                ...seatState,

                                [seatType.nickName]: [...seatState[key], seat],
                            });
                        }
                    });
                });
            }
        });
    };
    const onChange = (e) => {
        setSelectedSeatType(e.target.value);
    };

    const [isTableLoaded, setIsTableLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await new Promise((resolve) => setTimeout(resolve, 4000));

            setIsTableLoaded(true);
        };

        fetchData();
    }, []);

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
                                <div>
                                    {isTableLoaded && (
                                        <table className="grid">
                                            {
                                                showSeat ? (
                                                    <tbody>
                                                        {seatState.seatHeader.map((header, rowIndex) => (
                                                            <tr key={header}>
                                                                <td className="header-cell protected-element">
                                                                    {header}
                                                                </td>
                                                                {seatState.seat[rowIndex].map((seat_no) => {
                                                                    let width = 1;
                                                                    const seatClassName =
                                                                        nameSeat.indexOf(seat_no) > -1
                                                                            ? '#404040'
                                                                            : Object.keys(seatState)
                                                                                  .map((key) => {
                                                                                      let color = null;

                                                                                      if (
                                                                                          seatState[key].indexOf(
                                                                                              seat_no,
                                                                                          ) > -1
                                                                                      ) {
                                                                                          seatType.forEach((seat) => {
                                                                                              if (
                                                                                                  seat.nickName === key
                                                                                              ) {
                                                                                                  color = seat.color;
                                                                                                  if (seat.width >= 2) {
                                                                                                      width =
                                                                                                          seat.width;
                                                                                                  }
                                                                                              }
                                                                                          });
                                                                                      }

                                                                                      return color;
                                                                                  })
                                                                                  .filter(Boolean)
                                                                                  .join(' ') || 'none';

                                                                    const style = {
                                                                        backgroundColor: seatClassName,
                                                                        visibility:
                                                                            seatClassName === '#121B2B'
                                                                                ? 'hidden'
                                                                                : 'visible',
                                                                        textIndent:
                                                                            seatClassName === '#121B2B'
                                                                                ? '-9999px'
                                                                                : '0',
                                                                        transform: `scaleX(${width})`,
                                                                        transformOrigin: 'top left',
                                                                    };
                                                                    return (
                                                                        <td
                                                                            className={`protected-element`}
                                                                            style={style}
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
                                                ) : null /* Nếu không cần hiển thị table, không render tbody */
                                            }
                                        </table>
                                    )}
                                    {!isTableLoaded && (
                                        <div className="tw-text-white tw-text-2xl">
                                            <img src={img.loading} />
                                        </div>
                                    )}
                                </div>
                            </Col>
                            <Col span={6} className={cx('col-right-radioBox-btn')}>
                                <Row>
                                    <Col span={24}>
                                        <div style={{ overflowY: 'auto', maxHeight: '200px' }}>
                                            <Radio.Group style={radioStyl} onChange={onChange} value={selectedSeatType}>
                                                {seatType &&
                                                    seatType.map((value) => {
                                                        if (value.id === 7) {
                                                            return null;
                                                        }
                                                        if (value.id === 9) {
                                                            return null;
                                                        }
                                                        if (value.id === 8) {
                                                            return null;
                                                        }
                                                        return (
                                                            <Radio
                                                                key={value.id}
                                                                style={radioStyle}
                                                                value={value.nickName}
                                                            >
                                                                <Tag color={value.color}>{value.name}</Tag>
                                                            </Radio>
                                                        );
                                                    })}
                                            </Radio.Group>
                                        </div>
                                    </Col>
                                    <Col span={24} style={{ marginTop: 30 }}>
                                        <div className={cx('custom-btn')}>
                                            <Button className={cx('btn')} type="primary" onClick={onClickUpdate}>
                                                Cập nhật ghế
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <div className={cx('container-tag')}>
                            <Space size={[0, 200]} wrap>
                                <div className={cx('container-tag')}>
                                    <div style={{ display: 'flex', overflowX: 'auto', maxWidth: '600px' }}>
                                        {seatType &&
                                            seatType.map((value) => {
                                                if (value.id === 7) {
                                                    return null;
                                                }
                                                if (value.id === 9) {
                                                    return null;
                                                }
                                                return (
                                                    <Tag className={cx('tagg')} key={value.id} color={value.color}>
                                                        {value.name}
                                                    </Tag>
                                                );
                                            })}
                                    </div>
                                </div>
                            </Space>
                        </div>
                    </Col>
                </Row>
            </Card>
        </>
    );
}

export default SeatChart;
