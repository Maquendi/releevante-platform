package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.LibraryInventoryHibernateDao;
import com.releevante.core.adapter.persistence.dao.SmartLibraryHibernateDao;
import com.releevante.core.adapter.persistence.records.SmartLibraryRecord;
import com.releevante.core.domain.BookCopyStatus;
import com.releevante.core.domain.Client;
import com.releevante.core.domain.LoanDetail;
import com.releevante.core.domain.SmartLibrary;
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

@Transactional
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
    return Flux.fromIterable(
            smartLibraryDao.findAllById(
                sLids.stream().map(Slid::value).collect(Collectors.toSet())))
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
    return Mono.justOrEmpty(smartLibraryDao.findById(slid.value()))
        .map(SmartLibraryRecord::toDomain);
  }

  @Override
  public Mono<SmartLibrary> synchronizeClients(SmartLibrary library) {

    var clientFlux = Flux.fromIterable(library.clients());

    var synchronizing = clientFlux.flatMap(clientRepository::synchronize);

    var markAsBorrowed = clientFlux.flatMap(this::markInventoryAsBorrowed);

    return Flux.zip(synchronizing, markAsBorrowed).collectList().thenReturn(library);
  }

  public Mono<Integer> markInventoryAsBorrowed(Client client) {
    return Mono.fromCallable(
            () ->
                client.loans().stream()
                    .flatMap(loan -> loan.loanDetails().stream())
                    .map(LoanDetail::bookCopy)
                    .collect(Collectors.toSet()))
        .filter(Predicate.not(Set::isEmpty))
        .map(
            bookCopies ->
                libraryInventoryHibernateDao.updateInventoryStatusByCpy(
                    BookCopyStatus.BORROWED.name(), bookCopies))
        .defaultIfEmpty(0);
  }
}
