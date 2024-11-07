package com.releevante.application.service.user;

import com.releevante.application.dto.SmartLibraryDto;
import com.releevante.identity.domain.repository.SmartLibraryAccessControlRepository;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.Slid;
import com.releevante.types.exceptions.ForbiddenException;
import java.util.List;
import reactor.core.publisher.Flux;

public class DefaultSmartLibraryAccessControlServiceImpl
    implements SmartLibraryAccessControlService {

  final SmartLibraryAccessControlRepository repository;

  public DefaultSmartLibraryAccessControlServiceImpl(
      SmartLibraryAccessControlRepository repository) {
    this.repository = repository;
  }

  protected Boolean validateCanGrantAccess(SmartLibraryDto library, AccountPrincipal principal) {
    if (library.org().equals(principal.orgId()) || principal.isSuperAdmin()) {
      return true;
    }
    throw new ForbiddenException();
  }

  @Override
  public Flux<SmartLibraryDto> verifyActive(List<Slid> sLids, AccountPrincipal principal) {

    return null;
  }
}
