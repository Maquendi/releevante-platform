import { synchronizeBooks } from "./sync/synchronize-books";
import { synchronizeSettings } from "./sync/synchronize-settings";
import { synchronizeLibraryAccess } from "./sync/synchronize-library-access";
import { getCredential } from "./auth/authenticator";
import { synchronizeTransactions } from "./sync/synchronize-transactions";

const runAsync = async () => {
  let token = await getCredential();

  await synchronizeTransactions(token);

  await synchronizeBooks(token);

  await synchronizeLibraryAccess(token);

  await synchronizeSettings(token);
};

runAsync();

setInterval(() => {
  runAsync();
}, 1 * 60 * 1000);
