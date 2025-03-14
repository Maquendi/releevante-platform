import { getM2MToken } from "@/actions/auth-actions";
import { API_COOKIE, isTokenValid } from "./utils";

export async function retrieveToken(): Promise<string> {
  const m2mToken = await getM2MToken();
  const cachedClientCookie = API_COOKIE.CLIENT_TOKEN()?.value;
  if (cachedClientCookie && isTokenValid(cachedClientCookie)) {
    return cachedClientCookie;
  }

  return m2mToken;
}


