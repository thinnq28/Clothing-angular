import { RoleDataResponse } from "./role.data.response";

export interface RoleResponse {
    message: string;
    status: string;
    data: RoleDataResponse[];
  }
  