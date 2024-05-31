import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { GameService } from './game.service';
import {
  CreateGameDto,
  LifeLineUsed,
  QuitGameDto,
  SubmitAnswerDto,
} from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('game')
@ApiTags('KBC- Game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start the game using your name' })
  create(@Body() createGameDto: CreateGameDto, @Res() res: Response) {
    return this.gameService.create(createGameDto, res);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch current question base on game id' })
  fetchCurrentQuestion(@Param('id') id: string, @Res() res: Response) {
    return this.gameService.fetchCurrentQuestion(id, res);
  }
  @Post('submitAnswer')
  @ApiOperation({ summary: 'Submit answer' })
  submitAnswer(@Body() body: SubmitAnswerDto, @Res() res: Response) {
    return this.gameService.submitAnswer(body, res);
  }
  @Post('quitGame')
  @ApiOperation({ summary: 'Quit game' })
  quitGame(@Body() body: QuitGameDto, @Res() res: Response) {
    return this.gameService.quitGame(body, res);
  }

  @Post('lifeLineUsed')
  @ApiOperation({ summary: 'Use life line' })
  lifeLineUsed(@Body() body: LifeLineUsed, @Res() res: Response) {
    return this.gameService.lifeLineUsed(body, res);
  }
}
