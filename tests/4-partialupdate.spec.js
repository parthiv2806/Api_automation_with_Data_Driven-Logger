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
import { partialUpdateBookingFlexibleSchema } from "../schemas/partialUpdate_schemas";
import partialUpdateData from "../data/partialUpdate.json";
import { partial_update_booking } from "../services/partial_update_booking_service";
import { setToken, clearToken } from "../utils/tokenmanager";

test("partial update firstname", async ({ booking }) => {
  const response = await partial_update_booking(
    booking.bookingid,
    partialUpdateData.updateFirstname
  );
  const body = await response.json();

  Validateschema(partialUpdateBookingFlexibleSchema, body);
  validateStatus(response, 200);
  validateProperty(body, "firstname");
  validateBody(body, {
    firstname: "UpdatedParthiv",
  });
});

test("partial update lastname", async ({ booking }) => {
  const response = await partial_update_booking(
    booking.bookingid,
    partialUpdateData.updateLastname
  );
  const body = await response.json();

  Validateschema(partialUpdateBookingFlexibleSchema, body);
  validateStatus(response, 200);
  validateProperty(body, "lastname");
  validateBody(body, {
    lastname: "NewBhavsar",
  });
});

test("partial update totalprice", async ({ booking }) => {
  const response = await partial_update_booking(
    booking.bookingid,
    partialUpdateData.updateTotalPrice
  );
  const body = await response.json();

  Validateschema(partialUpdateBookingFlexibleSchema, body);
  validateStatus(response, 200);
  validateProperty(body, "totalprice");
  validateBody(body, {
    totalprice: 99999,
  });
});

test("partial update depositpaid", async ({ booking }) => {
  const response = await partial_update_booking(
    booking.bookingid,
    partialUpdateData.updateDepositPaid
  );
  const body = await response.json();

  Validateschema(partialUpdateBookingFlexibleSchema, body);
  validateStatus(response, 200);
  validateProperty(body, "depositpaid");
  validateBody(body, {
    depositpaid: true,
  });
});

test("partial update bookingdates", async ({ booking }) => {
  const response = await partial_update_booking(
    booking.bookingid,
    partialUpdateData.updateBookingDates
  );
  const body = await response.json();

  Validateschema(partialUpdateBookingFlexibleSchema, body);
  validateStatus(response, 200);
  validateProperty(body, "bookingdates");
  validateBody(body, {
    bookingdates: {
      checkin: "2023-06-01",
      checkout: "2023-06-10",
    },
  });
});

test("partial update additionalneeds", async ({ booking }) => {
  const response = await partial_update_booking(
    booking.bookingid,
    partialUpdateData.updateAdditionalNeeds
  );
  const body = await response.json();

  Validateschema(partialUpdateBookingFlexibleSchema, body);
  validateStatus(response, 200);
  validateProperty(body, "additionalneeds");
  validateBody(body, {
    additionalneeds: "Dinner",
  });
});

test("partial update multiple fields", async ({ booking }) => {
  const response = await partial_update_booking(
    booking.bookingid,
    partialUpdateData.updateMultipleFields
  );
  const body = await response.json();

  Validateschema(partialUpdateBookingFlexibleSchema, body);
  validateStatus(response, 200);
  validateProperty(body, "firstname");
  validateProperty(body, "lastname");
  validateProperty(body, "totalprice");
  validateProperty(body, "depositpaid");
  validateBody(body, {
    firstname: "UpdatedFirst",
    lastname: "UpdatedLast",
    totalprice: 55555,
    depositpaid: true,
  });
});

test("partial update without auth", async ({ booking }) => {
  clearToken();
  const response = await partial_update_booking(
    booking.bookingid,
    partialUpdateData.updateFirstname
  );
  const body = await response.text();
  validateStatus(response, 403);
  validateTextBody(body, "Forbidden");
  setToken(booking.token);
});