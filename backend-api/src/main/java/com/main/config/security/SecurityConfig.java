/* (C)2024 */
package com.main.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
  @Bean
  public SecurityWebFilterChain securityWebFilterChain(
      ServerHttpSecurity http, ApiKeyWebFilter apiKeyWebFilter, JwtWebFilter jwtWebFilter) {
    return http.authorizeExchange(
            exchanges ->
                exchanges
                    .pathMatchers("/auth/**", "/webjars/swagger-ui/**", "/v3/api-docs/**")
                    .permitAll()
                    .pathMatchers("/admin/**")
                    .hasAnyAuthority("super-admin", "sys-admin", "user-admin")
                    .anyExchange()
                    .authenticated())
        .addFilterBefore(apiKeyWebFilter, SecurityWebFiltersOrder.AUTHENTICATION)
        .addFilterAt(jwtWebFilter, SecurityWebFiltersOrder.AUTHENTICATION)
        .csrf(ServerHttpSecurity.CsrfSpec::disable)
        .exceptionHandling(
            (exception) -> {
              exception.accessDeniedHandler(new CustomAccessDeniedHandler());
              exception.authenticationEntryPoint(new CustomAuthenticationEntryPoint());
            })
        .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
        .logout(ServerHttpSecurity.LogoutSpec::disable)
        .cors(ServerHttpSecurity.CorsSpec::disable)
        .build();
  }
}
