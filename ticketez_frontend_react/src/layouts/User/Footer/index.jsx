import { Row, Col } from 'antd';
import img, { listIcon } from '~/assets/img';
function Footer() {
    return (
        <Row>
            <Col
                span={24}
                className="tw-bg-[#171717] tw-h-[450px] tw-w-[100%] tw-flex  tw-justify-center tw-px-[30px] tw-py-[15px]"
            >
                <Row className=" tw-w-[85%] tw-py-2 tw-px-[2rem]">
                    <Col span={5} className="tw-text-[14px]">
                        <h1 className="tw-text-[14px] tw-text-[#ffffffcc]">MUA VÉ XEM PHIM</h1>
                        <div className=" tw-mb-4">
                            <a href="#1">
                                <span className="tw-text-[#ffffff80] tw-transition tw-duration-300 tw-ease-in-out hover:tw-text-[#D9D9D9]">
                                    {' '}
                                    Lịch chiếu phim
                                </span>
                            </a>
                        </div>
                        <div className="tw-mb-4">
                            <a href="#1">
                                <span className="tw-text-[#ffffff80] tw-transition tw-duration-300 tw-ease-in-out hover:tw-text-[#D9D9D9]">
                                    {' '}
                                    Rạp chiếu phim
                                </span>
                            </a>
                        </div>
                        <div className="tw-mb-4">
                            <a href="#1">
                                <span className="tw-text-[#ffffff80] tw-transition tw-duration-300 tw-ease-in-out hover:tw-text-[#D9D9D9]">
                                    {' '}
                                    Phim chiếu rạp
                                </span>
                            </a>
                        </div>
                        <div className="tw-mb-4">
                            <a href="#1">
                                <span className="tw-text-[#ffffff80] tw-transition tw-duration-300 tw-ease-in-out hover:tw-text-[#D9D9D9]">
                                    {' '}
                                    Review phim
                                </span>
                            </a>
                        </div>
                        <div className="tw-mb-4">
                            <a href="#1">
                                <span className="tw-text-[#ffffff80] tw-transition tw-duration-300 tw-ease-in-out hover:tw-text-[#D9D9D9]">
                                    {' '}
                                    Top phim
                                </span>
                            </a>
                        </div>
                        <div className="tw-mb-4">
                            <a href="#1">
                                <span className="tw-text-[#ffffff80] tw-transition tw-duration-300 tw-ease-in-out hover:tw-text-[#D9D9D9]">
                                    {' '}
                                    Blog phim
                                </span>
                            </a>
                        </div>
                    </Col>
                    <Col span={5}>
                        <h1 className="tw-text-[14px] tw-text-[#ffffffcc]">DỊCH VỤ NỔI BẬT</h1>
                        <div className="tw-flex tw-items-center tw-mb-4  ">
                            <a href="#1" className="tw-flex tw-items-center tw-group">
                                <img src={listIcon.veXimPhim} alt="" width={24} className="tw-mr-3" />
                                <span className="tw-text-[#ffffff80] tw-transition tw-duration-300 tw-ease-in-out group-hover:tw-text-[#D9D9D9]">
                                    {' '}
                                    Vé xem phim
                                </span>
                            </a>
                        </div>
                        <div className="tw-flex tw-items-center tw-mb-4 ">
                            <a href="#1" className="tw-flex tw-items-center tw-group">
                                <img src={listIcon.baoHiem} alt="" width={24} className="tw-mr-3" />
                                <span className="tw-text-[#ffffff80] tw-transition tw-duration-300 tw-ease-in-out group-hover:tw-text-[#D9D9D9]">
                                    {' '}
                                    Bảo hiểm Ô tô
                                </span>
                            </a>
                        </div>
                        <div className="tw-flex tw-items-center tw-mb-4 ">
                            <a href="#1" className="tw-flex tw-items-center tw-group">
                                <img src={listIcon.veMayBay} alt="" width={24} className="tw-mr-3" />
                                <span className="tw-text-[#ffffff80] tw-transition tw-duration-300 tw-ease-in-out group-hover:tw-text-[#D9D9D9]">
                                    {' '}
                                    Vé máy bay
                                </span>
                            </a>
                        </div>
                        <div className="tw-flex tw-items-center tw-mb-4 ">
                            <a href="#1" className="tw-flex tw-items-center tw-group">
                                <img src={listIcon.veKhachSan} alt="" width={24} className="tw-mr-3" />
                                <span className="tw-text-[#ffffff80] tw-transition tw-duration-300 tw-ease-in-out group-hover:tw-text-[#D9D9D9]">
                                    {' '}
                                    Khách sạn
                                </span>
                            </a>
                        </div>
                        <div className="tw-flex tw-items-center tw-mb-4 ">
                            <a href="#1" className="tw-flex tw-items-center tw-group">
                                <img src={listIcon.viNhanAi} alt="" width={24} className="tw-mr-3" />
                                <span className="tw-text-[#ffffff80] tw-transition tw-duration-300 tw-ease-in-out group-hover:tw-text-[#D9D9D9]">
                                    {' '}
                                    Ví nhân ái
                                </span>
                            </a>
                        </div>
                        <div className="tw-flex tw-items-center tw-mb-4 ">
                            <a href="#1" className="tw-flex tw-items-center tw-group">
                                <img src={listIcon.vayNhanh} alt="" width={24} className="tw-mr-3" />
                                <span className="tw-text-[#ffffff80] tw-transition tw-duration-300 tw-ease-in-out group-hover:tw-text-[#D9D9D9]">
                                    {' '}
                                    Vay nhanh
                                </span>
                            </a>
                        </div>
                    </Col>
                    <Col span={8} className="tw-text-[14px]">
                        <h1 className="tw-text-[14px] tw-text-[#ffffffcc]">CHĂM SÓC KHÁCH HÀNG</h1>
                        <div className="tw-mb-3">
                            <span className="tw-text-[#8B8B8B]">Địa chỉ:</span>
                            <span className="tw-text-[#9F9F9F] tw-transition tw-duration-300 tw-ease-in-out hover:tw-text-[#D9D9D9] ">
                                Tầng M, Tòa nhà Victory Tower, Số 12 Tân Trào, Phường Tân Phú, Quận 7, Thành phố Hồ Chí
                                Minh
                            </span>
                        </div>
                        <div className="tw-mb-3">
                            <span className="tw-text-[#8B8B8B]">Hotline : </span>
                            <span>
                                {' '}
                                <a
                                    href="#4"
                                    className="tw-text-[#9F9F9F] tw-transition tw-duration-300 tw-ease-in-out hover:tw-text-[#D9D9D9]"
                                >
                                    {' '}
                                    1900 5454 41
                                </a>
                            </span>
                            <span>
                                {' '}
                                <i className="tw-text-[12px] tw-text-[#ffffff99]">(1000 đ/phút)</i>
                            </span>
                        </div>
                        <div className="tw-mb-3">
                            <span className="tw-text-[#8B8B8B]">Email :</span>
                            <span className="tw-text-[#9F9F9F] tw-transition tw-duration-300 tw-ease-in-out hover:tw-text-[#D9D9D9]">
                                {' '}
                               khanhttpc03027@fpt.du.vn
                            </span>
                        </div>
                        <div className="tw-mb-3 ">
                            <span className="tw-text-[#8B8B8B]">Tổng đài gọi ra : </span>
                            <span>
                                <a
                                    href="#2"
                                    className="tw-text-[#9F9F9F] tw-transition tw-duration-300 tw-ease-in-out hover:tw-text-[#D9D9D9] after:tw-content-['_-']"
                                >
                                    028.7306.5555
                                </a>{' '}
                                <a
                                    href="#4"
                                    className="tw-text-[#9F9F9F] tw-transition tw-duration-300 tw-ease-in-out hover:tw-text-[#D9D9D9]"
                                >
                                    028.9999.5555
                                </a>
                            </span>
                        </div>

                        <h1 className="tw-text-[14px] tw-text-[#ffffffcc] ">HỢP TÁC DOANH NGHIỆP</h1>
                        <div className="tw-mb-3 ">
                            <span className="tw-text-[#8B8B8B]"> Hotline :</span>
                            <span>
                                <a
                                    href="#4"
                                    className="tw-text-[#9F9F9F] tw-transition tw-duration-300 tw-ease-in-out hover:tw-text-[#D9D9D9]"
                                >
                                    1900 636 652 (Phí 1.000đ/phút)
                                </a>
                            </span>
                        </div>
                        <div className="tw-mb-3 ">
                            <span className="tw-text-[#8B8B8B]">Email :</span>
                            <span>
                                <a
                                    href="#4"
                                    className="tw-text-[#9F9F9F] tw-transition tw-duration-300 tw-ease-in-out hover:tw-text-[#D9D9D9]"
                                >
                                    trankhanh@gmail.com
                                </a>
                            </span>
                        </div>
                        <div className="tw-mb-3 ">
                            <span className="tw-text-[#8B8B8B]">Website :</span>
                            <span>
                                <a
                                    href="#2"
                                    className="tw-text-[#9F9F9F] tw-transition tw-duration-300 tw-ease-in-out hover:tw-text-[#D9D9D9]"
                                >
                                    ticketez.vn
                                </a>
                            </span>
                        </div>
                      
                    </Col>
                    <Col span={6} className="tw-pl-[20px]">
                        <h1 className="tw-text-[14px] tw-text-[#ffffffcc]">KẾT NỐI VỚI CHÚNG TÔI</h1>
                        <div>
                            <img src={listIcon.faceBook} alt="" width={40} className="tw-mr-[20px] tw-cursor-pointer " />
                            <img src={listIcon.linkedIn} alt="" width={40} className="tw-mr-[20px] tw-cursor-pointer" />
                            <img src={listIcon.youtube} alt="" width={40} className="tw-mr-[20px] tw-cursor-pointer" />
                        </div>
                        <h1 className="tw-text-[14px] tw-text-[#ffffffcc] tw-mt-[50px]">TẢI ỨNG DỤNG TRÊN ĐIỆN THOẠI</h1>
                        <div className="">
                            <img src={img.mapr} alt="" width={200} height={230} />
                        </div>
                        <h1 className="tw-text-[14px] tw-text-[#ffffffcc] tw-mt-[50px]">ĐƯỢC CHỨNG NHẬN BỞI</h1>
                       
                    </Col>
                </Row>
            </Col>
            <Col span={24} className="tw-bg-[#262626] tw-h-[80px] tw-w-[100%] tw-flex  tw-justify-center tw-px-[30px] tw-py-[10px]">
                <Row className='tw-w-[85%] tw-py-[10px]'> 
                    <Col span={1} className=''>
                        <img src={img.logoAdmin} alt="" width={50} />
                    </Col>
                    <Col span={15} className='tw-flex tw-items-end '>
                        <div className='tw-mb-4'>
                            <div className='tw-text-[16px] tw-text-[#CBCBCB]'>TICKETEZ ỨNG DỤNG SIÊU HÀNG ĐẦU ĐẶT VÉ XEM PHIM</div>
                            <div className='tw-text-[14px] tw-text-[#ffffff80]'>Cái Răng, Cần Thơ</div>
                        </div>
                    </Col>
                 
                </Row>
            </Col>
        </Row>
    );
}

export default Footer;
