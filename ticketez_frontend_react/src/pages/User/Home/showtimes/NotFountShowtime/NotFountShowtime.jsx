import classNames from 'classnames/bind';
import style from './NotFountShowtime.module.scss';
import img from '~/assets/img';

const cx = classNames.bind(style);


function NotFountShowtime({titleFirst, titleLast}) {
    return ( 
       <div className={cx('wrapper')} >
        <div className={cx('container-img')}>
            <img className={cx('img')} src={img.notFoundLogo} alt="" />
        </div>
        <div className={cx('title-1')}>{titleFirst}</div>
        <div className={cx('title-2')}>{titleLast}</div>
       </div>
     );
}

export default NotFountShowtime;