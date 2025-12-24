import { HttpResponse, TemplatedApp } from "uWebSockets.js";
import { getBody } from "./body";
import { bodyLoginValidate, bodyRegisterValidate, bodySessionValidate } from "../../shared/http/schema";
import { AccountProps, RegisterProps, ResponseMessage } from "../../shared/http/types";
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
        this.setCorsHeaders(res);
        res.writeHeader("Content-Type", "application/json");

        getBody(res)
          .then((json: RegisterProps) => {
            const valid = bodyRegisterValidate(json);

            if (valid && json.registerToken === Env.registerToken) {
              -database.register(json).then((output) => {
                makeResponse(
                  res,
                  output.message === ResponseMessage.Ok,
                  200,
                  output,
                );
              });
            }
            makeResponse(res, false, 400, {
              message: ResponseMessage.InvalidBody,
            });
          })
          .catch((e) => {
            makeResponse(res, false, 500, {
              message: ResponseMessage.InternalError,
            });
          });
      })
      .post("/login", (res, req) => {
        this.setCorsHeaders(res);
        res.writeHeader("Content-Type", "application/json");

        res.onAborted(() => {
          makeResponse(res, false, 500, {
            message: ResponseMessage.InternalError,
          });
        });

        getBody(res)
          .then((json: AccountProps) => {
            const valid = bodyLoginValidate(json);

            if (valid) {
              database.login(json).then((output) => {
                if (output.message === ResponseMessage.Ok)
                  makeResponse(res, true, 200, output);
                else makeResponse(res, false, 401, output);
              });
            } else {
              makeResponse(res, false, 400, {
                message: ResponseMessage.InvalidBody,
              });
            }
          })
          .catch(() => {
            makeResponse(res, false, 500, {
              message: ResponseMessage.InternalError,
            });
          });
      })
      .post("/check", (res, req) => {
        this.setCorsHeaders(res);
        res.writeHeader("Content-Type", "application/json");

        res.onAborted(() => {
          makeResponse(res, false, 500, {
            message: ResponseMessage.InternalError,
          });
        });

        getBody(res)
          .then((json: any) => {
            const valid = bodySessionValidate(json);
            if (valid) {
              database
                // @ts-ignore
                .checkAuth(json.token)
                .then((valid) => {
                  makeResponse(res, true, 200, {
                    // @ts-ignore
                    valid,
                  });
                })
                .catch(() => {
                  makeResponse(res, false, 400, {
                    message: ResponseMessage.InvalidBody,
                  });
                });
            }
          })
          .catch(() => {
            makeResponse(res, false, 500, {
              message: ResponseMessage.InternalError,
            });
          });
      })
      .get("/worlds", (res) => {
        this.setCorsHeaders(res);
        res.writeHeader("Content-Type", "application/json");
        res.writeStatus("200");
        res.write(JSON.stringify(Loader.worldsProps));
        res.end();
      })
      // .get("/online", (res) => {
      //   this.setCorsHeaders(res);
      //   res.writeHeader("Content-Type", "application/json");
      //   res.writeStatus("200");
      //   res.write(JSON.stringify({
      //     online:
      //   }));
      //   res.end();
      // })
      .get("/profile/:username", (res, req) => {
        this.setCorsHeaders(res);
        const username = req.getParameter(0) + "";

        res.onAborted(() => {
          makeResponse(res, false, 500, {
            message: ResponseMessage.InternalError,
          });
        });

        database
          .getProfile(username)
          .then((profile) => {
            if (!profile) {
              makeResponse(res, false, 404, {
                message: ResponseMessage.InvalidBody,
              });
              return;
            } else {
              makeResponse(res, true, 200, {
                // @ts-ignore
                profile,
              });
            }
          })
          .catch(() => {
            makeResponse(res, false, 500, {
              message: ResponseMessage.InternalError,
            });
          });
      })
      .post("/logout", (res, req) => {
        res.cork(async () => {
          this.setCorsHeaders(res);
          try {
            res.writeHeader("Content-Type", "application/json");

            const json = (await getBody(res)) as {
              token: string;
            };
            const valid = bodySessionValidate(json);

            if (valid) {
              await database.logout(json.token);
              makeResponse(res, true, 200);
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
      });
  }

  setCorsHeaders(response: HttpResponse) {
    if (Env.dev) {
      response.writeHeader("Access-Control-Allow-Origin", "*");
    } else {
      response.writeHeader("Access-Control-Allow-Origin", Env.clientUri);
    }
    response.writeHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.writeHeader(
      "Access-Control-Allow-Headers",
      "origin, content-type, accept, x-requested-with",
    );
    response.writeHeader("Access-Control-Max-Age", "3600");
  }
}
