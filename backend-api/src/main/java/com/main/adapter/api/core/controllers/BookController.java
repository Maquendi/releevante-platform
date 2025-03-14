package com.main.adapter.api.core.controllers;

import com.main.adapter.api.response.CustomApiResponse;
import com.main.adapter.api.response.HttpErrorResponse;
import com.releevante.core.application.service.BookService;
import com.releevante.core.domain.Book;
import com.releevante.core.domain.BookCategories;
import com.releevante.core.domain.PartialBook;
import com.releevante.types.exceptions.InvalidInputException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.util.List;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/books")
public class BookController {

  final BookService bookService;

  public BookController(BookService bookService) {
    this.bookService = bookService;
  }

  @PreAuthorize("hasAnyRole('UI-WEB-PUBLIC', 'UI-WEB-ADMIN', 'ADMIN', 'CLIENT')")
  @GetMapping()
  public Mono<CustomApiResponse<Object>> getBooks(
      @RequestParam(required = false) String orgId, @RequestParam(required = false) boolean asMap) {
    if (asMap) {
      return bookService
          .getBooks(orgId)
          .collect(Collectors.toMap(PartialBook::isbn, Function.identity()))
          .map(CustomApiResponse::from);
    }
    return bookService.getBooks(orgId).collectList().map(CustomApiResponse::from);
  }

  @Operation(
      summary = "get books by isbn and translationId",
      description =
          "returns a list of book having the same translationId, aka: books that are translated")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Ok", useReturnTypeSchema = true),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid data supplied",
            content = {
              @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = HttpErrorResponse.class))
            }),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized",
            content = {
              @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = HttpErrorResponse.class))
            }),
        @ApiResponse(
            responseCode = "403",
            description = "Forbidden access",
            content = {
              @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = HttpErrorResponse.class))
            }),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = {
              @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = HttpErrorResponse.class))
            })
      })
  @GetMapping("/{isbn}")
  public Mono<CustomApiResponse<List<Book>>> getBookById(
      @PathVariable(name = "isbn") String isbn,
      @RequestParam("translationId") String translationId) {
    return bookService.getBooksBy(isbn, translationId).collectList().map(CustomApiResponse::from);
  }

  @Operation(
      summary = "get books by isbn's or tag id's or tag values",
      description = "returns a list of books having specified isbn, or tagId, or tagValue")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Ok", useReturnTypeSchema = true),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid data supplied",
            content = {
              @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = HttpErrorResponse.class))
            }),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized",
            content = {
              @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = HttpErrorResponse.class))
            }),
        @ApiResponse(
            responseCode = "403",
            description = "Forbidden access",
            content = {
              @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = HttpErrorResponse.class))
            }),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = {
              @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = HttpErrorResponse.class))
            })
      })
  @GetMapping("/search")
  public Mono<CustomApiResponse<List<Book>>> getBooksByTags(
      @RequestParam(required = false) List<String> isbn,
      @RequestParam(required = false) List<String> tagId,
      @RequestParam(required = false) List<String> tagValue) {

    if (Objects.nonNull(isbn)) {
      return bookService.getByIsbnList(isbn).collectList().map(CustomApiResponse::from);
    } else if (Objects.nonNull(tagId)) {
      return bookService.getByTagIdList(tagId).collectList().map(CustomApiResponse::from);
    } else if (Objects.nonNull(tagValue)) {
      return bookService.getByTagValues(tagValue).collectList().map(CustomApiResponse::from);
    }
    throw new InvalidInputException("One of [isbn, tagId, tagValue] is required");
  }

  @Operation(
      summary = "get books categories",
      description = "get a list of book category in the system db")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Ok", useReturnTypeSchema = true),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid data supplied",
            content = {
              @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = HttpErrorResponse.class))
            }),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized",
            content = {
              @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = HttpErrorResponse.class))
            }),
        @ApiResponse(
            responseCode = "403",
            description = "Forbidden access",
            content = {
              @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = HttpErrorResponse.class))
            }),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = {
              @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = HttpErrorResponse.class))
            })
      })
  @GetMapping("/categories")
  public Mono<CustomApiResponse<BookCategories>> getBookCategories(
      @RequestParam(name = "orgId", required = false) String orgId) {
    return bookService.getBookCategories(orgId).map(CustomApiResponse::from);
  }
}
