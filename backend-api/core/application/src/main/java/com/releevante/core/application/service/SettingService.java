package com.releevante.core.application.service;

import com.releevante.core.application.dto.sl.settings.LibrarySettingsDto;
import com.releevante.core.application.dto.sl.settings.PartialSettingDto;
import com.releevante.core.domain.LibrarySetting;
import reactor.core.publisher.Mono;

public interface SettingService {
  Mono<LibrarySetting> create(LibrarySettingsDto dto);

  Mono<LibrarySetting> update(String settingId, LibrarySettingsDto dto);

  Mono<LibrarySetting> update(String settingId, PartialSettingDto dto);
}
