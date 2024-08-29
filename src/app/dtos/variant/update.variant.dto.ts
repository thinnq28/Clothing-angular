export class UpdateVariantDTO {
    productId: number;

    quantity: number;

    price: number;
    
    properties : string[];

    imageIds: number[];

    constructor(data: any) {
        this.properties = data.properties;
        this.productId = data.productId;
        this.quantity = data.quantity;
        this.price = data.price;
        this.imageIds = data.imageIds;
    }
}