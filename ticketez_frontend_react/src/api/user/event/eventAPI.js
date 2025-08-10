import axiosClient from '~/api/global/axiosClient';

const urlMovie = 'event';
export const eventAPI = {
    getEventByNew: async () => {
        try {
            const result = await axiosClient.get(urlMovie + '/get/event-by-news');
            return result.data;
        } catch (error) {
            return error;
        }
    },
    getEventByPromotion: async () => {
        try {
              const result = await axiosClient.get(urlMovie + '/get/event-by-promotion');
            return result.data;
        } catch (error) {
            return error;
        }
    },
};
export default eventAPI;