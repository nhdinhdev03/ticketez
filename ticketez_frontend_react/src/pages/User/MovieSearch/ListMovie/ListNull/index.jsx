import { Row, Col } from 'antd';

import React, { useEffect, useState } from 'react';
import { movieUserApi } from '~/api/user/showtime';
import List from './../List/index';
import authApi from '~/api/user/Security/authApi';

function ListNull() {
    const [data, setData] = useState([]);
    const user = authApi.getUser()

    useEffect(() => {
        const res = async () => {
            try {
                const result = await movieUserApi.getMovieShowtimePresentOrByUser(user?.id ?? "");
                setData(result.listMovieObjResp);
                // console.log('res nè:', resss);
            } catch (error) {
                console.log(error);
            }
        };
        res();
    }, [user]);

    // console.log('datanee', data);
    // console.log(authApi.getUser(),"ádasdasdasd");

    return (
        <Row className=" ">
            <Col span={24} className='tw-mb-[45px]'>
                <h1 className=" tw-text-[16px] tw-font-normal tw-text-center  tw-text-gray-500 ">
                    Rất tiếc, không tìm thấy phim phù hợp với lựa chọn của bạn
                </h1>
            </Col>
            <h1 className="tw-text-[14px] tw-font-semibold tw-text-center  tw-text-[#878787] tw-leading-loose tw-pl-6 ">
            {/* ĐỀ XUẤT PHIM CHO BẠN  */}
            TẤT CẢ PHIM ĐANG CHIẾU
            </h1>

            <Col span={24} className="  tw-grid tw-grid-cols-5 tw-gap-3">
                {data?.map((data,index) => (
                    <List key={index} data={data} />
                ))}
            </Col>
        </Row>
    );
}

export default ListNull;
