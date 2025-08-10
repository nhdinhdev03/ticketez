import React, { useState, useEffect } from 'react';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import Chart from 'react-apexcharts';
import { Col, Row, DatePicker, Button, Select, Space, Modal } from 'antd';
import axiosClient from '~/api/global/axiosClient';
import BaseTable from '~/components/Admin/BaseTable/BaseTable';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const { RangePicker } = DatePicker;

const AdminTicketStatistics = () => {
    const [bookingDataDTO, setBookingDataDTO] = useState([]);
    const [series, setSeries] = useState([]);
    const [labels, setLabels] = useState([]);
    const [options, setOptions] = useState({
        chart: {
            type: 'donut',
        },
        labels: labels,
    });
    const onChange = (value) => {
        if (value === 1) {
            fetchDataBookingDataDTO('cinemaChain');
        }
        if (value === 2) {
            fetchDataBookingDataDTO('cinemaComplex');
        }
        setSelectedDate(null);
        console.log(`selected ${value}`);
    };
    const onSearch = (value) => {
        console.log('search:', value);
    };

    const fetchDataBookingDataDTO = async (cinema) => {
        try {
            const res = await axiosClient.get(`${cinema}/${cinema}BookingDTO`);
            setBookingDataDTO(res.data);
        } catch (error) {
            console.error('Error fetching booking data:', error);
        }
    };

    const getBestMovieCinemaChain = (idCinemaChain) => {
        const movieBookingCount = {};
        // Lặp qua mảng bookingDataDTO và cập nhật số lượng đặt vé cho từng bộ phim
        bookingDataDTO.forEach((bookingData) => {
            if (idCinemaChain === bookingData.cinemaChain.id) {
                if (bookingData.bookings) {
                    bookingData.bookings.forEach((booking) => {
                        const movieId = booking.showtime.formatMovie.movie.id;

                        if (movieBookingCount[movieId]) {
                            movieBookingCount[movieId]++;
                        } else {
                            movieBookingCount[movieId] = 1;
                        }
                    });
                }
            }
        });

        if (Object.keys(movieBookingCount).length === 0) {
            return;
        }
        // Tìm bộ phim có lượt đặt vé nhiều nhất
        const mostBookedMovieId = Object.keys(movieBookingCount).reduce((a, b) =>
            movieBookingCount[a] > movieBookingCount[b] ? a : b,
        );

        // Tìm thông tin của bộ phim có lượt đặt vé nhiều nhất
        const mostBookedMovie = bookingDataDTO.reduce((acc, bookingData) => {
            if (bookingData.bookings) {
                const movie = bookingData.bookings.find(
                    (booking) => booking.showtime.formatMovie.movie.id === parseInt(mostBookedMovieId, 10),
                );

                if (movie && (!acc || movie.createDate > acc.createDate)) {
                    return movie;
                }
            }

            return acc;
        }, null);

        console.log('Bộ phim có lượt đặt vé nhiều nhất:', mostBookedMovie?.showtime.formatMovie.movie.title);
        return mostBookedMovie?.showtime.formatMovie.movie.title;
    };

    const getBestMovieCinemaComplex = (idCinemaComplex) => {
        const movieBookingCount = {};
        // Lặp qua mảng bookingDataDTO và cập nhật số lượng đặt vé cho từng bộ phim
        bookingDataDTO.forEach((bookingData) => {
            if (idCinemaComplex === bookingData.cinemaComplex.id) {
                if (bookingData.bookings) {
                    bookingData.bookings.forEach((booking) => {
                        const movieId = booking.showtime.formatMovie.movie.id;

                        if (movieBookingCount[movieId]) {
                            movieBookingCount[movieId]++;
                        } else {
                            movieBookingCount[movieId] = 1;
                        }
                    });
                }
            }
        });

        if (Object.keys(movieBookingCount).length === 0) {
            return;
        }
        // Tìm bộ phim có lượt đặt vé nhiều nhất
        const mostBookedMovieId = Object.keys(movieBookingCount).reduce((a, b) =>
            movieBookingCount[a] > movieBookingCount[b] ? a : b,
        );

        // Tìm thông tin của bộ phim có lượt đặt vé nhiều nhất
        const mostBookedMovie = bookingDataDTO.reduce((acc, bookingData) => {
            if (bookingData.bookings) {
                const movie = bookingData.bookings.find(
                    (booking) => booking.showtime.formatMovie.movie.id === parseInt(mostBookedMovieId, 10),
                );

                if (movie && (!acc || movie.createDate > acc.createDate)) {
                    return movie;
                }
            }

            return acc;
        }, null);

        console.log('Bộ phim có lượt đặt vé nhiều nhất:', mostBookedMovie?.showtime.formatMovie.movie.title);
        return mostBookedMovie?.showtime.formatMovie.movie.title;
    };

    useEffect(() => {
        fetchDataBookingDataDTO('cinemaChain');
    }, []);

    useEffect(() => {
        const newLabels = bookingDataDTO.map((data) =>
            data.cinemaChain ? data.cinemaChain.name : data.cinemaComplex.name,
        );
        const newSeries = bookingDataDTO.map((data) => (data.bookings ? data.bookings.length : 0));

        setLabels(newLabels);
        setSeries(newSeries);
        console.log(newLabels);
        console.log(newSeries);
        setOptions({
            chart: {
                type: 'donut',
            },
            labels: newLabels,
        });
    }, [bookingDataDTO]);
    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const optionsSelect = [
        {
            value: 1,
            label: 'Chuỗi rạp',
        },
        {
            value: 2,
            label: 'Cụm rạp',
        },
    ];
    const [selectedDate, setSelectedDate] = useState([]);
    const handleDateChange = (dates) => {
        setSelectedDate(dates);

        // Kiểm tra nếu có ngày bắt đầu và kết thúc
        if (dates && dates.length === 2) {
            const startDate = new Date(dates[0]);
            const endDate = new Date(dates[1]);

            const filteredBookingDataDTO = bookingDataDTO.filter((bookingDTO) => {
                const bookingsInDateRange = bookingDTO.bookings.some((booking) => {
                    // Ensure createdDate is a valid string
                    const createdDate = new Date(booking.account.createdDate);

                    // Check if createdDate is a valid Date object before using isBetween
                    if (!isNaN(createdDate.getTime())) {
                        return createdDate >= startDate && createdDate <= endDate;
                    } else {
                        // Handle invalid date, e.g., log an error or skip this booking
                        console.error('Invalid createdDate:', booking.account.createdDate);
                        return false;
                    }
                });

                return bookingsInDateRange;
            });

            setBookingDataDTO(filteredBookingDataDTO);
            console.log('Booking Data DTO with Bookings in date range:', filteredBookingDataDTO);
        }
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const [dataModal, setDataModal] = useState([]);

    const handleEditData = (record) => {
        setDataModal(record.bookings);
        showModal();
    };

    return (
        <>
            <Row>
                <Col span={24} className="tw-mb-8">
                    <Row>
                        <Col span={12}>
                            <Select

                                showSearch
                                defaultValue={1}
                                placeholder="Select a person"
                                optionFilterProp="children"
                                onChange={onChange}
                                onSearch={onSearch}
                                filterOption={filterOption}
                                options={optionsSelect}
                            />
                        </Col>
                        <Col span={12}>
                            <RangePicker value={selectedDate} onChange={handleDateChange} />
                        </Col>
                    </Row>
                </Col>
                <Col span={14}>
                    <BaseTable
                        columns={[
                            {
                                title: 'Tên chuỗi rạp',
                                render: (_, record) =>
                                    record.cinemaChain ? record.cinemaChain.name : record.cinemaComplex.name,
                            },
                            {
                                title: 'Số lượng vé bán',
                                render: (_, record) => (record.bookings ? record.bookings.length : 0),
                            },
                            {
                                title: 'Phim có số vé cao nhất',
                                render: (_, record) =>
                                    record.cinemaChain
                                        ? getBestMovieCinemaChain(record.cinemaChain.id)
                                        : getBestMovieCinemaComplex(record.cinemaComplex.id),
                            },
                            {
                                title: 'Thao tác',
                                render: (_, record) => (
                                    <Space size="middle">
                                        <FontAwesomeIcon
                                            icon={faPen}
                                            onClick={() => {
                                                handleEditData(record);
                                            }}
                                            className="tw-cursor-pointer hover:tw-cursor-pointer" // Thêm lớp Tailwind CSS
                                        />
                                    </Space>
                                ),
                            },
                        ]}
                        dataSource={bookingDataDTO.map((post) => ({
                            ...post,
                            key: post.cinemaChain ? post.cinemaChain.id : post.cinemaComplex.id,
                        }))}
                    />
                </Col>
                <Col span={10}>
                    {bookingDataDTO.length > 0 && (
                        <div className="donut">
                            <Chart options={options} series={series} type="donut" width="480" />
                        </div>
                    )}
                </Col>
            </Row>
            <Modal
                title="Chi tiết"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1000}
                footer={null}
            >
                {dataModal && (
                    <BaseTable
                        columns={[
                            {
                                title: 'Phim',
                                render: (_, record) => record.showtime.formatMovie.movie.title,
                            },
                            {
                                title: 'Người mua',
                                render: (_, record) => record.account.fullname,
                            },
                            {
                                title: 'Thuộc suất chiếu',
                                render: (_, record) =>
                                    new Date(record.showtime.startTime).toLocaleDateString() +
                                    ' - ' +
                                    new Date(record.showtime.endTime).toLocaleDateString(),
                            },
                        ]}
                        dataSource={dataModal.map((post) => ({
                            ...post,
                            key: post.id,
                        }))}
                    />
                )}
            </Modal>
        </>
    );
};

export default AdminTicketStatistics;
