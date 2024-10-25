/* (C)2024 */
package com.releevante.adapter.api.identity.controller;

import com.releevante.adapter.api.response.CustomApiResponse;
import com.releevante.identity.application.dto.AccountDto;
import com.releevante.identity.application.dto.AccountIdDto;
import com.releevante.identity.application.dto.NfcUserAccessDto;
import com.releevante.identity.application.dto.PinUserAccessDto;
import com.releevante.identity.application.identity.IdentityServiceFacade;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/users")
public class UserAccessManagementController {
  final IdentityServiceFacade identityServiceFacade;

  public UserAccessManagementController(IdentityServiceFacade identityServiceFacade) {
    this.identityServiceFacade = identityServiceFacade;
  }

  @PostMapping("/account")
  Mono<CustomApiResponse<AccountIdDto>> register(@RequestBody AccountDto account) {
    return identityServiceFacade.create(account).map(CustomApiResponse::from);
  }

  @PostMapping("/pin-access")
  Mono<CustomApiResponse<AccountIdDto>> register(@RequestBody PinUserAccessDto access) {
    return identityServiceFacade.create(access).map(CustomApiResponse::from);
  }

  @PostMapping("/nfc-access")
  Mono<CustomApiResponse<AccountIdDto>> register(@RequestBody NfcUserAccessDto access) {
    return identityServiceFacade.create(access).map(CustomApiResponse::from);
  }
}
