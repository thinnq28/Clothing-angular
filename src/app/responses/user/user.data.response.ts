import { Role } from "../../model/Role";
import { UserResponse } from "./user.response";

export interface UserDataResponse {
    id: number;
    fullname: string;
    address:string;
    email:string;
    is_active: boolean;
    date_of_birth: Date;
    phone_number: string;
    roles: Role[];
}