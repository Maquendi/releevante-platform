/* (C)2024 */
package com.releevante.adapter.api.identity.controller;

import com.releevante.adapter.api.response.CustomApiResponse;
import com.releevante.application.dto.AccountDto;
import com.releevante.application.dto.AccountIdDto;
import com.releevante.application.identity.IdentityServiceFacade;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/users")
public class UserAccountManagementController {
  final IdentityServiceFacade identityServiceFacade;

  public UserAccountManagementController(IdentityServiceFacade identityServiceFacade) {
    this.identityServiceFacade = identityServiceFacade;
  }

  @PostMapping("/account")
  Mono<CustomApiResponse<AccountIdDto>> register(@RequestBody AccountDto account) {
    return identityServiceFacade.create(account).map(CustomApiResponse::from);
  }
}
