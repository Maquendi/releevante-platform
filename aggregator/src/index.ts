import { synchronizeBooks } from "./sync/synchronize-books";
import { markLibrarySynchronized } from "./sync/mark-library-synced";
import { synchronizeSettings } from "./sync/synchronize-settings";
import { synchronizeLibraryAccess } from "./sync/synchronize-library-access";

const run = async () => {
  let dataSynced = await synchronizeBooks();

  //dataSynced += await synchronizeLibraryAccess();

  //dataSynced += await synchronizeSettings();

  console.log("TOTAL OBJECTS SYNCHRONIZED: " + dataSynced)

  // if (dataSynced > 0) {
  //   await markLibrarySynchronized();
  // }
};

run();
