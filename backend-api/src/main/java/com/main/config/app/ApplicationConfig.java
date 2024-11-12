package com.main.config.app;

import com.main.config.security.GlobalErrorWebExceptionHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.WebProperties;
import org.springframework.boot.web.reactive.error.ErrorAttributes;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.codec.ServerCodecConfigurer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.reactive.accept.RequestedContentTypeResolver;

@Configuration
public class ApplicationConfig {
  @Autowired ServerCodecConfigurer serverCodecConfigurer;
  @Autowired RequestedContentTypeResolver requestedContentTypeResolver;

  @Bean
  public WebProperties.Resources resources() {
    return new WebProperties.Resources();
  }

  // @Bean
  //  @Order(2)
  public GlobalErrorWebExceptionHandler globalRouterErrorHandler(
      ErrorAttributes errorAttributes,
      WebProperties webProperties,
      ApplicationContext applicationContext,
      ServerCodecConfigurer serverConfigurer) {
    return new GlobalErrorWebExceptionHandler(
        errorAttributes, webProperties, applicationContext, serverConfigurer);
  }

  @Bean
  CorsWebFilter corsFilter() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(true);
    config.addAllowedOrigin("http://localhost:3000");
    config.addAllowedOrigin("http://localhost:3001");
    config.addAllowedHeader("*");
    config.addAllowedMethod("*");
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return new CorsWebFilter(source);
  }
}
