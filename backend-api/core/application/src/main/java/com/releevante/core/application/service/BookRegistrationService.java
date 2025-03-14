package com.releevante.core.application.service;

import com.releevante.core.application.dto.sl.LibraryInventoryDto;
import com.releevante.core.domain.Book;
import reactor.core.publisher.Flux;

public interface BookRegistrationService {
  Flux<Book> getBookInventory();

  Flux<LibraryInventoryDto> getLibraryInventory(String tab);
}
