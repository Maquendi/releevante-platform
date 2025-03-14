package com.releevante.core.application.service.impl;

import com.releevante.core.application.dto.sl.settings.LibrarySettingsDto;
import com.releevante.core.application.dto.sl.settings.PartialSettingDto;
import com.releevante.core.application.identity.service.auth.AuthorizationService;
import com.releevante.core.application.service.SettingService;
import com.releevante.core.domain.LibrarySetting;
import com.releevante.core.domain.repository.SettingsRepository;
import com.releevante.core.domain.repository.SmartLibraryRepository;
import com.releevante.types.SequentialGenerator;
import com.releevante.types.Slid;
import com.releevante.types.UuidGenerator;
import com.releevante.types.ZonedDateTimeGenerator;
import com.releevante.types.exceptions.InvalidInputException;
import java.time.ZonedDateTime;
import reactor.core.publisher.Mono;

public class SettingServiceImpl implements SettingService {
  final SettingsRepository settingsRepository;
  final AuthorizationService authorizationService;

  final SmartLibraryRepository smartLibraryRepository;
  final SequentialGenerator<String> uuidGenerator = UuidGenerator.instance();
  final SequentialGenerator<ZonedDateTime> dateTimeGenerator = ZonedDateTimeGenerator.instance();

  public SettingServiceImpl(
      SettingsRepository settingsRepository,
      AuthorizationService authorizationService,
      SmartLibraryRepository smartLibraryRepository) {
    this.settingsRepository = settingsRepository;
    this.authorizationService = authorizationService;
    this.smartLibraryRepository = smartLibraryRepository;
  }

  @Override
  public Mono<LibrarySetting> create(LibrarySettingsDto settings) {
    return settingsRepository.create(settings.toDomain(uuidGenerator, dateTimeGenerator));
  }

  @Override
  public Mono<LibrarySetting> update(String settingId, LibrarySettingsDto dto) {
    return settingsRepository
        .find(settingId)
        .filter(setting -> setting.slid().equals(dto.slid()))
        .flatMap(ignore -> this.create(dto))
        .switchIfEmpty(throwError(settingId, dto.slid()));
  }

  @Override
  public Mono<LibrarySetting> update(String settingId, PartialSettingDto dto) {

    return settingsRepository
        .find(settingId)
        .filter(setting -> setting.slid().equals(dto.slid()))
        .map(setting -> dto.patch(setting, uuidGenerator, dateTimeGenerator))
        .switchIfEmpty(throwError(settingId, dto.slid()))
        .flatMap(
            librarySetting ->
                authorizationService
                    .getAccountPrincipal()
                    .flatMap(
                        principal -> {
                          if (principal.isSuperAdmin()) {
                            return settingsRepository.create(librarySetting);
                          }

                          return smartLibraryRepository
                              .findBy(Slid.of(dto.slid()))
                              .flatMap(
                                  smartLibrary -> {
                                    smartLibrary.validateCanAccess(principal);
                                    return settingsRepository.create(librarySetting);
                                  })
                              .switchIfEmpty(throwError(settingId, dto.slid()));
                        }));
  }

  Mono<LibrarySetting> throwError(String settingId, String slid) {
    return Mono.error(
        new InvalidInputException(
            String.format("setting id %s  of library %s not found", settingId, slid)));
  }
}
