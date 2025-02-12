export class CommentRateDTO {
    product_id: number;
    rating: number;
    content: string;

    constructor(data: any) {
        this.rating = data.rating;
        this.product_id = data.product_id;
        this.content = data.content;
    }
}