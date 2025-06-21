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
  Request
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
  create(@Request() req) {
    const { username } = req.user
    return this.questionSerive.create(username);
  }

  @Get()
  async findAll(
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('isDeleted') isDeleted: boolean = false,
    @Query('isStar') isStar: boolean = false,
    @Request() req
  ) {
    const { username } = req.user

    const list = await this.questionSerive.findAllList({
      keyword,
      page,
      pageSize,
      isDeleted,
      isStar,
      author: username
    });

    const count = await this.questionSerive.countAll({
      keyword,
      author: username,
      isDeleted,
      isStar
    })

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
  updateOne(@Param('id') id: string, @Body() questionDto: QuestionDto, @Request() req) {
    const { username } = req.user
    return this.questionSerive.update(id, questionDto, username);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string, @Request() req) {
    const { username } = req.user
    return this.questionSerive.delete(id, username);
  }

  @Delete()
  deleteMany(@Body() body, @Request() req) {
    const { username } = req.user;
    const { ids = [] } = body;
    return this.questionSerive.deleteMany(ids, username);
  }
}
