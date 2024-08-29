import { VariantDataResponse } from "./variant.data.response";

export interface VariantResponse {
    message: string;
    status: string;
    data: VariantDataResponse[];
  }