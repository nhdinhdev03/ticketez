
import BaseApi from '~/api/global/baseApi';
 import axiosClient from '~/api/global/axiosClient';
 const url = 'cinemaChain';

class CinemaChainApi extends BaseApi {
    constructor() {
        super('cinemaChain');
    }
}

const cinemaChainApi = new CinemaChainApi();

export default cinemaChainApi;