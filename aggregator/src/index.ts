import { synchronizeBooks } from "./sync/synchronize-books";
import { markLibrarySynchronized } from "./sync/mark-library-synced";
import { synchronizeSettings } from "./sync/synchronize-settings";
import { synchronizeLibraryAccess } from "./sync/synchronize-library-access";
import { getCredential } from "./auth/authenticator";

const run = async () => {
  let token = await getCredential();

  //let dataSynced = await synchronizeBooks();

  var dataSynced = await synchronizeLibraryAccess(token);

  dataSynced += await synchronizeSettings(token);

  console.log("TOTAL OBJECTS SYNCHRONIZED: " + dataSynced);

  // if (dataSynced > 0) {
  //   await markLibrarySynchronized();
  // }
};

run();
