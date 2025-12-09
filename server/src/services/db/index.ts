import path from "path";
import { Env } from "../env";
import {
  AccountProps,
  DatabaseResponse,
  ResponseMessage,
  Profile,
} from "../../shared/http/types";
import knex from "knex";
import { DBAccount } from "./objects/account";
import { DBSession } from "./objects/session";
import { DBProfile } from "./objects/profile";
import { databaseEvents } from "../events/db";

const pathToDB = path.join("./", Env.storagePath, Env.databaseFile);

const db = knex({
  client: "sqlite3",
  connection: {
    filename: pathToDB,
  },
  useNullAsDefault: true,
});

export class SQLDatabase {
  wasInit = false;

  constructor() {
    this.init();
    databaseEvents.on("award", async ({ username, vp, accessory }) => {
      const account = await DBAccount.getByUsername(db, username);
      if (account) {
        account.addVp(vp);
        if (accessory) account.addAccessory(accessory);
      }
    });
  }

  init = async () => {
    if (!(await db.schema.hasTable("accounts")))
      await db.schema.createTable("accounts", (table) => {
        table.increments("id").primary();
        table.string("username").unique().notNullable();
        table.string("password").notNullable();
        table.integer("vp").defaultTo(0);
        table.json("accessories").defaultTo("[]");
        table.json("highest").defaultTo("{}");
      });

    if (!(await db.schema.hasTable("sessions")))
      await db.schema.createTable("sessions", (table) => {
        table.increments("id").primary();
        table
          .integer("account_id")
          .notNullable()
          .references("id")
          .inTable("accounts");
        table.string("token").unique().notNullable();
        table.integer("expires_at").notNullable();
      });

    this.wasInit = true;
  };

  async register({
    username,
    password,
  }: AccountProps): Promise<
    DatabaseResponse & { token?: string; profile?: DBProfile }
  > {
    const exists = await DBAccount.getByUsername(db, username);

    if (exists !== null) return { message: ResponseMessage.AccountExists };

    const account = new DBAccount(
      {
        username,
        password,
      },
      db
    );

    await account.write();

    const session = new DBSession({ account_id: account.id, id: 0 }, db);

    await session.write();

    return {
      message: ResponseMessage.Ok,
      token: session.token,
      profile: new DBProfile(account),
    };
  }

  async login({
    username,
    password,
  }: AccountProps): Promise<
    DatabaseResponse & { token?: string; profile?: Profile }
  > {
    const account = await DBAccount.getByUsername(db, username);

    if (!account) return { message: ResponseMessage.AccountNotExists };

    if (!account.verify(password))
      return { message: ResponseMessage.AccountNotExists };

    const session = new DBSession({ account_id: account.id, id: 0 }, db);

    session.write();

    return {
      message: ResponseMessage.Ok,
      token: session.token,
      profile: new DBProfile(account),
    };
  }

  async auth(token: string) {
    const session = await DBSession.getSession(db, token);

    if (session === null) return null;

    const account = await DBAccount.getById(db, session.account_id);

    if (account) return new DBProfile(account);
    return null;
  }

  async checkAuth(token: string) {
    return (await DBSession.getSession(db, token)) !== null;
  }

  async logout(token: string) {
    if (!(await this.checkAuth(token))) return;

    DBSession.remove(db, token);
  }
}

export const database = new SQLDatabase();
