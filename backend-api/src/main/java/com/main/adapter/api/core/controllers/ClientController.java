package com.main.adapter.api.core.controllers;

import com.main.adapter.api.response.CustomApiResponse;
import com.releevante.core.application.dto.books.BookRecommendationDto;
import com.releevante.core.application.dto.clients.ClientDto;
import com.releevante.core.application.dto.clients.reservations.CreateReservationDto;
import com.releevante.core.application.dto.clients.reservations.ReservationDto;
import com.releevante.core.application.dto.clients.reviews.BookReviewDto;
import com.releevante.core.application.dto.clients.reviews.ServiceReviewDto;
import com.releevante.core.application.dto.clients.transactions.*;
import com.releevante.core.application.service.ClientService;
import com.releevante.core.domain.ClientId;
import com.releevante.core.domain.Isbn;
import com.releevante.core.domain.identity.model.OrgId;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/clients")
public class ClientController {

  final ClientService clientService;

  public ClientController(ClientService clientService) {
    this.clientService = clientService;
  }

  @PreAuthorize("hasRole('CLIENT')")
  @GetMapping("/{clientId}")
  Mono<CustomApiResponse<ClientDto>> getClient(@PathVariable() ClientId clientId) {
    return Mono.empty();
  }

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping()
  Mono<CustomApiResponse<List<ClientDto>>> getClients(
      @RequestParam() int page, @RequestParam() int size) {
    return Mono.empty();
  }

  @PreAuthorize("hasRole('CLIENT')")
  @PostMapping("/{clientId}/reservations")
  public Mono<CustomApiResponse<String>> createReservation(
      @PathVariable() ClientId clientId, @RequestBody CreateReservationDto reservationDto) {
    return clientService.createReservation(reservationDto).map(CustomApiResponse::from);
  }

  @PreAuthorize("hasRole('CLIENT')")
  @GetMapping("/{clientId}/reservations")
  public Mono<CustomApiResponse<List<ReservationDto>>> getClientReservation(
      @PathVariable() ClientId clientId) {
    return clientService.getReservations(clientId).collectList().map(CustomApiResponse::from);
  }

  @PreAuthorize("hasRole('CLIENT')")
  @GetMapping("/{clientId}/reservations/current")
  public Mono<CustomApiResponse<ReservationDto>> getClientReservationCurrent(
      @PathVariable() ClientId clientId) {
    return clientService.getReservation(clientId).map(CustomApiResponse::from);
  }

  @PreAuthorize("hasRole('CLIENT')")
  @PostMapping("/{clientId}/books/{isbn}/review")
  public Mono<CustomApiResponse<String>> rateBook(
      @PathVariable() ClientId clientId,
      @PathVariable() Isbn isbn,
      @RequestBody BookReviewDto ratingDto) {
    return clientService.createBookReviews(ratingDto).map(CustomApiResponse::from);
  }

  @PreAuthorize("hasRole('AGGREGATOR')")
  @PostMapping("/reviews")
  public Mono<CustomApiResponse<List<String>>> syncBookReviews(
      @RequestBody List<BookReviewDto> ratingDto) {
    return clientService.createBookReviews(ratingDto).collectList().map(CustomApiResponse::from);
  }

  @Operation(summary = "create a service rating", description = "A user rates our service")
  @PreAuthorize("hasRole('CLIENT')")
  @PostMapping("/{clientId}/service/review")
  public Mono<CustomApiResponse<String>> rateService(
      @PathVariable() ClientId clientId, @RequestBody ServiceReviewDto serviceReviewDto) {
    return clientService.createServiceReview(serviceReviewDto).map(CustomApiResponse::from);
  }

  @PreAuthorize("hasRole('SYSADMIN')")
  @GetMapping("/transactions")
  public Mono<CustomApiResponse<List<TransactionDto>>> getTransactions() {
    return clientService.getClientTransactions().collectList().map(CustomApiResponse::from);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/{clientId}/transactions")
  public Mono<CustomApiResponse<List<TransactionDto>>> getTransactions(
      @PathVariable() ClientId clientId) {
    return clientService.getClientTransactions(clientId).collectList().map(CustomApiResponse::from);
  }

  @PreAuthorize("hasRole('AGGREGATOR')")
  @PostMapping("/transactions")
  public Mono<CustomApiResponse<TransactionSyncResponse>> SyncClientTransactions(
      @RequestBody List<TransactionSyncDto> transactions) {
    return clientService.createTransactions(transactions).map(CustomApiResponse::from);
  }

  @PreAuthorize("hasRole('AGGREGATOR')")
  @PostMapping("/transaction-status")
  public Mono<CustomApiResponse<TransactionStatusSyncResponse>> SyncClientTransactionStatus(
      @RequestBody List<TransactionStatusSyncDto> transactionStatus) {
    return clientService.createTransactionStatus(transactionStatus).map(CustomApiResponse::from);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/reservations")
  public Mono<CustomApiResponse<List<ReservationDto>>> getOrgReservations(
      @RequestParam() OrgId orgId) {
    return clientService.getReservations(orgId).collectList().map(CustomApiResponse::from);
  }

  @Operation(
      summary = "recommend a book to a client",
      description = "returns a list of books having specified isbn, or tagId, or tagValue")
  @GetMapping("/recommendation")
  public Mono<CustomApiResponse<BookRecommendationDto>> getBookRecommendations(
      @RequestParam() List<String> preferences) {
    return clientService.getBookRecommendation(preferences).map(CustomApiResponse::from);
  }
}
