export interface TemplateCategory {
  id: number;
  name: string;
  slug: string;
}

export interface TemplateSubcategory {
  id: number;
  name: string;
  slug: string;
  category: TemplateCategory;
}

export interface TemplateAccount {
  id: number;
  name: string;
  schema_name: string;
  owner_id: number;
  created_on: string;
  paid_until: string | null;
  template_image: string | null;
  is_template_account: boolean;
  template_category: TemplateCategory | null;
  template_subcategory: TemplateSubcategory | null;
  domains: string[];
  description: string | null;
  repo_url: string | null;
  preview_url: string | null;
}

export interface TemplateListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TemplateAccount[];
}

export interface UseTemplatePayload {
  template_id?: number;
}
