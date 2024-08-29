export class UpdateUserDTO {
    fullname: string;    
    address: string;    
    email: string;    
    date_of_birth: Date;
    
    constructor(data: any) {
        this.fullname = data.fullname;
        this.address = data.address;
        this.email = data.email;
        this.date_of_birth = data.date_of_birth 
    }
}