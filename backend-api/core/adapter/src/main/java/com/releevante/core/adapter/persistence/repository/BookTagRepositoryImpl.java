package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.BookTagHibernateDao;
import com.releevante.core.adapter.persistence.dao.TagHibernateDao;
import com.releevante.core.adapter.persistence.records.TagRecord;
import com.releevante.core.domain.Isbn;
import com.releevante.core.domain.Tag;
import com.releevante.core.domain.repository.BookTagRepository;
import com.releevante.core.domain.tags.TagTypes;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class BookTagRepositoryImpl implements BookTagRepository {

  final TagHibernateDao tagHibernateDao;

  final BookTagHibernateDao bookTagHibernateDao;

  public BookTagRepositoryImpl(
      TagHibernateDao tagHibernateDao, BookTagHibernateDao bookTagHibernateDao) {
    this.tagHibernateDao = tagHibernateDao;
    this.bookTagHibernateDao = bookTagHibernateDao;
  }

  @Override
  public Mono<Tag> create(Tag tag) {
    return tagHibernateDao.save(TagRecord.from(tag)).thenReturn(tag);
  }

  @Transactional
  @Override
  public Flux<Tag> create(List<Tag> tags) {
    return tagHibernateDao
        .saveAll(tags.stream().map(TagRecord::from).collect(Collectors.toList()))
        .thenMany(Flux.fromIterable(tags));
  }

  @Override
  public Flux<Tag> get(TagTypes name) {
    return tagHibernateDao.findAllByName(name.name()).map(TagRecord::toDomain);
  }

  @Override
  public Flux<Tag> getTags(Isbn isbn) {
    return tagHibernateDao
        .findByIsbn(isbn.value())
        .map(
            projection ->
                Tag.builder()
                    .id(projection.getId())
                    .name(projection.getName())
                    .value(projection.getValueEn())
                    .valueFr(Optional.ofNullable(projection.getValueFr()))
                    .valueSp(Optional.ofNullable(projection.getValueSp()))
                    .createdAt(projection.getCreatedAt())
                    .build());
  }
}
