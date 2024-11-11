package com.main.adapter.api.identity.factory;

import com.main.config.security.JwtAuthenticationToken;
import com.releevante.identity.adapter.out.service.DefaultRsaKeyProvider;
import com.releevante.identity.adapter.out.service.DefaultUserJtwTokenService;
import com.releevante.identity.adapter.out.service.JwtRsaSigningKeyProvider;
import com.releevante.identity.application.service.auth.*;
import com.releevante.identity.application.service.user.DefaultUserServiceImpl;
import com.releevante.identity.application.service.user.OrgService;
import com.releevante.identity.application.service.user.OrgServiceImpl;
import com.releevante.identity.application.service.user.UserService;
import com.releevante.identity.domain.repository.*;
import com.releevante.identity.domain.service.PasswordEncoder;
import com.releevante.types.UuidGenerator;
import com.releevante.types.ZonedDateTimeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class IdentityServiceBeanFactory {
  @Autowired private AccountRepository accountRepository;
  @Autowired private UserRepository userRepository;
  @Autowired private PrivilegeRepository privilegeRepository;
  @Autowired private M2MClientsRepository m2MClientsRepository;
  @Autowired private OrgRepository orgRepository;
  @Autowired protected SmartLibraryAccessControlRepository accessControlRepository;

  @Value("${security.rsa.key-path.public}")
  private String rsaPublicKey;

  @Value("${security.rsa.key-path.private}")
  private String rsaPrivateKey;

  @Bean("userAuthenticationService")
  public AuthenticationService userAuthenticationService(
      JtwTokenService userJtwTokenService, PasswordEncoder passwordEncoder) {
    return new DefaultUserAuthenticationService(
        accountRepository,
        userJtwTokenService,
        passwordEncoder,
        privilegeRepository,
        orgRepository,
        accessControlRepository,
        userRepository);
  }

  @Bean()
  public JtwTokenService userJtwTokenService(JwtRsaSigningKeyProvider rsaSigningKeyProvider) {
    return new DefaultUserJtwTokenService(rsaSigningKeyProvider);
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
        ZonedDateTimeGenerator.instance(),
        authorizationService,
        accessControlRepository);
  }

  @Bean()
  public AuthorizationService authorizationService(
      AccountPrincipalService accountPrincipalService) {
    return new DefaultAuthorizationService(
        accountRepository, orgRepository, accountPrincipalService);
  }

  @Bean
  public OrgService orgService(
      PasswordEncoder passwordEncoder, AuthorizationService authorizationService) {
    return new OrgServiceImpl(
        orgRepository,
        accountRepository,
        passwordEncoder,
        UuidGenerator.instance(),
        ZonedDateTimeGenerator.instance(),
        authorizationService);
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
    return new PasswordEncoder() {
      @Override
      public String encode(String rawPassword) {
        return bCryptPasswordEncoder.encode(rawPassword);
      }

      @Override
      public boolean validate(String rawPassword, String hash) {
        return bCryptPasswordEncoder.matches(rawPassword, hash);
      }
    };
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
