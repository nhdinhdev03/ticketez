/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import { Rate, Tag, Modal, Row, Col, Typography } from 'antd';
import style from './MovieType.module.scss';
import classNames from 'classnames/bind';
import img from '~/assets/img';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(style);

const { Paragraph, Title } = Typography;

const ProductCard = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ellipsis, setEllipsis] = useState(true);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setLoading(true);
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <div className={cx('container')}>
                <Tag color="#f50" className={cx('tag-overlay')}>
                    18+
                </Tag>
                <Tag color="#D80032" className={cx('tag-overlay2')}>
                    <FontAwesomeIcon icon={faTicket} /> ĐẶT TRƯỚC
                </Tag>
                <img className={cx('img-overlay')} src={props.imgSrc} />
                <svg
                    onClick={showModal}
                    className={cx('icon-overlay')}
                    fill="#ffffff"
                    height="200px"
                    width="200px"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="-51.2 -51.2 614.40 614.40"
                    xmlSpace="preserve"
                    stroke="#ffffff"
                    strokeWidth="0.00512"
                >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        stroke="#CCCCCC"
                        strokeWidth="1.024"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                        <g>
                            <g>
                                <path d="M256,0C114.608,0,0,114.608,0,256s114.608,256,256,256s256-114.608,256-256S397.392,0,256,0z M256,496C123.664,496,16,388.336,16,256S123.664,16,256,16s240,107.664,240,240S388.336,496,256,496z"></path>
                            </g>
                        </g>
                        <g>
                            <g>
                                <polygon points="189.776,141.328 189.776,370.992 388.672,256.16"></polygon>
                            </g>
                        </g>
                    </g>
                </svg>
                <span className={cx('id-overlay')} style={{ color: '#E5E5E5' }}>
                    {props.idSrc}
                </span>
            </div>
            <div>
                <Title level={5} className={cx('name-movie')} style={{ color: '#ffffff' }}>
                    Đất Rừng Phương Nam <br />
                    <span className={cx('category-movie')} style={{ color: '#ffffff80' }}>
                        Chiến tranh, Chính kịch
                    </span>
                    <br />
                    <span className={cx('rate-movie')} style={{ color: '#ffffff' }}>
                        8
                    </span>
                    <Rate disabled defaultValue={1} style={{ fontSize: '13px', marginLeft: '-20px' }} />
                </Title>
            </div>

            {/* modal */}
            <Modal
                width={700}
                title="Đất Rừng Phương Nam "
                onOk={handleOk}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <>
                        <Row gutter={24}>
                            <Col lg={3}>
                                <img src={props.imgSrc} width={80} height={120} className={cx('img-modal')} />
                            </Col>
                            <Col lg={21} className={cx('name-video-modal')}>
                                <Title level={5}>
                                    Đất Rừng Phương Nam -{' '}
                                    <span className={cx('theloai-modal')}>Gia Đình, Phiêu Lưu</span> <br />
                                </Title>
                                <Paragraph
                                    ellipsis={
                                        ellipsis
                                            ? {
                                                  rows: 4,
                                              }
                                            : false
                                    }
                                    style={{ color: 'gray' }}
                                >
                                    Đất rừng phương Nam là một bộ phim điện ảnh Việt Nam thuộc thể loại sử thi – tâm lý
                                    – chính kịch ra mắt vào năm 2023, được dựa trên cuốn tiểu thuyết cùng tên của nhà
                                    văn Đoàn Giỏi và bộ phim truyền hình Đất phương Nam vào năm 1997.
                                </Paragraph>
                            </Col>
                        </Row>
                    </>,
                ]}
            >
                <iframe
                    style={{ width: '100%', height: '400px', border: 'none', borderRadius: '3px' }}
                    src="https://www.youtube.com/embed/uU-1VyT4TRE"
                    title="MV BÀI CA ĐẤT PHƯƠNG NAM I OST PHIM ĐẤT RỪNG PHƯƠNG NAM I SUẤT CHIẾU SỚM TỪ 13,14 &amp; 15.10"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
            </Modal>
        </>
    );
};

export default ProductCard;
