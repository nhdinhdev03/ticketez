import { Menu } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { getRolesFromLocalStorage } from '~/utils/authUtils';

const typeMenuItem = 'divider';

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}


function Sidebar() {
    const roles = getRolesFromLocalStorage();
    const isAuthenticated = !!localStorage.getItem('token');
    // console.log(roles);
    let items = []; 




    if (isAuthenticated && roles.includes('SUPER_ADMIN')) {

        items = [
            getItem(<Link to="/admin/index">Trang chủ</Link>, 'home', <FontAwesomeIcon icon={solidIcons.faHouse} />),

            // Quản lý rạp phim
            getItem('Rạp', 'grCinema', <FontAwesomeIcon icon={solidIcons.faTv} />, [
                getItem(<Link to="/admin/cinema-complex">Cụm rạp</Link>, 'cinemaComplex'),
                getItem(<Link to="/admin/cinema-type">Loại rạp</Link>, 'cinemaType'),
                getItem(<Link to="/admin/cinema-chains">Chuỗi Rap</Link>, 'cinemaChains'),
            ]),

            // Quản lý movie
            getItem('Phim', 'grMovie', <FontAwesomeIcon icon={solidIcons.faVideo} />, [
                getItem(<Link to="/admin/movie">Phim</Link>, 'moive'),
                getItem(<Link to="/admin/movie-studio">Hãng phim</Link>, 'moiveStudio'),
                getItem(<Link to="/admin/movie-producer">Nhà sản xuất</Link>, 'movieProducer'),
                getItem(<Link to="/admin/price">Giá vé</Link>, 'price'),
                getItem(<Link to="/admin/showtime">Suất chiếu</Link>, 'showtime'),
                getItem(<Link to="/admin/actor">Diễn viên</Link>, 'actor', null),
                getItem(<Link to="/admin/director">Đạo diễn</Link>, 'director', null),
                getItem(<Link to="/admin/mpaaRating">Phân loại</Link>, 'mpaaRating'),
                getItem(<Link to="/admin/format">Dạng phim</Link>, 'format', null),
                getItem(<Link to="/admin/article">Danh sách phim</Link>, 'article', null),
            ]),

            // Quản lý ghế
            getItem('Ghế', 'grSeat', <FontAwesomeIcon icon={solidIcons.faCouch} />, [
                getItem(<Link to="/admin/seat">Ghế</Link>, 'seat', null),
                getItem(<Link to="/admin/seat-type">Loại ghế</Link>, 'seatType', null),
                getItem(<Link to="/admin/seat-chart">Sơ đồ ghế</Link>, 'seatChart', null),
            ]),
            // Thống kê
            getItem('Thống kê', 'grStatic', <FontAwesomeIcon icon={solidIcons.faChartSimple} />, [
                getItem(<Link to="/admin/ticket-statistics">Thống kê vé theo chuỗi rạp</Link>, 'static', null),
            ]),

            // Quản lý dịch vụ, sự kiện
            getItem('Dịch vụ & sự kiện', 'grServiceEvent', <FontAwesomeIcon icon={solidIcons.faCalendarCheck} />, [
                getItem(<Link to="/admin/combo">Combo</Link>, 'combo', null),
                getItem(<Link to="/admin/service">Dịch vụ</Link>, 'service'),
                getItem(<Link to="/admin/priceService">Giá dịch vụ</Link>, 'priceService'),
                getItem(
                    'Sự kiện',
                    'grEvent',
                    null,
                    [
                        getItem(<Link to="/admin/discount">Giảm giá</Link>, 'discount'),
                        getItem(<Link to="/admin/event">Sự kiện</Link>, 'event'),
                    ],
                    'group',
                ),
            ]),


            { type: 'divider' },
            getItem(
                <Link to="/admin/account">Quản lý người dùng</Link>,
                'grAccount',
                <FontAwesomeIcon icon={solidIcons.faUsers} />,
            ),
            getItem(
                <Link to="/admin/accountStaff">Quản lý nhân viên</Link>,
                'grAccountStaff',
                <FontAwesomeIcon icon={solidIcons.faUserAlt} />,
            ),


            getItem(
                <Link to="/admin/comentModeration">Kiểm duyệt bình luận</Link>,
                'grComentModeration',
                <FontAwesomeIcon icon={solidIcons.faComment} />,
            ),
            getItem(<Link to="/admin/webcam">Soát vé</Link>, 'webcam', <FontAwesomeIcon icon={solidIcons.faCamera} />),
            getItem(
                <Link to="/admin/sendEmail">Gữi Email</Link>,
                'sendEmail',
                <FontAwesomeIcon icon={solidIcons.faEnvelope} />,
            ),
        ];


    } else if (isAuthenticated && roles.includes('MOVIE_MANAGEMENT_ADMIN')) {
        items = [
            getItem(<Link to="/admin/index">Trang chủ</Link>, 'home', <FontAwesomeIcon icon={solidIcons.faHouse} />),
            // Chỉ hiển thị phần quản lý rạp phim
            getItem('Phim', 'grMovie', <FontAwesomeIcon icon={solidIcons.faVideo} />, [
                getItem(<Link to="/admin/movie">Phim</Link>, 'moive'),
                getItem(<Link to="/admin/movie-studio">Hãng phim</Link>, 'moiveStudio'),
                getItem(<Link to="/admin/movie-producer">Nhà sản xuất</Link>, 'movieProducer'),
                getItem(<Link to="/admin/price">Giá vé</Link>, 'price'),
                getItem(<Link to="/admin/showtime">Suất chiếu</Link>, 'showtime'),
                getItem(<Link to="/admin/actor">Diễn viên</Link>, 'actor', null),
                getItem(<Link to="/admin/director">Đạo diễn</Link>, 'director', null),
                getItem(<Link to="/admin/mpaaRating">Phân loại</Link>, 'mpaaRating'),
                getItem(<Link to="/admin/format">Dạng phim</Link>, 'format', null),
                getItem(<Link to="/admin/article">Danh sách phim</Link>, 'article', null),
            ]),
        ];
    } else if (isAuthenticated && roles.includes('SCHEDULING_PRICING_ADMIN')) {
        // Quản lý ghế
        items = [
            getItem(<Link to="/admin/index">Trang chủ</Link>, 'home', <FontAwesomeIcon icon={solidIcons.faHouse} />),
            getItem('Ghế', 'grSeat', <FontAwesomeIcon icon={solidIcons.faCouch} />, [
                getItem(<Link to="/admin/seat">Ghế</Link>, 'seat', null),
                getItem(<Link to="/admin/seat-type">Loại ghế</Link>, 'seatType', null),
                getItem(<Link to="/admin/seat-chart">Sơ đồ ghế</Link>, 'seatChart', null),
            ]),
        ];
    } else if (isAuthenticated && roles.includes('CINEMA_MANAGEMENT_ADMIN')) {
        items = [
            // Quản lý rạp phim
            getItem(<Link to="/admin/index">Trang chủ</Link>, 'home', <FontAwesomeIcon icon={solidIcons.faHouse} />),

            getItem('Rạp', 'grCinema', <FontAwesomeIcon icon={solidIcons.faTv} />, [
                getItem(<Link to="/admin/cinema-complex">Cụm rạp</Link>, 'cinemaComplex'),
                getItem(<Link to="/admin/cinema-type">Loại rạp</Link>, 'cinemaType'),
                getItem(<Link to="/admin/cinema-chains">Chuỗi Rap</Link>, 'cinemaChains'),
            ]),


        ]

    } else if (isAuthenticated && roles.includes('SERVICE_EVENT_MANAGEMENT_ADMIN')) {

        items = [
            getItem(<Link to="/admin/index">Trang chủ</Link>, 'home', <FontAwesomeIcon icon={solidIcons.faHouse} />),
            getItem('Dịch vụ & sự kiện', 'grServiceEvent', <FontAwesomeIcon icon={solidIcons.faCalendarCheck} />, [
                getItem(<Link to="/admin/combo">Combo</Link>, 'combo', null),
                getItem(<Link to="/admin/service">Dịch vụ</Link>, 'service'),
                getItem(<Link to="/admin/priceService">Giá dịch vụ</Link>, 'priceService'),
                getItem(
                    'Sự kiện',
                    'grEvent',
                    null,
                    [
                        getItem(<Link to="/admin/discount">Giảm giá</Link>, 'discount'),
                        getItem(<Link to="/admin/event">Sự kiện</Link>, 'event'),
                    ],
                    'group',
                ),
            ]),

        ]
    } else if (isAuthenticated && roles.includes('USER_MANAGEMENT_ADMIN')) {

        items = [
            getItem(<Link to="/admin/index">Trang chủ</Link>, 'home', <FontAwesomeIcon icon={solidIcons.faHouse} />),
            { type: 'divider' },
            getItem(
                <Link to="/admin/account">Quản lý người dùng</Link>,
                'grAccount',
                <FontAwesomeIcon icon={solidIcons.faUsers} />,
            ),
            getItem(
                <Link to="/admin/accountStaff">Quản lý nhân viên</Link>,
                'grAccountStaff',
                <FontAwesomeIcon icon={solidIcons.faUserAlt} />,
            ),
        ]
    } else {
        items = [];
    }

    return isAuthenticated ? <Menu mode="inline" items={items} /> : null;
}

export default Sidebar;
