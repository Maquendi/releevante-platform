package com.releevante.core.application.dto.books;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.time.LocalDate;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookDtoV2.class)
@JsonSerialize(as = BookDtoV2.class)
@ImmutableExt
public abstract class AbstractBookDtoV2 {
  /** Random UUID used as book identifier */
  abstract String isbn();

  /** The book title */
  abstract String title();

  /** The author name */
  abstract String author();

  /** Random publisher name */
  abstract String publisher();

  /** Random date between 2020 and 2025 */
  abstract LocalDate publishedDate();

  /** The book description or random book description */
  abstract String description();

  /** The book language */
  abstract String language();

  /** Random price between 10 and 100 */
  abstract Double price();

  /** Random stock quantity between 10 and 100 */
  abstract Integer stock();

  /** Random image URL */
  abstract String image();

  /** Book categorization tags */
  abstract List<BookTag> tags();

  /** Random binding type */
  abstract String bindingType();

  /** Random UUID for public reference */
  abstract String publicIsbn();

  /** Random page count between 100 and 1000 */
  abstract Integer printLength();

  /** Book publish date */
  abstract LocalDate publishDate();

  /** Book dimensions (e.g., 10x10x10) */
  abstract String dimensions();

  /** Random quantity between 10 and 100 */
  abstract Integer qty();

  public interface BookTag {
    /** Tag type: either 'category' or 'subCategory' */
    String name();

    /**
     * Tag value: e.g., fiction, non-fiction for category, or bestseller, new release, top rated for
     * subCategory
     */
    String value();
  }
}
