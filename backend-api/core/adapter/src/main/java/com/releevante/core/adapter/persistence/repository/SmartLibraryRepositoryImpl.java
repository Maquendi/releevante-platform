package com.releevante.core.adapter.persistence.repository;

import static java.util.stream.Collectors.groupingBy;

import com.releevante.core.adapter.persistence.dao.LibraryInventoryHibernateDao;
import com.releevante.core.adapter.persistence.dao.SmartLibraryEventsHibernateDao;
import com.releevante.core.adapter.persistence.dao.SmartLibraryHibernateDao;
import com.releevante.core.adapter.persistence.records.SmartLibraryEventRecord;
import com.releevante.core.adapter.persistence.records.SmartLibraryRecord;
import com.releevante.core.domain.*;
import com.releevante.core.domain.repository.ClientRepository;
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

  public SmartLibraryRepositoryImpl(
      SmartLibraryHibernateDao smartLibraryDao,
      SmartLibraryEventsHibernateDao smartLibraryEventsHibernateDao,
      ClientRepository clientRepository,
      LibraryInventoryHibernateDao libraryInventoryHibernateDao) {
    this.smartLibraryDao = smartLibraryDao;
    this.smartLibraryEventsHibernateDao = smartLibraryEventsHibernateDao;
    this.clientRepository = clientRepository;
    this.libraryInventoryHibernateDao = libraryInventoryHibernateDao;
  }

  @Override
  public Flux<SmartLibrary> findById(Set<Slid> sLids) {

    var libraryEventFlux =
        smartLibraryEventsHibernateDao
            .findAllBySlidIn(sLids.stream().map(Slid::value).collect(Collectors.toSet()))
            .map(SmartLibraryEventRecord::toDomain)
            .collectList();

    var smartLibraries =
        smartLibraryDao
            .findAllById(sLids.stream().map(Slid::value).collect(Collectors.toSet()))
            .map(SmartLibraryRecord::toDomain)
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
    var smartLibraryMono = smartLibraryDao.findById(slid.value()).map(SmartLibraryRecord::toDomain);

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
  public Mono<SmartLibrary> synchronizeClients(SmartLibrary library) {
    var clients = library.clients();
    return Flux.fromIterable(clients)
        .flatMap(clientRepository::saveBookLoan)
        .collectList()
        .flatMap(ignore -> markInventoryAsBorrowed(clients))
        .thenReturn(library);
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
