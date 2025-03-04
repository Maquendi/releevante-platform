package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.*;
import com.releevante.core.adapter.persistence.dao.projections.SmartLibraryProjection;
import com.releevante.core.adapter.persistence.records.*;
import com.releevante.core.domain.*;
import com.releevante.core.domain.repository.ClientRepository;
import com.releevante.core.domain.repository.SettingsRepository;
import com.releevante.core.domain.repository.SmartLibraryRepository;
import com.releevante.types.Slid;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class SmartLibraryRepositoryImpl implements SmartLibraryRepository {

  final SmartLibraryHibernateDao smartLibraryDao;

  final SmartLibraryEventsHibernateDao smartLibraryEventsHibernateDao;

  final ClientRepository clientRepository;

  final LibraryInventoryHibernateDao libraryInventoryHibernateDao;

  final SettingsRepository settingsRepository;

  final BookImageHibernateDao bookImageHibernateDao;

  final AuthorizedOriginRecordHibernateDao authorizedOriginRecordHibernateDao;

  final BookRatingHibernateDao bookRatingHibernateDao;

  final SmartLibraryGrantedAccessHibernateDao smartLibraryGrantedAccessHibernateDao;

  public SmartLibraryRepositoryImpl(
      SmartLibraryHibernateDao smartLibraryDao,
      SmartLibraryEventsHibernateDao smartLibraryEventsHibernateDao,
      ClientRepository clientRepository,
      LibraryInventoryHibernateDao libraryInventoryHibernateDao,
      SettingsRepository settingsRepository,
      BookImageHibernateDao bookImageHibernateDao,
      AuthorizedOriginRecordHibernateDao authorizedOriginRecordHibernateDao,
      BookRatingHibernateDao bookRatingHibernateDao,
      SmartLibraryGrantedAccessHibernateDao smartLibraryGrantedAccessHibernateDao) {
    this.smartLibraryDao = smartLibraryDao;
    this.smartLibraryEventsHibernateDao = smartLibraryEventsHibernateDao;
    this.clientRepository = clientRepository;
    this.libraryInventoryHibernateDao = libraryInventoryHibernateDao;
    this.settingsRepository = settingsRepository;
    this.bookImageHibernateDao = bookImageHibernateDao;
    this.authorizedOriginRecordHibernateDao = authorizedOriginRecordHibernateDao;
    this.bookRatingHibernateDao = bookRatingHibernateDao;
    this.smartLibraryGrantedAccessHibernateDao = smartLibraryGrantedAccessHibernateDao;
  }

  @Override
  public Flux<SmartLibrary> findById(Set<Slid> sLids) {
    return Flux.fromIterable(sLids).flatMap(this::findBy);
  }

  @Override
  public Mono<SmartLibrary> saveEvent(SmartLibrary smartLibrary) {
    return Mono.fromCallable(() -> SmartLibraryRecord.events(smartLibrary))
        .flatMap(smartLibraryDao::save)
        .thenReturn(smartLibrary);
  }

  @Override
  public Mono<SmartLibrary> findBy(Slid slid) {
    return smartLibraryDao.findOneBy(slid.value()).map(SmartLibraryProjection::toDomain);
  }

  @Override
  public Mono<SmartLibrary> findWithAllocations(Slid slid) {
    return Mono.zip(
            findBy(slid),
            libraryInventoryHibernateDao.getAllocations(slid.value()).collect(Collectors.toSet()))
        .map(
            data -> {
              var library = data.getT1();
              var allocations = data.getT2();
              return library.withAllocations(allocations);
            });
  }

  @Transactional
  @Override
  public Mono<SmartLibrary> synchronizeLibraryTransactions(SmartLibrary library) {
    return Flux.fromIterable(library.clients())
        .flatMap(clientRepository::saveBookTransactions)
        .collectList()
        .thenReturn(library);
  }

  @Override
  public Mono<SmartLibrary> synchronizeLibraryClientRatings(SmartLibrary smartLibrary) {
    return Flux.fromStream(smartLibrary.clients().stream())
        .map(BookRatingRecord::fromDomain)
        .flatMap(bookRatingHibernateDao::saveAll)
        .collectList()
        .thenReturn(smartLibrary);
  }

  @Override
  public Mono<SmartLibrary> synchronizeLibraryTransactionStatus(SmartLibrary library) {
    return Flux.fromIterable(library.clients())
        .flatMap(clientRepository::saveBookTransactionStatus)
        .collectList()
        .thenReturn(library);
  }

  @Override
  public Flux<LibrarySetting> getSetting(Slid slid, boolean synced) {
    return settingsRepository.findBy(slid, synced);
  }

  @Override
  public Flux<LibrarySetting> getSetting(Slid slid) {
    return settingsRepository.findBy(slid);
  }

  @Override
  public Flux<BookImage> getImages(Set<Isbn> isbnSet) {
    return bookImageHibernateDao
        .findAllByIsbnIn(isbnSet.stream().map(Isbn::value).collect(Collectors.toSet()))
        .map(BookImageRecord::toDomain);
  }

  @Override
  public Flux<BookImage> getImages(Isbn isbn) {
    return null;
  }

  @Override
  public Mono<Boolean> setSynchronized(Slid slid) {
    return Mono.zip(
            smartLibraryGrantedAccessHibernateDao.setSynchronized(slid.value()).defaultIfEmpty(0),
            libraryInventoryHibernateDao.setSynchronized(slid.value()).defaultIfEmpty(0),
            settingsRepository.setSynchronized(slid))
        .map(data -> true)
        .defaultIfEmpty(true);
  }

  @Override
  public Mono<Boolean> setBooksSynchronized(Slid slid) {
    return libraryInventoryHibernateDao.setSynchronized(slid.value()).thenReturn(true);
  }

  @Override
  public Mono<Boolean> setLibrarySettingsSynchronized(Slid slid) {
    return settingsRepository.setSynchronized(slid).thenReturn(true);
  }

  @Override
  public Mono<Boolean> setAccessSynchronized(Slid slid) {
    return smartLibraryGrantedAccessHibernateDao.setSynchronized(slid.value()).thenReturn(true);
  }
}
