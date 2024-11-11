package com.releevante.core.domain.repository;

import com.releevante.core.domain.Client;
import com.releevante.core.domain.ClientId;
import reactor.core.publisher.Mono;

public interface ClientRepository {
  Mono<Client> find(ClientId clientId);

  Mono<Client> saveServiceRating(Client client);

  Mono<Client> saveBookLoan(Client client);

  Mono<Client> saveBookRating(Client client);

  Mono<Client> savePurchase(Client client);

  Mono<Client> saveReservations(Client client);

  Mono<Client> saveCarts(Client client);
}
