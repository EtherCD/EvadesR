import { HttpResponse } from "uWebSockets.js";

export const getBody = (res: HttpResponse): Promise<any> => {
	return new Promise((resolve, reject) => {
		let buffer: Buffer[] = [];
		let size = 0;

		res.onData((chunk, isLast) => {
			size += chunk.byteLength;
			if (size > 1e6) reject("too large");

			buffer.push(Buffer.from(chunk));

			if (isLast) {
				try {
					resolve(JSON.parse(Buffer.concat(buffer).toString()));
				} catch (e) {
					reject("invalid json");
				}
			}
		});

		res.onAborted(() => reject("aborted"));
	});
};
