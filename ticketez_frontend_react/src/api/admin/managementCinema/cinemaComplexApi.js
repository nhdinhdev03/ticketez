import axiosClient from '../../global/axiosClient';
import cinemaChainApi from './cinemaChainApi';
import provinceApi from './provinceApi';

const url = 'cinemaComplex';

const cinemaComplexApi = {
    getId: async (cinemaComplexId) => {
        return axiosClient.get(url + '/' + cinemaComplexId);
    },

    get: async () => {
        return axiosClient.get(url + '/get/all');
    },

    getPage: async (page, limit) => {
        const params = {
            page: page,
            limit: limit,
        };
        const res = await axiosClient.get(url, { params });
        return res.data;
    },

    post: async (data, provinceId, cinemaChainId) => {
        const [province, cinemaChain] = await Promise.all([
            provinceApi.getId(provinceId),
            cinemaChainApi.getId(cinemaChainId),
        ]);
        const values = { ...data, province: province.data, cinemaChain: cinemaChain.data };
        console.log('values', values);
        return axiosClient.post(url, values);
    },
    put: async (id, data, provinceId, cinemaChainId) => {
        const [province, cinemaChain] = await Promise.all([
            provinceApi.getId(provinceId),
            cinemaChainApi.getId(cinemaChainId),
        ]);
        const values = { id: id, ...data, province: province.data, cinemaChain: cinemaChain.data };
        return axiosClient.put(url + '/' + id, values);
    },
    delete: async (cinemaComplexId) => {
        return axiosClient.delete(url + '/' + cinemaComplexId);
    },

    //hiển thị số lượng cinema theo cinemacomplex
    getTotalCinemaToCinemaComplex: async () => {
        return axiosClient.get(url + '/getTotalCinemaToCinemaComplex');
    },

    //hiển thị số lượng cinema theo cinemacomplex
    getComplexByProvince: async (id) => {
        return axiosClient.get(url + '/get/cinemaComplex-by-province/'+ id);
    },
};

export default cinemaComplexApi;
