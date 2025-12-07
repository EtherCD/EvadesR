import Ajv, { Schema } from "ajv";

const bodyMessageSchema: Schema = {
	type: "object",
	properties: {
		username: { type: "string", maxLength: 16 },
		password: { type: "string", minLength: 4, maxLength: 12 },
	},
};

const bodySessionSchema: Schema = {
	type: "object",
	properties: {
		token: { type: "string", minLength: 64 },
	},
};

const ajv = new Ajv();
export const bodyMessageValidate = ajv.compile(bodyMessageSchema);

export const bodySessionValidate = ajv.compile(bodySessionSchema);
