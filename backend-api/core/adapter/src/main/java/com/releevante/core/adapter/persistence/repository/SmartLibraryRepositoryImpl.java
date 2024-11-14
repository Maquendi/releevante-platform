package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.LibraryInventoryHibernateDao;
import com.releevante.core.adapter.persistence.dao.SmartLibraryHibernateDao;
import com.releevante.core.adapter.persistence.records.SmartLibraryRecord;
import com.releevante.core.domain.*;
import com.releevante.core.domain.repository.ClientRepository;
import com.releevante.core.domain.repository.SmartLibraryRepository;
import com.releevante.types.Slid;
import java.util.List;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class SmartLibraryRepositoryImpl implements SmartLibraryRepository {

  final SmartLibraryHibernateDao smartLibraryDao;

  final ClientRepository clientRepository;

  final LibraryInventoryHibernateDao libraryInventoryHibernateDao;

  public SmartLibraryRepositoryImpl(
      SmartLibraryHibernateDao smartLibraryDao,
      ClientRepository clientRepository,
      LibraryInventoryHibernateDao libraryInventoryHibernateDao) {
    this.smartLibraryDao = smartLibraryDao;
    this.clientRepository = clientRepository;
    this.libraryInventoryHibernateDao = libraryInventoryHibernateDao;
  }

  @Override
  public Flux<SmartLibrary> findById(List<Slid> sLids) {
    return smartLibraryDao
        .findAllById(sLids.stream().map(Slid::value).collect(Collectors.toSet()))
        .map(SmartLibraryRecord::toDomain);
  }

  @Override
  public Mono<SmartLibrary> saveEvent(SmartLibrary smartLibrary) {
    return Mono.fromCallable(() -> SmartLibraryRecord.events(smartLibrary))
        .map(smartLibraryDao::save)
        .thenReturn(smartLibrary);
  }

  @Override
  public Mono<SmartLibrary> findBy(Slid slid) {
    return smartLibraryDao.findById(slid.value()).map(SmartLibraryRecord::toDomain);
  }

  @Transactional
  @Override
  public Mono<SmartLibrary> synchronizeClients(SmartLibrary library) {
    var clients = library.clients();
    return Flux.fromIterable(clients)
        .flatMap(clientRepository::synchronize)
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
