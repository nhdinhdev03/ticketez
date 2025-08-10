import axiosClient from '../../global/axiosClient';

const urlMovie = 'movie';
const urlAccount= 'account';
const urlBooking = 'booking';

const AdminDashboardApi = {
    getTotalTickets: async () => {
        return axiosClient.get(urlMovie + '/get/total-ticket');
    },
    getTotalMovies: async () => {
        return axiosClient.get(urlMovie + '/get/total-movie');
    },
    getTotalUser: async () => {
        return axiosClient.get(urlAccount + '/get/total-user');
    },
    getRevenueStatistics: async () => {
        return axiosClient.get(urlBooking + '/get/Revenue-statistics');
    },
};

export default AdminDashboardApi;
