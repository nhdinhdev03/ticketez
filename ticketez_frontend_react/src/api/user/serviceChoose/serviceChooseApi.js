import axiosClient from '~/api/global/axiosClient';
import BaseApi from '~/api/global/baseApi';

const url = 'service-choose';
class ServiceChooseApi extends BaseApi {
    constructor() {
        super(url);
    }
    // async getPaymentInfoParams(params) {
    //     return axiosClient.get(`/${url}/vnpay-payment`, { params });
    // }
    async createListServiceChoose(listServiceChoose) {
        return axiosClient.post(`/${url}/create-list`, listServiceChoose);
    }
}
const serviceChooseApi = new ServiceChooseApi();
export default serviceChooseApi;
