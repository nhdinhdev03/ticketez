import React, { useState } from 'react';
import { Tabs } from 'antd';

import classNames from 'classnames/bind';
import styles from './BookingHistory.module.scss';
import MovieTickets from './MovieTickets';

const cx = classNames.bind(styles);
const ticketStatus = {
    UNUSED: 0,
    USED: 1,
    EXPIRES: 2,
};
function BookingHistory() {
    const [activityKey, setActivityKey] = useState('1');
    const items = [
        {
            key: '1',
            label: 'Vé chưa sử dụng',
            children: activityKey === '1' && <MovieTickets tab={ticketStatus.UNUSED} />,
        },
        {
            key: '2',
            label: 'Vé đã sử dụng',
            children: activityKey === '2' && <MovieTickets tab={ticketStatus.USED} />,
        },
        {
            key: '3',
            label: 'Vé hết hạn',
            children: activityKey === '3' && <MovieTickets tab={ticketStatus.EXPIRES} />,
        },
    ];
    const onChange = (key) => {
        setActivityKey(key);
        console.log(key);
    };
    return (
        <div id={cx('wrapper-booking-history')}>
            <div className={cx('wrapper-tabs')}>
                <Tabs defaultActiveKey="1" activeKey={activityKey} items={items} onChange={onChange} />
            </div>
        </div>
    );
}

export default BookingHistory;
