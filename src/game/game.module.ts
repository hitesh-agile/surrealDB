import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { ShareModule } from 'src/share/share.module';

@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [ShareModule],
})
export class GameModule {}
