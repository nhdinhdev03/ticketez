import React, { useEffect, useState } from 'react';
import { Layout, Form, Input, Button, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './OtpForm.module.scss';
import authApi from '~/api/user/Security/authApi';
import funcUtils from '~/utils/funcUtils';
import {validateId} from '../Auth/Custom/index';

const { Content } = Layout;


const OtpForm = () => {
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(300);
    const [emailForOtp, setEmailForOtp] = useState('');
    const [isOtpButtonDisabled, setOtpButtonDisabled] = useState(false);
    const [otpExpired, setOtpExpired] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let intervalId;

        if (isOtpButtonDisabled && countdown > 0) {
            intervalId = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            setOtpButtonDisabled(false);
            setOtpExpired(true);
        }

        return () => clearInterval(intervalId);
    }, [isOtpButtonDisabled, countdown]);


    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await authApi.getVerifyAccount({
                id: values.id,
                otp: values.otp

            });
            funcUtils.notify('Xác Minh thành công !', 'success');
            navigate('/login');
        } catch (error) {
            funcUtils.notify('Kiểm tra tài khoản và Mã OTP đúng chưa', 'error');
        } finally {
            setLoading(false);
        }
    };


    const handleResendOtp = async () => {
        if (!emailForOtp) {
            funcUtils.notify('Vui lòng nhập email để nhận mã OTP.', 'error');
            return;
        }
        setOtpExpired(false);
        setOtpButtonDisabled(true);
        setCountdown(5);
        try {
            const response = await authApi.regenerateOtp(emailForOtp);
            funcUtils.notify('Mã OTP đã được gửi. Vui lòng xác minh tài khoản trong vòng 1 phút!', 'success');
            console.log(response);
        } catch (error) {
            funcUtils.notify('Có lỗi xảy ra khi gửi mã OTP. Vui lòng thử lại.', 'error');
        }

        setTimeout(() => {
            setOtpButtonDisabled(true);
        }, 300000);
    };

    return (
        <Layout className="layout">
            <Content className={styles.content}>
                <div className={styles.wrapper}>
                    <div className={styles.loginContainer}>
                        <Form
                            name="basic"
                            className={styles.loginForm}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <h3 className={styles.formTitle}>Xác thực tài khoản</h3>

                            <Form.Item
                                name="id"
                                rules={[
                                    { validator: validateId}, 
                                  ]}
                                className={styles.formItem}
                            >
                                <Input placeholder="Tên Tài khoản" className={styles.input} />
                            </Form.Item>

                            <Form.Item
                                name="otp"
                                rules={[{ required: true, message: 'Vui lòng nhập mã OTP!' }, 
                                { max: 6, message: 'Mã OTP phải gồm 6 chữ số!' }]}
                                className={styles.formItem}
                            >
                                <Input placeholder="Nhập mã OTP" maxLength={6} className={styles.input} />
                            </Form.Item>

                            <div className={styles.resendContainer}>
                                <Input
                                    placeholder="Email để nhận mã OTP"
                                    name='email'
                                    value={emailForOtp}
                                    onChange={(e) => setEmailForOtp(e.target.value)}
                                    className={styles.input}
                                />
                                <Button
                                    onClick={handleResendOtp}
                                    disabled={isOtpButtonDisabled}
                                    className={styles.resendButton}
                                >
                                    {isOtpButtonDisabled ? `Gửi lại sau (${countdown}s)` : 'Gửi mã'}
                                </Button>
                            </div>

                            <Button type="primary" htmlType="submit" block className={styles.loginButton} loading={loading}>
                                Xác nhận
                            </Button>
                        </Form>
                    </div>
                </div>
            </Content>
        </Layout>
    );

};

export default OtpForm;