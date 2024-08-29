export interface PromotionDataResponse{
    id: number,
    name: string,
    discountPercentage: number,
    startDate: Date,
    endDate: Date,
    active: boolean;
}