import { test } from "../fixture/apiFixtures";
import {
  validateStatus,
  validateTextBody,
} from "../utils/responsevalidator";
import { delete_booking } from "../services/delete_booking_service";
import { Create_booking } from "../services/Create_booking_servicce";
import { Get_function } from "../services/get_booking_service";
import { setToken, clearToken } from "../utils/tokenmanager";
import bookingData from "../data/createBooking.json";

test("delete booking", async ({ booking }) => {
  const response = await delete_booking(booking.bookingid);
  const body = await response.text();

  validateStatus(response, 201);
  validateTextBody(body, "Created");
});

test("booking not found after delete", async ({ apiClient }) => {
  const createResponse = await Create_booking(bookingData.validUser_booking);
  const createBody = await createResponse.json();
  const bookingid = createBody.bookingid;

  const response = await delete_booking(bookingid);
  validateStatus(response, 201);

  const getResponse = await Get_function(bookingid);
  const getBody = await getResponse.text();
  validateStatus(getResponse, 404);
  validateTextBody(getBody, "Not Found");
});

test("delete without auth", async ({ booking }) => {
  clearToken();
  const response = await delete_booking(booking.bookingid);
  const body = await response.text();
  validateStatus(response, 403);
  validateTextBody(body, "Forbidden");
  setToken(booking.token);
});

test("delete nonexistent booking", async ({ booking }) => {
  const response = await delete_booking(999999999);
  const body = await response.text();
  validateStatus(response, 405);
  validateTextBody(body, "Method Not Allowed");
});