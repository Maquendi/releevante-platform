import { synchronizeBooks } from "./sync/synchronize-books";
import { markLibrarySynchronized } from "./sync/mark-library-synced";
import { synchronizeSettings } from "./sync/synchronize-settings";
import { synchronizeLibraryAccess } from "./sync/synchronize-library-access";
import { getCredential } from "./auth/authenticator";
import { synchronizeTransactions } from "./sync/synchronize-transactions";

const runAsync = async () => {
  let token = await getCredential();

  const stats = await synchronizeTransactions(token);

  console.log("New transactions synced " + stats.transactionsCreated);

  console.log(
    "New Transaction Status/Item status synced " +
      stats.transactionStatusesCreated
  );

  let dataSynced = await synchronizeBooks(token);

  dataSynced += await synchronizeLibraryAccess(token);

  dataSynced += await synchronizeSettings(token);

  console.log("TOTAL OBJECTS SYNCHRONIZED: " + dataSynced);

  if (dataSynced > 0) {
    await markLibrarySynchronized(token);
  }
};

runAsync();

setInterval(() => {
  runAsync();
}, 1 * 60 * 1000);
