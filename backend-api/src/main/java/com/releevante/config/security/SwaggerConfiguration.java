package com.releevante.config.security;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfiguration {

  @Bean
  public OpenAPI customOpenAPI() {
    return new OpenAPI()
        .info(new Info().title("hello").version("3.0").description("Docs for api"))
        .components(
            new Components()
                .addSecuritySchemes(
                    "bearer-key",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")));
  }

  //    @Bean
  //    public Docket api() {
  //        return new Docket(DocumentationType.SWAGGER_2)
  //                .select()
  //                .apis(RequestHandlerSelectors.any())
  //                .paths(PathSelectors.any())
  //                .build();
  //    }

  @Bean
  GroupedOpenApi api() {
    return GroupedOpenApi.builder().group("webflux-api").pathsToMatch("/api/**").build();
  }
}
