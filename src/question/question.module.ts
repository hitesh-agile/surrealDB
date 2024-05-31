import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { ShareModule } from 'src/share/share.module';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService],
  imports: [ShareModule],
})
export class QuestionModule {}
