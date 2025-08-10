import axiosClient from '~/api/global/axiosClient';
import BaseApi from '~/api/global/baseApi';

const url = 'booking';
class BookingApi extends BaseApi {
    constructor() {
        super(url);
    }
    async getPaymentInfoParams(params) {
        return axiosClient.get(`/${url}/vnpay-payment`, { params });
    }
    async getPaymentInfoById(id) {
        return axiosClient.get(`/${url}/payment-info/${id}`);
    }

    

    async getBookingByAcc(page = 1, limit = 10, accountId, ticketStatus = 0, search = '') {
        const params = {
            page,
            limit,
            search,
            ticketStatus,
        };
        const res = await axiosClient.get(`/${url}/get-by-acc/${accountId}`, { params });
        return res.data;
    }

    // 
    async getBookingPaymentInfoSeatBooking(bookingId) {
        return axiosClient.get(`/${url}/get/booking-payment-info-seat-booking/${bookingId}`);
    }
}
const bookingApi = new BookingApi();
export default bookingApi;
