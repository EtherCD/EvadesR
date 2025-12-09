import mitt from "mitt";

type NetworkEventsType = {
  all: object;
  direct: { id: number; value: object };
  close: { id: number; reason: string };
  win: { id: number; vp: number };
};

export const networkEvents = mitt<NetworkEventsType>();
