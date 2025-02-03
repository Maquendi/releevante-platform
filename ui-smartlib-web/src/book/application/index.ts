
import { defaultSettingsRepository } from "@/core/infrastructure/settings-repository.impl";
import { defaultBookRepository } from "../infrastructure/repositories-impl";
import { DefaultBookServiceImpl } from "./book-service-impl";
import { BookServiceFacadeImpl } from "./facade";
import { SettingsFacade } from "@/core/application/settings.facade";

const settingsFacade = new SettingsFacade(defaultSettingsRepository);
const bookService = new DefaultBookServiceImpl(
  defaultBookRepository,
  settingsFacade
);
export const bookServiceFacade = new BookServiceFacadeImpl(bookService);
