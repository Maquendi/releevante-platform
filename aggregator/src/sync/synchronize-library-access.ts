import { dbConnection } from "../config/db.js";
import { executeGet } from "../htttp-client/http-client.js";
import { ApiRequest } from "../htttp-client/model.js";
import { LibraryAccess } from "../model/client.js";

const slid = process.env.slid;

export const synchronizeLibraryAccess = async () => {
  let syncComplete = false;
  let totalRecordsSynced = 0;
  const request: ApiRequest = {
    resource: `aggregator/${slid}/synchronize/accesses`,
  };
  const response = await executeGet<LibraryAccess[]>(request);
  const accesses = response.context.data;
  syncComplete = accesses?.length == 0 || !accesses;

  if (accesses && accesses.length) {
    totalRecordsSynced += await insertUsers(accesses);
  }

  console.log("TOTAL USER RECORDS SYNCHRONIZED: " + totalRecordsSynced);

  return totalRecordsSynced;
};

const insertUsers = async (accesses: LibraryAccess[]) => {
  const stmt = dbConnection.prepare(
    "INSERT INTO user VALUES (@id, @access_id, @credential, @is_active, @expires_at, @created_at, @updated_at)"
  );
  let dbChanges = 0;

  accesses.forEach((access) => {
    dbChanges += stmt.run({
      id: access.userId,
      access_id: access.accessId,
      credential: access.credential,
      is_active: true,
      expires_at: access.expiresAt,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).changes;
  });

  return dbChanges;
};
