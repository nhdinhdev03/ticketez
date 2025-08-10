import axiosClient from "~/api/global/axiosClient";

const url = 'cinemaChain';

const cinemaChainApi = {
    getId: async(cinemaChainId) => {
        return axiosClient.get(url + '/' + cinemaChainId);
    },
    get: async () => {
        return axiosClient.get(url + '/get/all');
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
    delete: async (cinemaChainId) => {
        return axiosClient.delete(url + '/' + cinemaChainId);
    }
}

export default cinemaChainApi;