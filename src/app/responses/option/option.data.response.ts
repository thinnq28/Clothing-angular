import { OptionValueDataResponse } from "../option-value/option.data.response";

export interface OptionDataResponse {
    id: number;
    name: string;
    active: boolean;
    isMultipleUsage: boolean;
    optionValues: OptionValueDataResponse[];
}