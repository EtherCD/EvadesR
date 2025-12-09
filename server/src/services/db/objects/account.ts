import knex from "knex";
import { Account } from "server/src/shared/http/types";
import { hashPassword, verifyPassword } from "../hash";
import { DBProfile } from "./profile";

export class DBAccount extends DBProfile {
  id: number;
  password: string;

  db: knex.Knex;

  constructor(props: Account, db: knex.Knex) {
    super(props);
    this.id = props.id ?? 0;
    this.password = props.password;
    this.db = db;
  }

  async write() {
    const [id] = await this.db("accounts")
      .insert({
        username: this.username,
        password: await hashPassword(this.password),
        vp: this.vp,
        highest: this.highest,
        accessories: this.accessories,
      })
      .returning("id");
    this.id = id.id;
  }

  async addVp(count: number) {
    await this.db("accounts")
      .where({ username: this.username })
      .increment("vp", count);
  }

  async addAccessory(accessory: string) {
    const accessories = (await this.db("accounts")
      .where({
        username: this.username,
      })
      .first()
      .select("accessories")) as Array<string>;
    accessories.push(accessory);
    const element = await this.db("accounts")
      .where({
        username: this.username,
      })
      .update({
        accessories,
      });
  }

  async verify(password: string) {
    return await verifyPassword(this.password, password);
  }

  static async getByUsername(db: knex.Knex, username: string) {
    const rawAccount = await db("accounts").where({ username }).first();

    if (!rawAccount) return null;

    return new DBAccount(rawAccount, db);
  }

  static async getById(db: knex.Knex, id: number) {
    const rawAccount = await db("accounts").where({ id }).first();

    if (!rawAccount) return null;

    return new DBAccount(rawAccount, db);
  }
}
