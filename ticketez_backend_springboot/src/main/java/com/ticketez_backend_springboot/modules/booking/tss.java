package com.ticketez_backend_springboot.modules.booking;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class tss {
    public static void main(String[] args) {
        // Date currentDate = new Date();

        // // Tạo đối tượng SimpleDateFormat để định dạng ngày thành chuỗi
        // SimpleDateFormat sdf = new SimpleDateFormat("EEEE");

        // // Chuyển đổi ngày thành chuỗi thứ
        // String dayOfWeek = sdf.format(currentDate);

        // // In ra thứ
        // System.out.println("Thứ hiện tại là: " + dayOfWeek);
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());

        // Tạo đối tượng SimpleDateFormat để định dạng ngày thành chuỗi
        SimpleDateFormat sdf = new SimpleDateFormat("EEEE");

        // In ra các thứ trong tuần
        for (int i = 0; i < 7; i++) {
            String dayOfWeek = sdf.format(calendar.getTime());
            System.out.println("Ngày " + (i + 1) + ": " + dayOfWeek);

            // Di chuyển đến ngày tiếp theo
            calendar.add(Calendar.DAY_OF_WEEK, 1);
        }
    }
}
