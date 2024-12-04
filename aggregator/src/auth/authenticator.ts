import { promises as fs } from "fs";
import { executePost } from "../htttp-client/http-client";
import { ApiCredential } from "../model/client";
const slid = process.env.slid;

const credentialFileName = "credentials.json";

const loadFromFile = async (): Promise<ApiCredential> => {
  try {
    return JSON.parse(await fs.readFile(credentialFileName, "utf-8")); // Parse JSON string to an object
  } catch (error) {
    return loadFromServer();
  }
};

const loadFromServer = async (): Promise<ApiCredential> => {
  console.log("loading from server .... ");
  const request = {
    resource: `auth/aggregator`,
    body: { slid },
  };

  try {
    const response = await executePost<ApiCredential>(request);
    const credentials = {
      slid,
      ...response?.context?.data,
    };
    await writeCredentialFile(credentials);

    return credentials;
  } catch (error) {
    return null as any;
  }
};

const writeCredentialFile = async (credentials: ApiCredential) => {
  try {
    const credentialString = JSON.stringify(credentials, null, 2);
    await fs.writeFile(credentialFileName, credentialString);
  } catch (err) {
    console.error("Error writing file", err);
  }
};

const credentialVerified = (credentials: ApiCredential): boolean => {
  if (!credentials.token || credentials.slid !== slid) return false;
  const expiresAt = new Date(credentials?.expiresAt as string); // 10:00 AM on December 1, 2024
  const now = new Date(); // 3:30 PM on December 1, 2024

  const diffInHours = Math.abs(expiresAt.getTime() - now.getTime()) / 3600000;

  console.log("diffInHours " + diffInHours);

  return diffInHours > 2;
};

export const getCredential = async (): Promise<string> => {
  let credential = await loadFromFile();

  if (!credentialVerified(credential)) {
    credential = await loadFromServer();
  }

  return credential?.token;
};
