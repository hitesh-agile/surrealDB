import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { DatabaseService } from 'src/database/database.service';
import Surreal from 'surrealdb.js';
import { successResponse } from 'src/helpers/responses/success.helper';
import { statusOk } from 'src/helpers/responses/respones.status.constant';
import { CustomError } from 'src/helpers/exceptions';

@Injectable()
export class QuestionService {
  private db: Surreal;
  constructor(private readonly dbService: DatabaseService) {
    this.db = this.dbService.getDBConn();
  }
  async create() {
    const questions = [
      {
        text: 'What is 2+7?',
        options: ['3', '7', '9', '11'],
        correctAnswer: '9',
      },
      {
        text: 'What is 5x15?',
        options: ['25', '50', '75', '100'],
        correctAnswer: '75',
      },
      {
        text: 'What is 6x9?',
        options: ['54', '36', '24', '69'],
        correctAnswer: '54',
      },
      {
        text: 'What is 0+0?',
        options: ['0', '1', '100', '1000'],
        correctAnswer: '0',
      },
      {
        text: 'How many alphabets are there in the word ‘apple’?',
        options: ['10', '15', '5', '7'],
        correctAnswer: '5',
      },
      {
        text: 'What is the colour of moon?',
        options: ['red', 'orange', 'pink', 'white'],
        correctAnswer: 'white',
      },
      {
        text: 'How many legs does a chicken have?',
        options: ['1', '2', '4', '10'],
        correctAnswer: '2',
      },
      {
        text: 'Which one of these is not a programming language?',
        options: ['C', 'C++', 'Javascript', 'English'],
        correctAnswer: 'English',
      },
      {
        text: 'How many days are there in a week?',
        options: ['10', '5', '7', '6'],
        correctAnswer: '7',
      },
      {
        text: 'Which of these is not a react library inbuilt hook?',
        options: [
          'useState',
          'useRef',
          'useImperativeHandle',
          'useLocalStorage',
        ],
        correctAnswer: 'useLocalStorage',
      },
    ];
    const [record] = await this.db.insert('Question', questions);
    console.log('record: ', record);
  }

  async findAll(res) {
    try {
      const [questions]: any = await this.db
        .query_raw(`SELECT * FROM Question ORDER BY rand();
      `);
      res
        .status(statusOk)
        .json(successResponse(statusOk, 'Game started', questions.result));
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
