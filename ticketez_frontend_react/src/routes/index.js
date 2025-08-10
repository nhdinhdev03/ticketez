import UserContact from '~/pages/User/Contact';
import * as PageAdmin from '~/pages/Admin';
import * as PageUser from '~/pages/User';
import { AdminLayout, DefaultLayout } from '~/layouts';

const publicRoutes = [
    //Admin
    // { path: '/admin/index', component: PageAdmin.AdminIndex, layout: AdminLayout, roles: ['SUPER_ADMIN'] },
    // { path: '/admin/movie', component: PageAdmin.AdminMovie, layout: AdminLayout },
    // { path: '/admin/cinema-complex', component: PageAdmin.AdminCinemaComplex, layout: AdminLayout },
    // { path: '/admin/cinema', component: PageAdmin.AdminCinema, layout: AdminLayout },
    // { path: '/admin/cinema-type', component: PageAdmin.AdminCinemaType, layout: AdminLayout },
    // { path: '/admin/province', component: PageAdmin.AdminProvince, layout: AdminLayout },
    // { path: '/admin/showtime', component: PageAdmin.AdminShowtime, layout: AdminLayout },
    // { path: '/admin/seat', component: PageAdmin.AdminSeat, layout: AdminLayout },
    // { path: '/admin/seat-type', component: PageAdmin.AdminSeatType, layout: AdminLayout },
    // { path: '/admin/seat-chart', component: PageAdmin.AdminSeatChart, layout: AdminLayout },
    // { path: '/admin/combo', component: PageAdmin.AdminCombo, layout: AdminLayout },
    // { path: '/admin/discount', component: PageAdmin.AdminDiscount, layout: AdminLayout },
    // { path: '/admin/event', component: PageAdmin.AdminEvent, layout: AdminLayout },
    // { path: '/admin/movie-studio', component: PageAdmin.AdminMovieStudio, layout: AdminLayout },
    // { path: '/admin/actor', component: PageAdmin.AdminActor, layout: AdminLayout },
    // { path: '/admin/director', component: PageAdmin.AdminDirector, layout: AdminLayout },
    // { path: '/admin/format', component: PageAdmin.AdminFormat, layout: AdminLayout },
    // { path: '/admin/account', component: PageAdmin.AdminAccount, layout: AdminLayout },
    // { path: '/admin/mpaaRating', component: PageAdmin.AdminMpaaRating, layout: AdminLayout },
    // { path: '/admin/service', component: PageAdmin.AdminService, layout: AdminLayout },
    // { path: '/admin/priceservice', component: PageAdmin.AdminPriceService, layout: AdminLayout },
    // { path: '/admin/cinema-chains', component: PageAdmin.AdminCinemaChains, layout: AdminLayout },
    // { path: '/admin/price', component: PageAdmin.AdminPrice, layout: AdminLayout },
    // { path: '/admin/article', component: PageAdmin.AdminArticle, layout: AdminLayout },
    // { path: '/admin/movie-producer', component: PageAdmin.AdminProducer, layout: AdminLayout },
    // { path: '/admin/accountStaff', component: PageAdmin.AdminAccountStaff, layout: AdminLayout },
    // { path: '/admin/webcam', component: PageAdmin.AdminWebcam, layout: AdminLayout },
    // { path: '/admin/sendEmail', component: PageAdmin.AdminSendEmail, layout: AdminLayout },
    // { path: '/admin/ticket-statistics', component: PageAdmin.AdminTicKetStatistics, layout: AdminLayout },
    // // User
    // { path: '/admin/comentModeration', component: PageAdmin.AdminComment, layout: AdminLayout },

    // { path: '/movie/:id', component: PageUser.MovieDef, layout: DefaultLayout },
    { path: '/', component: PageUser.Home, layout: DefaultLayout },
    { path: '/login', component: PageUser.LoginForm, layout: DefaultLayout },
    { path: '/register', component: PageUser.RegisterForm, layout: DefaultLayout },
    { path: '/otp', component: PageUser.OtpForm, layout: DefaultLayout },
    { path: '/changepassword', component: PageUser.PasswordChangeForm, layout: DefaultLayout },
    { path: '/forgotpassword', component: PageUser.ResetPasswordFrom, layout: DefaultLayout },
    { path: '/chat', component: PageUser.Chat, layout: DefaultLayout },
    //sự kiện
    { path: '/su-kien/tin-tuc', component: PageUser.Event, layout: DefaultLayout },
    { path: '/su-kien/tin-tuc/:eventId', component: PageUser.EventDetails, layout: DefaultLayout },
    { path: '/su-kien/khuyen-mai', component: PageUser.Event, layout: DefaultLayout },
    { path: '/su-kien/khuyen-mai/:eventId', component: PageUser.EventDetails, layout: DefaultLayout },
    //liên hệ
    { path: '/contact', component: UserContact, layout: DefaultLayout },

    { path: '/movie-details/:movieId', component: PageUser.MovieDetails, layout: DefaultLayout },
    { path: '/movie-search', component: PageUser.MovieSearch, layout: DefaultLayout },
    { path: '/connector-page', component: PageUser.ConnectorPage, layout: null },
    { path: '/booking-info', component: PageUser.BookingInfo, layout: DefaultLayout },
    { path: '/booking-combo', component: PageUser.BookingCombo, layout: DefaultLayout },
    { path: '/booking-history', component: PageUser.BookingHistory, layout: DefaultLayout },
    { path: '/review/', component: PageUser.ReviewMovie, layout: DefaultLayout },
    { path: '/movieTop/', component: PageUser.MovieTop, layout: DefaultLayout },
    { path: '/movieTop/:articleId', component: PageUser.MovieTopDetails, layout: DefaultLayout },
    { path: '/movie-cinema-complex/:ccxId', component: PageUser.MovieCinemaComplex, layout: DefaultLayout },
];

const privateRoutes = [
    //trang chủ
    { path: '/admin/index', component: PageAdmin.AdminIndex, layout: AdminLayout, allowedRoles: ['SUPER_ADMIN', 'CINEMA_MANAGEMENT_ADMIN', 'USER_MANAGEMENT_ADMIN', 'SERVICE_EVENT_MANAGEMENT_ADMIN', 'SCHEDULING_PRICING_ADMIN', 'MOVIE_MANAGEMENT_ADMIN'] },

    //rap
    {
        path: '/admin/cinema-complex',
        component: PageAdmin.AdminCinemaComplex,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'CINEMA_MANAGEMENT_ADMIN'],
    },
    {
        path: '/admin/cinema',
        component: PageAdmin.AdminCinema,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'CINEMA_MANAGEMENT_ADMIN'],
    },
    {
        path: '/admin/cinema-type',
        component: PageAdmin.AdminCinemaType,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'CINEMA_MANAGEMENT_ADMIN'],
    },
    {
        path: '/admin/cinema-chains',
        component: PageAdmin.AdminCinemaChains,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'CINEMA_MANAGEMENT_ADMIN'],
    },

    //phim
    {
        path: '/admin/movie',
        component: PageAdmin.AdminMovie,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'MOVIE_MANAGEMENT_ADMIN'],
    },
    {
        path: '/admin/movie-studio',
        component: PageAdmin.AdminMovieStudio,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'MOVIE_MANAGEMENT_ADMIN'],
    },
    {
        path: '/admin/movie-producer',
        component: PageAdmin.AdminProducer,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'MOVIE_MANAGEMENT_ADMIN'],
    },
    {
        path: '/admin/price',
        component: PageAdmin.AdminPrice,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'MOVIE_MANAGEMENT_ADMIN'],
    },
    {
        path: '/admin/showtime',
        component: PageAdmin.AdminShowtime,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'MOVIE_MANAGEMENT_ADMIN'],
    },
    {
        path: '/admin/actor',
        component: PageAdmin.AdminActor,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'MOVIE_MANAGEMENT_ADMIN'],
    },
    {
        path: '/admin/director',
        component: PageAdmin.AdminDirector,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'MOVIE_MANAGEMENT_ADMIN'],
    },
    {
        path: '/admin/mpaaRating',
        component: PageAdmin.AdminMpaaRating,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'MOVIE_MANAGEMENT_ADMIN'],
    },
    {
        path: '/admin/format',
        component: PageAdmin.AdminFormat,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'MOVIE_MANAGEMENT_ADMIN'],
    },
    {
        path: '/admin/article',
        component: PageAdmin.AdminArticle,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'MOVIE_MANAGEMENT_ADMIN'],
    },

    //ghế
    {
        path: '/admin/seat',
        component: PageAdmin.AdminSeat,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'SCHEDULING_PRICING_ADMIN'],
    },
    {
        path: '/admin/seat-type',
        component: PageAdmin.AdminSeatType,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'SCHEDULING_PRICING_ADMIN'],
    },
    {
        path: '/admin/seat-chart',
        component: PageAdmin.AdminSeatChart,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'SCHEDULING_PRICING_ADMIN'],
    },

    //Dịch vụ Sự kiện
    {
        path: '/admin/combo',
        component: PageAdmin.AdminCombo,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'SERVICE_EVENT_MANAGEMENT_ADMIN'],
    },
    {
        path: '/admin/service',
        component: PageAdmin.AdminService,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'SERVICE_EVENT_MANAGEMENT_ADMIN'],
    },
    {
        path: '/admin/priceservice',
        component: PageAdmin.AdminPriceService,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'SERVICE_EVENT_MANAGEMENT_ADMIN'],
    },
    {
        path: '/admin/discount',
        component: PageAdmin.AdminDiscount,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'SERVICE_EVENT_MANAGEMENT_ADMIN'],
    },
    {
        path: '/admin/event',
        component: PageAdmin.AdminEvent,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'SERVICE_EVENT_MANAGEMENT_ADMIN'],
    },
    {
        path: '/admin/province',
        component: PageAdmin.AdminProvince,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'SERVICE_EVENT_MANAGEMENT_ADMIN'],
    },

    //quản lý tài khoản
    {
        path: '/admin/account',
        component: PageAdmin.AdminAccount,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'USER_MANAGEMENT_ADMIN'],
    },
    {
        path: '/admin/accountStaff',
        component: PageAdmin.AdminAccountStaff,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN', 'USER_MANAGEMENT_ADMIN'],
    },
    {
        path: '/admin/ticket-statistics',
        component: PageAdmin.AdminTicKetStatistics,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN'],
    },
    {
        path: '/admin/ticket-statistics-price',
        component: PageAdmin.AdminTicKetStatisticsPrice,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN'],
    },
    {
        path: '/admin/sendEmail',
        component: PageAdmin.AdminSendEmail,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN'],
    },

    {
        path: '/admin/comentModeration',
        component: PageAdmin.AdminComment,
        layout: AdminLayout,
        allowedRoles: ['SUPER_ADMIN'],
    },
    //webcam
    { path: '/admin/webcam', component: PageAdmin.AdminWebcam, layout: AdminLayout, allowedRoles: ['SUPER_ADMIN'] },

    { path: '/profile', component: PageUser.ProfilePage, layout: DefaultLayout, allowedRoles: ['SUPER_ADMIN', 'USER', 'CINEMA_MANAGEMENT_ADMIN', 'USER_MANAGEMENT_ADMIN', 'SERVICE_EVENT_MANAGEMENT_ADMIN', 'SCHEDULING_PRICING_ADMIN', 'MOVIE_MANAGEMENT_ADMIN'] },


];

export { publicRoutes, privateRoutes };
