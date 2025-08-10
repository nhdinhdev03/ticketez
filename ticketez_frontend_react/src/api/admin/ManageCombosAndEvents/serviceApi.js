import BaseApi from '~/api/global/baseApi';
import cinemaComplexApi from '../managementCinema/cinemaComplexApi';
import axiosClient from '~/api/global/axiosClient';
const url = 'servicecombo';

class ServiceApi extends BaseApi {
    constructor() {
        super('servicecombo');
    }

    async post(data, cinemaComplexId) {
        try {
            const cinemaComplex = await cinemaComplexApi.getId(cinemaComplexId);
            const values = { ...data, cinemaComplex: cinemaComplex.data };
            console.log('values', values);
            const response = await axiosClient.post(url, values);
            console.log('Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async put(id, data, cinemaComplexId) {
        const cinemaComplex = await cinemaComplexApi.getId(cinemaComplexId);
        const values = { id: id, ...data, cinemaComplex: cinemaComplex.data };
        return axiosClient.put(url + '/' + id, values);
    }
}

const serviceApi = new ServiceApi();

export default serviceApi;
