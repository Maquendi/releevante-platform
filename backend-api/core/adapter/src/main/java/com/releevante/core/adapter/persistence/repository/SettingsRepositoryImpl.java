package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.LibrarySettingsHibernateDao;
import com.releevante.core.adapter.persistence.records.LibrarySettingsRecord;
import com.releevante.core.domain.LibrarySetting;
import com.releevante.core.domain.repository.SettingsRepository;
import com.releevante.types.Slid;
import java.util.List;
import java.util.function.Predicate;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class SettingsRepositoryImpl implements SettingsRepository {

  final LibrarySettingsHibernateDao settingsHibernateDao;

  public SettingsRepositoryImpl(LibrarySettingsHibernateDao settingsHibernateDao) {
    this.settingsHibernateDao = settingsHibernateDao;
  }

  @Override
  public Mono<LibrarySetting> create(LibrarySetting setting) {
    return settingsHibernateDao.save(LibrarySettingsRecord.from(setting)).thenReturn(setting);
  }

  @Override
  public Mono<LibrarySetting> find(String id) {
    return settingsHibernateDao.findById(id).map(LibrarySettingsRecord::toDomain);
  }

  @Override
  public Flux<LibrarySetting> create(Slid slid) {
    return settingsHibernateDao.findBy(slid.value()).map(LibrarySettingsRecord::toDomain);
  }

  @Override
  public Flux<LibrarySetting> findBy(Slid slid, boolean synced) {
    return Flux.from(settingsHibernateDao.findBy(slid.value(), synced))
        .map(LibrarySettingsRecord::toDomain);
  }

  @Override
  public Flux<LibrarySetting> findBy(Slid slid) {
    return settingsHibernateDao.findBy(slid.value()).map(LibrarySettingsRecord::toDomain);
  }

  @Override
  public Mono<LibrarySetting> findCurrentBy(Slid slid) {
    return settingsHibernateDao
        .findBy(slid.value())
        .collectList()
        .filter(Predicate.not(List::isEmpty))
        .map(settings -> settings.get(0))
        .map(LibrarySettingsRecord::toDomain);
  }

  @Override
  public Mono<Integer> setSynchronized(Slid slid) {
    return settingsHibernateDao.setSynchronized(slid.value()).defaultIfEmpty(0);
  }
}
