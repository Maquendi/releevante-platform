/* (C)2024 */
package com.main.config.security;

import com.releevante.core.application.identity.dto.LoginTokenDto;
import com.releevante.types.AccountPrincipal;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class JwtAuthenticationToken extends AbstractAuthenticationToken {
  private final AccountPrincipal principal;
  private final LoginTokenDto loginToken;

  public JwtAuthenticationToken(AccountPrincipal principal, LoginTokenDto loginToken) {
    super(extractAuthorities(principal));
    this.principal = principal;
    this.loginToken = loginToken;
    setAuthenticated(true);
  }

  private static Set<GrantedAuthority> extractAuthorities(AccountPrincipal principal) {
    return principal.roles().stream()
        .peek(System.out::println)
        .map(
            role -> {
              if (isRole(role)) {
                return new SimpleGrantedAuthority(String.format("ROLE_%s", role));
              }
              return new SimpleGrantedAuthority(role);
            })
        .collect(Collectors.toSet());
  }

  protected static boolean isRole(String value) {
    return !value.matches("^[^:]+:[^:]+$\n");
  }

  @Override
  public LoginTokenDto getCredentials() {
    return loginToken;
  }

  @Override
  public AccountPrincipal getPrincipal() {
    return principal;
  }
}
