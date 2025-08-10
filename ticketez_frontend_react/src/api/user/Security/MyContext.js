import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MyPageComponent = () => {
  // Trong component trang chủ
const location = useLocation();

useEffect(() => {
    if (location.state?.fromLogin) {
        // Tải lại dữ liệu hoặc cập nhật trạng thái
    }
}, [location.state]);

};
