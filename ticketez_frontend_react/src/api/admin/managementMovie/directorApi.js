// import axiosClient from '../../global/axiosClient';

// const url = 'director';
// const directorApi = {
//     getId: async (directorId) => {
//         return axiosClient.get(url + '/' + directorId);
//     },
//     get: async (page, limit) => {
//         const params = {
//             page: page,
//             limit: limit,
//         };
//         const res = await axiosClient.get(url, { params } );
//         return  res.data;
//     },
//     post: async (data) => {
//         return axiosClient.post(url, data);
//     },
//     put: async (id ,data) => {
//         return axiosClient.put(url + '/' + id, data);
//     },
//     delete: async (directorId) => {
//         return axiosClient.delete(url + '/' + directorId);
//     },
// };

// export default directorApi;

import BaseApi from '~/api/global/baseApi';

class DirectorApi extends BaseApi {
    constructor() {
        super('director');
    }
}
const directorApi = new DirectorApi();
export default directorApi;
