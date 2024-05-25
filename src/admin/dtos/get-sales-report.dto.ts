import { IsDateString } from 'class-validator';

export class GetSalesReportDto {
  @IsDateString({}, { message: 'Date must be in the format YYYY-MM-DD' })
  date: string;
}
