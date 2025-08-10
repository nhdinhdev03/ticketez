import axiosClient from '../../global/axiosClient';

const url = 'province';

const provinceApi= {

    getId: async (provinceId) => {
        return axiosClient.get(url + '/' + provinceId);
    },
    get: async () => {
        return axiosClient.get(url);
    },
    post: async (data) => {
        return axiosClient.post(url, data);
    },
    put: async(id, data) => {
        return axiosClient.put(url + '/' + id, data);
    },
    delete: async (provinceId) => {
        return axiosClient.delete(url + '/' + provinceId);
    },
    getTotalCinemaComplexToPrivince: async () => {
        return axiosClient.get(url + '/getTotalCinemaComplexToPrivince');
    },
};
export default provinceApi;