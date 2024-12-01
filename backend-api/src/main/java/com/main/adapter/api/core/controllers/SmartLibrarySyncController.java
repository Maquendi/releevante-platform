package com.main.adapter.api.core.controllers;

import com.main.adapter.api.response.CustomApiResponse;
import com.main.adapter.api.response.HttpErrorResponse;
import com.main.application.core.SmartLibraryServiceFacade;
import com.releevante.core.application.dto.SmartLibrarySyncDto;
import com.releevante.core.application.dto.SyncStatus;
import com.releevante.core.domain.LibrarySetting;
import com.releevante.core.domain.SmartLibrary;
import com.releevante.identity.domain.model.SmartLibraryAccess;
import com.releevante.types.Slid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/sl/{slid}")
public class SmartLibrarySyncController {

  private final SmartLibraryServiceFacade smartLibraryService;

  public SmartLibrarySyncController(SmartLibraryServiceFacade smartLibraryService) {
    this.smartLibraryService = smartLibraryService;
  }

  @Operation(
      summary = "Synchronize client's loans",
      description = "Synchronizes the given client's loans from smart library to server")
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
  @PostMapping("/loans")
  public Mono<CustomApiResponse<SmartLibrary>> createLoans(
      @RequestBody SmartLibrarySyncDto loanSynchronizeDto) {
    return smartLibraryService
        .synchronizeClientsLoans(loanSynchronizeDto)
        .map(CustomApiResponse::from);
  }

  @Operation(
      summary = "library is synchronized",
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
  @PutMapping("/synchronize")
  public Mono<CustomApiResponse<Boolean>> setLibrarySynchronized(
      @PathVariable("slid") String slid) {
    return smartLibraryService.setSynchronized(Slid.of(slid)).map(CustomApiResponse::from);
  }

  @Operation(
      summary = "get smart library settings",
      description = "get the last setting for the given smart library id")
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
  @GetMapping("settings")
  public Mono<CustomApiResponse<List<LibrarySetting>>> getSettings(
      @RequestParam() String slid, @RequestParam(required = false) SyncStatus status) {
    return Mono.justOrEmpty(status)
        .flatMap(
            syncStatus ->
                smartLibraryService.getSetting(Slid.of(slid), syncStatus.toBoolean()).collectList())
        .switchIfEmpty(smartLibraryService.getSetting(Slid.of(slid)).collectList())
        .map(CustomApiResponse::from);
  }

  @Operation(
      summary = "Synchronize library accesses",
      description = "retrieve new accesses created for the given library")
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
  @GetMapping("/accesses")
  public Mono<CustomApiResponse<List<SmartLibraryAccess>>> synchronizeLibraryAccess(
      @PathVariable String slid, @RequestParam(required = false) SyncStatus status) {
    return Mono.justOrEmpty(status)
        .flatMap(
            syncStatus ->
                smartLibraryService
                    .getAccesses(Slid.of(slid), syncStatus.toBoolean())
                    .collectList())
        .switchIfEmpty(smartLibraryService.getAccesses(Slid.of(slid)).collectList())
        .map(CustomApiResponse::from);
  }
}
