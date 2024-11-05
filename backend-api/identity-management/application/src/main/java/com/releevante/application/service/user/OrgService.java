package com.releevante.application.service.user;

import com.releevante.application.dto.AccountIdDto;
import com.releevante.application.dto.OrgDto;
import reactor.core.publisher.Mono;

public interface OrgService {
  Mono<AccountIdDto> createOrg(OrgDto orgDto);
}
