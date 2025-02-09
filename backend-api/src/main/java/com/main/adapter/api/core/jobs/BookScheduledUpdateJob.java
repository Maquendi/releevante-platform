package com.main.adapter.api.core.jobs;

import com.releevante.core.domain.repository.BookRepository;
import com.releevante.core.domain.repository.BookTransactionRepository;
import com.releevante.core.domain.repository.SmartLibraryInventoryRepository;
import com.releevante.core.domain.repository.ratings.BookRatingRepository;
import reactor.core.publisher.Mono;

public class BookScheduledUpdateJob {
  final BookRepository bookRepository;
  final BookTransactionRepository bookLoanRepository;
  final BookRatingRepository bookRatingRepository;
  final SmartLibraryInventoryRepository smartLibraryInventoryRepository;

  public BookScheduledUpdateJob(
      BookRepository bookRepository,
      BookTransactionRepository bookLoanRepository,
      BookRatingRepository bookRatingRepository,
      SmartLibraryInventoryRepository smartLibraryInventoryRepository) {
    this.bookRepository = bookRepository;
    this.bookLoanRepository = bookLoanRepository;
    this.bookRatingRepository = bookRatingRepository;
    this.smartLibraryInventoryRepository = smartLibraryInventoryRepository;
  }

  Mono<Void> bookRatingScheduledUpdater() {
    return bookRatingRepository.updateBookRatingUnSynced();
  }

  Mono<Void> bookInventoryScheduledUpdater() {
    return this.smartLibraryInventoryRepository.updateLibraryInventory().then();
  }
}
