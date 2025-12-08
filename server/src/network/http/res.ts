import { HttpResponse } from "uWebSockets.js";
import { DatabaseResponse } from "../../shared/http/types";

export const makeResponse = (
  res: HttpResponse,
  successful: boolean,
  status: number,
  data: DatabaseResponse & object
) => {
  res.writeHeader("Content-Type", "application/json");
  res.writeStatus(status + "");
  res.write(JSON.stringify({ successful, data }));
  res.end();
};
