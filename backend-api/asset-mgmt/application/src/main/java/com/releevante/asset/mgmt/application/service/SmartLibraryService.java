package com.releevante.asset.mgmt.application.service;

import com.releevante.asset.mgmt.application.service.dto.OrgIdDto;
import com.releevante.asset.mgmt.application.service.dto.SlidDto;
import com.releevante.asset.mgmt.application.service.dto.SmartLibraryDto;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SmartLibraryService {
  Flux<SmartLibraryDto> find(OrgIdDto orgId);

  Mono<SmartLibraryDto> find(SlidDto slid);

  Flux<SmartLibraryDto> verifyAndGet(List<SlidDto> sLids);
}
