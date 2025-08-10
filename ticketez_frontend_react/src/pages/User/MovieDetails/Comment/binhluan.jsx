import React, { useEffect, useState } from 'react';
import { Avatar, Button, List, Row, Col, Rate, Space, Input, Typography, Dropdown, Menu, Modal } from 'antd';
import { StarFilled, CommentOutlined, LikeOutlined, DashOutlined } from '@ant-design/icons'
import classNames from 'classnames/bind';
import style from './binhluan.module.scss';
import reviewApi from '~/api/user/review/reviewApi';
import funcUtils from './../../../../utils/funcUtils';
import { movieApi } from '~/api/admin';
import { useParams } from 'react-router-dom';
import uploadApi from '~/api/service/uploadApi';
import PaginationCustom from '~/components/Admin/PaginationCustom';

import moment from 'moment-timezone';

import authApi from './../../../../api/user/Security/authApi';
import reviewStatus from '~/pages/Admin/CommentModeration/ModalReview/statusReview';
import axios from 'axios';

const cx = classNames.bind(style);
const Binhluan = () => {
    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);

    const [review, setReview] = useState([]);

    const [workSomeThing, setWorkSomeThing] = useState();
    const [isCommentVisible, setCommentVisible] = useState(false); // xử lý mở comment
    const [isClicked, setIsClicked] = useState(false);
    const { movieId, reviewId } = useParams();
    const [comment, setComment] = useState('');
    const [moviedata, setMoviedata] = useState();
    const [rating, setRating] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState('');
    const [indexId, setIndexId] = useState();
    const [editData, setEditData] = useState();
    const [deleteItem, setDeleteItem] = useState(null);
    const [commentError, setCommentError] = useState(false);
    const [ratingError, setRatingError] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [totalItems, setTotalItems] = useState(0); // Tổng số mục
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(7);
    const [showCommentInput, setShowCommentInput] = useState(false);

    const { Paragraph } = Typography;
    // Xử lý sự kiện thay đổi trang
    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };
    const user = !!authApi.getUser();

    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            try {
                const res = await reviewApi.getMovieAndReviewId(movieId, currentPage, pageSize, reviewStatus.APPROVED);
                console.log('tsst', res);
                setReview(res.data.data);
                setInitLoading(false);
                setTotalItems(res.data.totalItems);

                // setData(res.data);
                // setList(res.data);
                setLoading(false);
                // console.log(res.data);
            } catch (error) {
                if (error.hasOwnProperty('response')) {
                    funcUtils.notify(error.response.data, 'error');
                } else {
                    console.log(error);
                }
            }
        };
        getList();
    }, [workSomeThing, movieId, currentPage, pageSize,]);

    useEffect(() => {
        const getMovie = async () => {
            const movie = await movieApi.getById(movieId);
            setMoviedata(movie.data.movie);
            console.log(movie.data.movie);
        }
        getMovie();
    }, [movieId])

    useEffect(() => {
        const checkPaymentStatus = async () => {
            try {
                const user = authApi.getUser();
                const isPaid = await reviewApi.getcheckAccountBooking(user.id, movieId);

                setIsPaid(isPaid);

                // Thực hiện các hành động tương ứng khi trạng thái thanh toán thay đổi
                if (isPaid) {
                    setCommentVisible(true);
                    // Có thể thêm các tương tác hoặc thông báo khi tài khoản đã thanh toán
                } else {
                    setCommentVisible(false);
                    // Có thể thêm các tương tác hoặc thông báo khi tài khoản chưa thanh toán
                }
            } catch (error) {
                console.error('Lỗi khi kiểm tra thanh toán:', error);
                // Xử lý lỗi theo ý của bạn
            }
        };

        checkPaymentStatus();
    }, [user.id, movieId, setIsPaid, setCommentVisible]);
    const isUserComment = (comment) => {
        const user = authApi.getUser();
        return user && comment.account.id === user.id;
    };

    const filterProfanity = (text) => {
        const profanityList = ['đụ má', 'con mẹ mày', 'vcl', 'vãi',
            'fuck', 'cmm', 'như cc', 'nứng cặc',
            'cdm', 'duma', 'dcm', 'nứng vl', 'chó đẻ',
            'vãi cứt', 'xàm lồn', 'như lồn', 'cái lồn', 'như l', 'đỉ mẹ', 'loz', 'lol', 'nhu cac', 'đụ', 'vc', 'nhu con cac',
            'khùng', 'ngu vl', 'vcllll', 'địt mẹ', 'cức', 'đỉ mẹ', 'dâm dục', 'sex', 'phim sẽ', 'dụ đỉ mẹ mày', 'mày', 'tao',
            
        ]; // Thêm các từ thô tục vào danh sách
        let filteredText = text;

        profanityList.forEach((profanity) => {
            const regex = new RegExp(profanity, 'gi');
            filteredText = filteredText.replace(regex, '*'.repeat(profanity.length));
        });

        return filteredText;
    };
    const handleAdd = async () => {

        if (rating === 0) {
            setRatingError(true);
        } else {
            setRatingError(false);
        }

        if (comment.trim() === '') {
            setCommentError(true);
        } else {
            setCommentError(false);
            // Handle comment submission logic here
        }
        setLoading(true);
        try {
            const user = authApi.getUser();
            const isPaid = await reviewApi.getcheckAccountBooking(user.id, movieId);
            setIsPaid(isPaid);
            const censoredComment = filterProfanity(comment);
            const datareview = {
                comment: censoredComment,
                rating,
                createDate: new Date(),
                editData: null,
                status: 1,
                likeComent: 0,

            }
            funcUtils.notify('Bình luận của bạn đang chờ kiểm duyệt. Cảm ơn!', 'info');
            reviewApi.post(datareview, user.id, movieId);
            setComment("");
            console.log(datareview);
            // funcUtils.notify('Bình luận thành công.', 'success');
            setWorkSomeThing(!workSomeThing);
        } catch (error) {
            console.error('Failed:', error);
            if (error.response && error.response.data) {
                funcUtils.notify(error.response.data.message, 'error');
            } else {
                funcUtils.notify('Đã xảy ra lỗi', 'error');
            }

            setLoading(false);
        }
    };
    useEffect(() => {
        setRating(rating);
    }, [rating])

    // // Hàm xử lý sự kiện khi bấm vào biểu tượng bình luận
    // const handleCommentClick = () => {
    //     setCommentVisible(!isCommentVisible);
    // };
    const handleEdit = (item, index) => {
        setIsEditing(true);
        setEditedComment(item.comment);
        setIndexId(index);
        setEditData(item);

    };
    useEffect(() => {
        console.log({ ...editData, comment: editedComment, editDate: new Date() });

    }, [editedComment])

    // const handleSaveEdit = async (item) => {
    //     try {

    //         const dulieu = { ...editData, comment: editedComment, rating: rating, editDate: new Date() }
    //         await reviewApi.put(dulieu);
    //         funcUtils.notify('Chỉnh sửa bình luận thành công', 'success');
    //         setWorkSomeThing(!workSomeThing);
    //         setIsEditing(false);
    //     } catch (error) {
    //         console.error('Failed:', error);
    //         funcUtils.notify('Đã xảy ra lỗi khi lưu chỉnh sửa bình luận', 'error');
    //     }
    // };
    const [isPendingApproval, setIsPendingApproval] = useState(false);

    const handleSaveEdit = async (item) => {
        try {
            const updatedData = { ...editData, comment: editedComment, rating, editDate: new Date(), status: 1};
            // if (isPendingApproval) {
            //     updatedData.status = reviewStatus.APPROVED;
            // }
            await reviewApi.put(updatedData);
            funcUtils.notify('Chỉnh sửa bình luận thành công chờ kiểm duyệt', 'success');
            setWorkSomeThing(!workSomeThing);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed:', error);
            funcUtils.notify('Đã xảy ra lỗi khi lưu chỉnh sửa bình luận', 'error');
        }
    };

    const handleDelete = (item) => {
        setDeleteItem(item);
        // Hiển thị modal xác nhận xóa
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa bình luận của ${item.account.fullname}?`,
            onOk: () => confirmDelete(item),
            onCancel: () => setDeleteItem(null),
            okButtonProps: { style: { background: '#053b50', color: 'white' } },
        });
    };

    const confirmDelete = async (item) => {
        try {
            const res = await reviewApi.delete(item.id);
            console.log(res);
            if (res.status === 200) {
                funcUtils.notify(res.data, 'success');
            }
        } catch (error) {
            console.log(error);
            if (error.res.status === 409) {
                funcUtils.notify('đã xóa', 'error');
            }
        }
        setDeleteItem(null);
        setWorkSomeThing(!workSomeThing);
    };


    const handleRatingChange = (value) => {
        const roundedValue = (value * 2);
        setRating(roundedValue);
        setCommentError(false);
        setShowCommentInput(true);

    };
    console.log(rating);

    const handleCancel = () => {
        setIsEditing(false);
        setEditedComment('');
    };
    const convertRatingToStatus = (rating) => {
        if (rating >= 1 && rating <= 2) {
            return "Rất kém";
        } else if (rating >= 3 && rating <= 4) {
            return "Không có hay";
        } else if (rating >= 5 && rating <= 6) {
            return "Ở mức trung bình";
        } else if (rating >= 7 && rating <= 8) {
            return "Tuyệt vời";
        } else if (rating >= 9 && rating <= 10) {
            return "Siêu phẩm";
        } else {
            return "Không xác định";
        }
    };
    const reorderComments = (comments, userId) => {
        const userCommentIndex = comments.findIndex(comment => comment.account.id === userId);

        if (userCommentIndex !== -1) {
            const userComment = comments.splice(userCommentIndex, 1)[0];
            comments.unshift(userComment);
        }

        return comments;
    };

    const [expanded, setExpanded] = useState(false);

    const handleToggle = () => {
        setExpanded(!expanded);
    };

    const [likeStatus, setLikeStatus] = useState({});
    const likeReview = async (reviewId) => {
        try {
            // Gọi API để thực hiện "like" bình luận
            await reviewApi.likeReview(reviewId);

            // Cập nhật state để đánh dấu là đã "like"
            setLikeStatus((prevStatus) => ({
                ...prevStatus,
                [reviewId]: 'liked',
            }));

            setWorkSomeThing(!workSomeThing);
        } catch (error) {
            console.error('Failed to like review:', error);

        }
    };


    const dislikeReview = async (reviewId) => {
        try {

            await reviewApi.dislikeReview(reviewId);

            setLikeStatus((prevStatus) => ({
                ...prevStatus,
                [reviewId]: 'disliked',
            }));

            // Tải lại danh sách bình luận sau khi thực hiện "dislike"
            setWorkSomeThing(!workSomeThing);
        } catch (error) {
            console.error('Failed to dislike review:', error);
            // Xử lý lỗi theo ý của bạn
        }
    };
    const getLikeButtonStatus = (reviewId) => likeStatus[reviewId] || 'default';

    return (
        <div>
            <Row style={{ width: '1080px' }}>
                <Col span={24} style={{ color: 'black', height: '70px', textAlign: 'left' }}>
                    <h1>Bình luận của người xem</h1>
                </Col>

                <Col span={24} style={{ color: 'black', height: '120px', textAlign: 'left' }}>
                    <h2> <StarFilled style={{ color: 'yellow' }} />{moviedata?.rating}/10 <span>{review.length != null
                        ? review.length > 1000000
                            ? (review.length / 1000000).toFixed(1) + 'M'
                            : review.length > 1000
                                ? (review.length / 1000).toFixed(1) + 'k'
                                : review.length
                        : null} lượt đánh giá</span></h2>
                </Col>

                {isPaid && ( // chỉ hiển thị rating khi isPaid là true
                    <Col span={16}>
                        <Rate
                            name="rating"
                            allowHalf
                            defaultValue={rating}
                            style={{ fontSize: '36px', width: '250px' }}
                            onChange={handleRatingChange}
                            tooltips={1}
                        />
                        {ratingError && <span style={{ color: 'red' }}>Vui lòng chọn đánh giá</span>}
                    </Col>
                )}

                <Col span={16}>
                    {isPaid ? ( // Nếu đã thanh toán, hiển thị nút bình luận và input
                        <>
                            {showCommentInput && (
                                <Space.Compact
                                    className="tw-flex tw-flex-col tw-items-start tw-justify-start"
                                    style={{
                                        width: '90%',
                                    }}
                                >
                                    <Input.TextArea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Bình luận tại đây"
                                        autoSize={{ minRows: 4, maxRows: 4 }}
                                        className='tw-w-full'
                                    />
                                    <Button
                                        onClick={handleAdd}
                                        className='tw-bg-[var(--primary-background-color)] tw-text-white tw-mt-2' // Thêm margin-top để tạo khoảng cách giữa Input.TextArea và Button

                                    >
                                        Send
                                    </Button>

                                    {commentError && <span style={{ color: 'red' }}>Vui lòng nhập bình luận</span>}
                                </Space.Compact>
                            )}
                        </>
                    ) : (
                        // Nếu chưa thanh toán, hiển thị thông báo và ẩn input và nút bình luận
                        <div>

                        </div>
                    )}
                </Col>

                <Col span={16}>
                    {/* <div className="tw-overflow-hidden tw-scrollbar-hidden tw-max-h-[1000px]"> */}

                    <List
                        className="demo-loadmore-list"
                        loading={initLoading}
                        itemLayout="horizontal"
                        // loadMore={loadMore}
                        dataSource={reorderComments(review, user.id)}
                        renderItem={(item, index) => (
                            <List.Item>
                                <Row>
                                    <Col span={24} style={{ textAlign: 'left', width: '1080px' }}>
                                        <Row>
                                            <Col span={2}>
                                                <Avatar size={40}

                                                    src={uploadApi.get(item.account.image)}
                                                >
                                                </Avatar>
                                            </Col>
                                            <Col span={22}>
                                                <div className={cx('info-container')}>
                                                    <h4>{item.account.fullname}</h4>
                                                </div>
                                                <div>
                                                    {moment(item.createDate).format("MM-DD-YYYY")}</div>
                                            </Col>

                                        </Row>
                                    </Col>
                                    <Col span={24} style={{ textAlign: 'left' }}>
                                        <h4>
                                            <StarFilled style={{ color: 'yellow', fontSize: '20px' }} /> {item.rating}/10 | {convertRatingToStatus(item.rating)}
                                        </h4>
                                        {isEditing && index === indexId ? (
                                            <div>
                                                <Rate
                                                    // value={rating}
                                                    name="rating"
                                                    allowHalf
                                                    defaultValue={rating}
                                                    className='tw-text-gray-400'
                                                    style={{ fontSize: '16px', width: '120px' }}
                                                    onChange={handleRatingChange}
                                                    tooltips={1}
                                                />
                                                <Input.TextArea
                                                    name='comment'
                                                    value={editedComment}
                                                    onChange={(e) => setEditedComment(e.target.value)}
                                                    className='tw-h-[100px]'
                                                />
                                                <Button onClick={() => handleSaveEdit(item)} className='tw-btn tw-bg-[var(--primary-background-color)] tw-text-white'>Lưu</Button>
                                                <Button onClick={() => handleCancel()} type="default">Hủy bỏ</Button>
                                            </div>
                                        ) : (
                                            <div>
                                                <Paragraph
                                                    ellipsis={
                                                        expanded
                                                            ? {
                                                                rows: 2,
                                                                expandable: true,
                                                                symbol: 'Thu gọn',
                                                                onExpand: handleToggle,
                                                            }
                                                            : {
                                                                rows: 2,
                                                                expandable: true,
                                                                symbol: 'Xem thêm',
                                                                onExpand: handleToggle,
                                                            }
                                                    }
                                                    onClick={handleToggle}
                                                    className='tw-text-justify tw-text-[15px]'
                                                >
                                                    {item.comment}
                                                </Paragraph>

                                                <Space>
                                                    {/* <CommentOutlined className={cx('col-icon')} onClick={handleCommentClick} /><span>50 Bình luận</span> */}
                                                    <LikeOutlined
                                                        className={cx('col-icon', {
                                                            'liked': getLikeButtonStatus(item.id) === 'liked',
                                                        })}
                                                        onClick={() => {
                                                            getLikeButtonStatus(item.id) === 'liked'
                                                                ? dislikeReview(item.id)
                                                                : likeReview(item.id);
                                                        }}
                                                    />
                                                    <span>{item.likeComent} lượt thích</span>
                                                    {isUserComment(item) && (
                                                        <Dropdown
                                                            overlay={(
                                                                <Menu>
                                                                    <Menu.Item key="edit" onClick={() => handleEdit(item, index)}>Sửa</Menu.Item>
                                                                    <Menu.Item key="delete" onClick={() => handleDelete(item)}>Xóa</Menu.Item>
                                                                </Menu>
                                                            )}
                                                            trigger={['click']}
                                                        >
                                                            <Button
                                                                type="text"
                                                                icon={<DashOutlined
                                                                    className={cx('col-icon', {
                                                                        'text-blue-500': isClicked,
                                                                    })}
                                                                />}
                                                            />
                                                        </Dropdown>
                                                    )}
                                                </Space>
                                            </div>
                                        )}
                                    </Col>
                                    {/* 
                                        {isCommentVisible && (
                                            <Col span={24} style={{ textAlign: 'left' }} key="comment">
                                              
                                                <div className={cx('comment-container')}>
                                                    <Row>
                                                        <Col span={2}>
                                                            <Avatar size={40}
                                                                src={imageUrl || 'https://i.imgur.com/nHg881t.jpg'}
                                                            >
                                                            </Avatar>
                                                        </Col>
                                                        <Col span={22}>
                                                            <div><h4>Nhã Nè</h4></div>
                                                            <div>1 ngày trước</div>                         
                                                        </Col>
                                                        <p>
                                                            Đồng quan điểm . Phim hay, cảnh quay đẹp, giải trí ok, miễn coi cảm thấy vui là được. </p>
                                                        <Col span={24} style={{ textAlign: 'left' }}>
                                                            <Space>
                                                                <CommentOutlined className={cx('col-icon')} /><span>Phản hồi</span>
                                                                <LikeOutlined className={cx('col-icon')} /><span>Thích</span>
                                                            </Space>
                                                        </Col>
                                                    </Row>
                                                    <hr />
                                                    <Row>
                                                        <Col span={2}>
                                                            <Avatar size={40}
                                                                src={imageUrl || 'https://i.imgur.com/Lfimatm.jpg'}
                                                            >
                                                            </Avatar>
                                                        </Col>
                                                        <Col span={22}>
                                                            <div><h4>KakaShi</h4></div>
                                                            <div>1 ngày trước</div>
                                    
                                                        </Col>
                                                        <p>
                                                            Điểm cộng là bối cảnh, nhạc phim mãn nhãn. Cảm giác bồi hồi thật sự khi ngắm nhìn khung cảnh sông nước làng quê xứ Tây Nam Bộ. Diễn xuất của dàn diễn viên nhí ổn áp, vai Út Lục Lâm cũng tạo ra nhiều tiếng cười sảng khoái. </p>
                                                        <Col span={24} style={{ textAlign: 'left' }}>
                                                            <Space>
                                                                <CommentOutlined className={cx('col-icon')} /><span>Phản hồi</span>
                                                                <LikeOutlined className={cx('col-icon')} /><span>Thích</span>
                                                            </Space>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                        )} */}
                                </Row>

                            </List.Item>
                        )}
                    />

                    <PaginationCustom
                        howSizeChanger={false}
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalItems}
                        onChange={handlePageChange}
                    />
                </Col>
            </Row>


        </div>

    );
};
export default Binhluan;
