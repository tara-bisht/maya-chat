export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/** Placeholder until `generate_typescript_types` overwrites this file. */
export type Database = Record<string, never>;
