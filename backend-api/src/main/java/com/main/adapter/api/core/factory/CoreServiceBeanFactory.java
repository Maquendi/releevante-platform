package com.main.adapter.api.core.factory;

import com.main.adapter.api.core.jobs.BookScheduledUpdateJob;
import com.releevante.core.adapter.service.books.DefaultBookRegistrationService;
import com.releevante.core.adapter.service.google.GoogleSheetService;
import com.releevante.core.application.service.*;
import com.releevante.core.application.service.impl.DefaultBookServiceImpl;
import com.releevante.core.application.service.impl.DefaultLibraryService;
import com.releevante.core.application.service.impl.DefaultTaskExecutionService;
import com.releevante.core.application.service.impl.SettingServiceImpl;
import com.releevante.core.domain.repository.*;
import com.releevante.core.domain.repository.ratings.BookRatingRepository;
import com.releevante.core.domain.tasks.TaskRepository;
import com.releevante.identity.application.service.auth.AuthorizationService;
import java.time.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.Disposable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Configuration
public class CoreServiceBeanFactory {

  Logger logger = LoggerFactory.getLogger(CoreServiceBeanFactory.class);
  @Autowired BookTransactionRepository bookLoanRepository;

  @Autowired SmartLibraryRepository smartLibraryRepository;

  @Autowired ClientRepository clientRepository;

  @Autowired BookRepository bookRepository;

  @Autowired TaskRepository taskRepository;

  @Autowired BookTagRepository bookTagRepository;

  @Autowired SettingsRepository settingsRepository;

  @Autowired BookRatingRepository bookRatingRepository;

  @Autowired SmartLibraryInventoryRepository smartLibraryInventoryRepository;

  @Value("${spring.application.name}")
  String applicationName;

  @Value("${google.credentials.path}")
  String googleCredentialFilePath;

  @Bean()
  public SmartLibraryService smartLibraryService(
      AccountAuthorizationService accountAuthorizationService) {
    return new DefaultLibraryService(smartLibraryRepository, accountAuthorizationService);
  }

  @Bean()
  public AccountAuthorizationService accountAuthorizationService(
      AuthorizationService authorizationService) {
    return authorizationService::getAccountPrincipal;
  }

  @Bean()
  public SettingService settingService(AccountAuthorizationService accountAuthorizationService) {
    return new SettingServiceImpl(
        settingsRepository, accountAuthorizationService, smartLibraryRepository);
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
  public BookService bookService(BookRegistrationService bookRegistrationService) {
    return new DefaultBookServiceImpl(
        bookRepository, bookRegistrationService, bookTagRepository, smartLibraryRepository);
  }

  @Bean
  public BookScheduledUpdateJob bookScheduledUpdateJob() {
    return new BookScheduledUpdateJob(bookRatingRepository, smartLibraryInventoryRepository);
  }

  @Bean
  public Disposable someTaskScheduler(BookScheduledUpdateJob bookScheduledUpdateJob) {
    return Flux.interval(Duration.ofMinutes(1))
        .publishOn(Schedulers.boundedElastic())
        .onBackpressureDrop()
        .concatMap(
            ignored ->
                Mono.defer(
                    () -> {
                      logger.info("Trying to process the task...");
                      return Mono.zip(
                          bookScheduledUpdateJob.bookInventoryScheduledUpdater(),
                          bookScheduledUpdateJob.bookRatingScheduledUpdater());
                    }),
            0)
        .subscribe();
  }
}
