package com.ticketez_backend_springboot.modules.activityLog;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ticketez_backend_springboot.modules.account.Account;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class ActivityLogService {

    @Autowired
    private ActivityLogDAO dao;

    public ActivityLog saveLogActivity(
            Account account,
            String description,
            String result,
            HttpServletRequest request,
            Optional<String> oldData,
            Optional<String> newData) throws Exception {

        String userAgent = request.getHeader("User-Agent"); // Lấy thông tin trình duyệt: Chrome, Hệ điều hành,...
        String ipAddress = request.getRemoteAddr(); // Lấy địa chỉ IP từ request

        ActivityLog activityLog = new ActivityLog();
        activityLog.setAccount(account);
        activityLog.setDescription(description);
        activityLog.setResult(result);
        activityLog.setTimeStamp(new Date());
        activityLog.setIpAddress(ipAddress);
        activityLog.setUserAgent(userAgent);

        oldData.ifPresent(activityLog::setOldData);
        newData.ifPresent(activityLog::setNewData);

        return dao.save(activityLog);
    }
}
