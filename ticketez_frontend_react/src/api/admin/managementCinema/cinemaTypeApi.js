import axiosClient from '../../global/axiosClient';

const url = 'cinemaType';

const cinemaTypeApi = {

    getId: async (cinemaTypeId) => {
        return axiosClient.get(url + '/' + cinemaTypeId);
    },
    

    get: async () => {
        return axiosClient.get(url);
    },
    post: async (data) => {
        const values = { ...data};
        console.log('values', values);
        return axiosClient.post(url, values);
    },
    put: async (id, data) => {
        
        const values = { id: id, ...data };
        return axiosClient.put(url + '/' + id, values);
    },
    delete: async (cinemaTypeId) => {
        return axiosClient.delete(url + '/' + cinemaTypeId);
    }
};

export default cinemaTypeApi;