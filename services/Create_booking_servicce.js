import { post } from "../utils/apiclients";

export async function Create_booking(data) {
  return await post(`https://restful-booker.herokuapp.com/booking`, data);
}
