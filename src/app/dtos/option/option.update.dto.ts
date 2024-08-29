
export class OptionUpdateDTO {
    optionId: number;
    optionName: string;
    isMultipleUsage: boolean;

    constructor(data: any) {
        this.optionId = data.option_id;
        this.optionName = data.option_name
        this.isMultipleUsage = data.isMultipleUsage
    }
}