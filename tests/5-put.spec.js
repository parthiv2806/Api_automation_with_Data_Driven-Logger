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
import { putBookingSchema } from "../schemas/put_schemas";
import putData from "../data/put.json";
import { update_booking } from "../services/put_booking_service";
import { setToken, clearToken } from "../utils/tokenmanager";

test("put valid update", async ({ booking }) => {
  const response = await update_booking(
    booking.bookingid,
    putData.validUpdate
  );
  const body = await response.json();

  Validateschema(putBookingSchema, body);
  validateStatus(response, 200);
  validateTruthy(body.firstname);
  validateTruthy(body.lastname);
  validateProperty(body, "firstname");
  validateProperty(body, "bookingdates");
  validateBody(body, {
    firstname: "Updated",
    lastname: "Name",
    totalprice: 5000,
    depositpaid: true,
    bookingdates: {
      checkin: "2023-01-01",
      checkout: "2023-01-10",
    },
    additionalneeds: "Dinner",
  });
});

test("put change all fields", async ({ booking }) => {
  const response = await update_booking(
    booking.bookingid,
    putData.changeAllFields
  );
  const body = await response.json();

  Validateschema(putBookingSchema, body);
  validateStatus(response, 200);
  validateTruthy(body.firstname);
  validateTruthy(body.lastname);
  validateBody(body, {
    firstname: "NewFirst",
    lastname: "NewLast",
    totalprice: 777,
    depositpaid: false,
    bookingdates: {
      checkin: "2024-05-05",
      checkout: "2024-05-15",
    },
    additionalneeds: "None",
  });
});

test("put incomplete data", async ({ booking }) => {
  const response = await update_booking(
    booking.bookingid,
    putData.incompleteData
  );
  const body = await response.text();
  validateStatus(response, 400);
  validateTextBody(body, "Bad Request");
});

test("put without auth", async ({ booking }) => {
  clearToken();
  const response = await update_booking(
    booking.bookingid,
    putData.validUpdate
  );
  const body = await response.text();
  validateStatus(response, 403);
  validateTextBody(body, "Forbidden");
  setToken(booking.token);
});
