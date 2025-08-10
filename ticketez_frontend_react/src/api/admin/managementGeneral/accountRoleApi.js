import axiosClient  from "~/api/global/axiosClient";
import BaseApi from '~/api/global/baseApi';
const url = 'accountRole'

class AccountRoleApi extends BaseApi {
    constructor() {
        super('accountRole');
    }
    async getByPage(page, limit, search, status) {
        const params = {
            page,
            limit,
            search,
            status,
        };
        const res = await axiosClient.get(url, { params });
        return res.data;
    }
    async patchStatus(id, status, reason ) {
        return axiosClient.patch(url + '/status/' + id, { status, reason });
    }
    async patchInfoUser(id, data) {
        return axiosClient.patch(url + '/infoUser/' + id, data);
    }
    async post(value){
        return axiosClient.post(url + '/signupNV', value);
    }

}
const accountRoleApi = new AccountRoleApi();
export default accountRoleApi;