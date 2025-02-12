import { VariantDataResponse } from "../variant/variant.data.response";

export interface OrderDetailResponse {
    id: number;
    quantity: number;
    variant: VariantDataResponse;
    price: number;
  }
  
  