export interface AccountProps {
	username: string;
	password: string;
}

export interface Account {
	id: number;
	username: string;
	password: string;
	vp: number;
	highest: Record<string, number> | null;
}

export interface Session {
	id: number;
	account_id: number;
	session_token: string;
	expires_at: number;
}

export interface SafeAccount {
	username: string;
	vp: number;
	highest: Record<string, number> | null;
}
