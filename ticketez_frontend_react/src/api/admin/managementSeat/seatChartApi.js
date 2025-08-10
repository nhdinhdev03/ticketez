import BaseApi from '~/api/global/baseApi';

class SeatChartApi extends BaseApi {
    constructor() {
        super('seatchart/getAll');
    }
}
const seatChartApi = new SeatChartApi();

export default seatChartApi;

