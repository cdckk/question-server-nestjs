import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Answer } from './schemas/answer.schema';

@Injectable()
export class AnswerService {
    constructor(@InjectModel(Answer.name) private readonly answerModel) {}

    async create(answerInfo) {
        if (answerInfo.questionId == null) {
            throw new HttpException('缺少问卷 id', HttpStatus.BAD_REQUEST);
        }

        const answer = new this.answerModel(answerInfo);
        return await answer.save();
    }
}
