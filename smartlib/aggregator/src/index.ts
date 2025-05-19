import { synchronizeBooks } from "./sync/synchronize-books";
import { synchronizeSettings } from "./sync/synchronize-settings";
import { synchronizeLibraryAccess } from "./sync/synchronize-library-access";
import { getCredential } from "./auth/authenticator";
import { synchronizeTransactions } from "./sync/synchronize-transactions";
import { isServerReachable } from "./htttp-client/http-client";
import dotenv from 'dotenv';
dotenv.config();

const executeTasks = async () => {

  try {
    let token = await getCredential();

    await synchronizeTransactions(token);
    await synchronizeBooks(token);
    await synchronizeLibraryAccess(token);
    await synchronizeSettings(token);

  } catch (error) {
    console.error("Error executing tasks:", error);
  }
};

setInterval(async () => {
  try {
    if (await isServerReachable()) {
      await executeTasks();
    } else {
      console.log("SERVER UNREACHABLE");
    }
  } catch (error) {
    console.error("Error in setInterval:", error);
  }
}, 1 * 60 * 1000);