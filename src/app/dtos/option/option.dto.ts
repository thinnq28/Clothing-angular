
export class OptionDTO {
    optionId: number;
    optionName: string;
    active: boolean;
    isCreateNew: boolean;
    isMultipleUsage: boolean;
    optionValues: string[];

    constructor(data: any) {
        this.optionId = data.option_id;
        this.optionName = data.option_name
        this.active = data.active
        this.optionValues = data.option_value_name
        this.isCreateNew = data.isCreateNew
        this.isMultipleUsage = data.isMultipleUsage;
    }
}