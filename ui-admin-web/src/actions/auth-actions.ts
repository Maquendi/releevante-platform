"use server";

import { setCookie } from "@/lib/cookies";
import {fetchHelper } from "@/lib/htttp/http-client";
import { API_CONFIG } from "@/lib/htttp/utils";
import { unstable_cache } from "next/cache";

export async function getM2MToken(): Promise<string> {
  const clientId = API_CONFIG.CLIENT_ID;
  const requestUrl = `${API_CONFIG.BASE_URL}/auth/m2m/token`;
  const cachedToken = unstable_cache(
    async () => {
      const res = await fetchHelper<string>(requestUrl, {
        method: "POST",
        headers: { ...API_CONFIG.DEFAULT_HEADERS },
        body: JSON.stringify({ clientId }),
      });

      return res.context?.data as string;
    },
    ["M2M_TOKEN"],
    { revalidate: 60 * 60 * 24 }
  );

  return await cachedToken();
}

export async function getClientToken(accessId: string, m2mToken: string) {
  const requestUrl = `${API_CONFIG.BASE_URL}/auth/client/token`;

  const res = await fetchHelper<string>(requestUrl, {
    method: "POST",
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      Authorization: `Bearer ${m2mToken}`,
    },
    body: JSON.stringify({ accessId }),
  });
  return res.context.data;
}

export async function authClientAcessId(accessId: string) {
  const m2mToken = await getM2MToken();
  const clientToken = await getClientToken(accessId, m2mToken);
  if (!clientToken) {
    throw new Error("Error getting client token");
  }
  setCookie(API_CONFIG.CLIENT_TOKEN!, clientToken);
  return clientToken;
}


export async function authSignOut() {}
