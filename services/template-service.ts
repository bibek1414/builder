import { siteConfig } from "@/config/site";
import {
  TemplateAccount,
  UseTemplatePayload,
  TemplateListResponse,
} from "@/types/template";

import { getCookie } from "@/lib/auth-client";

const API_BASE_URL = siteConfig.apiUrl;
const API_BUILD_URL = siteConfig.apiBuildUrl;

export const templateService = {
  getTemplates: async (): Promise<TemplateAccount[]> => {
    const token = getCookie("authToken");
    const response = await fetch(`${API_BASE_URL}/api/template-tenants/`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch templates");
    }

    const data: TemplateListResponse = await response.json();
    return data.results;
  },

  useTemplate: async (payload: UseTemplatePayload): Promise<unknown> => {
    const token = getCookie("authToken");
    const response = await fetch(`${API_BASE_URL}/api/templates/use/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        ...payload,
        token: token, // User requested to pass token in the body as well
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to use template");
    }

    return response.json();
  },

  useRealData: async (): Promise<unknown> => {
    const token = getCookie("authToken");
    const response = await fetch(`${API_BUILD_URL}/api/builder/use-data/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to use real data");
    }

    return response.json();
  },
};
