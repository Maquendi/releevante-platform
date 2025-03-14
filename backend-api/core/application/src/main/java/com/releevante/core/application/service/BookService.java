package com.releevante.core.application.service;

import com.releevante.core.application.dto.books.BookDto;
import com.releevante.core.application.dto.books.BookRecommendationDto;
import com.releevante.core.application.dto.books.TagCreateDto;
import com.releevante.core.application.dto.clients.reservations.CreateReservationDto;
import com.releevante.core.application.dto.clients.reviews.BookReviewDto;
import com.releevante.core.application.dto.sl.SyncStatus;
import com.releevante.core.domain.*;
import com.releevante.core.domain.tags.TagTypes;
import com.releevante.types.Slid;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.annotation.Nullable;

public interface BookService {
  Mono<Long> executeLoadBooks();

  Mono<Long> executeLoadInventory(Slid slid, String source);

  Flux<Tag> createTags(TagCreateDto dto);

  Flux<Tag> getTags(List<TagTypes> name);

  Mono<Tag> getTag(TagTypes name, String value);

  Flux<Book> getBooks(
      Slid slid, int page, int size, SyncStatus status, boolean includeImages, boolean includeTags);

  Flux<Book> getBooks(int page, int size, boolean includeImages, boolean includeTags);

  Flux<PartialBook> getBooks(@Nullable String orgId);

  Flux<PartialBook> getBooksByOrg();

  Mono<Book> saveBook(BookDto book);

  Mono<BookCategories> getBookCategories(@Nullable String orgId);

  Flux<Book> getBooksBy(String isbn, String translationId);

  Flux<Book> getByTagIdList(List<String> tagIdList);

  Mono<BookRecommendationDto> getBookRecommendation(List<String> userPreferences);

  Flux<Book> getByIsbnList(List<String> isbnList);

  Flux<Book> getByTagValues(List<String> tagNameList);

  Mono<Isbn> rate(BookReviewDto ratingDto);

  Mono<String> reserve(CreateReservationDto reservationDto);
}
