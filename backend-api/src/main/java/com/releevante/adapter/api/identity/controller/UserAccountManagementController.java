/* (C)2024 */
package com.releevante.adapter.api.identity.controller;

import com.releevante.application.dto.AccountDto;
import com.releevante.application.dto.UserDto;
import com.releevante.application.facade.identity.IdentityServiceFacade;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/users")
public class UserAccountManagementController {
  final IdentityServiceFacade identityServiceFacade;

  public UserAccountManagementController(IdentityServiceFacade identityServiceFacade) {
    this.identityServiceFacade = identityServiceFacade;
  }

  @PostMapping("/account")
  Mono<?> registerAccount(@RequestBody AccountDto account) {

    return Mono.just("created");
  }

  @PostMapping()
  Mono<ResponseEntity<?>> registerUser(@RequestBody UserDto user) {

    return Mono.empty();
  }
}
