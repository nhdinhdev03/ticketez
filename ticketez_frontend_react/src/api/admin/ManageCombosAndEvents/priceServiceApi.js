import BaseApi from '~/api/global/baseApi';
import cinemaComplexApi from '../managementCinema/cinemaComplexApi';
import serviceApi from './serviceApi';
import axiosClient from '~/api/global/axiosClient';
const url = 'priceService';

class PriceServiceApi extends BaseApi {
    constructor() {
        super('priceService');
    }

    async findByCplx(idCplx) {
        try {
            const response = await axiosClient.get(`${url}/find-by-cinema-complex/${idCplx}`);
            console.log('Response:', response);
            return response;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }


    async post(data, serviceId) {
        try {
            const [service] = await Promise.all([
                serviceApi.getById(serviceId)
            ]);
            const values = { ...data, service: service.data};
            console.log('values', values);
            return axiosClient.post(url, values);
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async put(id, data, serviceId) {
        try {
            const [service] = await Promise.all([serviceApi.getById(serviceId)]);
            const values = { id: id, ...data, service: service.data };
            console.log('values', values);
            return axiosClient.put(url + '/' + id, values);
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}
const priceServiceApi = new PriceServiceApi();
export default priceServiceApi;
