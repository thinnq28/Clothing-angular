export class OptionVariantDTO {
    optionId: number;
    optionValueIds: number[];
    constructor(data: any) {
        this.optionId = data.optionId;
        this.optionValueIds = data.optionValueId;
    }
}