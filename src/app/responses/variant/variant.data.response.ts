import { ImageDataResponse } from "../image/image.data.response";
import { OptionDataResponse } from "../option/option.data.response";
import { ProductDataResponse } from "../product/product.data.response";

export interface VariantDataResponse{
    id: number,
    variantName: string,
    skuId: string,
    quantity: number,
    price: number,
    imageUrls: string[],
    images: ImageDataResponse[],
    active: boolean,
    product: ProductDataResponse,
    optionValueIds: number[],
    promotionIds: number[],
    totalDiscountPercentage: number,
    options: OptionDataResponse[];
}