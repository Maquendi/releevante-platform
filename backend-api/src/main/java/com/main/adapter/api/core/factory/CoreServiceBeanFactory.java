package com.main.adapter.api.core.factory;

import com.releevante.core.adapter.service.books.DefaultBookRegistrationService;
import com.releevante.core.adapter.service.google.GoogleSheetService;
import com.releevante.core.application.service.BookRegistrationService;
import com.releevante.core.application.service.BookService;
import com.releevante.core.application.service.SmartLibraryService;
import com.releevante.core.application.service.TaskExecutionService;
import com.releevante.core.application.service.impl.DefaultBookServiceImpl;
import com.releevante.core.application.service.impl.DefaultLibraryService;
import com.releevante.core.application.service.impl.DefaultTaskExecutionService;
import com.releevante.core.domain.repository.BookLoanRepository;
import com.releevante.core.domain.repository.BookRepository;
import com.releevante.core.domain.repository.ClientRepository;
import com.releevante.core.domain.repository.SmartLibraryRepository;
import com.releevante.core.domain.tasks.TaskRepository;
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

  @Value("${spring.application.name}")
  String applicationName;

  @Value("${google.credentials.path}")
  String googleCredentialFilePath;

  @Bean()
  public SmartLibraryService smartLibraryService() {
    return new DefaultLibraryService(smartLibraryRepository);
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
    return new DefaultBookServiceImpl(bookRepository, bookRegistrationService);
  }
}
