export class UpdateStatusOrderDTO {
    status: string;
    constructor(data: any) {
        this.status = data.status;
      }
}