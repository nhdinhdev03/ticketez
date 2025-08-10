import { Pagination } from 'antd';
import classNames from 'classnames/bind';
import style from './PaginationCustom.module.scss';
const cx = classNames.bind(style);
function PaginationCustom(props) {
    return (
        <div className={cx('wrapp-pagination')}>
            <Pagination {...props} showSizeChanger />
        </div>
    );
}

export default PaginationCustom;
