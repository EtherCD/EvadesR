import { TemplatedApp } from "uWebSockets.js";
import { getBody } from "./body";
import { bodyMessageValidate, bodySessionValidate } from "../../shared/http/schema";
import { AccountProps } from "../../shared/http/types";
import { database } from "../../services/db";

export class HTTPServer {
	constructor(app: TemplatedApp) {
		app
			.post("/register", async (res, req) => {
				try {
					res.writeHeader("Content-Type", "application/json");

					const json = (await getBody(res)) as AccountProps;
					const valid = bodyMessageValidate(json);

					if (valid) {
						const output = await database.register(json);

						res.end(JSON.stringify(output));
						return;
					}
					res.end('{"success":false,"reason":"Body is not valid!"}');
				} catch (e) {
					res.end('{"success":false,"reason":"Internal Error"}');
				}
			})
			.post("/logout", (res, req) => {
				res.writeStatus("403");
				res.write("Auth failed");
				res.end();
			})
			.post("/login", async (res, req) => {
				try {
					res.writeHeader("Content-Type", "application/json");

					const json = (await getBody(res)) as AccountProps;
					const valid = bodyMessageValidate(json);

					if (valid) {
						const output = await database.login(json);

						res.end(JSON.stringify(output));
						return;
					}
					res.end('{"success":false,"reason":"Body is not valid!"}');
				} catch (e) {
					res.end('{"success":false,"reason":"Internal Error"}');
				}
			})
			.post("/check", async (res, req) => {
				try {
					res.writeHeader("Content-Type", "application/json");

					const json = (await getBody(res)) as { token: string };
					const valid = bodySessionValidate(json);

					if (valid) {
						res.end(JSON.stringify({ valid: database.checkAuth(json.token) }));
						return;
					}
					res.end('{"success":false,"reason":"Body is not valid!"}');
				} catch (e) {
					res.end('{"success":false,"reason":"Internal Error"}');
				}
			});
	}
}
