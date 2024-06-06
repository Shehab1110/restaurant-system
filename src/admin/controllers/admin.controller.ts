import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminService } from '../services/admin.service';
import { Roles } from 'src/user/decorators/roles.decorator';
import { OrderDocument } from '../../database/order.schema';
import { APIFeatures, QueryString } from 'src/utils/api-features';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';
import { GetSalesReportDto } from '../dtos/get-sales-report.dto';

@UseGuards(AuthGuard)
@Roles(['admin'])
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/orders')
  async getOrders(@Query() queryString: QueryString): Promise<OrderDocument[]> {
    const features = new APIFeatures(this.adminService.getOrders(), queryString)
      .filter()
      .limitFields()
      .paginate()
      .sort();
    return await features.query;
  }

  @Patch('update-order')
  async updateOrder(@Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.adminService.updateOrder(updateOrderStatusDto);
  }

  @Get('sales-report')
  async getSalesReport(@Query() query: GetSalesReportDto) {
    const reportDate = new Date(query.date);
    return this.adminService.getDailySalesReport(reportDate);
  }
}
