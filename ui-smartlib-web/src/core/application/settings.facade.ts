import { SettingsRepository } from "../domain/repositories";
import { LibrarySettings } from "../domain/settings.model";

export class SettingsFacade {
  constructor(private settingsRepository: SettingsRepository) {}
  async getLibrarySetting(): Promise<LibrarySettings> {
    return this.settingsRepository.getSetting();
  }
}
