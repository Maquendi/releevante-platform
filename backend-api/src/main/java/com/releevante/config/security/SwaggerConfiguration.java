package com.releevante.config.security;

import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfiguration {
  //  @Bean
  //  public OpenAPI customOpenAPI() {
  //    return new OpenAPI()
  //        .components(
  //            new Components()
  //                .addSecuritySchemes(
  //                    "bearer-key",
  //                    new SecurityScheme()
  //                        .type(SecurityScheme.Type.HTTP)
  //                        .scheme("bearer")
  //                        .bearerFormat("JWT")));
  //  }

  //    @Bean
  //    public OpenAPI customOpenAPI() {
  //        return new OpenAPI()
  //                .addServersItem(new Server().url("/api"));  // Set the API base path here
  //    }

  //    @Bean
  //    SpringdocRouteBuilder healthCheckRouter() {
  //      return route()
  //          .add(
  //              route(GET("/health"), req -> ok().bodyValue("healthy")),
  //              builder ->
  //                  builder
  //                      .tag("healthCheck")
  //                      .operationId("/health")
  //                      .response(
  //                          responseBuilder().responseCode("200").description("check app
  // health")));
  //    }

  //  @Bean
  //  GroupedOpenApi api() {
  //    return GroupedOpenApi.builder().group("webflux-api").pathsToMatch("/api/**").build();
  //  }
}
