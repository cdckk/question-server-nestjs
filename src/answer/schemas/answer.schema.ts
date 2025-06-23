import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AnswerDocument = HydratedDocument<Answer>;

@Schema({
    timestamps: true, // 记录时间戳 createdAt updatedAt
})
export class Answer {
  @Prop({ required: true, unique: true })
  questionId: string; // 对应 问卷 的 _id

  @Prop()
  answerList: {
    componentFeId: string; // 对应组件 fe_id
    value: string[];
  }[]

  // 其他待补充...
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);