import mitt from "mitt";

type NetworkEventsType = {
	all: unknown;
	direct: { id: number; value: unknown };
};

export const networkEvents = mitt<NetworkEventsType>();
