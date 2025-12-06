import mitt from "mitt";

type CoreEventsType = {
	join: { id: number; name: string };
	leave: number;
	message: { msg: string; id: number };
};

export const coreEvents = mitt<CoreEventsType>();
