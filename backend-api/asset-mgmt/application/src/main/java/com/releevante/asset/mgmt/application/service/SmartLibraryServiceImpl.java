package com.releevante.asset.mgmt.application.service;

import com.releevante.asset.mgmt.application.service.dto.OrgIdDto;
import com.releevante.asset.mgmt.application.service.dto.SlidDto;
import com.releevante.asset.mgmt.application.service.dto.SmartLibraryDto;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class SmartLibraryServiceImpl implements SmartLibraryService {
  @Override
  public Flux<SmartLibraryDto> find(OrgIdDto orgId) {
    return null;
  }

  @Override
  public Mono<SmartLibraryDto> find(SlidDto slid) {
    return null;
  }

  @Override
  public Flux<SmartLibraryDto> verifyAndGet(List<SlidDto> sLids) {
    return null;
  }
}
