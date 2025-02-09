package com.main.adapter.api.core.jobs;

import static java.util.stream.Collectors.groupingBy;

import com.releevante.core.domain.BookRating;
import com.releevante.core.domain.repository.BookLoanRepository;
import com.releevante.core.domain.repository.BookRepository;
import com.releevante.core.domain.repository.ratings.BookRatingRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class BookScheduledUpdateJob {

  final BookRepository bookRepository;

  final BookLoanRepository bookLoanRepository;

  final BookRatingRepository bookRatingRepository;

  public BookScheduledUpdateJob(
      BookRepository bookRepository,
      BookLoanRepository bookLoanRepository,
      BookRatingRepository bookRatingRepository) {
    this.bookRepository = bookRepository;
    this.bookLoanRepository = bookLoanRepository;
    this.bookRatingRepository = bookRatingRepository;
  }

  Mono<Void> bookScheduledUpdater() {
    return bookRatingRepository
        .getByAllUnSynchronized()
        .collectList()
        .flatMapMany(
            ratings ->
                Flux.fromStream(
                        ratings.stream().collect(groupingBy(BookRating::isbn)).entrySet().stream())
                    .flatMap(
                        entry -> {
                          var isbn = entry.getKey();
                          return bookRepository
                              .findByIsbn(isbn)
                              .map(
                                  book -> {
                                    var currentRating = book.rating();
                                    var voteCounts = entry.getValue().size();
                                    var voteCountSum = book.votes() + voteCounts;
                                    var ratingSum =
                                        entry.getValue().stream()
                                            .map(BookRating::rating)
                                            .reduce(Integer::sum)
                                            .map(intValue -> (float) intValue)
                                            .orElse(0f);
                                    var newRating = ((ratingSum / voteCounts) + currentRating) / 2;
                                    return book.withRating(newRating).withVotes(voteCountSum);
                                  });
                        }))
        .flatMap(bookRepository::updateRating)
        .then();
  }
}
