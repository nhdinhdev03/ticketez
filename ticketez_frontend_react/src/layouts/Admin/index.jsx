// React
import { useEffect, useState } from 'react';

// Scss
import styles from './Admin.module.scss';
import './AdminCustomAntDesgin.scss';
import classNames from 'classnames/bind';

// Ant Design
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, theme, Card, Skeleton } from 'antd';
import { HeaderAdminLeft, HeaderAdminRight } from './Header';
import { Footer } from 'antd/es/layout/layout';
import Sidebar from './Sidebar';
import { LayoutPageDefault } from '..';

const { Header, Sider, Content } = Layout;
const cx = classNames.bind(styles);
const AdminLayout = ({ children }) => {

     const [isLoading, setIsLoading] = useState(true);
     const [active, setActive] = useState(true);
     useEffect(() => {
         setTimeout(() => {
             setIsLoading(false);
         }, 1000);
     }, []);
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const path = window.location.pathname;

    return (
        <Layout>
            <Sider trigger={null} theme="light" collapsible collapsed={collapsed} width={250}>
                <Header
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: colorBgContainer,
                        padding: 0,
                        paddingLeft: '16px',
                    }}
                >
                    <HeaderAdminLeft />
                </Header>
                <Sidebar />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        display: 'flex',
                        width: '100%',
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <HeaderAdminRight />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        // background: colorBgContainer,
                    }}
                >
                    <div>
                        {isLoading && <Skeleton active={active} />}
                        {!isLoading && <LayoutPageDefault path={path}>{children}</LayoutPageDefault>}
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    {/* Ant Design ©2023 Created by Ant UED */}
                </Footer>
            </Layout>
        </Layout>
    );
};
export default AdminLayout;
