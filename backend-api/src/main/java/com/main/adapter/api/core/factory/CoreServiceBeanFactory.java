package com.main.adapter.api.core.factory;

import com.releevante.core.adapter.service.books.DefaultBookRegistrationService;
import com.releevante.core.adapter.service.google.GoogleSheetService;
import com.releevante.core.application.service.*;
import com.releevante.core.application.service.impl.DefaultBookServiceImpl;
import com.releevante.core.application.service.impl.DefaultLibraryService;
import com.releevante.core.application.service.impl.DefaultTaskExecutionService;
import com.releevante.core.domain.repository.*;
import com.releevante.core.domain.tasks.TaskRepository;
import com.releevante.identity.application.service.auth.AuthorizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CoreServiceBeanFactory {

  @Autowired BookLoanRepository bookLoanRepository;

  @Autowired SmartLibraryRepository smartLibraryRepository;

  @Autowired ClientRepository clientRepository;

  @Autowired BookRepository bookRepository;

  @Autowired TaskRepository taskRepository;

  @Autowired BookTagRepository bookTagRepository;

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
}
