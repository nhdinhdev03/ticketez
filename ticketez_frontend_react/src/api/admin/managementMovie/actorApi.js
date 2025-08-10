// import axiosClient from '../../global/axiosClient';

// const url = 'actor';

// const actorApi = {
//     getId: async (actorId) => {
//         return axiosClient.get(url + '/' + actorId);
//     },
//     getPage: async (page, limit) => {
//         const params = {
//             page: page,
//             limit: limit,
//         };
//         const res = await axiosClient.get(url, { params });
//         return res.data ;
//     },
//     post: async (data) => {
//         return axiosClient.post(url, data);
//     },
//     put: async (id, data) => {
//         return axiosClient.put(url + '/' + id, data);
//     },
//     delete: async (actorId) => {
//         return axiosClient.delete(url + '/' + actorId);
//     },
// };

// export default actorApi;



import BaseApi from '~/api/global/baseApi';

class ActorApi extends BaseApi {
    constructor() {
        super('actor');
    }
}
const actorApi = new ActorApi();
export default actorApi;

