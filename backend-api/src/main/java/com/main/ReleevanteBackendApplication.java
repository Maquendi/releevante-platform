/* (C)2024 */
package com.main;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;

@SpringBootApplication
@ComponentScan(
    value = {
      "com.releevante",
      "com.main.config.app",
      "com.main",
      "com.releevante.core.adapter.persistence"
    })
@OpenAPIDefinition
@EnableR2dbcRepositories(
    basePackages = {
      "com.releevante.identity.adapter.persistence.repository.components",
      "com.releevante.core.adapter.persistence.dao"
    })
public class ReleevanteBackendApplication {
  public static void main(String[] args) {
    SpringApplication.run(ReleevanteBackendApplication.class, args);
  }
}
