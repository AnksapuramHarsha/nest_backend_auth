import { Order } from '../../constants/order.ts';
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import {
  EnumFieldOptional,
  NumberFieldOptional,
  StringFieldOptional,
} from '../../decorators/field.decorators.ts';

export class PageOptionsDto {

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    readonly page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    readonly limit?: number = 10;

  @EnumFieldOptional(() => Order, {
    default: Order.ASC,
  })
  readonly order!: Order;

  @NumberFieldOptional({
    minimum: 1,
    default: 1,
    int: true,
  })
  //readonly page!: number;

  @NumberFieldOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
    int: true,
  })
  readonly take!: number;

//   get skip(): number {
//     return (this.page - 1) * this.take;
//   }

  @StringFieldOptional()
  readonly q?: string;
}
