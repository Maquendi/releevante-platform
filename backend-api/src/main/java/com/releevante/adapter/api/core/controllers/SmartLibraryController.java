package com.releevante.adapter.api.core.controllers;

import com.releevante.adapter.api.response.CustomApiResponse;
import com.releevante.adapter.api.response.HttpErrorResponse;
import com.releevante.core.application.dto.LoanSynchronizeDto;
import com.releevante.core.application.service.SmartLibraryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/aggregator/{slid}")
public class SmartLibraryController {

  private final SmartLibraryService smartLibraryService;

  public SmartLibraryController(SmartLibraryService smartLibraryService) {
    this.smartLibraryService = smartLibraryService;
  }

  @PostMapping("/user/{user_id}/explore")
  public Mono<?> libraryExplore() {

    return null;
  }

  @Operation(
      summary = "Synchronize book loans",
      description = "Synchronizes the given book loans from smart library to local db")
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
  @PostMapping("/synchronize/loan")
  public Mono<CustomApiResponse<Boolean>> synchronizeLoan(
      @RequestBody LoanSynchronizeDto loanSynchronizeDto) {
    return smartLibraryService.synchronize(loanSynchronizeDto).map(CustomApiResponse::from);
  }
}
