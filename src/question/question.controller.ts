import { Controller, Get, Post, Body, Param, Res } from '@nestjs/common';
import { QuestionService } from './question.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('question')
@ApiTags('Questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('import')
  create() {
    return this.questionService.create();
  }

  @Get()
  findAll(@Res() res: Response) {
    return this.questionService.findAll(res);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id);
  }
}
