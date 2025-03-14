package com.releevante.core.adapter.persistence.repository;

import static java.util.stream.Collectors.*;

import com.releevante.core.adapter.persistence.dao.BookTagHibernateDao;
import com.releevante.core.adapter.persistence.dao.TagHibernateDao;
import com.releevante.core.adapter.persistence.dao.projections.BookCategoryProjection;
import com.releevante.core.adapter.persistence.records.TagRecord;
import com.releevante.core.domain.*;
import com.releevante.core.domain.repository.BookTagRepository;
import com.releevante.core.domain.tags.TagTypes;
import java.util.*;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import javax.annotation.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class BookTagRepositoryImpl implements BookTagRepository {
  final TagHibernateDao tagHibernateDao;
  final BookTagHibernateDao bookTagHibernateDao;
  static final String categoryAllEnglish = "All";
  static final String categoryAllFrench = "Tous";
  static final String categoryAllSpanish = "Todas";

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
  public Flux<Tag> get(List<TagTypes> names) {
    return tagHibernateDao
        .findAllByNameIn(names.stream().map(Enum::name).collect(toSet()))
        .map(TagRecord::toDomain);
  }

  @Override
  public Mono<Tag> get(TagTypes name, String value) {
    return tagHibernateDao.findFirstByValueIgnoreCase(value).map(TagRecord::toDomain);
  }

  @Override
  public Flux<Tag> getTags(Isbn isbn) {
    return tagHibernateDao
        .findByIsbn(isbn.value())
        .map(
            projection ->
                Tag.builder()
                    .id(projection.getId())
                    .isbn(isbn.value())
                    .bookTagId(projection.getBookTagId())
                    .name(projection.getName())
                    .value(
                        TagValue.builder()
                            .en(projection.getValueEn())
                            .fr(Optional.ofNullable(projection.getValueFr()))
                            .es(Optional.ofNullable(projection.getValueSp()))
                            .build())
                    .createdAt(projection.getCreatedAt())
                    .build());
  }

  @Override
  public Mono<BookCategories> getBookCategories(@Nullable String orgId) {
    return Mono.justOrEmpty(orgId)
        .flatMapMany(tagHibernateDao::findBookCategories)
        .collectList()
        .filter(Predicate.not(List::isEmpty))
        .switchIfEmpty(Flux.defer(tagHibernateDao::findBookCategories).collectList())
        .map(
            projections -> {
              var categories =
                  projections.stream()
                      .filter(p -> p.getName().equals("category"))
                      .collect(
                          groupingBy(
                              Function.identity(),
                              mapping(BookCategoryProjection::getIsbn, toSet())));

              var subCategories =
                  projections.stream()
                      .filter(p -> p.getName().equals("subcategory"))
                      .collect(
                          groupingBy(
                              Function.identity(),
                              mapping(BookCategoryProjection::getIsbn, toSet())));

              var allCategory =
                  Category.builder()
                      .id(categoryAllEnglish)
                      .es(categoryAllSpanish)
                      .en(categoryAllEnglish)
                      .fr(categoryAllFrench)
                      .subCategoryRelations(
                          subCategories.entrySet().stream()
                              .map(
                                  entry -> {
                                    var subCategoryId = entry.getKey();
                                    var books = entry.getValue();
                                    return SubCategoryRelation.builder()
                                        .id(subCategoryId.getTagId())
                                        .bookRelations(books)
                                        .build();
                                  })
                              .toList())
                      .build();

              var bookCategories = new ArrayList<Category>();
              bookCategories.add(allCategory);
              categories.forEach(
                  (projection, bookCategorySet) -> {
                    var subCategoryRelationStream =
                        subCategories.entrySet().stream()
                            .map(
                                (subCategoryEntry) -> {
                                  var subCategory = subCategoryEntry.getKey();
                                  var bookSubCategorySet =
                                      new HashSet<>(subCategoryEntry.getValue());
                                  bookSubCategorySet.retainAll(bookCategorySet);
                                  return SubCategoryRelation.builder()
                                      .id(subCategory.getTagId())
                                      .bookRelations(bookSubCategorySet)
                                      .build();
                                })
                            .filter(Predicate.not(relation -> relation.bookRelations().isEmpty()));

                    bookCategories.add(
                        Category.builder()
                            .id(projection.getTagId())
                            .es(projection.getValueSp())
                            .en(projection.getValueEn())
                            .fr(projection.getValueFr())
                            .subCategoryRelations(subCategoryRelationStream.toList())
                            .build());
                  });

              var subCategoryMap =
                  subCategories.keySet().stream()
                      .map(
                          projection ->
                              SubCategory.builder()
                                  .id(projection.getTagId())
                                  .en(projection.getValueEn())
                                  .fr(projection.getValueFr())
                                  .es(projection.getValueSp())
                                  .build())
                      .collect(Collectors.toMap(SubCategory::id, Function.identity()));

              return BookCategories.builder()
                  .categories(bookCategories)
                  .subCategoryMap(subCategoryMap)
                  .build();
            });
  }
}
