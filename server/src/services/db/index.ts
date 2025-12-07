import Database from "better-sqlite3";
import path from "path";
import { Env } from "../env";
import { Account, AccountProps, SafeAccount, Session } from "../../shared/http/types";
import { DatabaseResponse } from "../../shared/services/types";
import { hashPassword, verifyPassword } from "./hash";
import { randomBytes } from "crypto";

const pathToDB = path.join("./", Env.storagePath, Env.databaseFile);

const db = new Database(pathToDB);

db.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				username TEXT UNIQUE NOT NULL,
				password TEXT NOT NULL,
				vp INTEGER DEFAULT 0,
				highest TEXT
		);

		CREATE TABLE IF NOT EXISTS sessions (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				account_id INTEGER NOT NULL,
				session_token TEXT UNIQUE NOT NULL,
				expires_at INTEGER NOT NULL,
				FOREIGN KEY(account_id) REFERENCES accounts(id)
		);
		`);

export class SQLDatabase {
	createAccountStmt = db.prepare<[string, string], unknown>(`
		INSERT INTO accounts (username, password)
    VALUES (?, ?)
		`);
	createSessionStmt = db.prepare<[number, string, number], unknown>(`
			INSERT INTO sessions (account_id, session_token, expires_at)
      VALUES (?, ?, ?)
			`);
	getAccountStmt = db.prepare<[string], Account>(`
			SELECT * FROM accounts WHERE username = ?
			`);
	getAccountByIdStmt = db.prepare<[number], Account>(`
			SELECT * FROM accounts WHERE id = ?
			`);
	getSessionStmt = db.prepare<[string, number], Session>(`
		SELECT accounts.* 
		FROM sessions 
		JOIN accounts ON sessions.account_id = accounts.id
		WHERE sessions.session_token = ? 
    AND sessions.expires_at > ?`);
	deleteSessionStmt = db.prepare<[string], unknown>(`
    DELETE FROM sessions WHERE session_token = ?
    `);

	async register(account: AccountProps): Promise<DatabaseResponse> {
		const exists = this.getAccountStmt.get(account.username);

		if (exists) return { success: false, reason: "account_exists" };

		const hashedPassword = await hashPassword(account.password);

		this.createAccountStmt.run(account.username, hashedPassword);

		return {
			success: true,
			reason: "all_ok",
		};
	}

	async login({ username, password }: AccountProps): Promise<DatabaseResponse & { token?: string }> {
		const account = this.getAccountStmt.get(username);

		if (!account) return { success: false, reason: "account_not_exists" };

		if (!(await verifyPassword(account.password, password))) return { success: false, reason: "account_not_exists" };

		const token = randomBytes(32).toString("hex");

		this.createSessionStmt.run(account.id, token, Date.now() + 7 * 24 * 60 * 60 * 1000);

		return {
			success: true,
			reason: "all_ok",
			token,
		};
	}

	checkAuth(token: string): boolean {
		const session = this.getSession(token);

		return session !== null;
	}

	auth(token: string): SafeAccount | undefined {
		const session = this.getSession(token);

		if (session === null) return undefined;

		const account = this.getAccountByIdStmt.get(session.account_id);

		if (account)
			return {
				vp: account.vp,
				highest: account.highest,
				username: account.username,
			};
		return undefined;
	}

	logout(token: string) {
		if (!this.checkAuth(token)) return;

		this.deleteSessionStmt.run(token);
	}

	getSession(token: string): Session | null {
		const now = Date.now();

		const session = db.transaction(() => {
			db.prepare(`DELETE FROM sessions WHERE session_token = ? AND expires_at <= ?`).run(token, now);

			return db
				.prepare<[string, number], Session>(
					`
            SELECT accounts.* 
            FROM sessions 
            JOIN accounts ON sessions.account_id = accounts.id
            WHERE sessions.session_token = ? AND sessions.expires_at > ?
        `
				)
				.get(token, now);
		})();

		return session || null;
	}
}

export const database = new SQLDatabase();
// const createUserStmt = db.prepare(`
//     INSERT INTO accounts (username, password, highest, session)
//     VALUES (?, ?, ?, ?)
// `);

// const getUserStmt = db.prepare(`
//     SELECT * FROM accounts WHERE username = ?
// `);

// const updateHighestStmt = db.prepare(`
//     UPDATE accounts SET highest = ? WHERE id = ?
// `);

// export const registerAccount = async (props: AccountProps) => {
// 	if (isAccountExists(props.username)) return null;
// 	createUserStmt.run(props.username, await hashPassword(props.password), JSON.stringify({}), null);
// };

// export const loginAccount = async (props: AccountProps) => {
// 	const account = getAccount(props.username);
// 	if (!account) return null;

// 	const ok = await verifyPassword(account.password, props.password);
// 	if (!ok) return null;

// 	return account;
// };

// export const isAccountExists = (name: string) => {
// 	const account = getAccount(name);
// 	return account !== null;
// };

// export const getAccount = (name: string): Account | null => {
// 	const row = getUserStmt.get(name);
// 	if (!row) return null;

// 	return {
// 		username: row.username + "",
// 		password: row.password + "",
// 		highest: JSON.parse(row.highest + ""),
// 		session: row.session ? JSON.parse(row.session + "") : null,
// 	};
// };

// export const updateHighest = (id: number, data: Record<string, number>) => {
// 	updateHighestStmt.run(JSON.stringify(data), id);
// };
