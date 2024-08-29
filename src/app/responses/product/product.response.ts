import { ProductDataResponse } from "./product.data.response";

export interface ProductResponse {
    message: string;
    status: string;
    data: ProductDataResponse[];
  }
  