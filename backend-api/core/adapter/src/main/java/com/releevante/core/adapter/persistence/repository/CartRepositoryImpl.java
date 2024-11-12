package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.CartHibernateDao;
import com.releevante.core.adapter.persistence.dao.CartItemHibernateDao;
import com.releevante.core.domain.Cart;
import com.releevante.core.domain.repository.CartRepository;
import com.releevante.types.UserId;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

@Component
public class CartRepositoryImpl implements CartRepository {

  final CartHibernateDao cartHibernateDao;
  final CartItemHibernateDao cartItemHibernateDao;

  public CartRepositoryImpl(
      CartHibernateDao cartHibernateDao, CartItemHibernateDao cartItemHibernateDao) {
    this.cartHibernateDao = cartHibernateDao;
    this.cartItemHibernateDao = cartItemHibernateDao;
  }

  @Override
  public Flux<Cart> getByUser(UserId user) {

    cartHibernateDao.findById(user.value());

    return null;
  }
}
