import { promises as fs } from "fs";
import { executePost } from "../htttp-client/http-client";
import { ApiCredential } from "../model/client";
const slid = process.env.slid;

const credentialFileName = "./credentials.json";

const loadFromFile = async (): Promise<ApiCredential> => {
  try {
    return JSON.parse(await fs.readFile(credentialFileName, "utf-8"));
  } catch (error) {
    console.log("Failed to load credential from file with error " + error);
    return await loadFromServer();
  }
};

const loadFromServer = async (): Promise<ApiCredential> => {
  console.log("loading credentials from server .... ");
  const request = {
    resource: `auth/m2m/token`,
    body: { clientId: slid },
  };

  try {
    
    const response = await executePost<string>(request);

    const now = new Date();

    now.setHours(now.getHours() + 24)

    const credentials = {
      slid,
      token: response?.context?.data,
      expiresAt: now.toISOString(),
    };
    await writeCredentialFile(credentials);

    return credentials;
  } catch (error: any) {
    console.log("error loading credentials from server " + error.message);
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
  if (!credentials?.token || credentials.slid !== slid) return false;
  const expiresAt = new Date(credentials?.expiresAt as string); // 10:00 AM on December 1, 2024
  const now = new Date(); // 3:30 PM on December 1, 2024

  const diffInHours = (expiresAt.getTime() - now.getTime()) / 3600000;

  console.log("diffInHours " + diffInHours);

  return diffInHours > 2;
};

export const getCredential = async (): Promise<string> => {
  let credential = null;
  try {
    credential = await loadFromFile();
  } catch (error) {
    throw error;
  }

  const credentialIsVerified = credentialVerified(credential);

  if (!credentialIsVerified) {
    console.log("reloading credentials " + credentialIsVerified);
    credential = await loadFromServer();
  }

  return credential?.token;
};
