import { put } from "../utils/apiclients";

export async function update_booking(bookingid, data) {
  return await put(
    `https://restful-booker.herokuapp.com/booking/${bookingid}`,
    data
  );
}
