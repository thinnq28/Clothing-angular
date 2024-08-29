
export class VoucherDTO {
    code: string;
    description: string = '';
    discount: number = 0;
    discountType: string = '';
    minPurchaseAmount: number = 0;
    maxDiscountAmount: number = 0;
    maxUsage: string;
    startDate: Date;
    endDate: Date;

    constructor(data: any) {
        this.code = data.code;
        this.description = data.description
        this.startDate = data.startDate
        this.endDate = data.endDate
        this.discount = data.discount
        this.discountType = data.discountType
        this.minPurchaseAmount = data.minPurchaseAmount
        this.maxDiscountAmount = data.maxDiscountAmount
        this.maxUsage = data.maxUsage

    }
}