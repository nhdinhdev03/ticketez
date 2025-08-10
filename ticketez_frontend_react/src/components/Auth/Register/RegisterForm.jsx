import React, { useState } from 'react';
import { Layout, Form, Input, Button, Checkbox, Radio } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterForm.module.scss';
import img from '~/assets/img';
import authApi from '~/api/user/Security/authApi';
import funcUtils from '~/utils/funcUtils';
import backgroundImage from '~/assets/img/texure.jpg';
import { validateEmail, validateId, validatePassword, validatePhone, validateFullname } from '../Custom';

const { Header, Content } = Layout;

const RegisterForm = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [form] = Form.useForm();
    const [registrationData, setRegistrationData] = useState({});

    const onFinish = async () => {
        setLoading(true);
        const finalData = {
            ...registrationData,
            ...form.getFieldsValue(),
            gender: form.getFieldValue('gender') === 'male',
        };
        try {
            await authApi.signup(finalData);
            funcUtils.notify('Đăng ký thành công kiểm tra email nhập mã để xác nhận tài khoản!', 'success');
            navigate('/otp');
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            funcUtils.notify(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const onNext = async () => {
        try {
            const values = await form.validateFields(
                currentStep === 1 ? ['id', 'fullname'] : currentStep === 2 ? ['phone', 'email'] : [],
            );
            setRegistrationData((prevData) => ({ ...prevData, ...values }));
            setCurrentStep(currentStep + 1);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    const onPrevious = () => {
        setCurrentStep(currentStep - 1);
    };
    return (
        <Layout className="layout">
            <Content className={styles.content}>
                <div className={styles.wrapper}>
                    <div className={styles.registerContainer}>
                        <h1 className={styles.title}>Đăng Ký</h1>
                        <Form
                            form={form}
                            name="register"
                            className={styles.registerForm}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            {currentStep === 1 && (
                                <>
                                    <span
                                        style={{
                                            marginBottom: '20px',
                                            marginRight: '450px',
                                            fontWeight: 'bold',
                                            fontSize: '14px',
                                        }}
                                    >
                                        Tên tài khoản:
                                    </span>
                                    <Form.Item
                                        name="id"
                                        rules={[
                                            {
                                                validator: validateId,
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Tên Tài khoản" />
                                    </Form.Item>
                                    <span
                                        style={{
                                            marginBottom: '20px',
                                            marginRight: '485px',
                                            fontWeight: 'bold',
                                            fontSize: '14px',
                                        }}
                                    >
                                        Họ và tên:
                                    </span>
                                    <Form.Item name="fullname" rules={[{ validator: validateFullname }]}>
                                        <Input placeholder="Họ và tên" />
                                    </Form.Item>
                                    <Button type="primary" onClick={onNext}>
                                        Tiếp theo
                                    </Button>
                                </>
                            )}

                            {currentStep === 2 && (
                                <>
                                    <span
                                        style={{
                                            marginBottom: '20px',
                                            marginRight: '460px',
                                            fontWeight: 'bold',
                                            fontSize: '14px',
                                        }}
                                    >
                                        Số điện thoại:
                                    </span>
                                    <Form.Item name="phone" rules={[{ validator: validatePhone }]}>
                                        <Input placeholder="Số điện thoại" />
                                    </Form.Item>
                                    <span
                                        style={{
                                            marginBottom: '20px',
                                            marginRight: '530px',
                                            fontWeight: 'bold',
                                            fontSize: '14px',
                                        }}
                                    >
                                        Email:
                                    </span>
                                    <Form.Item name="email" rules={[{ validator: validateEmail }]}>
                                        <Input placeholder="Email" />
                                    </Form.Item>
                                    <div className="button-group">
                                        <Button onClick={onPrevious} style={{ marginRight: '20px' }}>
                                            Quay lại
                                        </Button>

                                        <Button type="primary" onClick={onNext}>
                                            Tiếp theo
                                        </Button>
                                    </div>
                                </>
                            )}

                            {currentStep === 3 && (
                                <>
                                    <span style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '14px' }}>
                                        Giới tính:
                                    </span>
                                    <Form.Item
                                        name="gender"
                                        rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                                    >
                                        <Radio.Group>
                                            <Radio value="male">Nam</Radio>
                                            <Radio value="female">Nữ</Radio>
                                        </Radio.Group>
                                    </Form.Item>

                                    <span
                                        style={{
                                            marginBottom: '20px',
                                            marginRight: '485px',
                                            fontWeight: 'bold',
                                            fontSize: '14px',
                                        }}
                                    >
                                        Mật khẩu:
                                    </span>
                                    <Form.Item name="password" rules={[{ validator: validatePassword }]}>
                                        <Input.Password placeholder="Mật khẩu" />
                                    </Form.Item>

                                    <span
                                        style={{
                                            marginBottom: '20px',
                                            marginRight: '390px ',
                                            fontWeight: 'bold',
                                            fontSize: '14px',
                                        }}
                                    >
                                        Xác nhận lại mật khẩu:
                                    </span>
                                    <Form.Item
                                        name="confirm"
                                        dependencies={['password']}
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng xác nhận mật khẩu của bạn!',
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(
                                                        new Error('Hai mật khẩu bạn nhập không khớp!'),
                                                    );
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password placeholder="Xác nhận mật khẩu" />
                                    </Form.Item>
                                    <Button onClick={onPrevious} style={{ marginRight: '20px' }}>
                                        Quay lại
                                    </Button>
                                    <Button type="primary" htmlType="submit" loading={loading}>
                                        Đăng ký
                                    </Button>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default RegisterForm;
