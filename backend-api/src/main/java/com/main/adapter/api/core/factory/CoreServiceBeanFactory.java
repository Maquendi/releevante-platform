package com.main.adapter.api.core.factory;

import com.main.adapter.api.core.jobs.BookScheduledUpdateJob;
import com.releevante.core.adapter.service.books.DefaultBookRegistrationService;
import com.releevante.core.adapter.service.google.GoogleSheetService;
import com.releevante.core.application.identity.service.auth.AuthorizationService;
import com.releevante.core.application.service.*;
import com.releevante.core.application.service.impl.*;
import com.releevante.core.domain.identity.repository.SmartLibraryAccessControlRepository;
import com.releevante.core.domain.repository.*;
import com.releevante.core.domain.repository.ratings.BookRatingRepository;
import com.releevante.core.domain.repository.ratings.ServiceRatingRepository;
import com.releevante.core.domain.tasks.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CoreServiceBeanFactory {

  Logger logger = LoggerFactory.getLogger(CoreServiceBeanFactory.class);
  @Autowired BookTransactionRepository bookTransactionRepository;

  @Autowired SmartLibraryRepository smartLibraryRepository;

  @Autowired ClientRepository clientRepository;

  @Autowired BookRepository bookRepository;

  @Autowired TaskRepository taskRepository;

  @Autowired BookTagRepository bookTagRepository;

  @Autowired SettingsRepository settingsRepository;

  @Autowired BookRatingRepository bookRatingRepository;

  @Autowired SmartLibraryInventoryRepository smartLibraryInventoryRepository;

  @Autowired ServiceRatingRepository serviceRatingRepository;

  @Autowired BookReservationRepository reservationRepository;

  @Autowired SettingsRepository librarySettingRepository;

  @Value("${spring.application.name}")
  String applicationName;

  @Value("${google.credentials.path}")
  String googleCredentialFilePath;

  @Autowired protected SmartLibraryAccessControlRepository accessControlRepository;

  @Bean()
  public SettingService settingService(AuthorizationService authorizationService) {
    return new SettingServiceImpl(settingsRepository, authorizationService, smartLibraryRepository);
  }

  @Bean()
  public ServiceRatingService serviceRatingService(AuthorizationService authorizationService) {
    return new ServiceRatingServiceImpl(serviceRatingRepository, authorizationService);
  }

  @Bean
  public BookRegistrationService bookRegistrationService() {
    return new DefaultBookRegistrationService(
        new GoogleSheetService(applicationName, googleCredentialFilePath));
  }

  @Bean
  public TaskExecutionService taskExecutionService() {
    return new DefaultTaskExecutionService(taskRepository);
  }

  @Bean
  public BookService bookService(
      BookRegistrationService bookRegistrationService, AuthorizationService authorizationService) {
    return new DefaultBookServiceImpl(
        bookRepository,
        bookRegistrationService,
        bookTagRepository,
        smartLibraryRepository,
        authorizationService,
        bookRatingRepository,
        reservationRepository,
        librarySettingRepository,
        accessControlRepository,
        clientRepository);
  }

  @Bean
  public ClientService clientService(
      BookService bookService, AuthorizationService authorizationService) {
    return new ClientServiceImpl(
        bookService,
        clientRepository,
        authorizationService,
        reservationRepository,
        settingsRepository,
        accessControlRepository,
        bookTransactionRepository,
        smartLibraryInventoryRepository);
  }

  @Bean
  public BookScheduledUpdateJob bookScheduledUpdateJob() {
    return new BookScheduledUpdateJob(bookRatingRepository, smartLibraryInventoryRepository);
  }

  //  @Bean
  //  public Disposable someTaskScheduler(BookScheduledUpdateJob bookScheduledUpdateJob) {
  //    return Flux.interval(Duration.ofMinutes(1))
  //        .publishOn(Schedulers.boundedElastic())
  //        .onBackpressureDrop()
  //        .concatMap(
  //            ignored ->
  //                Mono.defer(
  //                    () -> {
  //                      logger.info("Trying to process the task...");
  //                      return Mono.zip(
  //                          bookScheduledUpdateJob.bookInventoryScheduledUpdater(),
  //                          bookScheduledUpdateJob.bookRatingScheduledUpdater());
  //                    }),
  //            0)
  //        .subscribe();
  //  }
}
