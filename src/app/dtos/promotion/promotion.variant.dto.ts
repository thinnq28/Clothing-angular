
export class PromotionVariantDTO {
    variantId: number
    promotionId: number

    constructor(data: any) {
        this.variantId = data.variantId;
        this.promotionId = data.promotionId
    }
}