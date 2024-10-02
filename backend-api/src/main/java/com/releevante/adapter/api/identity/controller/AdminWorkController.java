package com.releevante.adapter.api.identity.controller;

import com.releevante.application.dto.AccountIdDto;
import com.releevante.application.dto.OrgDto;
import com.releevante.application.identity.IdentityServiceFacade;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/admin")
public class AdminWorkController {
  final IdentityServiceFacade identityServiceFacade;

  public AdminWorkController(IdentityServiceFacade identityServiceFacade) {
    this.identityServiceFacade = identityServiceFacade;
  }

  @PostMapping("/org")
  Mono<AccountIdDto> register(@RequestBody OrgDto org) {
    return identityServiceFacade.create(org);
  }
}
