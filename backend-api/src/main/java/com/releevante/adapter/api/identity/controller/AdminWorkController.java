package com.releevante.adapter.api.identity.controller;

import com.releevante.adapter.api.response.CustomApiResponse;
import com.releevante.application.dto.AccountIdDto;
import com.releevante.application.dto.OrgDto;
import com.releevante.application.identity.IdentityServiceFacade;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springdoc.core.annotations.RouterOperation;
import org.springdoc.core.annotations.RouterOperations;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/admin")
public class AdminWorkController {
  final IdentityServiceFacade identityServiceFacade;

  public AdminWorkController(IdentityServiceFacade identityServiceFacade) {
    this.identityServiceFacade = identityServiceFacade;
  }

  @RouterOperations({
    @RouterOperation(
        path = "/api/org",
        produces = {MediaType.APPLICATION_JSON_VALUE},
        method = RequestMethod.GET,
        beanMethod = "register",
        operation =
            @Operation(
                operationId = "register a new organization",
                responses = {
                  @ApiResponse(responseCode = "200", description = "successful operation"),
                  @ApiResponse(
                      responseCode = "400",
                      description = "bad request or missing data",
                      content =
                          @Content(
                              examples =
                                  @ExampleObject(
                                      "{\n"
                                          + "\"statusCode\": 400,\n"
                                          + "\"context\": {\n"
                                          + "\"data\": \"bad request\"\n"
                                          + "}\n"
                                          + "}")))
                }))
  })
  @PostMapping("/org")
  Mono<CustomApiResponse<AccountIdDto>> register(@RequestBody OrgDto org) {
    return identityServiceFacade.create(org).map(CustomApiResponse::from);
  }
}
