package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.BookTagHibernateDao;
import com.releevante.core.adapter.persistence.dao.TagHibernateDao;
import com.releevante.core.adapter.persistence.records.TagRecord;
import com.releevante.core.domain.repository.BookTagRepository;
import com.releevante.core.domain.tags.Tag;
import com.releevante.core.domain.tags.TagTypes;
import com.releevante.types.SequentialGenerator;
import com.releevante.types.UuidGenerator;
import com.releevante.types.ZonedDateTimeGenerator;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class BookTagRepositoryImpl implements BookTagRepository {

  final TagHibernateDao tagHibernateDao;

  final BookTagHibernateDao bookTagHibernateDao;

  final SequentialGenerator<String> uuidGenerator = UuidGenerator.instance();
  final SequentialGenerator<ZonedDateTime> dateTimeGenerator = ZonedDateTimeGenerator.instance();

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
}
