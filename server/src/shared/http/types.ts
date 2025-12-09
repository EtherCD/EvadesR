export interface AccountProps {
  username: string;
  password: string;
}

export interface RegisterProps {
  username: string;
  password: string;
  registerToken: string;
}

export interface Account {
  id?: number;
  username: string;
  password: string;
  vp?: number;
  highest?: Record<string, number> | null;
  accessories?: string[];
}

export interface Session {
  id: number;
  account_id: number;
  token?: string;
  expires_at?: number;
}

export interface Profile {
  username: string;
  vp: number;
  highest: Record<string, number> | null;
}

export enum ResponseMessage {
  Ok = "all_ok",
  AccountExists = "account_exists",
  AccountNotExists = "account_not_exists",
  InternalError = "internal_error",
  InvalidBody = "invalid_body",
}

export interface DatabaseResponse {
  message: ResponseMessage;
}
