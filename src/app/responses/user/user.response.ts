import { UserDataResponse } from "./user.data.response";


export interface UserResponse {
    data: UserDataResponse,
    message: string,
    status: string
}