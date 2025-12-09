import { Account } from "server/src/shared/http/types";
import { AccountRole } from "shared/types";

export class DBProfile {
  username: string;
  vp: number;
  highest: Record<string, number>;
  accessories: string[];
  role: AccountRole;

  constructor(props: Account) {
    this.username = props.username;
    this.vp = props.vp ?? 0;
    this.highest = props.highest ?? {};
    this.accessories = props.accessories ?? [];
    this.role = props.role;
  }
}
