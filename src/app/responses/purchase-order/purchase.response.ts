import { PurchaseOrderdetail } from "./purchase.detail";

export interface PurchaseOrder{
    id: number,
    orderDate: Date; // Dạng chuỗi ISO 8601
    supplierName: string;
    totalAmount: number,
    details: PurchaseOrderdetail[];
}