import { OptionVariantDTO } from "./insert.option.variant";

export class InsertVariantDTO {
    productId: number;

    quantity: number;

    price: number;
    
    options: OptionVariantDTO[];

    constructor(data: any) {
        this.productId = data.productId;
        this.quantity = data.quantity;
        this.price = data.price;
        this.options = data.options;
    }
}