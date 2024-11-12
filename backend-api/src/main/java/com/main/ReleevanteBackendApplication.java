/* (C)2024 */
package com.main;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(
    basePackages = {
      "com.releevante.core.adapter.persistence.repository",
      "com.releevante.core.adapter.persistence.dao",
      "com.releevante.identity.adapter.persistence.repository"
    })
@EntityScan({
  "com.releevante.identity.adapter.persistence.records",
  "com.releevante.core.adapter.persistence.records"
})
@ComponentScan(value = {"com.releevante", "com.main", "com.releevante.core.adapter.persistence"})
@OpenAPIDefinition
public class ReleevanteBackendApplication {
  public static void main(String[] args) {
    SpringApplication.run(ReleevanteBackendApplication.class, args);
  }
}
