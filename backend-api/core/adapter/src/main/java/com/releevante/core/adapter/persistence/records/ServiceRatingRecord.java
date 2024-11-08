package com.releevante.core.adapter.persistence.records;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "book_ratings", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class BookRatingRecord {
    private String id;
    private String userId;
    private String bookId;
    private String rating;
}
