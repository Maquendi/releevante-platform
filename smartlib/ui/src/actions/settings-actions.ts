"use server";

import { settingsFacade } from "@/core/application";
import { LibrarySettings } from "@/core/domain/settings.model";

export default async function FetchLibrarySettings(): Promise<LibrarySettings> {
  try {
    return await settingsFacade.getLibrarySetting();
  } catch (error) {
    throw new Error("Faild to load configuration");
  }
}
