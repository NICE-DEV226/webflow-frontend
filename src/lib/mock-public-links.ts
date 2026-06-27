export interface PublicFormLink {
  id: string;
  slug: string;
  tenantSlug: string;
  title: string;
  active: boolean;
  createdAt: string;
  url: string;
}

let _links: PublicFormLink[] = [
  {
    id: "pl-1",
    slug: "sinistre-auto",
    tenantSlug: "demo",
    title: "Déclaration sinistre auto",
    active: true,
    createdAt: "2026-06-01T08:00:00Z",
    url: "",
  },
  {
    id: "pl-2",
    slug: "sante-remboursement",
    tenantSlug: "demo",
    title: "Remboursement santé",
    active: true,
    createdAt: "2026-06-05T10:30:00Z",
    url: "",
  },
];

export function getPublicLinks(tenantSlug: string): PublicFormLink[] {
  return _links.filter((l) => l.tenantSlug === tenantSlug);
}

export function getPublicLink(slug: string): PublicFormLink | undefined {
  return _links.find((l) => l.slug === slug);
}

export function createPublicLink(data: {
  slug: string;
  tenantSlug: string;
  title: string;
}): PublicFormLink {
  const link: PublicFormLink = {
    id: `pl-${Date.now()}`,
    slug: data.slug,
    tenantSlug: data.tenantSlug,
    title: data.title,
    active: true,
    createdAt: new Date().toISOString(),
    url: `/f/${data.slug}`,
  };
  _links.push(link);
  return link;
}

export function togglePublicLink(id: string): PublicFormLink | null {
  const link = _links.find((l) => l.id === id);
  if (!link) return null;
  link.active = !link.active;
  return link;
}

export function deletePublicLink(id: string): boolean {
  const idx = _links.findIndex((l) => l.id === id);
  if (idx === -1) return false;
  _links.splice(idx, 1);
  return true;
}

export function updatePublicLink(id: string, data: Partial<Pick<PublicFormLink, "title" | "slug">>): PublicFormLink | null {
  const link = _links.find((l) => l.id === id);
  if (!link) return null;
  if (data.title) link.title = data.title;
  if (data.slug) link.slug = data.slug;
  return link;
}
