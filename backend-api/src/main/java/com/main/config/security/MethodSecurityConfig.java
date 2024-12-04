package com.main.config.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;

@Configuration
// @EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true)
@EnableReactiveMethodSecurity()
public class MethodSecurityConfig {}
