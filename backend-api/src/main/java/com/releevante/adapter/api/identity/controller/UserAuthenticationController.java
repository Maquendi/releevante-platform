/* (C)2024 */
package com.releevante.adapter.api.identity.controller;

import com.releevante.application.facade.identity.IdentityServiceFacade;
import com.releevante.identity.adapter.in.api.LoginDto;
import com.releevante.identity.domain.model.Audience;
import com.releevante.identity.domain.model.LoginToken;
import com.releevante.identity.domain.model.Password;
import com.releevante.identity.domain.model.UserName;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/auth")
public class UserAuthenticationController {
  final IdentityServiceFacade identityServiceFacade;

  public UserAuthenticationController(IdentityServiceFacade identityServiceFacade) {
    this.identityServiceFacade = identityServiceFacade;
  }

  @PostMapping("/login")
  Mono<String> registerAccount(@RequestBody LoginDto loginDto) {
    return identityServiceFacade
        .authenticate(
            UserName.of(loginDto.userName()),
            Password.of(loginDto.password()),
            Audience.of(loginDto.audience()))
        .map(LoginToken::value);
  }
}
