export class ChangePasswordDTO {
    current_password: string;
    new_password: string;    
    confirm_password: string;    
    
    constructor(data: any) {
        this.current_password = data.current_password;
        this.new_password = data.password;
        this.confirm_password = data.retype_password;
    }
}