package com.releevante.core.domain.repository;

import com.releevante.core.domain.SmartLibrary;
import com.releevante.types.Slid;
import java.util.List;
import reactor.core.publisher.Flux;

public interface SmartLibraryRepository {
  Flux<SmartLibrary> findById(List<Slid> sLids);
}
