/* (C)2024 */
package com.releevante.adapter.api.identity.controller;

import com.releevante.adapter.api.response.CustomApiResponse;
import com.releevante.application.dto.LoginDto;
import com.releevante.application.dto.LoginTokenDto;
import com.releevante.application.identity.IdentityServiceFacade;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/auth")
public class UserAuthenticationController {
  final IdentityServiceFacade identityServiceFacade;

  public UserAuthenticationController(IdentityServiceFacade identityServiceFacade) {
    this.identityServiceFacade = identityServiceFacade;
  }

  @PostMapping("/login")
  Mono<CustomApiResponse<LoginTokenDto>> registerAccount(@RequestBody LoginDto login) {
    return identityServiceFacade.authenticate(login).map(CustomApiResponse::from);
  }
}
