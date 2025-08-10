import BaseApi from '~/api/global/baseApi';

class SeatTypeApi extends BaseApi {
    constructor() {
        super('seatType');
    }
}
const seatTypeApi = new SeatTypeApi();
export default seatTypeApi;

