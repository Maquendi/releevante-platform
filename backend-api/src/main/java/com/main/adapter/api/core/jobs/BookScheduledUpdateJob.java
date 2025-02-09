package com.main.adapter.api.core.jobs;

import com.releevante.core.domain.repository.SmartLibraryInventoryRepository;
import com.releevante.core.domain.repository.ratings.BookRatingRepository;
import reactor.core.publisher.Mono;

public class BookScheduledUpdateJob {
  final BookRatingRepository bookRatingRepository;
  final SmartLibraryInventoryRepository smartLibraryInventoryRepository;

  public BookScheduledUpdateJob(
      BookRatingRepository bookRatingRepository,
      SmartLibraryInventoryRepository smartLibraryInventoryRepository) {
    this.bookRatingRepository = bookRatingRepository;
    this.smartLibraryInventoryRepository = smartLibraryInventoryRepository;
  }

  public Mono<Void> bookRatingScheduledUpdater() {
    return bookRatingRepository.updateBookRatingUnSynced();
  }

  public Mono<Void> bookInventoryScheduledUpdater() {
    return this.smartLibraryInventoryRepository.updateLibraryInventories();
  }
}
