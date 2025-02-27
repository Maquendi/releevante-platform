package com.releevante.core.domain.repository;

import com.releevante.core.domain.BookCategories;
import com.releevante.core.domain.Isbn;
import com.releevante.core.domain.Tag;
import com.releevante.core.domain.tags.TagTypes;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.annotation.Nullable;

public interface BookTagRepository {
  Mono<Tag> create(Tag tag);

  Flux<Tag> create(List<Tag> tags);

  Flux<Tag> get(List<TagTypes> name);

  Mono<Tag> get(TagTypes name, String value);

  Flux<Tag> getTags(Isbn isbn);

  Mono<BookCategories> getBookCategories(@Nullable String orgId);
}
