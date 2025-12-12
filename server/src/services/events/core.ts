import mitt from "mitt";
import { AccountRole } from "shared/types";

type CoreEventsType = {
  join: { id: number; name: string; role: AccountRole };
  leave: { id: number; reason?: string };
  message: { msg: string; id: number };
};

export const coreEvents = mitt<CoreEventsType>();
