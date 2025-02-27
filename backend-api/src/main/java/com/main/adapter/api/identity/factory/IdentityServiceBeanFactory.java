package com.main.adapter.api.identity.factory;

import com.main.config.security.JwtAuthenticationToken;
import com.releevante.core.adapter.service.identity.service.DefaultRsaKeyProvider;
import com.releevante.core.adapter.service.identity.service.DefaultUserJtwTokenService;
import com.releevante.core.adapter.service.identity.service.JwtRsaSigningKeyProvider;
import com.releevante.core.application.identity.service.auth.*;
import com.releevante.core.application.identity.service.user.DefaultUserServiceImpl;
import com.releevante.core.application.identity.service.user.OrgService;
import com.releevante.core.application.identity.service.user.OrgServiceImpl;
import com.releevante.core.application.identity.service.user.UserService;
import com.releevante.core.application.service.SmartLibraryService;
import com.releevante.core.application.service.impl.DefaultLibraryService;
import com.releevante.core.domain.identity.repository.*;
import com.releevante.core.domain.identity.service.PasswordEncoder;
import com.releevante.core.domain.repository.BookReservationRepository;
import com.releevante.core.domain.repository.BookTransactionRepository;
import com.releevante.core.domain.repository.SmartLibraryRepository;
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
  @Autowired private OrgRepository orgRepository;
  @Autowired protected SmartLibraryAccessControlRepository accessControlRepository;
  @Autowired private AuthorizedOriginRepository authorizedOriginRepository;

  @Autowired SmartLibraryRepository smartLibraryRepository;

  @Autowired BookTransactionRepository bookTransactionRepository;

  @Autowired BookReservationRepository bookReservationRepository;

  @Value("${security.rsa.key-path.public}")
  private String rsaPublicKey;

  @Value("${security.rsa.key-path.private}")
  private String rsaPrivateKey;

  @Bean("userAuthenticationService")
  public AuthenticationService userAuthenticationService(
      JtwTokenService userJtwTokenService,
      PasswordEncoder passwordEncoder,
      AuthorizationService authorizationService) {
    return new DefaultUserAuthenticationService(
        accountRepository,
        userJtwTokenService,
        passwordEncoder,
        privilegeRepository,
        orgRepository,
        accessControlRepository,
        userRepository,
        authorizedOriginRepository,
        authorizationService);
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
  public SmartLibraryService smartLibraryService(AuthorizationService authorizationService) {
    return new DefaultLibraryService(smartLibraryRepository, authorizationService);
  }

  @Bean()
  public UserService userService(
      PasswordEncoder passwordEncoder,
      AuthorizationService authorizationService,
      SmartLibraryService smartLibraryService) {
    return new DefaultUserServiceImpl(
        userRepository,
        accountRepository,
        passwordEncoder,
        UuidGenerator.instance(),
        ZonedDateTimeGenerator.instance(),
        authorizationService,
        accessControlRepository,
        smartLibraryService);
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
        authorizationService,
        bookTransactionRepository,
        bookReservationRepository);
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
