import mitt from "mitt";

type NetworkEventsType = {
	all: object;
	direct: { id: number; value: object };
};

export const networkEvents = mitt<NetworkEventsType>();
