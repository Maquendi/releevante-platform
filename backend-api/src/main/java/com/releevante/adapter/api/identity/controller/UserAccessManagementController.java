/* (C)2024 */
package com.releevante.adapter.api.identity.controller;

import com.releevante.adapter.api.response.CustomApiResponse;
import com.releevante.identity.application.dto.*;
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

  @PostMapping("/access")
  Mono<CustomApiResponse<SmartLibraryGrantedAccess>> register(@RequestBody UserAccessDto access) {
    return identityServiceFacade.create(access).map(CustomApiResponse::from);
  }
}
