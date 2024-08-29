import { PurchaseOrderDataResponse } from "../../responses/purchase-order/purchase.order.response";
import { PurchaseOrderDetailDTO } from "./purchase.order.detail";

export class PurchaseOrderDTO {
    supplierId: number;
    totalAmount: number;
    purchaseOrderModels: PurchaseOrderDataResponse[];

    constructor(data: any) {
        this.supplierId = data.supplierId;
        this.totalAmount = data.totalAmount
        this.purchaseOrderModels = data.purchaseOrderModels
    }
}