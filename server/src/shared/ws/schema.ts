import Ajv, { Schema } from "ajv";
import { kMaxLength } from "buffer";

const clientMessageSchema: Schema = {
	type: "object",
	properties: {
		message: { type: "string" },
		keyUp: { type: "string" },
		keyDown: { type: "string" },
		init: {
			type: "object",
			properties: {
				name: { type: "string", minLength: 1, maxLength: 10 },
				session: { type: "string" },
				hero: { type: "string" },
			},
		},
		mouseEnable: { type: "boolean" },
		mousePos: { type: "array", maxItems: 2, items: { type: "number" } },
		ability: { type: "string" },
	},
};

const ajv = new Ajv();
export const clientMessageValidate = ajv.compile(clientMessageSchema);
