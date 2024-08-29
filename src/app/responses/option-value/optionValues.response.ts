import { OptionValueDataResponse } from "./option.data.response";

export interface OptionValueResponse {
    message: string;
    status: string;
    data: OptionValueDataResponse[];
  }
  