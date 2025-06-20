import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({
  timestamps: true, // 记录时间戳 createdAt updatedAt
})
export class Question {
  @Prop({ required: true })
  title: string;

  @Prop()
  desc: string;

  // 其他待补充...

  @Prop({ required: true })
  author: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);