/* (C)2024 */
package com.releevante.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.util.matcher.PathPatternParserServerWebExchangeMatcher;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
  @Bean
  public SecurityWebFilterChain securityWebFilterChain(
      ServerHttpSecurity http, JwtAuthenticationWebFilter jwtFilter) {
    return http.securityMatcher(new PathPatternParserServerWebExchangeMatcher("/api/**"))
        .authorizeExchange(
            exchanges ->
                exchanges.pathMatchers("/api/auth/**").permitAll().anyExchange().authenticated())
        .addFilterAt(jwtFilter, SecurityWebFiltersOrder.AUTHENTICATION)
        .csrf(ServerHttpSecurity.CsrfSpec::disable)
        .build();
  }

  //  @Order(Ordered.HIGHEST_PRECEDENCE)
  //  @Bean
  //  SecurityWebFilterChain apiHttpSecurity(ServerHttpSecurity http) {
  //    http.securityMatcher(new PathPatternParserServerWebExchangeMatcher("/api/**"))
  //            .authorizeExchange((exchanges) -> exchanges
  //                    .anyExchange().authenticated())
  //            .oauth2ResourceServer(d -> d.jwt(Customizer.withDefaults()));
  //    return http.build();
  //  }
}
