import { synchronizeBooks } from "./sync/synchronize-books";
import { synchronizeSettings } from "./sync/synchronize-settings";
import { synchronizeLibraryAccess } from "./sync/synchronize-library-access";
import { getCredential } from "./auth/authenticator";
import { synchronizeTransactions } from "./sync/synchronize-transactions";
import { isServerReachable } from "./htttp-client/http-client";

const executeTasks = async () => {
  let token = await getCredential();

  await synchronizeTransactions(token);

  await synchronizeBooks(token);

  await synchronizeLibraryAccess(token);

  await synchronizeSettings(token);
};

setInterval(async () => {
  if ((await isServerReachable())) {
    executeTasks();
  } else {
    console.log("SERVER UNREACHABLE")
  }
}, 1 * 60 * 1000);
