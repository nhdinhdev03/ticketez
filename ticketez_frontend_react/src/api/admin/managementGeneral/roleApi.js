import axiosClient from '../../global/axiosClient';

const url = 'role';

const roleApi= {

    getId: async (roleId) => {
        return axiosClient.get(url + '/' + roleId);
    },
    get: async () => {
        return axiosClient.get(url + '/get/all');
    },
    post: async (data) => {
        return axiosClient.post(url, data);
    },
    put: async(id, data) => {
        return axiosClient.put(url + '/' + id, data);
    },
    delete: async (roleId) => {
        return axiosClient.delete(url + '/' + roleId);
    },
   
};
export default roleApi;