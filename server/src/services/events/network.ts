import mitt from "mitt";

type NetworkEventsType = {
  send: Record<number, Buffer>;
};

export const networkEvents = mitt<NetworkEventsType>();
