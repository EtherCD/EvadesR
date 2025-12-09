import { randomBytes } from "crypto";
import knex from "knex";
import { Session } from "server/src/shared/http/types";

export class DBSession {
  id: number;
  account_id: number;
  token: string;
  expires_at: number;

  db: knex.Knex;

  constructor(props: Session, db: knex.Knex) {
    this.id = props.id ?? 0;
    this.account_id = props.account_id;
    this.token = props.token ?? randomBytes(32).toString("hex");
    this.expires_at = props.expires_at ?? Date.now() + 7 * 24 * 60 * 60 * 1000;
    this.db = db;
  }

  async write() {
    const oldSession = await DBSession.getSessionById(this.db, this.account_id);
    if (oldSession !== null)
      await this.db("sessions")
        .where({ account_id: this.account_id })
        .first()
        .delete();
    const [id, token] = await this.db("sessions")
      .insert({
        account_id: this.account_id,
        token: this.token,
        expires_at: this.expires_at,
      })
      .returning("id")
      .returning("token");
    this.id = id;
    return token;
  }

  static async getSession(db: knex.Knex, token: string) {
    const session = await db("sessions").where({ token }).first();

    if (!session) return null;

    return new DBSession(session, db);
  }

  static async getSessionById(db: knex.Knex, account_id: number) {
    const session = await db("sessions").where({ account_id }).first();

    if (!session) return null;

    return new DBSession(session, db);
  }

  static async remove(db: knex.Knex, token: string) {
    const session = await db("sessions").where({ token }).delete();

    if (!session) return null;
  }
}
