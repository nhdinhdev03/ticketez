import { SearchOutlined } from '@ant-design/icons';
import { faBell, faGear, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row, Input, Dropdown, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import style from './AdminHeader.module.scss';
import classNames from 'classnames/bind';
import { Menu } from 'antd';
import authApi from '~/api/user/Security/authApi';
import funcUtils from '~/utils/funcUtils';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(style);

function HeaderAdminRight() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
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
        fetchData();
    }, [loading]);

    const handleLogout = async () => {
        try {
            authApi.logout();
            localStorage.clear();
            funcUtils.notify('Đăng Xuất thành công!', 'success');
            navigate('/login');
        } catch (error) {
            funcUtils.notify('Đăng Xuất Thất Bại!', 'error');
        }
    };

    const itemsBell = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    1st menu item
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    2nd menu item
                </a>
            ),
        },
        {
            key: '3',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                    3rd menu item
                </a>
            ),
        },
    ];

    const itemSetting = [
        {
            key: '1',
            label: (
                <a target="_self" onClick={handleLogout} rel="noopener noreferrer">
                    Đăng xuất
                </a>
            ),
        },
    ];

    return (
        <>
            <Row style={{ width: '100%' }} className="background">
                <Col span={22} style={{ display: 'flex', alignItems: 'center', width: '100px' }}>
                    {/* <div>
                        <span className={cx('title-left')}>Home /</span>
                        <span className={cx('name-left')}> Dashboard</span>
                    </div> */}
                    <span className="name-short">
                        Xin chào,{' '}
                        {userData?.fullname == null || userData?.fullname == undefined
                            ? ''
                            : userData.fullname.split(' ').pop()}
                    </span>
                </Col>
                <Col
                    span={2}
                    className={cx('item-hearder-right')}
                    style={{ display: 'flex', justifyContent: 'end', paddingRight: 35 }}
                >
                    <Popconfirm
                        placement="leftBottom"
                        title={'Đăng xuất'}
                        description={'Bạn có chắc chắn muốn đăng xuất?'}
                        okText="Có"
                        onConfirm={handleLogout}
                        cancelText="Không"
                    >
                        <span className={cx('icon-item-hearder-right')}>
                            <FontAwesomeIcon icon={faRightFromBracket} />
                        </span>
                    </Popconfirm>
                </Col>
            </Row>
        </>
    );
}

export default HeaderAdminRight;
