import React, { useState } from 'react';
import { Layout, Form, Input, Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './ResetPasswordFrom.module.scss';
import authApi from '~/api/user/Security/authApi';
import funcUtils from '~/utils/funcUtils';
import { validateEmail, validateId, validatePassword, validatePhone, validateFullname } from '../Custom';
const { Content } = Layout;

const ResetPasswordForm = () => {
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const hideModal = () => {
        setIsModalVisible(false);
    };

    const onEmailSubmit = async (values) => {
        setLoading(true);
   
        try {
            await authApi.sendOtpEmailNew({
                email: values.email
            });
            showModal();
            funcUtils.notify('Mã OTP đã được gửi đến email của bạn.', 'success');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Email không tồn tại !';
            funcUtils.notify(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };


    const onResetPasswordSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await authApi.ResetPasswordNew({
                code: values.code,
                newPassword: values.newPassword
            });
            funcUtils.notify('Đổi mật khẩu thành công!', 'success');
            navigate('/login');
        }
        catch (error) {
            funcUtils.notify('Kiểm tra mã OTP!', 'error');
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Layout className="layout">
            <Content className={styles.content}>
                <div className={styles.formContainer}>
                    <Form
                        onFinish={onEmailSubmit}
                        className={styles.resetForm}
                        layout="vertical"
                    >
                        <h3 className={styles.title}>Đặt lại mật khẩu của bạn</h3>
                        <Form.Item
                            name="email"
                            rules={[
                                { validator: validateEmail },
                            ]}
                        >
                            <Input placeholder="Email" className={styles.inputField} />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className={styles.submitButton}
                                block
                            >
                                Gửi email
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

                {/* OTP and New Password Modal */}
                <Modal
                    title="Đặt lại mật khẩu"
                    visible={isModalVisible}
                    onCancel={hideModal}
                    footer={null}
                    className={styles.modal}
                >
                    <Form
                        onFinish={onResetPasswordSubmit}
                        className={styles.resetForm}
                        layout="vertical"
                    >
                        <Form.Item
                            name="code"
                            rules={[{ required: true, message: 'Vui lòng nhập mã OTP!' },
                            { max: 6, message: 'Mã OTP phải có 6 ký tự!' },
                            ]}
                        >
                            <Input placeholder="Mã OTP" className={styles.inputField} />
                        </Form.Item>
                        <Form.Item
                            name="newPassword"
                            rules={[
                                { validator: validatePassword },
                            ]}
                        >
                            <Input.Password placeholder="Mật khẩu mới" className={styles.inputField} />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className={styles.submitButton}
                                block
                            >

                                Đặt lại mật khẩu
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </Content>
        </Layout>
    );
};

export default ResetPasswordForm;