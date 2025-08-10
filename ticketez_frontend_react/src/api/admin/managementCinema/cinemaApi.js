import axiosClient from '../../global/axiosClient';
import cinemaComplexApi from './cinemaComplexApi';
import cinemaTypeApi from './cinemaTypeApi';

const url = 'cinema';

const cinemaApi = {
    getId: async (cinemaId) => {
        return axiosClient.get(url + '/' + cinemaId);
    },
    getPage: async (page, limit) => {
        const params = {
            page: page,
            limit: limit,
        };
        const res = await axiosClient.get(url, { params });
        return res.data;
    },
    get: async () => {
        return axiosClient.get(url);
    },
    post: async (data, cinemaTypeId, cinemaComplexId) => {
        const [cinemaType, cinemaComplex] = await Promise.all([
            cinemaTypeApi.getId(cinemaTypeId),
            cinemaComplexApi.getId(cinemaComplexId),
        ]);
        const values = { ...data, cinemaType: cinemaType.data, cinemaComplex: cinemaComplex.data };
        console.log('values', values);
        return axiosClient.post(url, values);
    },
    put: async (id, data, cinemaTypeId, cinemaComplexId) => {
        const [cinemaType, cinemaComplex] = await Promise.all([
            cinemaTypeApi.getId(cinemaTypeId),
            cinemaComplexApi.getId(cinemaComplexId),
        ]);
        const values = { id: id, ...data, cinemaType: cinemaType.data, cinemaComplex: cinemaComplex.data };
        return axiosClient.put(url + '/' + id, values);
    },
    delete: async (cinemaId) => {
        return axiosClient.delete(url + '/' + cinemaId);
    },
    
    getCinemaByComplexId: async (cinemaComplexId, page, limit) => {
        const params = {
            cinemaComplexId,
            page,
            limit,
        }
        return axiosClient.get(url + '/get/cinema-by-cinemaComplexId', {params});
    },
};
export default cinemaApi;
