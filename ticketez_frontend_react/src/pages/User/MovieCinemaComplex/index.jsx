import { Button, Row, Col, Modal } from 'antd';
import ShowTimeCCX from './ShowtimeCCX';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { cinemaComplexApi } from '~/api/admin';
import uploadApi from '~/api/service/uploadApi';
import Mapbox from '~/components/Mapbox';
import MovieShowing from '../Home/MovieShowing';


function MovieCinemaComplex() {
    const { ccxId } = useParams();
    const [dataCcx, setDataCcx] = useState([]);
    useEffect(() => {
        const get = async () => {
            try {
                const result = await cinemaComplexApi.getId(ccxId);
                console.log(result);
                setDataCcx(result.data);
            } catch (error) {
                console.log(error);
            }
        };
        get();
    }, [ccxId]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancelModal = () => {
        setIsModalOpen(false);
    };
    console.log("",dataCcx);

    const style = {
        backgroundImage: `url(${uploadApi.get(dataCcx?.cinemaChain?.banner)})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100%',
        position: 'relative',
        zIndex: 0,
    };
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Row className=" tw-w-[100%] tw-bg-[#FAFAFA] tw-leading-normal ">
            <Col className="tw-w-[100%] tw-min-h-[65px] tw-bg-slate-800"></Col>

            <Col span={24} className=" tw-h-[450px] tw-bg-gray-500">
                <div style={style} c>
                    <div className="  tw-w-[100%] tw-absolute tw-h-[115px] tw-bottom-[25px] tw-px-[200px] ">
                        <div className="  tw-w-[100%] tw-h-[100%] tw-flex">
                            <div className="  tw-w-[15%] tw-h-[100%] tw-flex tw-justify-center tw-items-center">
                                <img
                                    className="tw-h-[100%]"
                                    src={uploadApi.get(dataCcx?.cinemaChain?.image)}
                                    alt="Lỗi ảnh"
                                />
                            </div>
                            <div className="  tw-w-[85%] tw-h-[100%] tw-text-left tw-flex tw-items-center">
                                <div>
                                    <div className="tw-text-white tw-text-[24px] tw-font-semibold">{dataCcx?.name}</div>
                                    <div className="tw-text-[#FFFFFFCC] tw-text-[15px] tw-font-medium ">
                                        {dataCcx?.address}
                                    </div>
                                    <div>
                                        <div
                                            onClick={showModal}
                                            className="tw-text-[#3b82f6] tw-cursor-pointer tw-w-[100px] tw-text-[14px] tw-font-medium hover:tw-text-blue-700 "
                                        >
                                            [Xem bản đổ]
                                        </div>

                                        <Modal
                                            title="Bản đồ"
                                            open={isModalOpen}
                                            onCancel={handleCancelModal}
                                            className="modal-map-lg"
                                            footer={
                                                <Button className="modal-footer-btn-close" onClick={handleCancelModal}>
                                                    ĐÓNG
                                                </Button>
                                            }
                                        >
                                            <div className="map-lg-content">
                                                <Mapbox
                                                    latitude={dataCcx?.latitude}
                                                    longitude={dataCcx?.longitude}
                                                    address={dataCcx?.address}
                                                    title={dataCcx?.name}
                                                />
                                            </div>
                                        </Modal>
                                    </div>
                                    {/* <div className=" tw-mt-1 tw-text-[#ff85c0] tw-text-[14px]">
                                        Ưu đãi 89K/vé 2D cả tuần không giới hạn; 69K/vé 2D, tối đa 1 vé/tháng khi thanh
                                        toán bằng Ví Trả Sau
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
            <Col span={24} className=" tw-min-h-[150px] tw-p-[56px] tw-flex tw-justify-center">
                <Row className="  tw-w-[1088px]">
                    <Col
                        span={24}
                        className=" tw-h-[50px] tw-text-[36px] tw-mb-10  tw-flex tw-justify-center tw-text-black tw-font-medium"
                    >
                        {'Lịch chiếu phim ' + dataCcx?.name}
                    </Col>
                    <ShowTimeCCX />
                </Row>
            </Col>

            <Col className="tw-w-[100%] tw-min-h-[450px] tw-bg-black">
                <MovieShowing />
            </Col>
        </Row>
    );
}

export default MovieCinemaComplex;
