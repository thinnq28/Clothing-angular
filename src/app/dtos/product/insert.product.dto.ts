export class InsertProductDTO {
    name: string;

    supplierId: number;

    commodityId: number;

    description: string;

    optionId: number[] = [];
    
    constructor(data: any) {
        this.name = data.name;
        this.supplierId = data.supplier_id;
        this.commodityId = data.commodity_id;
        this.description = data.description;
        this.optionId = data.option_id;
    }
}