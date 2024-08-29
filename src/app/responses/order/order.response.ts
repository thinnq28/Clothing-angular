export interface OrderResponse {
    id: number;
    user_id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    note: string;
    orderDate: Date; // Dạng chuỗi ISO 8601
    status: string;
    total_money: number;
    shipping_method: string;
    shipping_address: string;
    shipping_date: Date; // Dạng chuỗi ISO 8601
    payment_method: string;
    active: boolean;
    // order_details: OrderDetail[]; // Đảm bảo có một interface OrderDetail tương ứng
  }
  
  