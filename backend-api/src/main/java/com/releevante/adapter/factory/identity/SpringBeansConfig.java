package com.releevante.adapter.factory.identity;

import com.releevante.application.service.auth.*;
import com.releevante.application.service.user.DefaultUserServiceImpl;
import com.releevante.application.service.user.UserService;
import com.releevante.config.security.JwtAuthenticationToken;
import com.releevante.identity.adapter.out.service.DefaultM2MJtwTokenService;
import com.releevante.identity.adapter.out.service.DefaultRsaKeyProvider;
import com.releevante.identity.adapter.out.service.DefaultUserJtwTokenService;
import com.releevante.identity.adapter.out.service.JwtRsaSigningKeyProvider;
import com.releevante.identity.domain.model.LoginAccount;
import com.releevante.identity.domain.model.M2MClient;
import com.releevante.identity.domain.repository.*;
import com.releevante.identity.domain.service.PasswordEncoder;
import com.releevante.types.UuidGenerator;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class SpringBeansConfig {
  @Autowired private AccountRepository accountRepository;
  @Autowired private UserRepository userRepository;
  @Autowired private PrivilegeRepository privilegeRepository;
  @Autowired private M2MClientsRepository m2MClientsRepository;

  @Autowired private OrgRepository orgRepository;

  @Value("${security.rsa.key-path.public}")
  private String rsaPublicKey;

  @Value("${security.rsa.key-path.private}")
  private String rsaPrivateKey;

  @Bean
  public AuthenticationService userAuthenticationService(
      JtwTokenService<LoginAccount> userJtwTokenService, PasswordEncoder passwordEncoder) {
    return new DefaultUserAuthenticationService(
        accountRepository, userJtwTokenService, passwordEncoder, privilegeRepository);
  }

  @Bean
  public AuthenticationService m2mAuthenticationService(
      JtwTokenService<M2MClient> m2mJtwTokenService) {
    return new M2MDefaultAuthenticationService(m2MClientsRepository, m2mJtwTokenService);
  }

  @Bean()
  public JtwTokenService<LoginAccount> userJtwTokenService(
      JwtRsaSigningKeyProvider rsaSigningKeyProvider) {
    return new DefaultUserJtwTokenService(rsaSigningKeyProvider);
  }

  @Bean()
  public JtwTokenService<M2MClient> m2mJtwTokenService(
      JwtRsaSigningKeyProvider rsaSigningKeyProvider) {
    return new DefaultM2MJtwTokenService(rsaSigningKeyProvider);
  }

  @Bean()
  public JwtRsaSigningKeyProvider rsaSigningKeyProvider() {
    return new DefaultRsaKeyProvider(rsaPublicKey, rsaPrivateKey);
  }

  @Bean()
  public UserService userService(
      PasswordEncoder passwordEncoder, AuthorizationService authorizationService) {
    return new DefaultUserServiceImpl(
        userRepository,
        accountRepository,
        passwordEncoder,
        UuidGenerator.instance(),
        authorizationService);
  }

  @Bean()
  public AuthorizationService authorizationService(
      AccountPrincipalService accountPrincipalService) {
    return new DefaultAuthorizationService(
        accountRepository, orgRepository, accountPrincipalService);
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    var sha256Digest = DigestUtils.getSha256Digest();
    return (password) -> new String(sha256Digest.digest(password.getBytes()));
  }

  @Bean()
  public AccountPrincipalService accountPrincipalService() {
    return new AccountPrincipalService(
        () ->
            ReactiveSecurityContextHolder.getContext()
                .map(
                    context ->
                        ((JwtAuthenticationToken) context.getAuthentication()).getPrincipal()));
  }
}
