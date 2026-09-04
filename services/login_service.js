import { post } from "../utils/apiclients";

export async function Login_function(data) {
  return await post(`https://restful-booker.herokuapp.com/auth`, data);
}
