import { OptionDataResponse } from "./option.data.response";

export interface OptionResponse {
    message: string;
    status: string;
    data: OptionDataResponse[];
  }
  