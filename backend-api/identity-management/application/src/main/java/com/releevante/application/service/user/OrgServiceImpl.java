package com.releevante.application.service.user;

import com.releevante.application.dto.AccountIdDto;
import com.releevante.application.dto.OrgDto;
import com.releevante.application.service.auth.AuthorizationService;
import com.releevante.identity.domain.model.AccountId;
import com.releevante.identity.domain.model.LoginAccount;
import com.releevante.identity.domain.model.OrgId;
import com.releevante.identity.domain.model.Organization;
import com.releevante.identity.domain.repository.AccountRepository;
import com.releevante.identity.domain.repository.OrgRepository;
import com.releevante.identity.domain.service.PasswordEncoder;
import com.releevante.types.SequentialGenerator;
import java.time.ZonedDateTime;
import reactor.core.publisher.Mono;

public class OrgServiceImpl extends AccountService implements OrgService {
  final OrgRepository orgRepository;
  final AuthorizationService authorizationService;

  public OrgServiceImpl(
      OrgRepository orgRepository,
      AccountRepository accountRepository,
      PasswordEncoder passwordEncoder,
      SequentialGenerator<String> uuidGenerator,
      SequentialGenerator<ZonedDateTime> dateTimeGenerator,
      AuthorizationService authorizationService) {
    super(accountRepository, passwordEncoder, uuidGenerator, dateTimeGenerator);
    this.orgRepository = orgRepository;
    this.authorizationService = authorizationService;
  }

  @Override
  public Mono<AccountIdDto> createOrg(OrgDto orgDto) {
    return authorizationService
        .checkAuthorities("org:create")
        .flatMap(
            principal -> {
              var orgId = OrgId.of(uuidGenerator.next());
              var currentDateTime = dateTimeGenerator.next();
              var accountDto = orgDto.accountDto();
              var orgBuilder =
                  Mono.just(
                      Organization.builder()
                          .id(orgId)
                          .createdAt(currentDateTime)
                          .updatedAt(currentDateTime)
                          .isActive(false)
                          .name(orgDto.name())
                          .type(orgDto.type())
                          .build());

              return createAccount(accountDto, orgId)
                  .zipWith(orgBuilder)
                  .flatMap(
                      data -> {
                        var account = data.getT1();
                        var organization = data.getT2();
                        return orgRepository
                            .upsert(organization)
                            .flatMap(org -> accountRepository.upsert(account));
                      });
            })
        .map(LoginAccount::accountId)
        .map(AccountId::value)
        .map(AccountIdDto::of);
  }
}
