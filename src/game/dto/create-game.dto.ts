import { ApiProperty } from '@nestjs/swagger';

export class CreateGameDto {
  @ApiProperty({ default: 'John doe' })
  displayName: string;
}
export class SubmitAnswerDto {
  @ApiProperty()
  gameId: string;

  @ApiProperty()
  answer: string;
}
export class QuitGameDto {
  @ApiProperty()
  gameId: string;
}
export class LifeLineUsed {
  @ApiProperty()
  gameId: string;

  @ApiProperty({ default: '50-50', enum: ['50-50', 'AskTheAI'] })
  lifeline: string;
}
