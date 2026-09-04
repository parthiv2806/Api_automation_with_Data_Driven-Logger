export const Login_Schema = {
  type: "object",

  additionalProperties: false,

  required: ["token"],

  properties: {
    token: {
      type: "string",

      minLength: 1,
      maxLength: 128,

      pattern: "^[a-zA-Z0-9]+$",

      nullable: false,
    },
  },
};

export const Login_Error_Schema = {
  type: "object",

  additionalProperties: false,

  required: ["reason"],

  properties: {
    reason: {
      type: "string",
      enum: ["Bad credentials"],
    },
  },
};
