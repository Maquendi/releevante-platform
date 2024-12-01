package com.releevante.core.application.service;

import com.releevante.core.domain.LibrarySetting;
import com.releevante.types.Slid;
import reactor.core.publisher.Mono;

public interface SettingService {

  Mono<LibrarySetting> synchronizeLibrarySettings(Slid slid, boolean synced);
}
