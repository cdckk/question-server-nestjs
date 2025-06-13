import {
  Controller,
  Get,
  Query,
  Param,
  Patch,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { QuestionDto } from './dto/question.dto'

@Controller('question')
export class QuestionController {
    @Get('test')
    getTest(): string {
        throw new HttpException('获取数据失败', HttpStatus.BAD_REQUEST)
    }
}
