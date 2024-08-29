
export class PromotionDTO {
    name: string;
    discountPercentage: number;
    startDate: Date;
    endDate: Date;

    constructor(data: any) {
        this.name = data.name;
        this.discountPercentage = data.discountPercentage
        this.startDate = data.startDate
        this.endDate = data.endDate
    }
}