import React, { useState } from 'react';
import { Layout, Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './ChangePasswordForm.module.scss';
import authApi from '~/api/user/Security/authApi';
import funcUtils from '~/utils/funcUtils';
import { validateEmail, validateId, validatePassword, validatePhone, validateFullname } from '../Custom';
const { Content } = Layout;

const PasswordChangeForm = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        if (values.newPassword !== values.confirmNewPassword) {
            funcUtils.notify('Mật khẩu mới và xác nhận mật khẩu không khớp!', 'error');
            return;
        }
        if (!values.oldPassword) {
            funcUtils.notify('Vui lòng nhập mật khẩu cũ!', 'error');
            return;
        }
        setLoading(true);
        try {
            const response = await authApi.changePasswordNew({
                id: values.id,
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
                confirmNewPassword: values.confirmNewPassword

            });
            console.log(response);
            console.log(values.confirmNewPassword);
            funcUtils.notify('Đổi mật khẩu thành công!', 'success');
            navigate('/');
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            funcUtils.notify(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Layout className="layout">
            <Content className={styles.content}>
                <div className={styles.formContainer}>
                    <Form
                        name="passwordChange"
                        onFinish={onFinish}
                        autoComplete="off"
                        className={styles.passwordChangeForm}
                    >
                        <h3 className={styles.formTitle}>Đổi Mật Khẩu</h3>
                        <Form.Item
                            name="id"
                            rules={[
                                { validator: validateId },
                            ]}
                        >
                            <Input placeholder="Tên Tài khoản" />
                        </Form.Item>
                        <Form.Item
                            name="oldPassword"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu cũ!' },
                                { validator: validatePassword },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="newPassword"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                { validator: validatePassword },
                            ]}
                        >
                            <Input.Password placeholder="Mật khẩu mới" />
                        </Form.Item>
                        <Form.Item
                            name="confirmNewPassword"
                            dependencies={['newPassword']}
                            hasFeedback
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Xác nhận mật khẩu mới" />
                        </Form.Item>
                        {/* Submit Button */}
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading}>
                                Đổi mật khẩu
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        </Layout >
    );
};

export default PasswordChangeForm;