import {
  Controller,
  Get,
  Query,
  Param,
  Patch,
  Body,
  HttpException,
  HttpStatus,
  Post,
  Delete,
} from '@nestjs/common';
import { QuestionDto } from './dto/question.dto'
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  // 依赖注入
  constructor(private readonly questionSerive: QuestionService) {}
  @Get('test')
  getTest(): string {
      throw new HttpException('获取数据失败', HttpStatus.BAD_REQUEST)
  }

  @Post()
  create() {
    return this.questionSerive.create();
  }

  @Get()
  async findAll(
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number
  ) {

    const list = await this.questionSerive.findAllList({
      keyword,
      page,
      pageSize,
    });

    const count = await this.questionSerive.countAll({ keyword })

    return {
      list,
      count
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionSerive.findOne(id);
  }

  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() questionDto: QuestionDto) {
    return this.questionSerive.update(id, questionDto);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.questionSerive.delete(id);
  }
}
