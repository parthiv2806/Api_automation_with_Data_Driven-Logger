import { test } from "../fixture/apiFixtures";
import { Get_function } from "../services/get_booking_service";
import {
  validateStatus,
  validateProperty,
  validateBody,
  validateTruthy,
} from "../utils/responsevalidator";
import { Validateschema } from "../utils/schemavalidator";

import { getBookingSchema } from "../schemas/getH_schemas";

test("Get the booking", async ({ booking }) => {
  const response = await Get_function(booking.bookingid);
  const body = await response.json();
  console.log(body);

  Validateschema(getBookingSchema, body);
  validateStatus(response, 200);

  validateProperty(body, "firstname");
  validateProperty(body, "lastname");
  validateProperty(body, "totalprice");
  validateProperty(body, "depositpaid");
  validateProperty(body, "bookingdates");

  validateProperty(body.bookingdates, "checkin");
  validateProperty(body.bookingdates, "checkout");

  validateBody(body, {
    firstname: booking.body.booking.firstname,
    lastname: booking.body.booking.lastname,
    totalprice: booking.body.booking.totalprice,
    depositpaid: booking.body.booking.depositpaid,
    bookingdates: booking.body.booking.bookingdates,
    additionalneeds: booking.body.booking.additionalneeds,
  });

  validateTruthy(body.firstname);
  validateTruthy(body.lastname);
  validateTruthy(body.totalprice);
  validateTruthy(body.bookingdates.checkin);
  validateTruthy(body.bookingdates.checkout);
  validateTruthy(body.additionalneeds);
});
