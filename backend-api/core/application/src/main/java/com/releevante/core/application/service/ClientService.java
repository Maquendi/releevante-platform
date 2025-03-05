package com.releevante.core.application.service;

import com.releevante.core.application.dto.books.BookRecommendationDto;
import com.releevante.core.application.dto.clients.reservations.CreateReservationDto;
import com.releevante.core.application.dto.clients.reservations.RemoveReservationItemsDto;
import com.releevante.core.application.dto.clients.reservations.ReservationDto;
import com.releevante.core.application.dto.clients.reservations.ReservationItemDto;
import com.releevante.core.application.dto.clients.reviews.BookReviewDto;
import com.releevante.core.application.dto.clients.reviews.ServiceReviewDto;
import com.releevante.core.application.dto.clients.transactions.*;
import com.releevante.core.domain.ClientId;
import com.releevante.core.domain.identity.model.OrgId;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ClientService {
  Mono<TransactionSyncResponse> createTransactions(List<TransactionSyncDto> transactions);

  Mono<TransactionStatusSyncResponse> createTransactionStatus(
      List<TransactionStatusSyncDto> transactionStatus);

  Mono<CreateTransactionResponse> createTransaction(TransactionSyncDto transaction);

  Flux<TransactionDto> getClientTransactions(ClientId clientId);

  Flux<TransactionDto> getClientTransactions();

  Mono<String> createBookReviews(BookReviewDto review);

  Flux<String> createBookReviews(List<BookReviewDto> review);

  Mono<String> createServiceReview(ServiceReviewDto review);

  Mono<String> createReservation(CreateReservationDto reservation);

  Mono<String> addReservationItems(
      String reservationId, ClientId clientId, List<ReservationItemDto> newItems);

  Mono<String> removeReservationItem(RemoveReservationItemsDto removeReservationItems);

  Mono<ReservationDto> getReservation(ClientId clientId);

  Flux<ReservationDto> getReservations(ClientId clientId);

  Flux<ReservationDto> getReservations(OrgId orgId);

  Flux<ReservationDto> getReservations();

  Mono<BookRecommendationDto> getBookRecommendation(List<String> userPreferences);
}
