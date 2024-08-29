import { OptionDataResponse } from "../option/option.data.response";
import { VariantDataResponse } from "../variant/variant.data.response";

export interface ProductDataResponse{
    id: number,
    productName: string,
    supplierName: string,
    commodityName: string,
    imageUrl: string,
    description: string,
    active: boolean,
    supplierId: number,
    commodityId: number,
    variant: VariantDataResponse,
    options: OptionDataResponse[]
}