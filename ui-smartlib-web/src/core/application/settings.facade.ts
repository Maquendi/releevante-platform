import { SettingsRepository } from "../domain/repositories";
import { LibrarySettings } from "../domain/settings.model";
import { unstable_cache } from "next/cache";

export class SettingsFacade {
  constructor(private settingsRepository: SettingsRepository) {}

  getLibrarySetting = unstable_cache(
    this.settingsRepository.getSetting,
    ["library_setting"],
    {
      revalidate: 300,
    }
  );
}
