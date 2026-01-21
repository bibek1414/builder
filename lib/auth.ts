import { cookies } from "next/headers";
import { AuthUser, DecodedToken } from "@/types";

export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const authUserCookie = cookieStore.get("authUser");

  if (!authUserCookie?.value) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(authUserCookie.value));
  } catch (error) {
    console.error("Failed to parse authUser cookie:", error);
    return null;
  }
}

export async function getDecodedToken(): Promise<DecodedToken | null> {
  const cookieStore = await cookies();
  const authTokenCookie = cookieStore.get("authToken");

  if (!authTokenCookie?.value) {
    return null;
  }

  try {
    const parts = authTokenCookie.value.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8');
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Failed to decode authToken:", error);
    return null;
  }
}

export async function getSubDomain(): Promise<string | null> {
  // Try getting from authUser first as it's easier
  const authUser = await getAuthUser();
  if (authUser?.sub_domain) {
    return authUser.sub_domain;
  }

  // Fallback to authToken
  const decodedToken = await getDecodedToken();
  if (decodedToken?.sub_domain) {
    return decodedToken.sub_domain;
  }

  return null;
}
