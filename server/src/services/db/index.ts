import Database from "better-sqlite3";
import path from "path";
import { Env } from "../env";
import {
  Account,
  AccountProps,
  DatabaseResponse,
  ResponseMessage,
  Profile,
  Session,
} from "../../shared/http/types";
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

  async register(
    account: AccountProps
  ): Promise<DatabaseResponse & { token?: string; profile?: Profile }> {
    const exists = this.getAccountStmt.get(account.username);

    if (exists) return { message: ResponseMessage.AccountExists };

    const hashedPassword = await hashPassword(account.password);

    this.createAccountStmt.run(account.username, hashedPassword);

    const token = randomBytes(32).toString("hex");

    const user = this.getAccountStmt.get(account.username)!;

    this.createSessionStmt.run(
      user.id,
      token,
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    return {
      message: ResponseMessage.Ok,
      token,
      profile: {
        username: user.username,
        vp: user.vp,
        highest: user.highest,
      },
    };
  }

  async login({
    username,
    password,
  }: AccountProps): Promise<
    DatabaseResponse & { token?: string; profile?: Profile }
  > {
    const account = this.getAccountStmt.get(username);

    if (!account) return { message: ResponseMessage.AccountNotExists };

    if (!(await verifyPassword(account.password, password)))
      return { message: ResponseMessage.AccountNotExists };

    const token = randomBytes(32).toString("hex");

    this.createSessionStmt.run(
      account.id,
      token,
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    return {
      message: ResponseMessage.Ok,
      token,
      profile: {
        username: account.username,
        highest: account.highest,
        vp: account.vp,
      },
    };
  }

  checkAuth(token: string): boolean {
    const session = this.getSession(token);

    return session !== null;
  }

  auth(token: string): Profile | undefined {
    const account = this.getSession(token);

    if (account === null) return undefined;

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

  getSession(token: string): Account | null {
    const now = Date.now();

    const session = db.transaction(() => {
      db.prepare(
        `DELETE FROM sessions WHERE session_token = ? AND expires_at <= ?`
      ).run(token, now);

      return db
        .prepare<[string, number], Account>(
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
