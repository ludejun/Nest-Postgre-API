import { Controller, Get, Param } from '@nestjs/common';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { CatsService } from './cats.service';
import { Cat } from './cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Get()
  // @HttpProcessor.handle('获取所有Cats')
  async findAll(): Promise<Cat[]> {
    return await this.catsService.findAll();
  }

  @Get('create/:name')
  @HttpProcessor.handle('创建Cat，存数据库')
  async create(@Param() params): Promise<void> {
    return await this.catsService.create({
      name: params.name,
      age: 1,
      breed: '',
    });
  }
}
