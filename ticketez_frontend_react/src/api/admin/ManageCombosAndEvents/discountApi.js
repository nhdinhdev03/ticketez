
import BaseApi from '~/api/global/baseApi';
import cinemaComplexApi from '../managementCinema/cinemaComplexApi';
import axiosClient from '~/api/global/axiosClient';

const url = 'discount';

class DiscountApi extends BaseApi {
    constructor() {
        super('discount');
    }


    async post(data, cinemaComplexId) {
        try {
            const [cinemaComplex] = await Promise.all([cinemaComplexApi.getId(cinemaComplexId)]);
            const values = { ...data, cinemaComplex: cinemaComplex.data };
            console.log('values', values);
            return axiosClient.post(url, values);
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async put(id, data, cinemaComplexId) {
        try {
            const [ cinemaComplex ] = await Promise.all([cinemaComplexApi.getId(cinemaComplexId)]);
            const values = { id: id, ...data, cinemaComplex: cinemaComplex.data };
            console.log('values', values);
            return axiosClient.put(url + '/' + id, values);
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}

const discountApi = new DiscountApi();

export default discountApi;
