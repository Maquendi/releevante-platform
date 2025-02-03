package com.main.adapter.api.core.controllers;

import com.main.adapter.api.response.CustomApiResponse;
import com.main.adapter.api.response.HttpErrorResponse;
import com.releevante.core.application.dto.BookRecommendationDto;
import com.releevante.core.application.dto.SyncStatus;
import com.releevante.core.application.service.BookService;
import com.releevante.core.domain.Book;
import com.releevante.core.domain.BookCategories;
import com.releevante.core.domain.PartialBook;
import com.releevante.types.Slid;
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
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/")
public class BookController {

  final BookService bookService;

  public BookController(BookService bookService) {
    this.bookService = bookService;
  }

  @Operation(summary = "get books by slid", description = "get a list of books in the system db")
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
  @GetMapping("slid/{id}/books")
  public Mono<CustomApiResponse<List<Book>>> getBooksBySlid(
      @PathVariable(name = "id") String slid,
      @RequestParam() int page,
      @RequestParam() int size,
      @RequestParam() boolean includeTags,
      @RequestParam() boolean includeImages,
      @RequestParam(required = false) SyncStatus status) {

    return bookService
        .getBooks(Slid.of(slid), page, size, status, includeImages, includeTags)
        .collectList()
        .map(CustomApiResponse::from);
  }

  @Operation(summary = "get books", description = "get a list of books in the system db")
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
  @GetMapping("books")
  public Mono<CustomApiResponse<List<Book>>> getBooks(
      @RequestParam() int page,
      @RequestParam() int size,
      @RequestParam() boolean includeTags,
      @RequestParam() boolean includeImages) {
    return bookService
        .getBooks(page, size, includeImages, includeTags)
        .collectList()
        .map(CustomApiResponse::from);
  }

  @Operation(summary = "get books by org", description = "get a list of books in the system db")
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
  @GetMapping("org/{id}/books")
  public Mono<CustomApiResponse<Object>> getBooksByOrg(
      @PathVariable(name = "id") String orgId, @RequestParam(required = false) boolean asMap) {

    if (asMap) {
      return bookService
          .getBooksByOrg(orgId)
          .collect(Collectors.toMap(PartialBook::isbn, Function.identity()))
          .map(CustomApiResponse::from);
    }
    return bookService.getBooksByOrg(orgId).collectList().map(CustomApiResponse::from);
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
  @GetMapping("org/{id}/categories")
  public Mono<CustomApiResponse<BookCategories>> getBookCategories(
      @PathVariable(name = "id") String orgId) {
    return bookService.getBookCategories(orgId).map(CustomApiResponse::from);
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
  @GetMapping("books/{isbn}")
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
  @GetMapping("books/search")
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
  @GetMapping("books/recommendation")
  public Mono<CustomApiResponse<BookRecommendationDto>> getBookRecommendations(
      @RequestParam() List<String> preferences) {
    return bookService.getBookRecommendation(preferences).map(CustomApiResponse::from);
  }
}
