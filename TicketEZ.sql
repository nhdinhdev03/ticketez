
USE [master]
GO

CREATE DATABASE TicketEZ 
GO
    -- DROP DATABASE TicketEZ 
    USE TicketEZ
GO
 
CREATE TABLE Roles (
	 id BIGINT IDENTITY(1,1) NOT NULL,
	 [name] NVARCHAR(255) NOT NULL,
	 [description] NVARCHAR(MAX)
)
GO
	
CREATE TABLE Accounts (
	id NVARCHAR(20) NOT NULL,
    phone NVARCHAR(15) ,
    fullname NVARCHAR(100),
	[image] NVARCHAR(MAX),
    email NVARCHAR(350) NOT NULL,
	[address] NVARCHAR(MAX),
    [password] NVARCHAR(255) NOT NULL,
    birthday DATE,
    gender BIT ,
    [status] INT ,
    verified BIT ,
	created_date DATETIME ,
    points INT  
)
GO
CREATE TABLE Account_Lock_History(
    id BIGINT IDENTITY(1,1) NOT NULL,
    event_type INT NOT NULL, -- unlock hoặc lock tài khoản, lock: true, unlock: false
    event_date DATETIME NOT NULL, 
    reason NVARCHAR(MAX) NOT NULL, -- lý do unlock hoặc lock 
	account_id NVARCHAR(20) NOT NULL,
)
GO

CREATE TABLE Accounts_Roles (
	account_id NVARCHAR(20) NOT NULL,
	role_id BIGINT NOT NULL,
)
GO

CREATE TABLE Activity_Logs (
    id BIGINT IDENTITY(1,1) NOT NULL,
    time_stamp DATETIME NOT NULL, -- Thời gian thực hiện
	[action] NVARCHAR(MAX) NOT NULL, -- Thêm, sửa, xóa, đăng nhập, đăng xuất
	[description] NVARCHAR(MAX) NOT NULL,
	ip_address NVARCHAR(MAX) NOT NULL,
	[user_agent] NVARCHAR(MAX) NOT NULL, -- Thông tin của trình duyệt: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36
	[result] NVARCHAR(50) NOT NULL, -- Thành công, thất bại
	account_id NVARCHAR(20) NOT NULL,
    old_data NVARCHAR(MAX), -- Lưu các thông tin trước khi "xóa", "cập nhật" (Không bắt buộc)
    new_data NVARCHAR(MAX) -- Lưu các thông tin sau khi "Thêm", "cập nhật" (Không bắt buộc)
)
GO
    CREATE TABLE Verification (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        account_id NVARCHAR(20) NULL,
        code NVARCHAR(6) NULL,
        created_at DATETIME NULL,
        expires_at DATETIME NULL,
        active BIT NULL
    )
GO
    CREATE TABLE Reviews (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        comment NVARCHAR(MAX),
        rating FLOAT NOT NULL,
        create_date DATETIME NOT NULL,
        edit_date DATETIME,
        account_id NVARCHAR(20) NOT NULL,
        movie_id BIGINT NOT NULL,
        [status] INT NOT NULL,  --0 là duyệt, 1 là chưa duyệt, 2 là ẩn, 
        [like_coment] INT NOT NULL -- like bình luận
    )
GO
    CREATE TABLE Genres (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        [name] NVARCHAR(255) NOT NULL,
        [description] NVARCHAR(MAX)
    )
GO
    CREATE TABLE Genres_Movies (
        genre_id BIGINT NOT NULL,
        movie_id BIGINT NOT NULL
    )
GO
    CREATE TABLE Studios (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        [name] NVARCHAR(250) NOT NULL,
		[image] NVARCHAR(MAX) NOT NULL,
        [founded_date] DATE NOT NULL,
        country NVARCHAR(150) NOT NULL,
        email NVARCHAR(350) NOT NULL,
        [address] NVARCHAR(MAX) NOT NULL,
        website NVARCHAR(MAX) NOT NULL,
        [description] NVARCHAR(MAX)
    )
GO
    CREATE TABLE Producers (
        id BIGINT IDENTITY(1, 1) NOT NULL,
		[name] NVARCHAR(250) NOT NULL,
		[image] NVARCHAR(MAX) NOT NULL,
		[birthday] DATE NOT NULL,
        nationality NVARCHAR(150) NOT NULL,
        email NVARCHAR(350) NOT NULL,
        [biography] NVARCHAR(MAX)
    )
GO

    CREATE TABLE Movies_Producers (
        movie_id BIGINT NOT NULL,
		producer_id BIGINT NOT NULL,
    )
GO
CREATE TABLE Movies_Studios (
        movie_id BIGINT NOT NULL,
		studio_id BIGINT NOT NULL,
    )
GO

    CREATE TABLE MPAA_Rating (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        [rating_code] NVARCHAR(10) NOT NULL,
        icon NVARCHAR(MAX) NOT NULL,
		[color_code] NVARCHAR(30) NOT NULL,
        [description] NVARCHAR(MAX)
    )
GO
    CREATE TABLE Movies (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        title NVARCHAR (500) NOT NULL,
        poster NVARCHAR(MAX) NOT NULL,
        banner NVARCHAR(MAX) NOT NULL,
        [description] NVARCHAR(MAX) NOT NULL,
        duration TIME(0) NOT NULL,
        release_date DATE NOT NULL,
        country NVARCHAR(150) NOT NULL,
        rating FLOAT NOT NULL,
        --movie_studio_id BIGINT NOT NULL,
		--movie_producer_id BIGINT NOT NULL,
        video_trailer NVARCHAR(MAX) NOT NULL,
        MPAA_rating_id BIGINT NOT NULL
    )
GO

-- Lưu các top phim như (Top 10 phim hành động, top 10 phim xem nhiều nhất)
CREATE TABLE Articles(
    id BIGINT IDENTITY(1, 1) NOT NULL,
    title NVARCHAR(255) NOT NULL,
	banner NVARCHAR(MAX) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
	status BIT NOT NULL,--0 là nháp , 1 là đăng
    create_date DATE NOT NULL,
)
GO

CREATE TABLE Articles_Movies(
    movie_id BIGINT NOT NULL,
    article_id BIGINT NOT NULL,
)
GO

    CREATE TABLE Formats (      
        id BIGINT IDENTITY(1, 1) NOT NULL,
        [name] NVARCHAR(20) NOT NULL,
        [description] NVARCHAR(MAX)
    )
GO
    CREATE TABLE Formats_Movies (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        movie_id BIGINT NOT NULL,
        format_id BIGINT NOT NULL
    )
GO
    CREATE TABLE Directors (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        fullname NVARCHAR(100) NOT NULL,
		gender BIT NOT NULL,
        birthday DATE NOT NULL,
        country NVARCHAR(150) NOT NULL,
        avatar NVARCHAR(255) NOT NULL,
		email NVARCHAR(255) NOT NULL,
		biography NVARCHAR(MAX) -- lưu tiểu sử
    )
GO
    CREATE TABLE Directors_Movies (
        director_id BIGINT NOT NULL,
        movie_id BIGINT NOT NULL
    )
GO
    CREATE TABLE Actors (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        fullname NVARCHAR(100) NOT NULL,
		gender BIT NOT NULL,
        birthday DATE NOT NULL,
        country NVARCHAR(150) NOT NULL,
        avatar NVARCHAR(255) NOT NULL,
		email NVARCHAR(255) NOT NULL,
		biography NVARCHAR(MAX) -- lưu tiểu sử
    )
GO
    CREATE TABLE Actors_Movies (
        actor_id BIGINT NOT NULL,
        movie_id BIGINT NOT NULL
    )
GO
    CREATE TABLE Provinces (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        [name] NVARCHAR(200) NOT NULL
    )
GO
CREATE TABLE Cinema_Chains (
	id BIGINT IDENTITY(1, 1) NOT NULL,
	[name] NVARCHAR(255) NOT NULL,
    [image] NVARCHAR(MAX) NOT NULL,
	[banner] NVARCHAR(MAX) NOT NULL,
	[description] NVARCHAR(MAX)
) 
GO
    CREATE TABLE Cinema_Complex (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        [name] NVARCHAR(200) NOT NULL,
        [address] NVARCHAR(MAX) NOT NULL,
        phone NVARCHAR(15) NOT NULL,
        opening_time TIME(0) NOT NULL,
        closing_time TIME(0) NOT NULL,
		[longitude]  FLOAT NOT NULL,
		[latitude]  FLOAT NOT NULL,
        cinema_chain_id BIGINT NOT NULL,
        province_id BIGINT NOT NULL
    )
GO

    CREATE TABLE Seat_Types (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        [name] NVARCHAR(200) NOT NULL,
		nick_name nvarChar(50) not null,
		color nvarchar(50) not null,
				[width] int not null,
        [image] NVARCHAR(MAX) NOT NULL,
        [description] NVARCHAR(MAX)
    )
GO
    CREATE TABLE Seats (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        [name] NVARCHAR(200) NOT NULL,
        [status] BIT NOT NULL,
        [description] NVARCHAR(MAX),
        seat_type_id BIGINT NOT NULL,
		seat_chart_id BIGINT NOT NULL
    )
GO

-- CREATE TABLE Child_Seat_Chart (
-- 	seat_chart_id BIGINT NOT NULL,
-- 	showtime_id  BIGINT NOT NULL
-- )
-- GO

    CREATE TABLE Seats_Booking (
		id BIGINT IDENTITY(1, 1) NOT NULL,
        [seat_id] BIGINT NOT NULL,
        [booking_id] NVARCHAR(10) NOT NULL,
		[price] FLOAT NOT NULL,
    )
	go 
	
    CREATE TABLE Seats_Choose (
		id BIGINT IDENTITY(1, 1) NOT NULL,
		last_selected_time DATETIME,
		[seat_id] BIGINT NOT NULL,
		showtime_id BIGINT NOT NULL,
		account_id NVARCHAR(20) NOT NULL
    )
GO
    CREATE TABLE Price (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        [start_date] DATETIME NOT NULL,
        end_date DATETIME NOT NULL,
        [status] BIT NOT NULL,
        format_movie_id BIGINT NOT NULL,
        cinema_complex_id BIGINT NOT NULL
    )

GO
  CREATE TABLE Price_Seat_Types (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        weekday_price FLOAT NOT NULL,
        weekend_price FLOAT NOT NULL,
        seat_type_id BIGINT NOT NULL,
		price_id BIGINT NOT NULL
    )


GO
    CREATE TABLE [Events] (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        [name] NVARCHAR(200) NOT NULL,
        [description] NVARCHAR(MAX),
        [start_date] DATETIME NOT NULL,
        end_date DATETIME NOT NULL,
        banner NVARCHAR(MAX) NOT NULL,
        [status] BIT NOT NULL,
        type_event INT NOT NULL,
		account_id NVARCHAR(20) NOT NULL,

    )
GO
    CREATE TABLE [Events_Discounts] (
        event_id BIGINT NOT NULL,
        discount_id BIGINT NOT NULL,
    )
GO
    CREATE TABLE [Services] (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        [name] NVARCHAR(200) NOT NULL,
        [description] NVARCHAR(MAX),
        [image] NVARCHAR(MAX) NOT NULL,
        quantity INT NOT NULL,
        cinema_complex_id BIGINT NOT NULL
    )
GO

    CREATE TABLE [Service_Choose] (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        account_id NVARCHAR(20) NOT NULL,
        service_id BIGINT NOT NULL,
        quantity INT NOT NULL,
        price FLOAT NOT NULL,
    )

    CREATE TABLE Price_Services (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        price FLOAT NOT NULL,
        [start_date] DATETIME NOT NULL,
        end_date DATETIME NOT NULL,
        service_id BIGINT NOT NULL
    )
GO
    CREATE TABLE Cinema_Types (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        type_name NVARCHAR(100) NOT NULL,
        [description] NVARCHAR(MAX)
    )
GO
    CREATE TABLE Cinemas (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        [name] NVARCHAR(255) NOT NULL,
        [status] BIT NOT NULL,
        cinema_type_id BIGINT NOT NULL,
        cinema_complex_id BIGINT NOT NULL
    )
GO
    CREATE TABLE Seat_Chart (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        [name] NVARCHAR(255) NOT NULL,
		[rows] int NOT NULL,
		[columns] int NOT NULL,
        [status] BIT NOT NULL,
		cinema_id BIGINT NOT NULL
    )
GO
    -- CHƯA HOÀN THIỆN - DISCOUNT
    CREATE TABLE Discounts (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        title NVARCHAR(500) NOT NULL,
        coupon_code VARCHAR(20) NOT NULL,
        amount FLOAT NOT NULL,
        [start_date] DATETIME NOT NULL,
        end_date DATETIME NOT NULL,
        [status] BIT NOT NULL,
        discount_type BIT NOT NULL,
        cinema_complex_id BIGINT NOT NULL
    )
GO
    CREATE TABLE Discounts_Booking (
        discount_id BIGINT NOT NULL,
        booking_id NVARCHAR(10)NOT NULL,
    )
GO
    CREATE TABLE Showtimes (
        id BIGINT IDENTITY(1, 1) NOT NULL,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        --[status] INT NOT NULL,
        cinema_id BIGINT NOT NULL,
        format_movie_id BIGINT NOT NULL,
        seat_chart_id BIGINT NOT NULL,
		price_id  BIGINT NOT NULL,
    )
GO
    CREATE TABLE Booking (
        id NVARCHAR(10) NOT NULL,
        account_id NVARCHAR(20) NOT NULL,
        create_date DATETIME NOT NULL,
        showtime_id BIGINT NOT NULL,
        [status] INT NOT NULL, -- 0: Thành công, 1: Thanh toán gặp lỗi,...
        [ticket_status] INT NOT NULL, -- 0: Chưa sử dụng, 1: đã sử dụng, 2: Hết hạn
    )
GO
    CREATE TABLE Payment_Info (
        transaction_id NVARCHAR(20) NOT NULL,
        tmn_code NVARCHAR (10) NOT NULL,
        booking_id NVARCHAR(10)NOT NULL,
        amount FLOAT NOT NULL,
        pay_date DATETIME NOT NULL,
        order_info NVARCHAR(100) NOT NULL,
        bank_code NVARCHAR(25),
        transaction_status NVARCHAR(3) NOT NULL,
    )
GO
    CREATE TABLE Services_Booking (
        booking_id NVARCHAR(10)NOT NULL,
        service_id BIGINT NOT NULL,
		quantity INT NOT NULL,
		price FLOAT NOT NULL
    )
GO

ALTER TABLE Roles
ADD CONSTRAINT PK_Roles PRIMARY KEY(id)
GO

ALTER TABLE Accounts_Roles
ADD CONSTRAINT PK_Accounts_Roles PRIMARY KEY(account_id, role_id)
GO

ALTER TABLE Account_Lock_History
ADD CONSTRAINT PK_Account_Lock_History PRIMARY KEY(id)
GO

ALTER TABLE Activity_Logs
ADD CONSTRAINT PK_Activity_Logs PRIMARY KEY(id)
GO

-- ALTER TABLE Child_Seat_Chart
-- ADD CONSTRAINT PK_Child_Seat_Chart PRIMARY KEY(seat_chart_id,showtime_id)
-- GO

ALTER TABLE
    Accounts
ADD
    CONSTRAINT PK_Accounts PRIMARY KEY (id);

GO

ALTER TABLE
    Producers
ADD
    CONSTRAINT PK_Producers PRIMARY KEY (id);
GO
ALTER TABLE
    Movies_Producers
ADD
    CONSTRAINT PK_Movies_Producers PRIMARY KEY (movie_id, producer_id);
GO


ALTER TABLE
    Service_Choose
ADD
    CONSTRAINT PK_Service_Choose PRIMARY KEY (id);
GO

ALTER TABLE
    Studios
ADD
    CONSTRAINT PK_Studios PRIMARY KEY (id);
GO
ALTER TABLE
    Movies_Studios
ADD
    CONSTRAINT PK_Movies_Studios PRIMARY KEY (movie_id, studio_id);
GO
ALTER TABLE
    Actors
ADD
    CONSTRAINT PK_Actors PRIMARY KEY (id);

GO
ALTER TABLE
    Actors_Movies
ADD
    CONSTRAINT PK_Actors_Movies PRIMARY KEY (actor_id, movie_id);

GO
ALTER TABLE
    Cinemas
ADD
    CONSTRAINT PK_Cinemas PRIMARY KEY (id);

GO

ALTER TABLE
    Cinema_Chains
ADD
    CONSTRAINT PK_Cinema_Chains PRIMARY KEY (id);
GO
ALTER TABLE
    Articles
ADD
    CONSTRAINT PK_Articles PRIMARY KEY (id);
GO
ALTER TABLE
    Articles_Movies
ADD
    CONSTRAINT PK_Article_Movies PRIMARY KEY (movie_id, article_id);
GO
ALTER TABLE
    Seat_Chart
ADD
    CONSTRAINT PK_SeatChart PRIMARY KEY (id);

GO
ALTER TABLE
    Cinema_Complex
ADD
    CONSTRAINT PK_Cinema_Complex PRIMARY KEY (id);

GO
ALTER TABLE
    Cinema_Types
ADD
    CONSTRAINT PK_Cinema_Types PRIMARY KEY (id);

GO
ALTER TABLE
    Directors
ADD
    CONSTRAINT PK_Directors PRIMARY KEY (id);

GO
ALTER TABLE
    Directors_Movies
ADD
    CONSTRAINT PK_Directors_Movies PRIMARY KEY (director_id, movie_id);

GO
ALTER TABLE
    [Events]
ADD
    CONSTRAINT PK_Events PRIMARY KEY (id);

GO
ALTER TABLE
    Formats
ADD
    CONSTRAINT PK_Formats PRIMARY KEY (id);

GO
ALTER TABLE
    Formats_Movies
ADD
    CONSTRAINT PK_Formats_Movies PRIMARY KEY (id);

GO
ALTER TABLE
    Genres
ADD
    CONSTRAINT PK_Genres PRIMARY KEY (id);

GO
ALTER TABLE
    Genres_Movies
ADD
    CONSTRAINT PK_Genres_Movies PRIMARY KEY (genre_id, movie_id);

GO
ALTER TABLE
    Movies
ADD
    CONSTRAINT PK_Movies PRIMARY KEY (id);

GO
-- ALTER TABLE
--     Studio
-- ADD
--     CONSTRAINT PK_Movie_Studio PRIMARY KEY (id);

GO
ALTER TABLE
    Payment_Info
ADD
    CONSTRAINT PK_Payment_Info PRIMARY KEY (transaction_id);

GO
ALTER TABLE
    Price
ADD
    CONSTRAINT PK_Price PRIMARY KEY (id);

GO
ALTER TABLE
    Price_Services
ADD
    CONSTRAINT PK_Price_Services PRIMARY KEY (id);

GO
ALTER TABLE
    Provinces
ADD
    CONSTRAINT PK_Provinces PRIMARY KEY (id);

GO
ALTER TABLE
    Reviews
ADD
    CONSTRAINT PK_Reviews PRIMARY KEY (id);

GO
ALTER TABLE
    Seat_Types
ADD
    CONSTRAINT PK_Seat_Types PRIMARY KEY (id);

GO
ALTER TABLE
    Seats
ADD
    CONSTRAINT PK_Seats PRIMARY KEY (id);

GO

ALTER TABLE
    Seats_Booking
ADD
    CONSTRAINT PK_Seats_Booking PRIMARY KEY (id);

GO
ALTER TABLE
    [Services]
ADD
    CONSTRAINT PK_Services PRIMARY KEY (id);

GO
ALTER TABLE
    Showtimes
ADD
    CONSTRAINT PK_Showtimes PRIMARY KEY (id);

GO
ALTER TABLE
    Booking
ADD
    CONSTRAINT PK_Booking PRIMARY KEY (id);

GO
ALTER TABLE
    Discounts
ADD
    CONSTRAINT PK_Discounts PRIMARY KEY (id);

GO
ALTER TABLE
    Verification
ADD
    CONSTRAINT PK_Verification PRIMARY KEY (id);

GO
ALTER TABLE
    Services_Booking
ADD
    CONSTRAINT PK_Services_Booking PRIMARY KEY (booking_id, service_id);

GO
ALTER TABLE
    Discounts_Booking
ADD
    CONSTRAINT PK_Discounts_Booking PRIMARY KEY (booking_id, discount_id);

GO
ALTER TABLE
    MPAA_Rating
ADD
    CONSTRAINT PK_MPAA_Rating PRIMARY KEY (id);

GO
ALTER TABLE
    Seats_Choose
ADD
    CONSTRAINT PK_Seats_Choose PRIMARY KEY (id);
GO
ALTER TABLE
     Price_Seat_Types
ADD
    CONSTRAINT PK_Price_Seat_Types PRIMARY KEY (id);

    -- TẠO KHOÁ NGOẠI
ALTER TABLE
    Verification
ADD
    CONSTRAINT FK_Verification_Accounts FOREIGN KEY (account_id) REFERENCES Accounts(id)
GO

ALTER TABLE
    Accounts_Roles
ADD
    CONSTRAINT FK_Accounts_Roles_Accounts FOREIGN KEY (account_id) REFERENCES Accounts(id)
GO
ALTER TABLE
    Activity_Logs
ADD
    CONSTRAINT FK_Activity_Logs_Accounts FOREIGN KEY (account_id) REFERENCES Accounts(id)
GO

-- ALTER TABLE
--     Child_Seat_Chart
-- ADD
--     CONSTRAINT FK_Child_Seat_Chart_Seat_Chart FOREIGN KEY (seat_chart_id) REFERENCES Seat_Chart(id)
-- GO


-- ALTER TABLE
--     Child_Seat_Chart
-- ADD
--     CONSTRAINT FK_Child_Seat_Chart_Showtimes FOREIGN KEY (seat_chart_id) REFERENCES Showtimes(id)
-- GO
-- ALTER TABLE
--     Formats_Movies
-- ADD
--     CONSTRAINT FK_FormatsMovies_Movies FOREIGN KEY (movie_id) REFERENCES Movies(id)
-- GO  
ALTER TABLE
    Account_Lock_History
ADD
    CONSTRAINT FK_Account_Lock_History_Accounts FOREIGN KEY (account_id) REFERENCES Accounts(id)
GO 
ALTER TABLE
    Formats_Movies
ADD
    CONSTRAINT FK_FormatsMovies_Formats FOREIGN KEY (format_id) REFERENCES Formats(id)
GO
ALTER TABLE
    Accounts_Roles
ADD
    CONSTRAINT FK_Accounts_Roles_Roles FOREIGN KEY (role_id) REFERENCES Roles(id)
GO
    -- Reviews
ALTER TABLE
    Reviews
ADD
    CONSTRAINT FK_Reviews_Accounts FOREIGN KEY (account_id) REFERENCES Accounts(id)
GO
ALTER TABLE
    Reviews
ADD
    CONSTRAINT FK_Reviews_Movies FOREIGN KEY (movie_id) REFERENCES Movies(id)
GO
    -- /Reviews
    -- Showtimes
ALTER TABLE
    Showtimes
ADD
    CONSTRAINT FK_Showtimes_Cinema FOREIGN KEY (cinema_id) REFERENCES Cinemas(id)
GO
ALTER TABLE
    Showtimes
ADD
    CONSTRAINT FK_Showtimes_FormatMovies FOREIGN KEY (format_movie_id) REFERENCES Formats_Movies(id)
GO
ALTER TABLE
    Showtimes
ADD
    CONSTRAINT FK_Showtimes_Price FOREIGN KEY (price_id) REFERENCES price(id)
GO
    -- /Showtimes
    -- Price
ALTER TABLE
    Price
ADD
    CONSTRAINT FK_Price_FormatMovies FOREIGN KEY (format_movie_id) REFERENCES Formats_Movies(id)
GO
/*ALTER TABLE
    Price
ADD
    CONSTRAINT FK_Price_SeatTypes FOREIGN KEY (seat_type_id) REFERENCES Seat_Types(id)
GO
*/
ALTER TABLE
    Price
ADD
    CONSTRAINT FK_Price_CinemaComplex FOREIGN KEY (cinema_complex_id) REFERENCES Cinema_Complex(id)
GO
    -- /Price
    -- Directors_Movies
ALTER TABLE
    Directors_Movies
ADD
    CONSTRAINT FK_DirectorMovies_Movies FOREIGN KEY (movie_id) REFERENCES Movies(id)
GO
ALTER TABLE
    Directors_Movies
ADD
    CONSTRAINT FK_DirectorMovies_Directors FOREIGN KEY (director_id) REFERENCES Directors(id)
GO
    -- /Directors_Movies
    -- Formats_Movies



    -- /Formats_Movies
    -- Genres_Movies
ALTER TABLE
    Genres_Movies
ADD
    CONSTRAINT FK_GenresMovies_Movies FOREIGN KEY (movie_id) REFERENCES Movies(id)
GO
ALTER TABLE
    Genres_Movies
ADD
    CONSTRAINT FK_Genres_Movies FOREIGN KEY (genre_id) REFERENCES Genres(id)
GO
    -- /Genres_Movies
    -- Actors_Movies
ALTER TABLE
    Actors_Movies
ADD
    CONSTRAINT FK_ActorsMovies_Movies FOREIGN KEY (movie_id) REFERENCES Movies(id)
GO
ALTER TABLE
    Actors_Movies
ADD
    CONSTRAINT FK_ActorsMovies_Actors FOREIGN KEY (actor_id) REFERENCES Actors(id)
GO
    -- /Actors_Movies
    -- Movies
ALTER TABLE
    Movies
ADD
    CONSTRAINT FK_Movies_MPAArating FOREIGN KEY (MPAA_rating_id) REFERENCES MPAA_Rating(id)
GO


ALTER TABLE
    Movies_Studios
ADD
    CONSTRAINT FK_MovieStudio_Movie FOREIGN KEY (movie_id) REFERENCES Movies(id)
GO

ALTER TABLE
    Movies_Studios
ADD
    CONSTRAINT FK_MovieStudios_Studio FOREIGN KEY (studio_id) REFERENCES Studios(id)
GO

ALTER TABLE
    Movies_Producers
ADD
    CONSTRAINT FK_Movies_Producers_Movie FOREIGN KEY (movie_id) REFERENCES Movies(id)
GO
ALTER TABLE
    Movies_Producers
ADD
    CONSTRAINT FK_MovieProducer_Producer FOREIGN KEY (producer_id) REFERENCES Producers(id)
GO
    -- /Movies
    -- Seat 
ALTER TABLE
    [Seats]
ADD
    CONSTRAINT FK_Seats_SeatTypes FOREIGN KEY (seat_type_id) REFERENCES Seat_Types(id)
GO
ALTER TABLE
    [Seats]
ADD
    CONSTRAINT FK_Seats_SeatChart FOREIGN KEY (seat_chart_id) REFERENCES Seat_Chart(id)
GO
ALTER TABLE
    Seat_Chart
ADD
    CONSTRAINT FK_SeatChart_Cinemas FOREIGN KEY (cinema_id) REFERENCES Cinemas(id)
GO
    -- /Seats
    -------------- Cinema_Complex
ALTER TABLE
    [Services]
ADD
    CONSTRAINT FK_Service_Cinema_Complex FOREIGN KEY (cinema_complex_id) REFERENCES Cinema_Complex(id)
GO
ALTER TABLE
    Price_Services
ADD
    CONSTRAINT FK_PriceService_Service FOREIGN KEY (service_id) REFERENCES [Services](id)
GO
ALTER TABLE
    Events_Discounts
ADD
    CONSTRAINT FK_Events_Discounts_Events FOREIGN KEY (event_id) REFERENCES [Events](id)
GO
ALTER TABLE
    Events_Discounts
ADD
    CONSTRAINT FK_Events_Discounts_Discount FOREIGN KEY (discount_id) REFERENCES [Discounts](id)
GO
ALTER TABLE
    Cinema_Complex
ADD
    CONSTRAINT FK_CinemaComplex_Cinema_Chains FOREIGN KEY (cinema_chain_id) REFERENCES Cinema_Chains(id)
GO
ALTER TABLE
    Cinema_Complex
ADD
    CONSTRAINT FK_CinemaComplex_Provinces FOREIGN KEY (province_id) REFERENCES Provinces(id)
GO
ALTER TABLE
    Discounts
ADD
    CONSTRAINT FK_Discount_Cinema_Complex FOREIGN KEY (cinema_complex_id) REFERENCES Cinema_Complex(id)
GO
    -- Discount_Booking
ALTER TABLE
    Discounts_Booking
ADD
    CONSTRAINT FK_DiscountsBooking_Discounts FOREIGN KEY (discount_id) REFERENCES Discounts(id)
GO
ALTER TABLE
    Discounts_Booking
ADD
    CONSTRAINT FK_DiscountsBooking_Booking FOREIGN KEY (booking_id) REFERENCES Booking(id)
GO
    -- /Discount_Booking
    -- Cinema
ALTER TABLE
    Cinemas
ADD
    CONSTRAINT FK_Cinemas_CinemaComplex FOREIGN KEY (cinema_complex_id) REFERENCES Cinema_Complex(id)
GO
ALTER TABLE
    Cinemas
ADD
    CONSTRAINT FK_Cinemas_Cinema_Types FOREIGN KEY (cinema_type_id) REFERENCES Cinema_Types(id)
GO
    -- /Cinema
    -- -- Seats_Booking
ALTER TABLE
    [Seats_Booking]
ADD
    CONSTRAINT FK_SeatsBooking_Seats FOREIGN KEY (seat_id) REFERENCES Seats(id)
GO
ALTER TABLE
    [Seats_Booking]
ADD
    CONSTRAINT FK_SeatsBooking_Booking FOREIGN KEY (booking_id) REFERENCES Booking(id)
GO
    -- /Seats_Booking
    -- Booking
ALTER TABLE
    [Booking]
ADD
    CONSTRAINT FK_Booking_Showtimes FOREIGN KEY (showtime_id) REFERENCES Showtimes(id)
GO
ALTER TABLE
    [Booking]
ADD
    CONSTRAINT FK_Booking_Accounts FOREIGN KEY (account_id) REFERENCES Accounts(id)
GO
    -- /Booking
    -- Services_Booking
ALTER TABLE
    [Services_Booking]
ADD
    CONSTRAINT FK_ServicesBooking_Booking FOREIGN KEY (booking_id) REFERENCES Booking(id)
GO
ALTER TABLE
    [Services_Booking]
ADD
    CONSTRAINT FK_ServicesBooking_Services FOREIGN KEY (service_id) REFERENCES Services(id)
GO
ALTER TABLE
    [Articles_Movies]
ADD
    CONSTRAINT FK_Articles_Movies_Movie FOREIGN KEY (movie_id) REFERENCES Movies(id)
GO
ALTER TABLE
    [Articles_Movies]
ADD
    CONSTRAINT FK_Articles_Movies_Articles FOREIGN KEY (article_id) REFERENCES Articles(id)
GO
ALTER TABLE
    [Service_Choose]
ADD
    CONSTRAINT FK_Service_Choose_Service FOREIGN KEY (service_id) REFERENCES Services(id)
GO
ALTER TABLE
    [Service_Choose]
ADD
    CONSTRAINT FK_Service_Choose_Account FOREIGN KEY (account_id) REFERENCES Accounts(id)
GO
    -- /Services_Booking
    -- Payment_Info
ALTER TABLE
    [Payment_Info]
ADD
    CONSTRAINT FK_PaymentInfo_Booking FOREIGN KEY (booking_id) REFERENCES Booking(id)
GO
ALTER TABLE
    [Seats_Choose]
ADD
    CONSTRAINT FK_Seats_Choose_Seat FOREIGN KEY (seat_id) REFERENCES Seats(id)
GO
	ALTER TABLE
    [Seats_Choose]
ADD
    CONSTRAINT FK_Choose_Seat_showtime FOREIGN KEY (showtime_id) REFERENCES Showtimes(id)
	GO
    -- /seatChoose
		ALTER TABLE
    [Seats_Choose]
ADD
    CONSTRAINT FK_Choose_Seat_Account FOREIGN KEY (account_id) REFERENCES Accounts(id)
	GO
		ALTER TABLE
    [Price_Seat_Types]
ADD
    CONSTRAINT FK_Price_Seat_Types_price FOREIGN KEY (price_id) REFERENCES Price(id)
GO

		ALTER TABLE
    [Price_Seat_Types]
ADD
    CONSTRAINT FK_Price_Seat_Types_Seat_Type FOREIGN KEY (seat_type_id) REFERENCES Seat_Types(id)
GO


SELECT * FROM Accounts
SELECT * FROM Verification
SELECT * FROM Reviews
SELECT * FROM Genres
SELECT * FROM Genres_Movies

SELECT * FROM Movies_Studios
SELECT * FROM MPAA_Rating
SELECT * FROM Movies
SELECT * FROM Formats
SELECT * FROM Formats_Movies
SELECT * FROM Directors
SELECT * FROM Directors_Movies

SELECT * FROM Actors
SELECT * FROM Actors_Movies
SELECT * FROM Provinces
SELECT * FROM Cinema_Complex
SELECT * FROM Seat_Types
SELECT * FROM Seats
SELECT * FROM Seats_Booking
SELECT * FROM Price


SELECT * FROM [Events]
SELECT * FROM [Services]
SELECT * FROM Price_Services
SELECT * FROM Cinema_Types
SELECT * FROM Cinemas
SELECT * FROM Discounts
SELECT * FROM Discounts_Booking
SELECT * FROM Showtimes
SELECT * FROM Booking
SELECT * FROM Payment_Info
SELECT * FROM Services_Booking



-- insert into


-- DELETE Accounts
-- DBCC CHECKIDENT ('Accounts', RESEED, 0);

-- DELETE Verification
-- DBCC CHECKIDENT ('Verification', RESEED, 0);

-- DELETE Reviews
-- DBCC CHECKIDENT ('Reviews', RESEED, 0);

-- DELETE Genres
-- DBCC CHECKIDENT ('Genres', RESEED, 0);

-- DELETE Genres_Movies
-- DBCC CHECKIDENT ('Genres_Movies', RESEED, 0);

-- DELETE Movie_Studio
-- DBCC CHECKIDENT ('Movie_Studio', RESEED, 0);

-- DELETE MPAA_Rating
-- DBCC CHECKIDENT ('MPAA_Rating', RESEED, 0);

-- DELETE Movies
-- DBCC CHECKIDENT ('Movies', RESEED, 0);

-- DELETE Formats
-- DBCC CHECKIDENT ('Formats', RESEED, 0);

-- DELETE Formats_Movies
-- DBCC CHECKIDENT ('Formats_Movies', RESEED, 0);

-- DELETE Directors
-- DBCC CHECKIDENT ('Directors', RESEED, 0);

-- DELETE Directors_Movies
-- DBCC CHECKIDENT ('Directors_Movies', RESEED, 0);

-- DELETE Actors
-- DBCC CHECKIDENT ('Actors', RESEED, 0);

-- DELETE Actors_Movies
-- DBCC CHECKIDENT ('Actors_Movies', RESEED, 0);

-- DELETE Provinces
-- DBCC CHECKIDENT ('Provinces', RESEED, 0);

-- DELETE Cinema_Complex
-- DBCC CHECKIDENT ('Cinema_Complex', RESEED, 0);

-- DELETE Seat_Types
-- DBCC CHECKIDENT ('Seat_Types', RESEED, 0);

-- DELETESeats
-- DBCC CHECKIDENT ('Seats', RESEED, 0);

-- DELETE Seats_Booking
-- DBCC CHECKIDENT ('Seats_Booking', RESEED, 0);

-- DELETE Price
-- DBCC CHECKIDENT ('Price', RESEED, 0);

-- DELETE Events
-- DBCC CHECKIDENT ('Events', RESEED, 0);

-- DELETE Services
-- DBCC CHECKIDENT ('Services', RESEED, 0);

-- DELETE Price_Services
-- DBCC CHECKIDENT ('Price_Services', RESEED, 0);

-- DELETE Cinema_Types
-- DBCC CHECKIDENT ('Cinema_Types', RESEED, 0);

-- DELETE Cinemas
-- DBCC CHECKIDENT ('Cinemas', RESEED, 0);

-- DELETE Discounts
-- DBCC CHECKIDENT ('Discounts', RESEED, 0);

-- DELETE Discounts_Booking
-- DBCC CHECKIDENT ('Discounts_Booking', RESEED, 0);

-- DELETE Showtimes
-- DBCC CHECKIDENT ('Showtimes', RESEED, 0);

-- DELETE Booking
-- DBCC CHECKIDENT ('Booking', RESEED, 0);

-- DELETE Payment_Info
-- DBCC CHECKIDENT ('Payment_Info', RESEED, 0);

-- DELETE Services_Booking
-- DBCC CHECKIDENT ('Services_Booking', RESEED, 0);



SELECT * FROM Accounts
SELECT * FROM Verification
SELECT * FROM Reviews
SELECT * FROM Genres
SELECT * FROM Genres_Movies
SELECT * FROM Studios
SELECT * FROM Movies_Producers
SELECT * FROM Movies_Studios
SELECT * FROM MPAA_Rating
SELECT * FROM Movies
SELECT * FROM Formats
SELECT * FROM Formats_Movies
SELECT * FROM Directors
SELECT * FROM Directors_Movies
SELECT * FROM Actors
SELECT * FROM Actors_Movies
SELECT * FROM Provinces

SELECT * FROM Seat_Types
SELECT * FROM Seats
SELECT * FROM Seats_Choose

SELECT * FROM Seat_Chart
SELECT * FROM Seats_Booking
SELECT * FROM Price
SELECT * FROM Price_Seat_Types
SELECT * FROM [Events]
SELECT * FROM [Services]
SELECT * FROM Price_Services
SELECT * FROM Cinema_Types
SELECT * FROM Cinemas
SELECT * FROM Cinema_Complex
SELECT * FROM Discounts
SELECT * FROM Discounts_Booking
SELECT * FROM Showtimes
SELECT * FROM Booking
SELECT * FROM Payment_Info
SELECT * FROM Services_Booking