export class UpdateProductDTO {
    name: string;

    supplierId: number;

    description: string;

    optionId: number[] = [];
    constructor(data: any) {
        this.name = data.name;
        this.supplierId = data.supplier_id;
        this.description = data.description;
        this.optionId = data.option_id;
    }
}