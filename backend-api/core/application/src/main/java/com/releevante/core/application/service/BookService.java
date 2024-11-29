package com.releevante.core.application.service;

import com.releevante.core.application.dto.BookDto;
import com.releevante.core.application.dto.SyncStatus;
import com.releevante.core.application.dto.TagCreateDto;
import com.releevante.core.domain.Book;
import com.releevante.core.domain.Tag;
import com.releevante.core.domain.tags.TagTypes;
import com.releevante.types.Slid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface BookService {
  Mono<Long> executeLoadBooks();

  Mono<Long> executeLoadInventory(Slid slid, String source);

  Flux<Tag> createTags(TagCreateDto dto);

  Flux<Book> getBooks(
      Slid slid, int page, int size, SyncStatus status, boolean includeImages, boolean includeTags);

  Flux<Book> getBooks(int page, int size, boolean includeImages, boolean includeTags);

  Flux<Tag> getTags(TagTypes name);

  Mono<Book> saveBook(BookDto book);
}
