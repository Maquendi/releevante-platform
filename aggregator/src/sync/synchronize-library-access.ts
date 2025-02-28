import { dbConnection } from "../config/db.js";
import { executeGet, executePut } from "../htttp-client/http-client.js";
import { ApiRequest } from "../htttp-client/model.js";
import { LibraryAccess } from "../model/client.js";

const slid = process.env.slid;

export const synchronizeLibraryAccess = async (token: string) => {
  let totalRecordsSynced = 0;
  let completedNoError = false;
  const request: ApiRequest = {
    resource: `sl/${slid}/accesses?status=not_synced`,
    token,
  };
  const response = await executeGet<LibraryAccess[]>(request);
  const accesses = response.context.data || [];
  if (accesses.length) {
    try {
      totalRecordsSynced += await insertUsers(accesses);
      completedNoError = true;
    } catch (error: any) {
      completedNoError = false;
    }
  }

  console.log("TOTAL USER RECORDS SYNCHRONIZED: " + totalRecordsSynced);

  if (completedNoError) {
    const request: ApiRequest = {
      token,
      resource: `sl/${slid}/accesses`,
    };
    const response = await executePut<Boolean>(request);

    console.log("Library users set synchronized " + response?.context?.data);
  }
  return totalRecordsSynced;
};

const insertUsers = async (accesses: LibraryAccess[]) => {
  const create_stmt = dbConnection.prepare(
    "INSERT INTO user(id, access_id, credential, is_active, expires_at, contact_less) VALUES (@id, @access_id, @credential, @is_active, @expires_at, @contact_less)"
  );

  const update_stmt = dbConnection.prepare(
    "UPDATE user SET access_id=?, credential=?, is_active=?, expires_at=?, contact_less=? WHERE id=?"
  );
  let dbChanges = 0;

  accesses.forEach((access) => {
    try {
      dbChanges += create_stmt.run({
        id: access.id,
        access_id: access.accessId,
        credential: access.credential,
        is_active: (access.isActive && 1) || 0,
        expires_at: access.expiresAt,
        contact_less: access.contactless,
      }).changes;
    } catch (error) {
      dbChanges += update_stmt.run(
        access.accessId,
        access.credential,
        (access.isActive && 1) || 0,
        access.expiresAt,
        access.contactless,
        access.id
      ).changes;
    }
  });

  return dbChanges;
};
