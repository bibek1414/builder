import { AuthUser, DecodedToken } from "@/types";

/**
 * Utility to get a cookie value by name on the client side.
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

/**
 * Decodes the authToken cookie on the client side.
 */
export const getDecodedToken = (): DecodedToken | null => {
  const token = getCookie("authToken");
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // JWT payload is the second part, base64url encoded
    const payload = parts[1];
    // Need to handle base64 decoding carefully on the client
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Failed to decode authToken on client:", error);
    return null;
  }
};

/**
 * Gets the auth user from the authUser cookie on the client side.
 */
export const getAuthUser = (): AuthUser | null => {
  const cookieValue = getCookie("authUser");
  if (!cookieValue) return null;

  try {
    return JSON.parse(decodeURIComponent(cookieValue));
  } catch (error) {
    console.error("Failed to parse authUser cookie on client:", error);
    return null;
  }
};

/**
 * Gets the sub_domain from the authToken cookie or authUser cookie.
 */
export const getSubDomain = (): string | null => {
  // Try getting from authUser first as it's easier
  const authUser = getAuthUser();
  if (authUser?.sub_domain) {
    return authUser.sub_domain;
  }

  // Fallback to authToken
  const decodedToken = getDecodedToken();
  if (decodedToken?.sub_domain) {
    return decodedToken.sub_domain;
  }
  return null;
};

