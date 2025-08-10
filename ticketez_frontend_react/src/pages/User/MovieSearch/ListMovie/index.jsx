import React, { useEffect, useState } from 'react';

import { Row, Col, Button, Tooltip } from 'antd';
import './movieShowing.scss';
import { DownOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import useDebounce from './../../../../hooks/useDebounce';
import PaginationCustom from '~/components/Admin/PaginationCustom';

import countriesJson from '~/data/countries.json';
import genreApi from '~/api/admin/managementMovie/genreApi';
import List from './List';
import { movieUserApi } from '~/api/user/showtime';
import ListNull from './ListNull';

function ListMovie() {
    const [ckTheLoai, setCkTheLoai] = useState(false);
    const [ckQuocGia, setCkQuocGia] = useState(false);
    const [ckNam, setCkNam] = useState(false);
    const [dataGenres, setDataGenres] = useState([]);

    const checkTheLoai = (value) => {
        setCkTheLoai(value);
        if (ckQuocGia) {
            setCkQuocGia(!value);
        }
        if (ckNam) {
            setCkNam(!value);
        }
    };
    const clickQuocGia = (value) => {
        setCkQuocGia(value);
        if (ckTheLoai) {
            setCkTheLoai(!value);
        }
        if (ckNam) {
            setCkNam(!value);
        }
    };
    const clickNam = (value) => {
        setCkNam(value);

        if (ckTheLoai) {
            setCkTheLoai(!value);
        }
        if (ckQuocGia) {
            setCkQuocGia(!value);
        }
    };
    // ----------------------------------------------------------------

    const [valueTL, setValueTL] = useState('tất cả');
    const [valueQG, setValueQG] = useState({
        name: 'tất cả',
        code: 'tc',
    });
    const [valueN, setValueN] = useState('tất cả');

    const [searchValue, setSearchValue] = useState('');

    const debounce = useDebounce(searchValue, 500);
    const handleChange = (e) => {
        const searchValue = e.target.value;

        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
        }
    };

    const handleValueTL = (value) => {
        setValueTL(value);
        setCkTheLoai(false);
    };

    const handleValueQG = (value) => {
        setValueQG(value);
        setCkQuocGia(false);
    };

    const listNam = ['2019', '2000', '2021', '2022', '2023'];

    const handleValueN = (value) => {
        setValueN(value);
        setCkNam(false);
    };
    useEffect(() => {
        const getGenres = async () => {
            try {
                const res = await genreApi.getAll();
                setDataGenres(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getGenres();
    }, []);

    // console.log('Thể loại:', valueTL);
    // console.log('Quốc gia:', valueQG);
    // console.log('Năm:', valueN);

    // console.log('Tìm kiếm:', debounce);
    const [totalItems, setTotalItems] = useState(0); // Tổng số mục
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const [loading, setLoading] = useState(true);

    // Xử lý sự kiện thay đổi trang
    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };
    // ----------------------------------------------------------------

    const [data, setData] = useState([]);
    useEffect(() => {
        setLoading(true);
        const res = async () => {
            try {
                const resss = await movieUserApi.getMoviesByGenreNameAndCountryAndYearAndSearch(
                    currentPage,
                    pageSize,
                    valueTL,
                    valueQG.code,
                    valueN,
                    debounce,
                );
                setTotalItems(resss.totalItems);
                setData(resss.listMovieObjResp);
                // console.log('res nè:', resss);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        res();
    }, [currentPage, pageSize, valueTL, valueQG, debounce, valueN]);

    return (
        <Row className=" tw-relative tw-w-[80%] tw-h-[100%]">
            {loading && (
                <div className="loading">
                    <LoadingOutlined className="imgL" />
                </div>
            )}
            <Col span={24} className=" tw-h-[65px] tw-mb-[25px] ">
                <Row className="tw-h-[100%] tw-flex tw-items-center tw-justify-center">
                    <Col span={12} className=" tw-flex tw-items-center  tw-h-[100%]">
                        <h1 className="tw-text-[24px] tw-text-[var(--primary--text-color)]">
                            {' '}
                            Tìm phim chiếu rạp trên TicketEZ
                        </h1>
                    </Col>
                    <Col span={12} className=" tw-flex tw-items-center  tw-justify-center  tw-h-[100%]">
                        {/* select Thể loại */}
                        <div className="tw-relative tw-pr-5 ">
                            <button
                                onClick={() => checkTheLoai(!ckTheLoai)}
                                className="tw-w-[120px] tw-cursor-pointer tw-h-[36px] tw-bg-white tw-text-[#000000] tw-font-normal tw-text-[14px] tw-p-[9px] tw-rounded  tw-border-[1px] tw-border-slate-300 tw-text-left  "
                            >
                                <div className="tw-truncate tw-w-[84px]">
                                    <Tooltip title={valueTL === 'tất cả' ? '' : valueTL} color="#176b87">
                                        {valueTL === 'tất cả' ? 'Thể loại' : valueTL}
                                    </Tooltip>
                                </div>
                            </button>
                            <div className="tw-absolute tw-inset-y-0 tw-right-10 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
                                <DownOutlined className="tw-h-5 tw-w-5  tw-text-gray-500" />
                            </div>
                            {ckTheLoai && (
                                <div className="tw-absolute tw-p-1 tw-w-[470px] tw-max-h-[440px] tw-rounded tw-bg-[#FFFFFF] tw-right-30 tw-top-[85px] tw-z-50">
                                    <div className=" select-the-loai tw-p-2 tw-max-h-[400px]  tw-overflow-auto">
                                        <Button
                                            type="text"
                                            className={valueTL === 'tất cả' ? 'btn btn-active' : 'btn btn-text'}
                                            onClick={() => handleValueTL('tất cả')}
                                        >
                                            Tất cả
                                        </Button>

                                        {dataGenres.map((item, index) => (
                                            <Button
                                                key={index}
                                                type="text"
                                                onClick={() => handleValueTL(item.name)}
                                                className={valueTL === item.name ? 'btn btn-active' : 'btn btn-text'}
                                            >
                                                <Tooltip title={item.name} color="#176b87">
                                                    <span className="tw-truncate">{item.name}</span>
                                                </Tooltip>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* select Quốc gia */}
                        <div className="tw-relative tw-pr-5">
                            <button
                                onClick={() => clickQuocGia(!ckQuocGia)}
                                className="tw-w-[120px]  tw-cursor-pointer tw-bg-white tw-text-[#000000] tw-font-normal tw-text-[14px] tw-p-[9px] tw-rounded  tw-border-[1px] tw-border-slate-300 tw-text-left  "
                            >
                                <div className="tw-truncate tw-w-[84px]">
                                    <Tooltip title={valueQG.code === 'tc' ? '' : valueQG.name} color="#176b87">
                                        {valueQG.code === 'tc' ? 'Quốc gia' : valueQG.name}
                                    </Tooltip>
                                </div>
                            </button>
                            <div className="tw-absolute tw-inset-y-0 tw-right-10 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
                                <DownOutlined className="tw-h-5 tw-w-5  tw-text-gray-500" />
                            </div>
                            {ckQuocGia && (
                                <div className="tw-absolute tw-p-1 tw-w-[400px] tw-max-h-[420px] tw-rounded tw-bg-[#FFFFFF] tw-right-30 tw-top-[85px] tw-z-50 ">
                                    <div className=" select-quoc-gia tw-p-2 tw-max-h-[400px]  tw-overflow-auto">
                                        <Button
                                            type="text"
                                            className={valueQG.code === 'tc' ? 'btn btn-active' : 'btn btn-text'}
                                            onClick={() => handleValueQG({ name: 'tất cả', code: 'tc' })}
                                        >
                                            Tất cả
                                        </Button>
                                        {countriesJson.map((item, index) => (
                                            <Button
                                                key={index}
                                                type="text"
                                                className={
                                                    item.code === valueQG.code ? 'btn btn-active' : 'btn btn-text'
                                                }
                                                onClick={() => handleValueQG(item)}
                                            >
                                                <Tooltip title={item.name} color="#d82f8b">
                                                    <span className="tw-truncate tw-w-[90px]">{item.name}</span>
                                                </Tooltip>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* select Năm */}
                        <div className="tw-relative tw-pr-5">
                            <button
                                onClick={() => clickNam(!ckNam)}
                                className="tw-w-[120px] tw-cursor-pointer tw-bg-white tw-text-[#000000] tw-font-normal tw-text-[14px] tw-p-[9px] tw-rounded  tw-border-[1px] tw-border-slate-300 tw-text-left  "
                            >
                                {valueN === 'tất cả' ? 'Năm' : valueN}
                            </button>
                            <div className="tw-absolute tw-inset-y-0 tw-right-10 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
                                <DownOutlined className="tw-h-5 tw-w-5  tw-text-gray-500" />
                            </div>
                            {ckNam && (
                                <div className="tw-absolute tw-p-1 tw-w-[150px] tw-max-h-[420px] tw-rounded tw-bg-[#FFFFFF] tw-right-30 tw-top-[85px] tw-z-50">
                                    <div className=" select-nam tw-p-2 tw-max-h-[400px] tw-overflow-auto">
                                        <Button
                                            type="text"
                                            onClick={() => handleValueN('tất cả')}
                                            className={valueN === 'tất cả' ? 'btn btn-active' : 'btn btn-text'}
                                        >
                                            Tất cả
                                        </Button>
                                        {listNam.map((value, index) => (
                                            <Button
                                                key={index}
                                                type="text"
                                                onClick={() => handleValueN(value)}
                                                className={value === valueN ? 'btn btn-active' : 'btn btn-text'}
                                            >
                                                {'Năm ' + value}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* input search */}
                        <div className="tw-relative">
                            <input
                                className="tw-outline-none tw-p-[9px] tw-rounded  tw-border-[1px] tw-border-slate-300 "
                                type="text"
                                value={searchValue}
                                spellCheck={false}
                                placeholder="Tìm theo tên phim..."
                                onChange={handleChange}
                            />
                            <div className="tw-absolute tw-inset-y-0 tw-right-3 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
                                <SearchOutlined className="tw-h-5 tw-w-5  tw-text-gray-500" />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Col>
            {data !== null && (
                <Col span={24} className="tw-bg-[#FAFAFA] tw-grid tw-grid-cols-5">
                    {data?.map((data, index) => (
                        <List key={index} data={data} />
                    ))}
                </Col>
            )}
            {data === null && (
                <Col span={24} className="tw-bg-[#FAFAFA] tw-h-[100%] tw-mb-[25px] ">
                    <ListNull />
                </Col>
            )}
            {data !== null && (
                <Col span={24} className="container-pagination tw-h-[50px] tw-flex tw-items-center tw-justify-center ">
                    <PaginationCustom
                        howSizeChanger={false}
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalItems}
                        onChange={handlePageChange}
                    />
                </Col>
            )}
        </Row>
    );
}

export default ListMovie;
