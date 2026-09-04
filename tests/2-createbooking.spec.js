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
import { createBookingSchema } from "../schemas/createB_schemas";
import bookingData from "../data/createBooking.json";
import { Create_booking } from "../services/Create_booking_servicce";

test("valid booking", async ({ apiClient }) => {
  const response = await Create_booking(bookingData.validUser_booking);
  const body = await response.json();

  Validateschema(createBookingSchema, body);
  validateStatus(response, 200);
  validateProperty(body, "bookingid");
  validateProperty(body, "booking");
  validateTruthy(body.bookingid);
  validateBody(body, {
    booking: {
      firstname: "Jim",
      lastname: "Brown",
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: "2018-01-01",
        checkout: "2019-01-01",
      },
      additionalneeds: "Breakfast",
    },
  });
});

test("missingRequiredFields", async ({ apiClient }) => {
  const response = await Create_booking(bookingData.missingRequiredFields);
  const body = await response.text();
  validateStatus(response, 500);
  validateTextBody(body, "Internal Server Error");
});

test("emptyStrings", async ({ apiClient }) => {
  const response = await Create_booking(bookingData.emptyStrings);
  const body = await response.json();
  Validateschema(createBookingSchema, body);
  validateStatus(response, 200);
  validateTruthy(body.bookingid);
});

test("invalidDataTypes", async ({ apiClient }) => {
  const response = await Create_booking(bookingData.invalidDataTypes);
  const body = await response.text();
  validateStatus(response, 500);
  validateTextBody(body, "Internal Server Error");
});

test("invalidDateFormat", async ({ apiClient }) => {
  const response = await Create_booking(bookingData.invalidDateFormat);
  const body = await response.json();
  Validateschema(createBookingSchema, body);
  validateStatus(response, 200);
  validateTruthy(body.bookingid);
});

test("invalidDateLogic", async ({ apiClient }) => {
  const response = await Create_booking(bookingData.invalidDateLogic);
  const body = await response.json();
  Validateschema(createBookingSchema, body);
  validateStatus(response, 200);
  validateTruthy(body.bookingid);
});

test("nullValues", async ({ apiClient }) => {
  const response = await Create_booking(bookingData.nullValues);
  const body = await response.text();
  validateStatus(response, 500);
  validateTextBody(body, "Internal Server Error");
});

test("negativeTotalPrice", async ({ apiClient }) => {
  const response = await Create_booking(bookingData.negativeTotalPrice);
  const body = await response.json();
  Validateschema(createBookingSchema, body);
  validateStatus(response, 200);
  validateTruthy(body.bookingid);
});

test("emptyBookingDatesObject", async ({ apiClient }) => {
  const response = await Create_booking(bookingData.emptyBookingDatesObject);
  const body = await response.text();
  validateStatus(response, 500);
  validateTextBody(body, "Internal Server Error");
});
