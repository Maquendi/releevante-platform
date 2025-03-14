package com.main.adapter.api.core.controllers;

import com.releevante.core.application.service.SettingService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/settings")
public class SettingsController {

  final SettingService settingService;

  public SettingsController(SettingService settingService) {
    this.settingService = settingService;
  }
}
