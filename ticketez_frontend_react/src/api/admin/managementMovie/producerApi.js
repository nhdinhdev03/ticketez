import BaseApi from '~/api/global/baseApi';

class ProducerApi extends BaseApi {
    constructor() {
        super('producer');
    }
}
const producerApi = new ProducerApi();
export default producerApi;
