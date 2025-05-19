package com.main.adapter.api.core.controllers;

import com.main.adapter.api.response.CustomApiResponse;
import com.releevante.core.application.dto.mcp.McpServerDto;
import com.releevante.core.application.service.RegistryMcpComponentService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/mcp")
public class McpComponentController {

  @Autowired RegistryMcpComponentService mcpComponentService;

  @GetMapping("/servers")
  public Mono<CustomApiResponse<List<McpServerDto>>> getMcpServerList() {
    return mcpComponentService.getMcpServerList().collectList().map(CustomApiResponse::from);
  }

  @PostMapping("/servers/{mcpServerName}/{mcpComponentType}/{mcpComponentName}")
  public Mono<CustomApiResponse<?>> executeMcpComponent(
      @PathVariable() String mcpServerName,
      @PathVariable() String mcpComponentType,
      @PathVariable() String mcpComponentName,
      @RequestBody() Map<String, Object> requestBody) {

    return mcpComponentService
        .executeMcpComponent(mcpServerName, mcpComponentType, mcpComponentName, requestBody)
        .map(CustomApiResponse::from);
  }
}
