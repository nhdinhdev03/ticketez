import BaseApi from '~/api/global/baseApi';

class FormatApi extends BaseApi {
    constructor() {
        super('format');
    }
}
const formatAPI = new FormatApi();
export default formatAPI;
