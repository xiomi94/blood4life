package com.xiojuandawt.blood4life.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve files from the 'uploads' directory when accessing /images/**
        // 'file:uploads/' assumes the directory is in the root of the working directory
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:uploads/");
    }
}
