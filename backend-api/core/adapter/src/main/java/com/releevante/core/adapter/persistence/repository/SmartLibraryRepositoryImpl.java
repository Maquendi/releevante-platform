package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.SmartLibraryHibernateDao;
import com.releevante.core.adapter.persistence.records.SmartLibraryRecord;
import com.releevante.core.domain.SmartLibrary;
import com.releevante.core.domain.repository.SmartLibraryRepository;
import com.releevante.types.Slid;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

@Component
public class SmartLibraryRepositoryImpl implements SmartLibraryRepository {

  final SmartLibraryHibernateDao smartLibraryDao;

  public SmartLibraryRepositoryImpl(SmartLibraryHibernateDao smartLibraryDao) {
    this.smartLibraryDao = smartLibraryDao;
  }

  @Override
  public Flux<SmartLibrary> findById(List<Slid> sLids) {
    return Flux.fromIterable(
            smartLibraryDao.findAllById(
                sLids.stream().map(Slid::value).collect(Collectors.toSet())))
        .map(SmartLibraryRecord::toDomain);
  }
}
