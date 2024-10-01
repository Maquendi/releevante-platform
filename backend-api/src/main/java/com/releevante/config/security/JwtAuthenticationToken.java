/* (C)2024 */
package com.releevante.config.security;

import com.releevante.identity.domain.model.LoginToken;
import com.releevante.types.AccountPrincipal;
import java.util.stream.Collectors;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class JwtAuthenticationToken extends AbstractAuthenticationToken {
  private final AccountPrincipal principal;
  private final LoginToken loginToken;

  public JwtAuthenticationToken(AccountPrincipal principal, LoginToken loginToken) {
    super(principal.roles().stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList()));
    this.principal = principal;
    this.loginToken = loginToken;
    setAuthenticated(true);
    // This constructor is used after successful authentication
  }

  @Override
  public LoginToken getCredentials() {
    return loginToken;
  }

  @Override
  public AccountPrincipal getPrincipal() {
    return principal;
  }
}
