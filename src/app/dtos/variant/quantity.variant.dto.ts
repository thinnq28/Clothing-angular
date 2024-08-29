export class QuantityVariantDTO {
    quantity: number;

    skuId: string;
    
    constructor(data: any) {
        this.skuId = data.skuId;
        this.quantity = data.quantity;
    }
}