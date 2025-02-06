package com.releevante.core.adapter.service.books;

import com.releevante.core.adapter.service.google.BookGSheetUtils;
import com.releevante.core.adapter.service.google.GoogleSpreadSheetService;
import com.releevante.core.adapter.service.google.LibraryInventoryGSheetUtils;
import com.releevante.core.application.dto.LibraryInventoryDto;
import com.releevante.core.application.service.BookRegistrationService;
import com.releevante.core.domain.*;
import com.releevante.core.domain.tags.TagTypes;
import com.releevante.types.SequentialGenerator;
import com.releevante.types.UuidGenerator;
import com.releevante.types.ZonedDateTimeGenerator;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class DefaultBookRegistrationService implements BookRegistrationService {

  private static final String SPREADSHEET_ID = "1JX5MFqjtIs5pJbYIHtADGR27z-X9Tiv2LOb-d_SBjFs";
  private static final String MAIN_BOOK_INVENTORY_RANGE = "BOOK_INVENTORY!A2:X";
  private static final String LIBRARY_INVENTORY_RANGE = "A2:C";
  private final SequentialGenerator<String> uuidGenerator = UuidGenerator.instance();

  private final SequentialGenerator<ZonedDateTime> dateTimeGenerator =
      ZonedDateTimeGenerator.instance();
  private static final String COMMA_SEPARATOR = ",";
  private final GoogleSpreadSheetService googleSpreadSheetService;

  public DefaultBookRegistrationService(GoogleSpreadSheetService googleSpreadSheetService) {
    this.googleSpreadSheetService = googleSpreadSheetService;
  }

  @Override
  public Flux<Book> getBookInventory() {
    return googleSpreadSheetService
        .readFrom(SPREADSHEET_ID, MAIN_BOOK_INVENTORY_RANGE, Function.identity())
        .flatMap(this::processBookInventory);
  }

  @Override
  public Flux<LibraryInventoryDto> getLibraryInventory(String source) {
    return Mono.just(String.format("%s!%s", source, LIBRARY_INVENTORY_RANGE))
        .flatMapMany(
            range -> googleSpreadSheetService.readFrom(SPREADSHEET_ID, range, Function.identity()))
        .flatMap(this::processLibraryInventory);
  }

  Mono<LibraryInventoryDto> processLibraryInventory(List<Object> row) {
    return Mono.fromCallable(
        () -> {
          var bookId =
              Optional.of(row.get(LibraryInventoryGSheetUtils.BOOK_ID).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .orElseThrow(() -> new RuntimeException("BOOK_ID REQUIRED"));

          var title =
              Optional.of(row.get(LibraryInventoryGSheetUtils.BOOK_TITLE).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .orElseThrow(() -> new RuntimeException("BOOK_TITLE REQUIRED"));

          var qty =
              Optional.of(row.get(LibraryInventoryGSheetUtils.QTY).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .map(Integer::valueOf)
                  .orElseThrow(() -> new RuntimeException("BOOK_QTY REQUIRED"));

          return LibraryInventoryDto.builder().bookId(bookId).qty(qty).title(title).build();
        });
  }

  Mono<Book> processBookInventory(List<Object> row) {
    return Mono.fromCallable(
        () -> {
          var bookId =
              Optional.of(row.get(BookGSheetUtils.BOOK_ID).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .orElseThrow(() -> new RuntimeException("BOOK_ID REQUIRED"));

          var correlationId =
              Optional.of(row.get(BookGSheetUtils.CORRELATION_ID).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .orElseThrow(() -> new RuntimeException("CORRELATION_ID REQUIRED"));

          var translationId =
              Optional.of(row.get(BookGSheetUtils.TRANSLATION_ID).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .orElseThrow(() -> new RuntimeException("TRANSLATION_ID REQUIRED"));

          var language =
              Optional.of(row.get(BookGSheetUtils.BOOK_LANG).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .orElseThrow(() -> new RuntimeException("BOOK_LANGUAGE REQUIRED"));

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

          var descriptionEnglish =
              Optional.of(row.get(BookGSheetUtils.BOOK_DESCRIPTION_EN).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .orElseThrow(() -> new RuntimeException("BOOK_DESCRIPTION_EN REQUIRED"));

          var descriptionFrench =
              Optional.of(row.get(BookGSheetUtils.BOOK_DESCRIPTION_FR).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .orElseThrow(() -> new RuntimeException("BOOK_DESCRIPTION_FR REQUIRED"));

          var descriptionSpanish =
              Optional.of(row.get(BookGSheetUtils.BOOK_DESCRIPTION_SP).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .orElseThrow(() -> new RuntimeException("BOOK_DESCRIPTION_SP REQUIRED"));

          var imageUrls = new ArrayList<String>(3);

          var bookImage1 =
              Optional.of(row.get(BookGSheetUtils.BOOK_IMAGE_1).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .orElseThrow(() -> new RuntimeException("BOOK_IMAGE_1 REQUIRED"));

          imageUrls.add(bookImage1);

          try {
            Optional.of(row.get(BookGSheetUtils.BOOK_IMAGE_2).toString().strip())
                .filter(Predicate.not(String::isEmpty))
                .ifPresent(imageUrls::add);

            Optional.of(row.get(BookGSheetUtils.BOOK_IMAGE_3).toString().strip())
                .filter(Predicate.not(String::isEmpty))
                .ifPresent(imageUrls::add);
          } catch (Exception ignored) {
          }

          var bookImages = imageFrom(imageUrls, bookId);

          var categories =
              Optional.of(row.get(BookGSheetUtils.BOOK_CATEGORIES).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .map(keywords -> keywords.split(COMMA_SEPARATOR))
                  .map(Stream::of)
                  .map(
                      stream ->
                          stream
                              .map(String::strip)
                              .map(keyword -> buildTag(TagTypes.category, keyword))
                              .collect(Collectors.toList()))
                  .orElseThrow(() -> new RuntimeException("BOOK_CATEGORIES REQUIRED"));

          var subCategories =
              Optional.of(row.get(BookGSheetUtils.BOOK_SUB_CATEGORIES).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .map(keywords -> keywords.split(COMMA_SEPARATOR))
                  .map(Stream::of)
                  .map(
                      stream ->
                          stream
                              .map(String::strip)
                              .map(keyword -> buildTag(TagTypes.subcategory, keyword))
                              .collect(Collectors.toList()))
                  .orElseThrow(() -> new RuntimeException("BOOK_SUB_CATEGORIES REQUIRED"));

          var keyWords =
              Optional.of(row.get(BookGSheetUtils.BOOK_KEY_WORDS).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .map(keywords -> keywords.split(COMMA_SEPARATOR))
                  .map(Stream::of)
                  .map(
                      stream ->
                          stream
                              .map(String::strip)
                              .map(keyword -> buildTag(TagTypes.keyword, keyword))
                              .collect(Collectors.toList()))
                  .orElse(Collections.emptyList());

          var moodTags =
              Optional.of(row.get(BookGSheetUtils.BOOK_MOOD).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .map(keywords -> keywords.split(COMMA_SEPARATOR))
                  .map(Stream::of)
                  .map(
                      stream ->
                          stream
                              .map(String::strip)
                              .map(value -> value.replace(".", ","))
                              .map(tag -> buildTag(TagTypes.mood, tag))
                              .collect(Collectors.toList()))
                  .orElse(Collections.emptyList());

          var flavorTags =
              Optional.of(row.get(BookGSheetUtils.BOOK_FLAVOR).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .map(keywords -> keywords.split(COMMA_SEPARATOR))
                  .map(Stream::of)
                  .map(
                      stream ->
                          stream
                              .map(String::strip)
                              .map(value -> value.replace(".", ","))
                              .map(tag -> buildTag(TagTypes.flavor, tag))
                              .collect(Collectors.toList()))
                  .orElse(Collections.emptyList());

          var readingVibeTags =
              Optional.of(row.get(BookGSheetUtils.BOOK_READING_VIBE).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .map(keywords -> keywords.split(COMMA_SEPARATOR))
                  .map(Stream::of)
                  .map(
                      stream ->
                          stream
                              .map(String::strip)
                              .map(value -> value.replace(".", ","))
                              .map(tag -> buildTag(TagTypes.vibe, tag))
                              .collect(Collectors.toList()))
                  .orElse(Collections.emptyList());

          var printLength =
              Optional.of(row.get(BookGSheetUtils.BOOK_PRINT_LENGTH).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .map(Integer::valueOf)
                  .orElseThrow(() -> new RuntimeException("BOOK_PRINT_LENGTH REQUIRED"));

          var publishDate =
              Optional.of(row.get(BookGSheetUtils.BOOK_PUBLICATION_DATE).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .map(LocalDate::parse)
                  .orElseThrow(() -> new RuntimeException("BOOK_PUBLICATION_DATE REQUIRED"));

          var dimensions =
              Optional.of(row.get(BookGSheetUtils.BOOK_DIMENSIONS).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .orElseThrow(() -> new RuntimeException("BOOK_DIMENSIONS REQUIRED"));

          var publisher =
              Optional.of(row.get(BookGSheetUtils.BOOK_PUBLISHER).toString().strip())
                  .filter(Predicate.not(String::isEmpty))
                  .orElseThrow(() -> new RuntimeException("BOOK_PUBLISHER REQUIRED"));

          var publicIsbn =
              Optional.of(row.get(BookGSheetUtils.BOOK_PUBLIC_ISBN).toString().strip())
                  .filter(Predicate.not(String::isEmpty));

          var bindingType =
              Optional.of(row.get(BookGSheetUtils.BOOK_BINDING_TYPE).toString().strip())
                  .filter(Predicate.not(String::isEmpty));

          var createdAt = ZonedDateTimeGenerator.instance().next();

          var bookTags = new ArrayList<>(categories);
          bookTags.addAll(subCategories);
          bookTags.addAll(readingVibeTags);
          bookTags.addAll(moodTags);
          bookTags.addAll(keyWords);
          bookTags.addAll(flavorTags);

          return Book.builder()
              .isbn(Isbn.of(bookId))
              .title(title)
              .description(
                  BookDescription.builder()
                      .en(descriptionEnglish)
                      .fr(descriptionFrench)
                      .es(descriptionSpanish)
                      .build())
              .price(price)
              .author(author)
              .qty(qty)
              .images(bookImages)
              .createdAt(createdAt)
              .updatedAt(createdAt)
              .correlationId(correlationId)
              .translationId(translationId)
              .qtyForSale(0)
              .language(language)
              .publishDate(publishDate)
              .publisher(publisher)
              .printLength(printLength)
              .dimensions(dimensions)
              .publicIsbn(publicIsbn)
              .bindingType(bindingType)
              .rating(0f)
              .votes(0)
              .tags(bookTags)
              .build();
        });
  }

  private Tag buildTag(TagTypes name, String value) {
    return Tag.builder()
        .name(name.name())
        .value(TagValue.builder().es(value).fr(value).es(value).build())
        .id(uuidGenerator.next())
        .createdAt(dateTimeGenerator.next())
        .build();
  }

  private List<BookImage> imageFrom(List<String> imageUrls, String bookId) {
    return imageUrls.stream()
        .map(String::trim)
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
