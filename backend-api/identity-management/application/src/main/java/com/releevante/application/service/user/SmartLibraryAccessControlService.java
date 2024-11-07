package com.releevante.application.service.user;

import com.releevante.application.dto.SmartLibraryDto;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.Slid;
import java.util.List;
import reactor.core.publisher.Flux;

public interface SmartLibraryAccessControlService {
  Flux<SmartLibraryDto> verifyActive(List<Slid> sLids, AccountPrincipal principal);
}
