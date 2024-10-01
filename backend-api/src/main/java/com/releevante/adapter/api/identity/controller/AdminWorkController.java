package com.releevante.adapter.api.identity.controller;

import com.releevante.application.dto.AccountDto;
import com.releevante.application.dto.AccountIdDto;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/admin")
public class AdminWorkController {
  @PostMapping("/org")
  Mono<AccountIdDto> register(@RequestBody AccountDto account) {
    // return identityServiceFacade.createAccount(account);
    return null;
  }
}
