export interface VoucherDataResponse{
    id: number,

    code: string,

    description: string,

    discount: number,

    discountType: string,


    minPurchaseAmount: number,

    maxDiscountAmount: number,

    maxUsage: number,

    timesUsed: number,

    startDate: Date,

    endDate: Date,

    active: boolean
}