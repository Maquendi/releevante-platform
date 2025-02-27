package com.releevante.core.application.identity.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.identity.model.LoginAccount;
import com.releevante.core.domain.identity.model.Organization;
import com.releevante.core.domain.identity.model.User;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = UserAuthenticationDto.class)
@JsonSerialize(as = UserAuthenticationDto.class)
@ImmutableExt
public abstract class AbstractUserAuthenticationDto {
  abstract String email();

  abstract String fullName();

  abstract String orgName();

  abstract String orgId();

  abstract LoginTokenDto token();

  public static UserAuthenticationDto from(
      LoginTokenDto token, LoginAccount account, User user, Organization organization) {
    return UserAuthenticationDto.builder()
        .email(account.email().value())
        .fullName(user.fullName())
        .token(token)
        .orgId(organization.id().value())
        .orgName(organization.name())
        .build();
  }
}
