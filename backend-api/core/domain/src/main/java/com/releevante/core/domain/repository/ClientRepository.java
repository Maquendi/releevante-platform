package com.releevante.core.domain.repository;

import com.releevante.core.domain.Client;
import com.releevante.core.domain.ClientId;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ClientRepository {
  Mono<Client> find(ClientId clientId);

  Mono<Client> saveServiceReview(Client client);

  Mono<Client> saveBookTransactions(Client client);

  Mono<Client> saveBookTransactionStatus(Client client);

  Mono<Client> saveBookReview(Client client);

  Flux<Client> saveBookReview(Iterable<Client> client);

  Mono<Client> saveReservations(Client client);
}
