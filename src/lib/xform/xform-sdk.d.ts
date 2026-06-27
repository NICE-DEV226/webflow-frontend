/**
 * Déclarations de types pour le vrai xform-sdk.js (copié du plugin XForm).
 * On ne type que ce qu'on consomme côté frontend.
 */
import type { FormData, FormDefinition } from "./types";

export interface XFormClientConfig {
  baseUrl?: string;
  token?: string;
  pluginPrefix?: string;
}

export interface SubmitResult {
  submission_id: string;
  message: string;
  redirect_url?: string;
}

export interface UploadResult {
  file_id: string;
  original_name: string;
  size_bytes: number;
  mime_type: string;
}

export interface PublicModule {
  getForm(slug: string): Promise<{ form: FormDefinition }>;
  submit(
    slug: string,
    data: Record<string, unknown>,
    meta?: Record<string, unknown>,
  ): Promise<SubmitResult>;
  submitWithFiles(
    slug: string,
    data: FormData,
    meta?: Record<string, unknown>,
    onProgress?: (fieldName: string, progress: number) => void,
  ): Promise<SubmitResult>;
  uploadFile(slug: string, fieldName: string, file: File): Promise<UploadResult>;
}

export class XFormError extends Error {
  code: string;
  details: unknown;
}

export class XFormClient {
  constructor(config?: XFormClientConfig);
  public: PublicModule;
  auth: { setToken(token: string): void; clearToken(): void };
}

export default XFormClient;
