package com.main.adapter.api.core.controllers;

import com.main.adapter.api.response.CustomApiResponse;
import com.main.adapter.api.response.HttpErrorResponse;
import com.main.application.core.SmartLibraryServiceFacade;
import com.releevante.core.application.dto.LibrarySyncResponse;
import com.releevante.core.application.dto.SmartLibrarySyncDto;
import com.releevante.types.Slid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/aggregator/{slid}")
public class SmartLibraryController {

  private final SmartLibraryServiceFacade smartLibraryService;

  public SmartLibraryController(SmartLibraryServiceFacade smartLibraryService) {
    this.smartLibraryService = smartLibraryService;
  }

  @Operation(
      summary = "Synchronize clients",
      description = "Synchronizes the given clients from smart library to server")
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
  @PostMapping("/synchronize/clients")
  public Mono<CustomApiResponse<LibrarySyncResponse>> synchronizeClients(
      @RequestBody SmartLibrarySyncDto loanSynchronizeDto) {
    return smartLibraryService.synchronizeClients(loanSynchronizeDto).map(CustomApiResponse::from);
  }

  @Operation(
      summary = "Synchronize books, images, etc",
      description = "retrieve all book copies and their images that belongs to the given library")
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
  @GetMapping("/synchronize/books")
  public Mono<CustomApiResponse<LibrarySyncResponse>> synchronizeLibraryBooks(
      @PathVariable String slid, @RequestParam() int page) {
    return smartLibraryService.synchronizeLibrary(Slid.of(slid), page).map(CustomApiResponse::from);
  }

  @Operation(
      summary = "Synchronize settings",
      description = "retrieve settings that belongs to the given library")
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
  @GetMapping("/synchronize/settings")
  public Mono<CustomApiResponse<LibrarySyncResponse>> synchronizeLibrarySettings(
      @PathVariable String slid) {
    return smartLibraryService
        .synchronizeLibrarySettings(Slid.of(slid))
        .map(CustomApiResponse::from);
  }
}
