import { test as base } from "@playwright/test";
import { Login_function } from "../services/login_service";
import users from "../data/users.json";
import { setToken } from "../utils/tokenmanager";
import { initApiClient } from "../utils/apiclients";
import { Create_booking } from "../services/Create_booking_servicce";
import bookingData from "../data/createBooking.json";
export const test = base.extend({
  apiClient: [
    async ({}, use) => {
      await initApiClient();
      await use();
    },
    { scope: "worker" },
  ],
  auth: [
    async ({ apiClient }, use) => {
      //   await initApiClient();
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
  booking: [
    async ({ apiClient, auth }, use) => {
      const response = await Create_booking(bookingData.validUser_booking);

      const body = await response.json();
      console.log(body);
      const bookingid = body.bookingid;

      console.log("Created Booking ID:", bookingid);

      await use({
        response,
        body,
        bookingid,
        token: auth.body.token,
      });
    },
    { scope: "worker" },
  ],
});
