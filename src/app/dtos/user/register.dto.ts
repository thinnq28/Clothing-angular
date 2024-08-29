import {
    IsString, 
    IsNotEmpty, 
    IsPhoneNumber, 
    IsDate
} from 'class-validator';

export class RegisterDTO {
    @IsString()
    fullname: string;

    @IsPhoneNumber()
    phone_number: string;
    
    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    retype_password: string;

    @IsNotEmpty()
    email: string;

    @IsDate()
    date_of_birth: Date;

    role_id: number = 2;
    
    constructor(data: any) {
        this.fullname = data.fullname;
        this.phone_number = data.phone_number;
        this.address = data.address;
        this.password = data.password;
        this.retype_password = data.retype_password;
        this.date_of_birth = data.date_of_birth;
        this.email = data.email;
        this.role_id = data.role_id || 1;
    }
}