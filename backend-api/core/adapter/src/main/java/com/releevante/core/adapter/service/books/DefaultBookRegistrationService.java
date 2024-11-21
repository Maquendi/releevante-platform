package com.releevante.core.adapter.service.books;

import com.releevante.core.adapter.service.google.BookGSheetUtils;
import com.releevante.core.adapter.service.google.GoogleSpreadSheetService;
import com.releevante.core.application.service.BookRegistrationService;
import com.releevante.core.domain.Book;
import com.releevante.core.domain.BookImage;
import com.releevante.core.domain.Isbn;
import com.releevante.types.SequentialGenerator;
import com.releevante.types.UuidGenerator;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class DefaultBookRegistrationService implements BookRegistrationService {

  private static final String SPREADSHEET_ID = "1JX5MFqjtIs5pJbYIHtADGR27z-X9Tiv2LOb-d_SBjFs";
  private static final String RANGE = "BOOK_INVENTORY!A2:G";
  private final SequentialGenerator<String> uuidGenerator = UuidGenerator.instance();
  private static final String IMAGE_URL_SEPARATOR = ",";
  private final GoogleSpreadSheetService googleSpreadSheetService;

  public DefaultBookRegistrationService(GoogleSpreadSheetService googleSpreadSheetService) {
    this.googleSpreadSheetService = googleSpreadSheetService;
  }

  @Override
  public Flux<Book> getBooks() {
    return googleSpreadSheetService
        .readFrom(SPREADSHEET_ID, RANGE, Function.identity())
        .flatMap(this::processRow);
  }

  Mono<Book> processRow(List<Object> row) {
    return Mono.fromCallable(
        () -> {
          var bookId =
              Optional.of(row.get(BookGSheetUtils.BOOK_ID).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .orElseThrow(() -> new RuntimeException("BOOK_ID REQUIRED"));

          var title =
              Optional.of(row.get(BookGSheetUtils.BOOK_TITLE).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .orElseThrow(() -> new RuntimeException("BOOK_TITLE REQUIRED"));

          var qty =
              Optional.of(row.get(BookGSheetUtils.BOOK_QTY).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .map(Integer::valueOf)
                  .orElseThrow(() -> new RuntimeException("BOOK_QTY REQUIRED"));

          var price =
              Optional.of(row.get(BookGSheetUtils.BOOK_PRICE).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .map(BigDecimal::new)
                  .orElseThrow(() -> new RuntimeException("BOOK_PRICE REQUIRED"));

          var author =
              Optional.of(row.get(BookGSheetUtils.BOOK_AUTHOR).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .orElseThrow(() -> new RuntimeException("BOOK_AUTHOR REQUIRED"));

          var description =
              Optional.of(row.get(BookGSheetUtils.BOOK_DESCRIPTION).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .orElseThrow(() -> new RuntimeException("BOOK_DESCRIPTION REQUIRED"));

          var bookImages =
              Optional.of(row.get(BookGSheetUtils.BOOK_IMAGES_URL).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .map(url -> url.split(IMAGE_URL_SEPARATOR))
                  .map(Arrays::asList)
                  .map(urls -> imageFrom(urls, bookId))
                  .orElseThrow(() -> new RuntimeException("BOOK_IMAGES_URL REQUIRED"));

          return Book.builder()
              .isbn(Isbn.of(bookId))
              .title(title)
              .description(description)
              .price(price)
              .author(author)
              .qty(qty)
              .images(bookImages)
              .build();
        });
  }

  private List<BookImage> imageFrom(List<String> imageUrls, String bookId) {
    return imageUrls.stream()
        .map(
            url ->
                BookImage.builder()
                    .id(uuidGenerator.next())
                    .url(url)
                    .isbn(bookId)
                    .sourceUrl(url)
                    .build())
        .collect(Collectors.toList());
  }
}
