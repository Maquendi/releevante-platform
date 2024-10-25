package com.releevante.identity.application.service.user;

import com.releevante.identity.application.dto.AccountIdDto;
import com.releevante.identity.application.dto.OrgDto;
import reactor.core.publisher.Mono;

public interface OrgService {
  Mono<AccountIdDto> createOrg(OrgDto orgDto);
}
