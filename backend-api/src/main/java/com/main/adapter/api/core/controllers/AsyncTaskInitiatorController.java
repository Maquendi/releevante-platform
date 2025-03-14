package com.main.adapter.api.core.controllers;

import com.main.adapter.api.response.CustomApiResponse;
import com.main.adapter.api.response.HttpErrorResponse;
import com.releevante.core.application.service.BookService;
import com.releevante.core.application.service.TaskExecutionService;
import com.releevante.types.SequentialGenerator;
import com.releevante.types.Slid;
import com.releevante.types.UuidGenerator;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@RestController
@RequestMapping("/task")
public class AsyncTaskInitiatorController {
  final BookService bookService;

  final TaskExecutionService taskExecutionService;

  final SequentialGenerator<String> uuidGenerator = UuidGenerator.instance();

  public AsyncTaskInitiatorController(
      BookService bookService, TaskExecutionService taskExecutionService) {
    this.bookService = bookService;
    this.taskExecutionService = taskExecutionService;
  }

  @Operation(
      summary = "register books from a google sheet",
      description = "download books from google sheet and register into database")
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
  @PreAuthorize("hasRole('SYSADMIN')")
  @PostMapping("/register-books")
  public Mono<CustomApiResponse<String>> startRegisterBooksTask() {

    var taskId = uuidGenerator.next();
    taskExecutionService
        .execute(taskId, "register-books", bookService.executeLoadBooks())
        .subscribeOn(Schedulers.boundedElastic())
        .subscribe();

    return Mono.just(CustomApiResponse.from(taskId));
  }

  @Operation(
      summary = "register books from inventory a google sheet",
      description =
          "download book inventory from google sheet and register into database under given slid")
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
  @PreAuthorize("hasRole('SYSADMIN')")
  @PostMapping("/register-books-inventory/{slid}")
  public Mono<CustomApiResponse<String>> registerLibraryInventory(
      @PathVariable String slid, @RequestParam() String source) {
    var taskId = uuidGenerator.next();
    taskExecutionService
        .execute(
            taskId,
            "register-books-inventory",
            bookService.executeLoadInventory(Slid.of(slid), source))
        .subscribeOn(Schedulers.boundedElastic())
        .subscribe();
    return Mono.just(CustomApiResponse.from(taskId));
  }
}
