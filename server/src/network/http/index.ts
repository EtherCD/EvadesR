import { HttpResponse, TemplatedApp } from "uWebSockets.js";
import { getBody } from "./body";
import {
  bodyLoginValidate,
  bodyRegisterValidate,
  bodySessionValidate,
} from "../../shared/http/schema";
import {
  AccountProps,
  RegisterProps,
  ResponseMessage,
} from "../../shared/http/types";
import { database } from "../../services/db";
import { Env } from "../../services/env";
import { makeResponse } from "./res";
import { Loader } from "server/src/services/loader";

export class HTTPServer {
  constructor(app: TemplatedApp) {
    app.options("/*", (res, req) => {
      this.setCorsHeaders(res);
      res.writeStatus("204 No Content").end();
    });
    app
      .post("/register", (res, req) => {
        res.cork(async () => {
          this.setCorsHeaders(res);
          try {
            res.writeHeader("Content-Type", "application/json");

            const json = (await getBody(res)) as RegisterProps;
            const valid = bodyRegisterValidate(json);

            if (valid && json.registerToken === Env.registerToken) {
              const output = await database.register(json);

              makeResponse(
                res,
                output.message === ResponseMessage.Ok,
                200,
                output
              );
              return;
            }
            makeResponse(res, false, 400, {
              message: ResponseMessage.InvalidBody,
            });
          } catch (e) {
            makeResponse(res, false, 500, {
              message: ResponseMessage.InternalError,
            });
          }
        });
      })
      .post("/login", (res, req) => {
        res.cork(async () => {
          this.setCorsHeaders(res);
          try {
            res.writeHeader("Content-Type", "application/json");
            const json = (await getBody(res)) as AccountProps;
            const valid = bodyLoginValidate(json);

            if (valid) {
              const output = await database.login(json);

              if (output.message === ResponseMessage.Ok)
                makeResponse(res, true, 200, output);
              else makeResponse(res, false, 401, output);
              return;
            }
            makeResponse(res, false, 400, {
              message: ResponseMessage.InvalidBody,
            });
          } catch (e) {
            makeResponse(res, false, 500, {
              message: ResponseMessage.InternalError,
            });
          }
        });
      })
      .post("/check", (res, req) => {
        res.cork(async () => {
          this.setCorsHeaders(res);
          try {
            res.writeHeader("Content-Type", "application/json");

            const json = (await getBody(res)) as {
              token: string;
            };
            const valid = bodySessionValidate(json);

            if (valid) {
              makeResponse(res, true, 200, {
                // @ts-ignore
                valid: await database.checkAuth(json.token),
              });
              return;
            }
            makeResponse(res, false, 400, {
              message: ResponseMessage.InvalidBody,
            });
          } catch (e) {
            makeResponse(res, false, 500, {
              message: ResponseMessage.InternalError,
            });
          }
        });
      })
      .get("/worlds", (res) => {
        this.setCorsHeaders(res);
        res.writeHeader("Content-Type", "application/json");
        res.writeStatus("200");
        res.write(JSON.stringify(JSON.stringify(Loader.worldsProps)));
        res.end();
      });
    // .post("/logout", (res, req) => {
    //   res.cork(async () => {
    //     this.setCorsHeaders(res);
    //     try {
    //       res.writeHeader("Content-Type", "application/json");

    //       const json = (await getBody(res)) as {
    //         token: string;
    //       };
    //       const valid = bodySessionValidate(json);

    //       if (valid) {
    //         await database.logout(json.token);
    //         makeResponse(res, true, 200);
    //         return;
    //       }
    //       makeResponse(res, false, 400, {
    //         message: ResponseMessage.InvalidBody,
    //       });
    //     } catch (e) {
    //       makeResponse(res, false, 500, {
    //         message: ResponseMessage.InternalError,
    //       });
    //     }
    //   });
    // });
  }

  setCorsHeaders(response: HttpResponse) {
    if (Env.dev) {
      response.writeHeader("Access-Control-Allow-Origin", "*");
    } else {
      response.writeHeader("Access-Control-Allow-Origin", Env.clientUri);
    }
    response.writeHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.writeHeader(
      "Access-Control-Allow-Headers",
      "origin, content-type, accept, x-requested-with"
    );
    response.writeHeader("Access-Control-Max-Age", "3600");
  }
}
