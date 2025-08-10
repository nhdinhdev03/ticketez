import img from "~/assets/img";

function HeaderAdminLeft() {
    return (
        <div style={{ flex: 1 }}>
            {/* Đặt nội dung header phụ ở đây */}
            <div className="tw-flex tw-items-center tw-gap-2">
                <div className="tw-text-xl tw-font-medium tw-text-blue-800">
                    <span className="tw-font-bold tw-text-blue-900 ">
                        <img width={56} src={img.logoAdmin} alt="" />
                    </span>
                </div>
                <div className="tw-w-[1px] tw-bg-gray-500 tw-h-10 tw-hidden lg:tw-block"></div>
                <img src={img.logoHome} alt="" />
                <div className="tw-hidden tw-font-medium tw-leading-4 tw-text-[var(--primary--text-color)] lg:tw-block">
                    <div>
                        <div>Đặt vé</div>
                        <div className="tw-mt-[5px]">Xem phim</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeaderAdminLeft;
