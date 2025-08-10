import axiosClient from '../../global/axiosClient';

const url = 'event';

const eventApi = {
    getId: async (Id) => {
        return axiosClient.get(url + '/' + Id);
    },
    getPage: async (page, limit) => {
        const params = {
            page: page,
            limit: limit,
        };
        const res = await axiosClient.get(url, { params });
        return res.data;
    },
    getAll: async () => {
        return axiosClient.get(url);
    },
    post: async (data) => {
        const values = { ...data };
        return axiosClient.post(url, values);
    },
    put: async (id, data) => {
        const values = { id: id, ...data };
        return axiosClient.put(url + '/' + id, values);
    },
    delete: async (actorId) => {
        return axiosClient.delete(url + '/' + actorId);
    },
};

export default eventApi;
