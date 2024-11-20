package com.main.adapter.api.core.factory;

import com.releevante.core.application.service.SmartLibraryService;
import com.releevante.core.application.service.impl.DefaultLibraryService;
import com.releevante.core.domain.repository.BookLoanRepository;
import com.releevante.core.domain.repository.ClientRepository;
import com.releevante.core.domain.repository.SmartLibraryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CoreServiceBeanFactory {

  @Autowired BookLoanRepository bookLoanRepository;

  @Autowired SmartLibraryRepository smartLibraryRepository;

  @Autowired ClientRepository clientRepository;

  @Bean()
  public SmartLibraryService smartLibraryService() {
    return new DefaultLibraryService(smartLibraryRepository);
  }
}
