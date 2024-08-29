export class UserRoleDTO {
    roleId: number;
    userId: number;

    constructor(data: any) {
        this.roleId = data.roleId;
        this.userId = data.userId
    }

}