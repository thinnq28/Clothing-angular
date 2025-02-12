import { IsString, 
  IsNotEmpty, 
  IsPhoneNumber, 
  IsNumber, ArrayMinSize, 
  ValidateNested, 
  Length 
} from 'class-validator';
import { Type } from 'class-transformer';
import { CartItemDTO } from './cart.item.dto';

export class OrderDTO {
  userId: number;

  fullName: string;

  email: string;

  phoneNumber: string;
  
  address: string;

  note: string;
  
  totalMoney: number;

  paymentMethod: string;

  codes: string[];

  cart_items: { variantId: number, quantity: number }[]; // Thêm cart_items để lưu thông tin giỏ hàng


  status: string;

  constructor(data: any) {
    this.userId = data.user_id;
    this.fullName = data.fullname;
    this.email = data.email;
    this.phoneNumber = data.phone_number;
    this.address = data.address;
    this.note = data.note;
    this.totalMoney = data.total_money;
    this.paymentMethod = data.payment_method;
    this.cart_items = data.cart_items;
    this.status = data.status;
    this.codes = data.codes
  }
}

