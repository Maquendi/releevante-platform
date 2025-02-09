package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.*;
import com.releevante.core.adapter.persistence.dao.projections.SmartLibraryProjection;
import com.releevante.core.adapter.persistence.records.*;
import com.releevante.core.domain.*;
import com.releevante.core.domain.repository.ClientRepository;
import com.releevante.core.domain.repository.SettingsRepository;
import com.releevante.core.domain.repository.SmartLibraryRepository;
import com.releevante.types.SequentialGenerator;
import com.releevante.types.Slid;
import com.releevante.types.ZonedDateTimeGenerator;
import java.time.ZonedDateTime;
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

  final SmartLibraryAccessControlDao smartLibraryAccessControlDao;

  final AuthorizedOriginRecordHibernateDao authorizedOriginRecordHibernateDao;

  final SequentialGenerator<ZonedDateTime> dateTimeGenerator = ZonedDateTimeGenerator.instance();

  public SmartLibraryRepositoryImpl(
      SmartLibraryHibernateDao smartLibraryDao,
      SmartLibraryEventsHibernateDao smartLibraryEventsHibernateDao,
      ClientRepository clientRepository,
      LibraryInventoryHibernateDao libraryInventoryHibernateDao,
      SettingsRepository settingsRepository,
      BookImageHibernateDao bookImageHibernateDao,
      SmartLibraryAccessControlDao smartLibraryAccessControlDao,
      AuthorizedOriginRecordHibernateDao authorizedOriginRecordHibernateDao) {
    this.smartLibraryDao = smartLibraryDao;
    this.smartLibraryEventsHibernateDao = smartLibraryEventsHibernateDao;
    this.clientRepository = clientRepository;
    this.libraryInventoryHibernateDao = libraryInventoryHibernateDao;
    this.settingsRepository = settingsRepository;
    this.bookImageHibernateDao = bookImageHibernateDao;
    this.smartLibraryAccessControlDao = smartLibraryAccessControlDao;
    this.authorizedOriginRecordHibernateDao = authorizedOriginRecordHibernateDao;
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
            smartLibraryAccessControlDao.setSynchronized(slid.value()).defaultIfEmpty(0),
            libraryInventoryHibernateDao.setSynchronized(slid.value()).defaultIfEmpty(0),
            settingsRepository.setSynchronized(slid))
        .map(data -> true)
        .defaultIfEmpty(true);
  }

  //  public Mono<Void> updateInventoryStatus(List<Client> clients) {
  //    var updatedAt = dateTimeGenerator.next();
  //    return Flux.fromStream(
  //            clients.stream()
  //                .map(Client::loans)
  //                .flatMap(List::stream)
  //                .map(BookLoan::loanStatus)
  //                .flatMap(List::stream))
  //        .flatMap(
  //            loanStatus -> {
  //              var status =
  //                      loanStatus.itemStatuses().stream()
  //                      .min((i1, i2) -> i2.createdAt().compareTo(i1.createdAt()))
  //                      .map(LoanItemStatus::statuses)
  //                      .orElse(LoanItemStatuses.BORROWED);
  //
  //              return libraryInventoryHibernateDao.updateInventoryStatusByCpy(
  //                  status.name(), updatedAt, item.cpy());
  //            })
  //        .then();
  //  }
}
