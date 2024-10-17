/* (C)2024 */
package com.releevante;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
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
@OpenAPIDefinition(
    info = @Info(title = "APIs", version = "1.0.0", description = "Documentation APIs v1.0.0"))
public class ReleevanteBackendApplication {
  public static void main(String[] args) {
    SpringApplication.run(ReleevanteBackendApplication.class, args);
  }
}
