package com.main.adapter.api.core.controllers;

import com.main.adapter.api.response.CustomApiResponse;
import com.main.adapter.api.response.HttpErrorResponse;
import com.releevante.core.application.identity.dto.AccountIdDto;
import com.releevante.core.application.identity.dto.GrantedAccess;
import com.releevante.core.application.identity.dto.OrgDto;
import com.releevante.core.application.identity.dto.UserAccessDto;
import com.releevante.core.application.identity.service.user.OrgService;
import com.releevante.core.application.service.BookService;
import com.releevante.core.domain.identity.model.OrgId;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/org")
public class OrgController {
  final BookService bookService;

  final OrgService orgService;

  public OrgController(BookService bookService, OrgService orgService) {
    this.bookService = bookService;
    this.orgService = orgService;
  }

  @Operation(
      summary = "Add new organization",
      description = "Create a new organization, only admin users can do")
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
  @PostMapping()
  Mono<CustomApiResponse<AccountIdDto>> register(@RequestBody OrgDto org) {
    return orgService.createOrg(org).map(CustomApiResponse::from);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/{orgId}/accesses")
  public Mono<CustomApiResponse<GrantedAccess>> createLibraryAccess(
      @PathVariable() OrgId orgId, @RequestBody UserAccessDto access) {
    return orgService.create(orgId, access).map(CustomApiResponse::from);
  }
}
