import mitt from "mitt";
import { Entity } from "../../core/objects/entity";

type CoreEventsType = {
  join: { id: number; name: string };
  leave: number;
  message: { msg: string; id: number };
  newEntity: Entity;
};

export const coreEvents = mitt<CoreEventsType>();
