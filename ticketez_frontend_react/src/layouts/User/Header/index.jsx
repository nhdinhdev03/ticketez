import React, { useEffect, useState } from 'react';
import './header.scss';
import { animateScroll as scroll } from 'react-scroll';
import img from '~/assets/img';
import { Avatar, Breadcrumb, Divider, Dropdown } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import {
    faAddressCard,
    faChevronRight,
    faFireFlameCurved,
    faHome,
    faNewspaper,
    faRightFromBracket,
    faSearch,
    faTicket,
} from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import authApi from '~/api/user/Security/authApi';
import funcUtils from '~/utils/funcUtils';
import uploadApi from '~/api/service/uploadApi';

const Header = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);


    const fetchData = async () => {
        setLoading(true);
        try {
            const user = await authApi.getUser();
            setUserData(user);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchData();
    }, [loading]);


    useEffect(() => {
        let fetchDataInterval;
        if (userData === null) {
            fetchDataInterval = setInterval(() => {
                fetchData()
            }, 1000);
        }
        return () => {
            clearInterval(fetchDataInterval);
        };
    }, []);




    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async () => {
        navigate('/login');
    };

    const handleProfile = async () => {
        navigate('/profile');
    };

    const handleLogout = async () => {
        try {
            authApi.logout();
            localStorage.clear();
            funcUtils.notify('Đăng Xuất thành công!', 'success');
            window.location.reload();
            navigate('/');
        } catch (error) {
            funcUtils.notify('Đăng Xuất Thất Bại!', 'error');
        }
    };

    const allowedPaths = [
        '/su-kien/khuyen-mai',
        '/su-kien/tin-tuc',
        /^\/su-kien\/tin-tuc\/\d+$/,
        /^\/su-kien\/khuyen-mai\/\d+$/,
    ];
    const isEventPage = allowedPaths.some((path) =>
        typeof path === 'string' ? location.pathname === path : path.test(location.pathname),
    );

    const itemsAccount = [
        {
            key: '1',
            label: (
                <Link onClick={handleProfile} to="/profile">
                    Xem tài khoản
                </Link>
            ),
            icon: <FontAwesomeIcon icon={faAddressCard} className="text-4xl" />,
        },
        {
            key: '2',
            label: (
                <Link rel="noopener noreferrer" to="/booking-history">
                    Lịch sử đặt vé
                </Link>
            ),
            icon: <FontAwesomeIcon icon={faTicket} />,
        },
        {
            type: 'divider',
        },
        {
            key: '4',
            label: (
                <a target="_self" onClick={handleLogout} rel="noopener noreferrer">
                    Đăng xuất
                </a>
            ),
            icon: <FontAwesomeIcon icon={faRightFromBracket} />,
        },
    ];

    const scrollToShowTimes = () => {
        navigate('/');
        scroll.scrollTo(1800);
    };

    const scrollToMovieUpcoming = () => {
        navigate('/');
        scroll.scrollTo(1200);
    };

    const scrollToMovieShowing = () => {
        navigate('/');
        scroll.scrollTo(600);
    };

    return (
        <>
            <nav className="tw-z-[999] tw-bg-white tw-text-gray-500 tw-font-bold tw-shadow-2xl tw-sticky tw-top-0 ">
                <div className="tw-flex tw-items-center tw-justify-between tw-p-3 tw-border-b tw-container tw-mx-auto tw-px-[150px]">
                    <a href="/" className="tw-text-gray-700">
                        <div className="tw-flex tw-items-center tw-gap-2">
                            <div className="tw-text-xl tw-font-medium tw-text-blue-800">
                                <span className="tw-font-bold tw-text-blue-900 ">
                                    <img width={56} src={img.logoAdmin} />
                                </span>
                            </div>
                            {/* <div className="tw-w-[1px] tw-bg-pink-900 tw-h-10 tw-hidden lg:tw-block"></div> */}
                            {/* <img src={img.logoHome} /> */}
                            {/* <div className="tw-hidden tw-leading-4 tw-text-[var(--primary--text-color)] lg:tw-block">
                                <div>
                                    <div>Đặt vé</div>
                                    <div className="tw-mt-[5px]">Xem phim</div>
                                </div>
                            </div> */}
                        </div>
                    </a>

                    <div className="tw-flex tw-items-center tw-font-medium tw-cursor-pointer">
                        <div className="tw-hidden lg:tw-block tw-mr-[20px] tw-text-gray-700 tw-font-2xl">
                            <a onClick={scrollToShowTimes} className="tw-text-gray-700">
                                Lịch chiếu
                            </a>
                        </div>
                        <div className="tw-xl:tw-hidden tw-mr-[20px] tw-text-gray-700"></div>
                        <div className="tw-xl:tw-hidden tw-mr-[20px] tw-text-gray-700">
                            <a href="/movieTop" className="tw-text-gray-700">
                                Top phim
                            </a>
                        </div>
                        <div className="tw-xl:tw-hidden tw-mr-[20px] ">
                            <a href="/su-kien/tin-tuc" className="tw-text-gray-700">
                                Sự kiện
                            </a>
                        </div>
                        <div className="tw-xl:tw-hidden tw-mr-[20px] ">
                            <a href="/review" className="tw-text-gray-700">
                                Review Phim
                            </a>
                        </div>
                        <div className="tw-hidden lg:tw-block tw-mr-[10px] tw-text-gray-700 tw-font-2xl">
                            <a href="/movie-search" className="tw-text-gray-700">
                                <FontAwesomeIcon icon={faSearch} />
                            </a>
                        </div>

                        <Divider type="vertical" />
                        {userData ? (
                            <Dropdown
                                menu={{
                                    items: itemsAccount,
                                }}
                                placement="bottom"
                                arrow
                            >
                                <a className="tw-text-gray-700 flex items-center">
                                    <span className="name-short">
                                        Xin chào,{' '}
                                        {userData?.fullname == null || userData?.fullname == undefined
                                            ? ''
                                            : userData.fullname.split(' ').pop()}
                                    </span>
                                    <Avatar src={uploadApi.get(userData.image)} alt={`${userData.id}'s avatar`} />
                                </a>
                            </Dropdown>
                        ) : (
                            <>
                                <div
                                    className="tw-hidden lg:tw-block tw-mr-[10px] tw-text-gray-700 tw-font-2xl"
                                    onClick={handleLogin}
                                >
                                    <button className="tw-bg-[var(--primary--text-color)] tw-py-4  tw-px-8 tw-rounded tw-cursor-pointer hover:tw-opacity-[0.9]">
                                        Đăng nhập
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {isEventPage && (
                    <>
                        <Divider className="tw-mt-[-5px]" />
                        <div className="tw-container tw-mx-auto tw-px-[150px] tw-mt-[-10px] tw-mb-[10px] tw-text-gray-700 tw-font-2xl tw-font-[var(--font-family)]">
                            <Breadcrumb
                                separator={null}
                                items={[
                                    {
                                        href: '/',
                                        title: <FontAwesomeIcon icon={faHome} />,
                                    },
                                    {
                                        type: 'separator',
                                        separator: <FontAwesomeIcon icon={faChevronRight} />,
                                    },
                                    {
                                        title: 'Sự kiện',
                                        className: ' tw-cursor-pointer  tw-text-gray-500  tw-font-[var(--font-family)]',
                                    },
                                    {
                                        type: 'separator',
                                        separator: <FontAwesomeIcon icon={faChevronRight} />,
                                    },
                                    {
                                        href: '/su-kien/tin-tuc',
                                        className: `focus:tw-text-[var(--primary--text-color)] hover:tw-text-[var(--primary--text-color)] tw-cursor-pointer  tw-text-gray-500  tw-font-[var(--font-family)] ${isEventPage &&
                                            (location.pathname === '/su-kien/tin-tuc' ||
                                                /^\/su-kien\/tin-tuc\/\d+$/.test(location.pathname))
                                            ? 'tw-text-[var(--primary--text-color)]'
                                            : ''
                                            }`,
                                        title: (
                                            <>
                                                <FontAwesomeIcon icon={faFireFlameCurved} className="tw-mr-2" />
                                                <span>Tin tức</span>
                                            </>
                                        ),
                                    },
                                    {
                                        type: 'separator',
                                        separator: ' | ',
                                    },
                                    {
                                        href: '/su-kien/khuyen-mai',
                                        className: `focus:tw-text-[var(--primary--text-color)] hover:tw-text-[var(--primary--text-color)] tw-cursor-pointer  tw-text-gray-500  tw-font-[var(--font-family)] ${isEventPage &&
                                            (location.pathname === '/su-kien/khuyen-mai' ||
                                                /^\/su-kien\/khuyen-mai\/\d+$/.test(location.pathname))
                                            ? ' tw-text-[var(--primary--text-color)]'
                                            : ''
                                            }`,
                                        title: (
                                            <>
                                                <FontAwesomeIcon icon={faNewspaper} className="tw-mr-2" />
                                                <span>Khuyến mãi</span>
                                            </>
                                        ),
                                    },
                                ]}
                            />
                        </div>
                    </>
                )}
            </nav>
        </>
    );
};

export default Header;
