import { api } from "./client";

export interface FormField {
  [key: string]: unknown;
}

export interface CreateFormBody {
  title: string;
  description?: string | null;
  fields: FormField[];
  steps?: FormField[];
  settings?: Record<string, unknown>;
  theme?: Record<string, unknown>;
  tags?: string[];
}

export interface FormResponse {
  id?: string;
  title?: string;
  description?: string | null;
  fields?: FormField[];
  steps?: FormField[];
  settings?: Record<string, unknown>;
  theme?: Record<string, unknown>;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export async function getForms(): Promise<FormResponse[]> {
  return api.get<FormResponse[]>("/xform/forms");
}

export async function getForm(id: string): Promise<FormResponse> {
  return api.get<FormResponse>(`/xform/forms/${id}`);
}

export async function createForm(data: CreateFormBody): Promise<FormResponse> {
  return api.post<FormResponse>("/xform/forms", data);
}

export async function updateForm(id: string, data: Partial<CreateFormBody>): Promise<FormResponse> {
  return api.put<FormResponse>(`/xform/forms/${id}`, data);
}

export async function deleteForm(id: string): Promise<void> {
  return api.delete(`/xform/forms/${id}`);
}

export async function getFormSubmissions(id: string): Promise<Record<string, unknown>[]> {
  return api.get<Record<string, unknown>[]>(`/xform/forms/${id}/submissions`);
}

export async function getFormAnalytics(id: string): Promise<Record<string, unknown>> {
  return api.get<Record<string, unknown>>(`/xform/forms/${id}/analytics`);
}

export async function getPublicForm(slug: string): Promise<FormResponse> {
  return api.get<FormResponse>(`/xform/public/${slug}`);
}

export async function submitPublicForm(slug: string, data: Record<string, unknown>): Promise<void> {
  return api.post(`/xform/public/${slug}/submit`, { data });
}
