import { api } from "./client";

export interface PublicFormLink {
  id: string;
  slug: string;
  title: string;
  active: boolean;
  createdAt: string;
}

export async function getPublicLinks(tenantSlug: string): Promise<PublicFormLink[]> {
  return api.get<PublicFormLink[]>(`/tenants/${tenantSlug}/public-links`);
}

export async function getPublicLink(slug: string): Promise<PublicFormLink> {
  return api.get<PublicFormLink>(`/public-links/${slug}`);
}

export async function createPublicLink(
  tenantSlug: string,
  data: { slug: string; title: string },
): Promise<PublicFormLink> {
  return api.post<PublicFormLink>(`/tenants/${tenantSlug}/public-links`, data);
}

export async function togglePublicLink(id: string): Promise<PublicFormLink> {
  return api.patch<PublicFormLink>(`/public-links/${id}/toggle`);
}

export async function updatePublicLink(
  id: string,
  data: { slug?: string; title?: string },
): Promise<PublicFormLink> {
  return api.put<PublicFormLink>(`/public-links/${id}`, data);
}

export async function deletePublicLink(id: string): Promise<void> {
  return api.delete(`/public-links/${id}`);
}
