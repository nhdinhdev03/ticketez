import classNames from 'classnames/bind';
import style from './ConnectorPage.module.scss';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import bookingApi from '~/api/user/booking/bookingApi';
import { Flex, Spin } from 'antd';

const cx = classNames.bind(style);

function ConnectorPage() {
    // const {bookingId,showtimeId, accountId} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const callPaymentApi = async () => {
            const queryParams = new URLSearchParams(window.location.search);
            const vnp_Amount = queryParams.get('vnp_Amount');
            const vnp_BankCode = queryParams.get('vnp_BankCode');
            const vnp_BankTranNo = queryParams.get('vnp_BankTranNo');
            const vnp_CardType = queryParams.get('vnp_CardType');
            const vnp_OrderInfo = queryParams.get('vnp_OrderInfo');
            const vnp_PayDate = queryParams.get('vnp_PayDate');
            const vnp_ResponseCode = queryParams.get('vnp_ResponseCode');
            const vnp_TmnCode = queryParams.get('vnp_TmnCode');
            const vnp_TransactionNo = queryParams.get('vnp_TransactionNo');
            const vnp_TransactionStatus = queryParams.get('vnp_TransactionStatus');
            const vnp_TxnRef = queryParams.get('vnp_TxnRef');
            const vnp_SecureHash = queryParams.get('vnp_SecureHash');
            const bookingId = queryParams.get('bookingId');
            const accountId = queryParams.get('accountId');
            const showtimeId = queryParams.get('showtimeId');

            const params = {
                vnp_Amount,
                vnp_BankCode,
                vnp_BankTranNo,
                vnp_CardType,
                vnp_OrderInfo,
                vnp_PayDate,
                vnp_ResponseCode,
                vnp_TmnCode,
                vnp_TransactionNo,
                vnp_TransactionStatus,
                vnp_TxnRef,
                vnp_SecureHash,
                bookingId,
                accountId,
                showtimeId,
            };
            const page = '/booking-info';
            try {
                const resp = await bookingApi.getPaymentInfoParams(params);

                navigate(page, {
                    state: { paymentInfoId: resp.data },
                    replace: true,
                });

                setLoading(false);
            } catch (error) {
                navigate(page, {
                    state: { paymentInfoId: null },
                    replace: true,
                });
                setLoading(false);
            }
        };
        callPaymentApi();
    }, []);

    return (
        <>
            {loading && (
                <div id="initSpinner">
                    <div className="cm-spinner"></div>
                </div>
            )}
        </>
    );
    // <div className={cx('wrapper', 'tw-text-red-300')}>
    //     <Flex align="center" gap="middle">
    //         <Spin size="large" spinning={loading} />
    //     </Flex>
    // </div>
}

export default ConnectorPage;
