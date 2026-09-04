import { test } from "../fixture/apiFixtures";
import { expect } from "@playwright/test";
import {
  validateStatus,
  validateTruthy,
  validateProperty,
  validateBody,
  validateTextBody,
} from "../utils/responsevalidator";
import { Validateschema } from "../utils/schemavalidator";
import { Login_Schema } from "../schemas/login_schemas";
test("Valid login", async ({ auth }) => {
  validateStatus(auth.response, 200);
  validateTruthy(auth.body.token);
  validateProperty(auth.body, "token");
  validateBody(auth.body, {
    token: expect.any(String),
  });
  Validateschema(Login_Schema, auth.body);
});
