import mitt from "mitt";

type DatabaseEventsType = {
  award: { username: string; vp: number; accessory?: string };
};

export const databaseEvents = mitt<DatabaseEventsType>();
