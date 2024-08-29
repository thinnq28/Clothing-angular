import { LoginDataResponse } from "./login.data.response";

export interface LoginResponse {
  message: string;
  status: string;
  data: LoginDataResponse;
}
