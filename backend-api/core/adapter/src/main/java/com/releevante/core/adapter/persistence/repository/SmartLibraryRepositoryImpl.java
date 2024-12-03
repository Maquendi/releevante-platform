package com.releevante.core.adapter.persistence.repository;

import static java.util.stream.Collectors.groupingBy;

import com.releevante.core.adapter.persistence.dao.*;
import com.releevante.core.adapter.persistence.records.*;
import com.releevante.core.domain.*;
import com.releevante.core.domain.repository.ClientRepository;
import com.releevante.core.domain.repository.SettingsRepository;
import com.releevante.core.domain.repository.SmartLibraryRepository;
import com.releevante.types.Slid;
import java.util.*;
import java.util.function.Predicate;
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

    var libraryEventFlux =
        smartLibraryEventsHibernateDao
            .findAllBySlidIn(sLids.stream().map(Slid::value).collect(Collectors.toSet()))
            .map(SmartLibraryEventRecord::toDomain)
            .collectList();

    var smartLibraries =
        authorizedOriginRecordHibernateDao
            .findAllById(sLids.stream().map(Slid::value).collect(Collectors.toSet()))
            .map(AuthorizedOriginRecord::toLibrary)
            .collectList();

    return Mono.zip(libraryEventFlux, smartLibraries)
        .flatMapMany(
            data -> {
              var events = data.getT1().stream().collect(groupingBy(SmartLibraryStatus::slid));
              var libraries = data.getT2();
              var librariesWithStatus =
                  libraries.stream()
                      .map(
                          library -> {
                            var libraryStatuses =
                                Optional.ofNullable(events.get(library.id().value()))
                                    .orElse(Collections.emptyList());

                            return library.withStatuses(libraryStatuses);
                          })
                      .collect(Collectors.toSet());

              return Flux.fromIterable(librariesWithStatus);
            });
  }

  @Override
  public Mono<SmartLibrary> saveEvent(SmartLibrary smartLibrary) {
    return Mono.fromCallable(() -> SmartLibraryRecord.events(smartLibrary))
        .flatMap(smartLibraryDao::save)
        .thenReturn(smartLibrary);
  }

  @Override
  public Mono<SmartLibrary> findBy(Slid slid) {
    var smartLibraryMono =
        authorizedOriginRecordHibernateDao
            .findById(slid.value())
            .map(AuthorizedOriginRecord::toLibrary);

    var libraryEventsMono =
        smartLibraryEventsHibernateDao
            .findAllBySlid(slid.value())
            .map(SmartLibraryEventRecord::toDomain)
            .collectList();

    return Mono.zip(smartLibraryMono, libraryEventsMono)
        .map(
            data -> {
              var library = data.getT1();
              var libraryStatuses = data.getT2();
              return library.withStatuses(libraryStatuses);
            });
  }

  @Transactional
  @Override
  public Mono<SmartLibrary> synchronizeClientsLoans(SmartLibrary library) {
    return Flux.fromIterable(library.clients())
        .flatMap(clientRepository::saveBookLoan)
        .collectList()
        .flatMap(ignore -> markInventoryAsBorrowed(library.clients()))
        .thenReturn(library);
  }

  @Override
  public Flux<BookCopy> findAllBookCopiesUnSynced(
      Slid slid, boolean synced, int offset, int pageSize) {
    return libraryInventoryHibernateDao
        .findAllCopies(slid.value(), synced, offset * pageSize, pageSize)
        .map(LibraryInventoryRecord::fromProjection);
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

  public Mono<Void> markInventoryAsBorrowed(List<Client> clients) {
    return Mono.fromCallable(
            () ->
                clients.stream()
                    .map(Client::loans)
                    .flatMap(List::stream)
                    .map(BookLoan::loanDetails)
                    .flatMap(List::stream)
                    .map(LoanDetail::bookCopy)
                    .collect(Collectors.toSet()))
        .filter(Predicate.not(Set::isEmpty))
        .flatMap(
            bookCopies ->
                libraryInventoryHibernateDao.updateInventoryStatusByCpy(
                    BookCopyStatus.BORROWED.name(), bookCopies));
  }
}
