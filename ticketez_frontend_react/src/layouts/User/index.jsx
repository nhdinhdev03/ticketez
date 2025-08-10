import HeaderCustom from './Header';
import FooterCustom from './Footer';

// scss
import styles from './User.module.scss';
import classNames from 'classnames/bind';
// ant design
import React from 'react';
import { Layout, Space } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const headerStyle = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 50,
    lineHeight: '64px',
    backgroundColor: '#7dbcea',
};
const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    // backgroundColor: '#fff',
};
const siderStyle = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#3ba0e9',
};
const footerStyle = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#7dbcea',
};
const cx = classNames.bind(styles);
const UserLayout = ({ children }) => (
    <Space
        direction="vertical"
        style={{
            width: '100%',
        }}
        size={[0, 48]}
    >
        <Layout>
            <HeaderCustom></HeaderCustom>
            {/* <Header className={cx('content-index')} style={headerStyle}></Header> */}
            <Content className={cx('content-index')} style={contentStyle}>
                {' '}
                {children}
            </Content>
            <FooterCustom></FooterCustom>
            {/* <Footer style={footerStyle}>Footer</Footer> */}
        </Layout>
    </Space>
);
export default UserLayout;
