import { test as base } from "@playwright/test";
import { Login_function } from "../services/login_service";
import users from "../data/users.json";
import { setToken } from "../utils/tokenmanager";
import { initApiClient } from "../utils/apiclients";
export const test = base.extend({
  auth: [
    async ({}, use) => {
      await initApiClient();
      const response = await Login_function(users.validUser);
      const body = await response.json();
      console.log(body);
      setToken(body.token);
      await use({
        response,
        body,
      });
    },
    { scope: "worker" },
  ],
});
