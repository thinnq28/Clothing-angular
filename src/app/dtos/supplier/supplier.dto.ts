
export class SupplierDTO {
    supplierName: string;
    phoneNumber: string;
    email: string;
    address: string;

    constructor(data: any) {
        this.supplierName = data.supplierName;
        this.phoneNumber = data.phoneNumber
        this.email = data.email
        this.address = data.address
    }
}