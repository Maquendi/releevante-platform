package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.ClientHibernateDao;
import com.releevante.core.domain.Client;
import com.releevante.core.domain.ClientId;
import com.releevante.core.domain.repository.CartRepository;
import com.releevante.core.domain.repository.LibraryClientRepository;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class ClientRepositoryImpl implements LibraryClientRepository {

  final ClientHibernateDao clientHibernateDao;

  final CartRepository cartRepository;

  public ClientRepositoryImpl(
      ClientHibernateDao clientHibernateDao, CartRepository cartRepository) {
    this.clientHibernateDao = clientHibernateDao;
    this.cartRepository = cartRepository;
  }

  @Override
  public Mono<Client> find(ClientId clientId) {
    //    return Mono.justOrEmpty(clientHibernateDao.findById(clientId.value()))
    //            .map(data -> data.toDomain());

    return null;
  }
}
