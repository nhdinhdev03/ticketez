// package com.ticketez_backend_springboot.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration
// public class CorsConfig {

//     @Bean
//     public WebMvcConfigurer corsConfigurer() {
//         return new WebMvcConfigurer() {
//             @Override
//             public void addCorsMappings(CorsRegistry registry) {
//                 registry.addMapping("/api/**") // Điều này áp dụng CORS cho các URL bắt đầu bằng "/api/"
//                         // .allowedOrigins("https://ominous-engine-xjqgrwxx9wqhv66p-3000.app.github.dev")
//                         .allowedOriginPatterns("*")
//                         .allowCredentials(true);
//             }
//         };
//     }
// }




