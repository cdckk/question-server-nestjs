import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './schemas/question.schema';
import { nanoid } from 'nanoid';
import mongoose from 'mongoose';

@Injectable()
export class QuestionService {
    constructor(
        // 依赖注入
        @InjectModel(Question.name) private readonly questionModel,
    ) {}

    // 创建
    async create(username: string) {
        const question = new this.questionModel({
            title: '问卷标题' + Date.now(),
            desc: '问卷描述',
            author: username,
            componentList: [
              {
                fe_id: nanoid(),
                type: 'input',
                title: '问卷信息',
                props: { title: '问卷标题', desc: '问卷描述...' }
              }
            ]
        })

        return await question.save()
    }

    // 删除
    async delete(id: string, author: string) {
        // return await this.questionModel.findByIdAndDelete(id)
        const res = await this.questionModel.findOneAndDelete({
          _id: id,
          author,
        })
        return res
    }

    // 删除多个
    async deleteMany(ids: string[], author: string) {
      const res = await this.questionModel.deleteMany({
        _id: { $in: ids }, // ['aa', 'bb', 'cc'] 'aa' 在数组范围内就删除
        author,
      })
      return res;
    }

    // 更新
    async update(id: string, updateData, author) {
        return await this.questionModel.updateOne({ _id: id, author }, updateData)
    }

    // 查找
    async findOne(id: string) {
        return await this.questionModel.findById(id)
    }

    async findAllList({ keyword = '', page = 1, pageSize = 10, isDeleted = false, isStar, author = '' }) {
        const whereOpt: any = {
          author,
          isDeleted,
        }
        if (isStar !=null) whereOpt.isStar = isStar;
        if (keyword) {
            const reg = new RegExp(keyword, 'i');
            whereOpt.title = { $regex: reg } // 模糊搜索
        }
        return await this.questionModel
            .find(whereOpt)
            .sort({ _id: -1 }) // 逆序排序
            .skip((page -1) * pageSize) // 分页
            .limit(pageSize)
    }

    async countAll({ keyword = '', isDeleted = false, isStar, author = '' }) {
      const whereOpt: any = {
        author,
        isDeleted,
      }
      if (isStar !=null) whereOpt.isStar = isStar;
      if (keyword) {
          const reg = new RegExp(keyword, 'i');
          whereOpt.title = { $regex: reg } // 模糊搜索
      }
      return await this.questionModel.countDocuments(whereOpt)
    }

    // 复制问卷
    async duplicate(id: string, author: string) {
      const question = await this.questionModel.findById(id);
      const newQuestion = new this.questionModel({
        ...question.toObject(),
        _id: new mongoose.Types.ObjectId(), // 生成一个新的 mongodb ObjectId
        title: question.title + ' 副本',
        author,
        isPublished: false,
        isStar: false,
        componentList: question.componentList.map((item) => {
          return {
            ...item,
            fe_id: nanoid(),
          }
        })
      });
      return await newQuestion.save();
    }
}
