import mitt from "mitt";
import { Entity } from "../../core/objects/entity";

type CoreEventsType = {
  join: { id: number; name: string };
  leave: { id: number; reason?: string };
  message: { msg: string; id: number };
  newEntity: { area: number; world: string; ent: Entity };
};

export const coreEvents = mitt<CoreEventsType>();
