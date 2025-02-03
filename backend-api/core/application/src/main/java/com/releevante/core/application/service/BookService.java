package com.releevante.core.application.service;

import com.releevante.core.application.dto.BookDto;
import com.releevante.core.application.dto.BookRecommendationDto;
import com.releevante.core.application.dto.SyncStatus;
import com.releevante.core.application.dto.TagCreateDto;
import com.releevante.core.domain.Book;
import com.releevante.core.domain.BookCategories;
import com.releevante.core.domain.PartialBook;
import com.releevante.core.domain.Tag;
import com.releevante.core.domain.tags.TagTypes;
import com.releevante.types.Slid;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface BookService {
  Mono<Long> executeLoadBooks();

  Mono<Long> executeLoadInventory(Slid slid, String source);

  Flux<Tag> createTags(TagCreateDto dto);

  Flux<Tag> getTags(TagTypes name);

  Flux<Book> getBooks(
      Slid slid, int page, int size, SyncStatus status, boolean includeImages, boolean includeTags);

  Flux<Book> getBooks(int page, int size, boolean includeImages, boolean includeTags);

  Flux<PartialBook> getBooksByOrg(String orgId);

  Mono<Book> saveBook(BookDto book);

  Mono<BookCategories> getBookCategories(String slid);

  Flux<Book> getBooksBy(String isbn, String translationId);

  Flux<Book> getByTagIdList(List<String> tagIdList);

  Mono<BookRecommendationDto> getBookRecommendation(List<String> userPreferences);

  Flux<Book> getByIsbnList(List<String> isbnList);

  Flux<Book> getByTagValues(List<String> tagNameList);
}
