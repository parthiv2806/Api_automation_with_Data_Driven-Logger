import { patch } from "../utils/apiclients";

export async function partial_update_booking(bookingid, data) {
  return await patch(
    `https://restful-booker.herokuapp.com/booking/${bookingid}`,
    data
  );
}
