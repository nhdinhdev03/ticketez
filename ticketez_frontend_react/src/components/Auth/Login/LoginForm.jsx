import React, { useEffect, useState } from 'react';
import { Layout, Form, Input, Button, Checkbox, Modal } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import styles from './loginForm.module.scss';
import img from '~/assets/img';
import { SyncOutlined } from '@ant-design/icons';
import authApi from '~/api/user/Security/authApi';
import { hasSuperAdminRole } from '~/utils/authUtils';
import funcUtils from '~/utils/funcUtils';
import { validateId, validatePassword } from '../Custom';
const { Content } = Layout;

const generateCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const LoginForm = () => {
    const [canRefresh, setCanRefresh] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [captcha, setCaptcha] = useState(generateCaptcha());
    const [userInput, setUserInput] = useState('');
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(null);
    const [isloading, issetLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleRightClick = (event) => {
            event.preventDefault();
        };
        document.addEventListener('contextmenu', handleRightClick);

        return () => {
            document.removeEventListener('contextmenu', handleRightClick);
        };
    }, []);

    const onFinish = async (values) => {
        if (!isCaptchaVerified) {
            setIsModalVisible(true);
            return;
        }
        setLoading(true);
        try {
            const response = await authApi.getLogin({
                id: values.id,
                password: values.password,
            });

            if (hasSuperAdminRole()) {
                navigate('/admin/index');
                funcUtils.notify('Đăng nhập thành công!', 'success');
            } else {
                funcUtils.notify('Đăng nhập thành công!', 'success');
                navigate('/');
            }
            setIsModalVisible(true);
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            funcUtils.notify(errorMessage, 'error');
            if (errorMessage === 'Tài khoản chưa được xác thực. Vui lòng xác thực email của bạn!') {
                navigate('/otp');
            }
        } finally {
            setLoading(false);
        }
    };

    const onFinishCaptcha = () => {
        issetLoading(true);
        setTimeout(() => {
            issetLoading(false);

            if (userInput.trim().toLowerCase() === captcha.trim().toLowerCase()) {
                setIsCaptchaVerified(true);
                funcUtils.notify('Xác thực thành công!', 'success');
                setIsModalVisible(false);
            } else {
                setIsCaptchaVerified(false);
                funcUtils.notify('Xác thực không hợp lệ', 'error');
                setCaptcha(generateCaptcha());
            }
        }, 1000);
    };

    const onRefresh = () => {
        if (canRefresh) {
            setCaptcha(generateCaptcha());
            setCanRefresh(false);
            setTimeLeft(5);
        }
    };
    useEffect(() => {
        let timer = null;
        if (timeLeft != null) {
            timer = setTimeout(() => {
                setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
            }, 1000);
        }
        if (timeLeft === 0) {
            setCanRefresh(true);
            setTimeLeft(null);
        }
        return () => clearTimeout(timer);
    }, [timeLeft]);

    const handleModalClose = () => {
        form.resetFields();
        setCaptcha(generateCaptcha());
        setIsCaptchaVerified(false);
        setUserInput('');
        setIsModalVisible(false);
    };

    const onCaptchaChange = (e) => {
        setUserInput(e.target.value);
        if (isCaptchaVerified === false) {
            setIsCaptchaVerified(null);
        }
    };

    return (
        <Layout className="layout">
            <Content className={styles.content}>
                <div className={styles.wrapper}>
                    <div className={styles.loginContainer}>
                        <h1 className={styles.title}>Đăng nhập</h1>
                        <p className={styles.welcomeText}>
                            Chào mừng bạn đến giao diện người dùng TicketEZ. Vui lòng nhập thông tin của bạn dưới đây để
                            đăng nhập.
                        </p>
                        <Form
                            name="basic"
                            className={styles.loginForm}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item name="id" rules={[{ validator: validateId }]} className={styles.formItem}>
                                <Input placeholder="Tên tài khoản" className={styles.input} />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ validator: validatePassword }]}
                                className={styles.formItem}
                            >
                                <Input.Password type="password" placeholder="Mật khẩu" className={styles.input} />
                            </Form.Item>

                            <Form.Item className={styles.formItem}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    className={styles.loginButton}
                                    loading={loading}
                                >
                                    Đăng nhập
                                </Button>
                                <p className={styles.signup}>
                                    Bạn chưa có tài khoản
                                    <Link className={styles.forgots} to="/Register">
                                        Đăng Ký
                                    </Link>
                                </p>
                                <p className={styles.Qtk}>
                                    Quên mật khẩu tại đây
                                    <Link className={styles.forgot} to="/forgotpassword">
                                        Quên mật khẩu
                                    </Link>
                                </p>
                            </Form.Item>
                        </Form>
                    </div>
                </div>

                <div className={styles.rightContainer}>
                    <img src={img.logoLogin1} alt="Login" className={styles.imageStyle} />
                </div>
            </Content>
            <Modal
                title="Xác thực bạn có phải người máy không !"
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                centered
                style={{ textAlign: 'center' }}
            >
                <Form form={form} onFinish={onFinishCaptcha} className="captcha-form">
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '20px',
                            userSelect: 'none',
                        }}
                    >
                        <div
                            style={{
                                padding: '5px',
                                userSelect: 'none',
                                border: '1px solid gainsboro',
                                borderRadius: 5,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '24px',
                                    letterSpacing: '10px',
                                    userSelect: 'none',
                                }}
                            >
                                {captcha.substring(0, 6)}
                            </div>
                        </div>

                        <div
                            style={{
                                border: '1px solid gray',
                                borderRadius: '5px',
                                marginLeft: '10px',
                                userSelect: 'none',
                            }}
                        >
                            <Button
                                icon={
                                    <div style={{ position: 'relative', userSelect: 'none' }}>
                                        <SyncOutlined spin={!canRefresh} />
                                        {!canRefresh && (
                                            <span
                                                style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    color: 'black',
                                                    fontSize: '12px',
                                                    lineHeight: '12px',
                                                    userSelect: 'none',
                                                }}
                                            >
                                                {timeLeft}
                                            </span>
                                        )}
                                    </div>
                                }
                                onClick={onRefresh}
                                disabled={!canRefresh}
                                style={{ border: 'none', userSelect: 'none' }}
                            />
                        </div>
                    </div>

                    <Form.Item
                        name="captcha"
                        rules={[
                            { required: true, message: 'Vui lòng nhập captcha!' },
                            { max: 6, message: 'Mã captcha chỉ được tối đa 6 kí tự!' },
                        ]}
                        className={styles.captchaInput}
                        validateStatus={
                            isCaptchaVerified !== null ? (isCaptchaVerified ? 'success' : 'error') : undefined
                        }
                        help={isCaptchaVerified === false ? 'Captcha không đúng, vui lòng thử lại.' : undefined}
                    >
                        <Input placeholder="Nhập mã captcha" onChange={onCaptchaChange} maxLength={6} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={isloading}>
                            Xác thực
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default LoginForm;
