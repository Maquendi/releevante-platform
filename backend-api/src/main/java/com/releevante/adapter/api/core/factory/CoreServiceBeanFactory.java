package com.releevante.adapter.api.core.factory;

import com.releevante.core.application.service.SmartLibraryService;
import com.releevante.core.application.service.impl.DefaultLibraryService;
import com.releevante.core.domain.repository.BookLoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CoreServiceBeanFactory {

  @Autowired BookLoanRepository bookLoanRepository;

  @Bean()
  public SmartLibraryService smartLibraryService() {
    return new DefaultLibraryService(bookLoanRepository);
  }
}
