import { synchronizeBooks } from "./sync/synchronize-books";
import { setLibrarySynchronized } from "./sync/library-synced";
import { synchronizeSettings } from "./sync/synchronize-settings";
import { synchronizeLibraryAccess } from "./sync/synchronize-library-access";

const run = async () => {
  let dataSynced = await synchronizeBooks();

  dataSynced += await synchronizeSettings();

  dataSynced += await synchronizeLibraryAccess();

  await setLibrarySynchronized();
};

run();
