/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Select, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import style from './Home.module.scss';
import classNames from 'classnames/bind';
import ReactApexChart from 'react-apexcharts';
import AdminDashboardApi from '~/api/admin/AdminDashboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faTicket, faUser } from '@fortawesome/free-solid-svg-icons';
import { Option } from 'antd/es/mentions';

const cx = classNames.bind(style);

// Các options và series cho biểu đồ ApexCharts
// Tính tổng doanh thu theo từng tháng và năm

const seriesData = [
    {
        name: 'series1',
        data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
        name: 'series2',
        data: [11, 32, 45, 32, 34, 52, 41],
    },
];
const options = {
    chart: {
        height: 350,
        type: 'area',
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: 'smooth',
    },
    xaxis: {
        type: 'datetime',
        categories: [
            '2018-09-19T00:00:00.000Z',
            '2018-09-19T01:30:00.000Z',
            '2018-09-19T02:30:00.000Z',
            '2018-09-19T03:30:00.000Z',
            '2018-09-19T04:30:00.000Z',
            '2018-09-19T05:30:00.000Z',
            '2018-09-19T06:30:00.000Z',
        ],
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm',
        },
    },
    colors: ['#5D87FF', '#5F6F94'],
};

const dataBieuDoTron = [44, 55, 41, 17, 15];

const optionsBieuDoTron = {
    chart: {
        type: 'donut',
    },
    responsive: [
        {
            breakpoint: 480,
            options: {
                chart: {
                    width: 200,
                },
                legend: {
                    position: 'bottom',
                },
            },
        },
    ],
    colors: ['#5F6F94', '#5D87FF', '#ABD9FF', '#85CDFD', '#97DEFF'],
};

const AdminIndex = () => {
    const [size, setSize] = useState('large');
    const [dataTotalMovie, setDataTotalMovie] = useState(1);
     const [dataTotalTicket, setDataTotalTicket] = useState(1);
    const [dataTotalUser, setDataTotalUser] = useState(1);
    const [dataRevenueStatistics, setDataRevenueStatistics] = useState([]);
    const [dataYear, setDataYear] = useState([]);
    const [valueSelectYear, setValueSelectYear] = useState(2023);
    const [totalRevenueForSelectedYear, setTotalRevenueForSelectedYear] = useState(0);

    useEffect(() => {
        const getList = async () => {
            try {
                const [totalMovie, totalTicket, totalUser, getRevenueStatistics] = await Promise.all([
                    AdminDashboardApi.getTotalMovies(),
                    AdminDashboardApi.getTotalTickets(),
                    AdminDashboardApi.getTotalUser(),
                    AdminDashboardApi.getRevenueStatistics(),
                ]);
                setDataTotalMovie(totalMovie.data);
                setDataTotalTicket(totalTicket.data);
                setDataTotalUser(totalUser.data);
                setDataRevenueStatistics(getRevenueStatistics.data);

                const uniqueYears = Array.from(new Set(getRevenueStatistics.data.map((item) => item.year)));
                setDataYear(uniqueYears);
            } catch (error) {
                console.log(error);
            }
        };
        getList();
    }, []);

    useEffect(() => {
        // Tính tổng tiền theo năm đã chọn
        const calculateTotalRevenueForSelectedYear = () => {
            const selectedYear = valueSelectYear;
            const yearlyRevenue = dataRevenueStatistics
                .filter((entry) => entry.year === selectedYear)
                .reduce((total, entry) => total + entry.amount, 0);

            setTotalRevenueForSelectedYear(yearlyRevenue);
        };

        // Gọi hàm tính tổng khi có thay đổi trong valueSelectYear hoặc dataRevenueStatistics
        calculateTotalRevenueForSelectedYear();
    }, [valueSelectYear, dataRevenueStatistics]);

    const monthlyRevenue = {};
    dataRevenueStatistics.forEach((entry) => {
        const key = `${entry.year}-${entry.month}`;
        if (!monthlyRevenue[key]) {
            monthlyRevenue[key] = 0;
        }
        monthlyRevenue[key] += entry.amount;
    });

    // Chuyển dữ liệu thành mảng để sử dụng trong biểu đồ
    const months = [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
    ];

    const revenueData = months.map((month, index) => {
        const key = `${valueSelectYear}-${index + 1}`;
        const revenueInVND = monthlyRevenue[key] || 0;

        // Chuyển đổi giá trị thành VNĐ và định dạng số
        const formattedRevenue = revenueInVND.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });

        return formattedRevenue;
    });

    // Cập nhật options và series cho biểu đồ
    const apexChartOptions = {
        chart: {
            type: 'bar',
            height: 350,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded',
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        xaxis: {
            categories: months,
        },

        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    // Chuyển đổi giá trị thành đơn vị VNĐ và sử dụng dấu chấm phẩy
                    return val.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' đ';
                },
            },
        },
        colors: ['#5D87FF'],
    };

    const apexChartSeries = [
        {
            name: 'Tổng tiền',
            data: revenueData,
        },
    ];

    const totalTickets = dataTotalTicket[0]?.total_tickets;
    const totalMovies = dataTotalMovie[0]?.total_movies;
    const totalUsers = dataTotalUser[0]?.total_user;

    const onChangeSelectYearRevenue = (value) => {
        setValueSelectYear(value);
    };
    return (
        <>
            {/* 4 card thống kê  */}
            <Row gutter={24} className={cx('body')}>
                <Col xs={24} lg={8}>
                    <Card bordered={false} className={cx('card-top')} style={{ marginLeft: '-13px' }}>
                        <Row gutter={24}>
                            <Col xs={12} lg={18}>
                                <span className={cx('title-card-top')}>Tổng số vé đã bán </span>
                                <br />
                                <span className={cx('money-card-top')}>
                                    {totalTickets != null
                                        ? totalTickets > 1000000
                                            ? (totalTickets / 1000000).toFixed(1) + 'M'
                                            : totalTickets > 1000
                                            ? (totalTickets / 1000).toFixed(1) + 'k'
                                            : totalTickets
                                        : null}
                                </span>
                            </Col>
                            <Col xs={12} lg={4}>
                                <Space wrap>
                                    <Button
                                        type="primary"
                                        className={cx('button-card-top')}
                                        icon={<FontAwesomeIcon icon={faTicket} />}
                                        size={size}
                                    />
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card bordered={false} className={cx('card-top')}>
                        <Row gutter={24}>
                            <Col xs={12} lg={18}>
                                <span className={cx('title-card-top')}>Tổng phim </span>
                                <br />
                                <span className={cx('money-card-top')}>
                                    {totalMovies != null
                                        ? totalMovies > 1000000
                                            ? (totalMovies / 1000000).toFixed(1) + 'M'
                                            : totalMovies > 1000
                                            ? (totalMovies / 1000).toFixed(1) + 'k'
                                            : totalMovies
                                        : null}
                                </span>
                            </Col>
                            <Col xs={12} lg={4}>
                                <Space wrap>
                                    <Button
                                        type="primary"
                                        className={cx('button-card-top')}
                                        icon={<FontAwesomeIcon icon={faFilm} />}
                                        size={size}
                                    />
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card bordered={false} className={cx('card-top')}>
                        <Row gutter={24}>
                            <Col xs={12} lg={18}>
                                <span className={cx('title-card-top')}>Tổng người dùng</span>
                                <br />
                                <span className={cx('money-card-top')}>
                                    {totalUsers != null
                                        ? totalUsers > 1000000
                                            ? (totalUsers / 1000000).toFixed(1) + 'M'
                                            : totalUsers > 1000
                                            ? (totalUsers / 1000).toFixed(1) + 'k'
                                            : totalUsers
                                        : null}
                                </span>
                            </Col>
                            <Col xs={12} lg={4}>
                                <Space wrap>
                                    <Button
                                        type="primary"
                                        className={cx('button-card-top')}
                                        icon={<FontAwesomeIcon icon={faUser} />}
                                        size={size}
                                    />
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                {/* <Col xs={24} lg={6}>
                    <Card bordered={false} className={cx('card-top')}>
                        <Row gutter={24}>
                            <Col xs={12} lg={18}>
                                <span className={cx('title-card-top')}>Today's Moneys</span>
                                <br />
                                <span className={cx('money-card-top')}>$53,000 </span>
                                <span className={cx('char-card-top')}> +55%</span>
                            </Col>
                            <Col xs={12} lg={4}>
                                <Space wrap>
                                    <Button
                                        type="primary"
                                        className={cx('button-card-top')}
                                        icon={<DownloadOutlined />}
                                        size={size}
                                    />
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </Col> */}
            </Row>
            <Row gutter={24}>
                <Col xs={24} lg={24}>
                    <Card bordered={false} className={cx('card-top')} style={{ marginLeft: '-13px' }}>
                        <div id="chart">
                            <div>
                                <span className={cx('money-card-top')}>Biểu đồ thống kê doanh thu</span>
                                <br />
                                <span className={cx('title-card-top')}>trong năm </span>
                                <span className={cx('char-card-top')}>
                                    {valueSelectYear} ·{' '}
                                    {Math.floor(totalRevenueForSelectedYear).toLocaleString('en-US') + ' đ'}
                                </span>

                                <Select
                                    className="tw-float-right tw-mt-[-30px]  "
                                    showSearch
                                    placeholder="Chọn năm"
                                    defaultValue={2023}
                                    optionFilterProp="children"
                                    onChange={onChangeSelectYearRevenue}
                                    // onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        (option && option.label ? option.label.toLowerCase() : '').includes(
                                            input.toLowerCase(),
                                        )
                                    }
                                    options={dataYear?.map((item) => ({
                                        value: item,
                                        label: item.toString(),
                                    }))}
                                ></Select>
                            </div>
                            <ReactApexChart
                                options={apexChartOptions} // Sử dụng options từ biến apexChartOptions
                                series={apexChartSeries} // Sử dụng series từ biến apexChartSeries
                                type="bar"
                                height={350}
                                // style={{ maxWidth: '790px' }}
                            />
                        </div>
                    </Card>
                </Col>
                {/* <Col xs={24} lg={8}>
                    <Card bordered={false} className={cx('card-chart-donut')}>
                        <div id="chart">
                            <span>
                                <span className={cx('money-card-top')}>Biểu đồ thống kê số lượng vé</span>
                                <br />
                                <span className={cx('char-card-top')}>5% hơn </span>
                                <span className={cx('title-card-top')}>trong {valueSelectYear} là </span>
                            </span>
                            <div className="chart-donut">
                                <ReactApexChart
                                    options={optionsBieuDoTron}
                                    series={dataBieuDoTron}
                                    type="donut"
                                    style={{ maxWidth: '300px', marginTop: '50px' }}
                                />
                            </div>
                        </div>
                    </Card>
                </Col> */}
            </Row>
            {/* <Row gutter={24}>
                <Col xs={24} lg={24}>
                    <Card bordered={false} className={cx('card-chart-donut')} style={{ marginLeft: '-13px' }}>
                        <div>
                            <span>
                                <span className={cx('money-card-top')}>Biểu đồ thống kê số lượng vé</span>
                                <br />
                                <span className={cx('char-card-top')}>5% hơn </span>
                                <span className={cx('title-card-top')}>trong 2023 </span>
                            </span>
                            <ReactApexChart
                                options={options}
                                series={seriesData}
                                type="area"
                                style={{ maxWidth: '1155px', marginLeft: '-10px' }}
                                height={350}
                            />
                        </div>
                    </Card>
                </Col>
            </Row> */}
        </>
    );
};
export default AdminIndex;
