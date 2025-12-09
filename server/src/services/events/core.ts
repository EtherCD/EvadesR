import mitt from "mitt";
import { Entity } from "../../core/objects/entity";
import { AccountRole } from "shared/types";

type CoreEventsType = {
  join: { id: number; name: string; role: AccountRole };
  leave: { id: number; reason?: string };
  message: { msg: string; id: number };
  newEntity: { area: number; world: string; ent: Entity };
};

export const coreEvents = mitt<CoreEventsType>();
