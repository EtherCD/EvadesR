import Ajv, { Schema } from "ajv";

const bodyRegisterSchema: Schema = {
  type: "object",
  properties: {
    username: { type: "string", maxLength: 16 },
    password: { type: "string", minLength: 4, maxLength: 12 },
    registerToken: { type: "string", minLength: 32 },
  },
};

const bodyLoginSchema: Schema = {
  type: "object",
  properties: {
    username: { type: "string", maxLength: 16 },
    password: { type: "string", minLength: 4 },
  },
};

const bodySessionSchema: Schema = {
  type: "object",
  properties: {
    token: { type: "string", minLength: 64 },
  },
};

const bodyLogoutSchema: Schema = {
  type: "object",
  properties: {
    token: { type: "string", minLength: 64 },
  },
};

const ajv = new Ajv();

export const bodyRegisterValidate = ajv.compile(bodyRegisterSchema);
export const bodyLoginValidate = ajv.compile(bodyLoginSchema);
export const bodySessionValidate = ajv.compile(bodySessionSchema);
export const bodyLogoutValidate = ajv.compile(bodyLogoutSchema);
