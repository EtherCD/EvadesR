import mitt from "mitt";

type NetworkEventsType = {
  send: Record<number, Buffer>;
  leave: number;
};

export const networkEvents = mitt<NetworkEventsType>();
