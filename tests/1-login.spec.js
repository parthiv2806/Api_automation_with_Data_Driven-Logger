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
import { Login_Schema, Login_Error_Schema } from "../schemas/login_schemas";
import users from "../data/users.json";
import { Login_function } from "../services/login_service";
test("Valid login", async ({ auth }) => {
  Validateschema(Login_Schema, auth.body); //Pahele structure check hota hai bad mai ham respnsoe chek karte hai ki vlaue hai ki nai hai
  validateStatus(auth.response, 200);
  validateTruthy(auth.body.token);
  validateProperty(auth.body, "token");
  validateBody(auth.body, {
    token: expect.any(String),
  });
});

test("invalidUsername", async ({ auth }) => {
  const response = await Login_function(users.invalidUsername);
  const body = await response.json();
  Validateschema(Login_Error_Schema, body);
  validateStatus(response, 200);
  validateTruthy(body.reason);
  validateProperty(body, "reason");
  validateBody(body, {
    reason: "Bad credentials",
  });
});

test("invalidPassword", async ({ auth }) => {
  const response = await Login_function(users.invalidPassword);
  const body = await response.json();
  Validateschema(Login_Error_Schema, body);
  validateStatus(response, 200);
  validateTruthy(body.reason);
  validateProperty(body, "reason");
  validateBody(body, {
    reason: "Bad credentials",
  });
});

test("emptyUsername", async ({ auth }) => {
  const response = await Login_function(users.emptyUsername);
  const body = await response.json();
  Validateschema(Login_Error_Schema, body);
  validateStatus(response, 200);
  validateTruthy(body.reason);
  validateProperty(body, "reason");
  validateBody(body, {
    reason: "Bad credentials",
  });
});

test("emptyPassword", async ({ auth }) => {
  const response = await Login_function(users.emptyPassword);
  const body = await response.json();
  Validateschema(Login_Error_Schema, body);
  validateStatus(response, 200);
  validateTruthy(body.reason);
  validateProperty(body, "reason");
  validateBody(body, {
    reason: "Bad credentials",
  });
});

test("bothEmpty", async ({ auth }) => {
  const response = await Login_function(users.bothEmpty);
  const body = await response.json();
  Validateschema(Login_Error_Schema, body);
  validateStatus(response, 200);
  validateTruthy(body.reason);
  validateProperty(body, "reason");
  validateBody(body, {
    reason: "Bad credentials",
  });
});

test("missingUsernameKey", async ({ auth }) => {
  const response = await Login_function(users.missingUsernameKey);
  const body = await response.json();
  Validateschema(Login_Error_Schema, body);
  validateStatus(response, 200);
  validateTruthy(body.reason);
  validateProperty(body, "reason");
  validateBody(body, {
    reason: "Bad credentials",
  });
});

test("missingPasswordKey", async ({ auth }) => {
  const response = await Login_function(users.missingPasswordKey);
  const body = await response.json();
  Validateschema(Login_Error_Schema, body);
  validateStatus(response, 200);
  validateTruthy(body.reason);
  validateProperty(body, "reason");
  validateBody(body, {
    reason: "Bad credentials",
  });
});

test("nullValues", async ({ auth }) => {
  const response = await Login_function(users.nullValues);
  const body = await response.json();
  Validateschema(Login_Error_Schema, body);
  validateStatus(response, 200);
  validateTruthy(body.reason);
  validateProperty(body, "reason");
  validateBody(body, {
    reason: "Bad credentials",
  });
});

test("wrongDataTypes", async ({ auth }) => {
  const response = await Login_function(users.wrongDataTypes);
  const body = await response.json();
  Validateschema(Login_Error_Schema, body);
  validateStatus(response, 200);
  validateTruthy(body.reason);
  validateProperty(body, "reason");
  validateBody(body, {
    reason: "Bad credentials",
  });
});

test("extraFields", async ({ auth }) => {
  const response = await Login_function(users.extraFields);
  const body = await response.json();
  Validateschema(Login_Schema, body);
  validateStatus(response, 200);
  validateTruthy(body.token);
  validateProperty(body, "token");
  validateBody(body, {
    token: expect.any(String),
  });
});
