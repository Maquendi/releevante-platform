package com.releevante.core.application.service;

import com.releevante.core.application.dto.BookDto;
import com.releevante.core.application.dto.TagCreateDto;
import com.releevante.core.domain.Book;
import com.releevante.core.domain.tags.Tag;
import com.releevante.core.domain.tags.TagTypes;
import com.releevante.types.Slid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface BookService {
  Mono<Long> executeLoadBooks();

  Mono<String> executeLoadInventory(Slid slid, String source);

  Flux<Tag> createTags(TagCreateDto dto);

  Flux<Tag> getTags(TagTypes name);

  Mono<Book> saveBook(BookDto book);
}
