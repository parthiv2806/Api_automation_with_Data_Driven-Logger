import { del } from "../utils/apiclients";

export async function delete_booking(bookingid) {
  return await del(
    `https://restful-booker.herokuapp.com/booking/${bookingid}`
  );
}