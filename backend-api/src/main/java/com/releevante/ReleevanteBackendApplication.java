/* (C)2024 */
package com.releevante;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(
    basePackages = {"com.releevante.identity.adapter.out.persistence.repository"})
@ComponentScan("com.releevante")
@EntityScan("com.releevante.identity.adapter.out.persistence.records")
@OpenAPIDefinition
public class ReleevanteBackendApplication {
  public static void main(String[] args) {
    SpringApplication.run(ReleevanteBackendApplication.class, args);
  }
}
