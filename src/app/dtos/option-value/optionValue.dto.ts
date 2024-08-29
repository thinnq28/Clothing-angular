
export class OptionValueUpdateDTO {
    optionValueId: number;
    optionId: number;
    optionValueName: string;

    constructor(data: any) {
        this.optionValueId = data.optionValueId;
        this.optionId = data.optionId;
        this.optionValueName = data.optionName;
    }
}