import { Account } from "server/src/shared/http/types";

export class DBProfile {
  username: string;
  vp: number;
  highest: Record<string, number>;
  accessories: string[];

  constructor(props: Account) {
    this.username = props.username;
    this.vp = props.vp ?? 0;
    this.highest = props.highest ?? {};
    this.accessories = props.accessories ?? [];
  }
}
