export class ChangePasswordDTO {
    new_password: string;    
    confirm_password: string;    
    
    constructor(data: any) {
        this.new_password = data.password;
        this.confirm_password = data.retype_password;
    }
}