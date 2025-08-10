// import axiosClient from '../../global/axiosClient';

// const url = 'format';

// const formatApi = {
//     getId: async (formatId) => {
//         return axiosClient.get(url + '/' + formatId);
//     },
//     get: async () => {
//         return axiosClient.get(url);
//     },
//     post: async (data) => {
//         return axiosClient.post(url, data);
//     },
//     put: async (id ,data) => {
//         return axiosClient.put(url + '/' + id, data);
//     },
//     delete: async (formatId) => {
//         return axiosClient.delete(url + '/' + formatId);
//     },
// };

// export default formatApi;
import BaseApi from '~/api/global/baseApi';

class FormatApi extends BaseApi {
    constructor() {
        super('format');
    }
}
const formatAPI = new FormatApi();
export default formatAPI;
