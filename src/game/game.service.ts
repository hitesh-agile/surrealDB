import { Injectable } from "@nestjs/common";
import {
  CreateGameDto,
  LifeLineUsed,
  QuitGameDto,
  SubmitAnswerDto,
} from "./dto/create-game.dto";
import { UpdateGameDto } from "./dto/update-game.dto";
import { CustomError, TypeExceptions } from "src/helpers/exceptions";
import Surreal, { RecordId } from "surrealdb.js";
import { DatabaseService } from "src/database/database.service";
import { Response } from "express";
import { successResponse } from "src/helpers/responses/success.helper";
import { statusOk } from "src/helpers/responses/respones.status.constant";

@Injectable()
export class GameService {
  private db: Surreal;
  prizeMoneyLevels = [
    1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000,
  ];
  milestones = [1000, 1000000];
  validLifelines = ["50-50", "AskTheAI"];

  constructor(private readonly dbService: DatabaseService) {
    this.db = this.dbService.getDBConn();
  }
  async create(body: CreateGameDto, res: Response) {
    try {
      const playerObj = {
        displayName: body.displayName,
        prizeMoney: 0,
        gameStatus: "in-progress",
        startedAt: new Date().toISOString(),
        currentLevel: 0,
      };
      const [player] = await this.db.create("Player", playerObj);
      const [question]: any = await this.db
        .query_raw(`SELECT * FROM Question ORDER BY rand();
      `);
      const gameObj = {
        playerId: new RecordId(player.id.tb, player.id.id),
        questions: question.result.map((data) => data.id.id),
        currentQuestionIndex: 0,
        lifelinesUsed: [],
      };
      const [game] = await this.db.create("Game", gameObj);
      res
        .status(statusOk)
        .json(successResponse(statusOk, "Game started", { game }));
    } catch (error) {
      console.log("error: ", error);
      CustomError.UnknownError(error?.message, error?.status);
    }
  }

  async fetchCurrentQuestion(id: string, res: Response) {
    try {
      const query = `
      Select playerId.*,* from Game where id = Game:${id};
    `;
      const [game]: any = await this.db.query_raw(query);
      console.log("game: ", game);
      if (!game.result.length) {
        throw TypeExceptions.BadReqCommMsg("Game not found");
      }
      const currentIndex = game.result
        ? game.result[0].currentQuestionIndex
        : 0;
      if (game?.result[0]?.playerId?.gameStatus == "completed") {
        return res
          .status(statusOk)
          .json(
            successResponse(statusOk, "Game completed", {
              player: game.result[0].playerId,
            })
          );
      }
      const currentQuestionId = game.result[0].questions[currentIndex];
      console.log("currentQuestionId: ", currentQuestionId);
      const questionDetails = `
      Select * from Question where id = Question:${currentQuestionId};
    `;
      const [question]: any = await this.db.query_raw(questionDetails);
      console.log("question: ", question.result);
      if (!question.result.length) {
        throw TypeExceptions.BadReqCommMsg("Question not found");
      }
      const question_result = question.result[0];
      res.status(statusOk).json(
        successResponse(statusOk, "Question Details Fetched", {
          options: question_result.options,
          text: question_result.text,
        })
      );
    } catch (error) {
      throw error;
    }
  }
  async submitAnswer(body: SubmitAnswerDto, res: Response) {
    try {
      const query = `
      Select * from Game where id = Game:${body.gameId};
    `;
      const [game]: any = await this.db.query_raw(query);
      console.log("game: ", game);
      if (!game.result.length) {
        throw TypeExceptions.BadReqCommMsg("Game not found");
      }
      const currentIndex = game.result
        ? game.result[0].currentQuestionIndex
        : 0;
      const currentQuestionId = game.result[0].questions[currentIndex];
      console.log("currentQuestionId: ", currentQuestionId);
      const questionDetails = `
      Select * from Question where id = Question:${currentQuestionId};
    `;
      const [question]: any = await this.db.query_raw(questionDetails);
      if (!question.result.length) {
        throw TypeExceptions.BadReqCommMsg("Question not found");
      }
      console.log("game.result[0].playerId: ", game.result[0].playerId);
      const player = `
      Select * from Player where id = Player:${game.result[0].playerId.id};
    `;
      const [playerResult]: any = await this.db.query_raw(player);
      console.log("question.result: ", question.result);
      console.log(
        "question.result[0].answer: ",
        question.result[0].correctAnswer
      );
      console.log("body.answer: ", body.answer);
      if (body.answer == question.result[0].correctAnswer) {
        const playerCurrentLevel =
          Number(playerResult.result[0].currentLevel) + 1;
        const updateQuery = `
        Update Player Set 
        currentLevel="${playerCurrentLevel}"
         where id="Player:${game.result[0].playerId.id}";`;

        await this.db.query(updateQuery);
        console.log(
          "playerResult.result[0].currentLevel: ",
          playerResult.result[0].currentLevel
        );
        if (playerResult.result[0].currentLevel < 9) {
          const qIndex = Number(game.result[0].currentQuestionIndex) + 1;
          const updateQuery = `
          Update Game Set 
          currentQuestionIndex="${qIndex}"
           where id="Game:${body.gameId}";`;

          await this.db.query(updateQuery);
        } else {
          const updateQuery = `
          Update Player Set 
          gameStatus="completed"
           where id="Player:${game.result[0].playerId.id}";`;

          await this.db.query(updateQuery);
        }
        const money =
          this.prizeMoneyLevels[playerResult.result[0].currentLevel];
        const updateQuery1 = `
        Update Player Set 
        prizeMoney="${money}"
         where id="Player:${game.result[0].playerId.id}";`;

        await this.db.query(updateQuery1);

        res.status(statusOk).json(
          successResponse(statusOk, "Question Answered", {
            correct: true,
            prizeMoney: money,
          })
        );
      } else {
        const gameStatus = "completed";
        let prizeMoney = playerResult.result[0].prizeMoney;

        if (Number(playerResult.result[0].currentLevel) < 4) {
          prizeMoney = 0;
        } else {
          let lastMilestone = 0;
          for (const iterator of this.milestones) {
            if (prizeMoney >= iterator) {
              lastMilestone = iterator;
            }
          }
          prizeMoney = lastMilestone;
        }
        console.log("completed");
        const updateQuery1 = `
        Update Player Set 
        prizeMoney="${prizeMoney}",
        gameStatus="${gameStatus}"
         where id="Player:${game.result[0].playerId.id}";`;

        await this.db.query(updateQuery1);
        res.status(statusOk).json(
          successResponse(statusOk, "Question Answered", {
            correct: false,
            prizeMoney: prizeMoney,
          })
        );
      }
    } catch (error) {
      console.log("error: ", error);
      throw error;
    }
  }
  async quitGame(body: QuitGameDto, res: Response) {
    try {
      const query = `
      Select * from Game where id = Game:${body.gameId};
    `;
      const [game]: any = await this.db.query_raw(query);
      console.log("game: ", game);
      if (!game.result.length) {
        throw TypeExceptions.BadReqCommMsg("Game not found");
      }

      const player = `
      Select * from Player where id = Player:${game.result[0].playerId.id};
    `;
      const [playerResult]: any = await this.db.query_raw(player);

      console.log("playerResult.result[0]: ", playerResult.result[0]);
      if (Number(playerResult.result[0].currentLevel) < 4) {
        throw TypeExceptions.BadReqCommMsg(
          "You can only quit after winning Rs 1000 (level 4)"
        );
      }
      const updateQuery1 = `
      Update Player Set 
      prizeMoney="${
        this.prizeMoneyLevels[Number(playerResult.result[0].currentLevel) - 1]
      }",
      gameStatus="completed"
       where id="Player:${game.result[0].playerId.id}";`;

      await this.db.query(updateQuery1);
      res.status(statusOk).json(successResponse(statusOk, "Game Quit", {}));
    } catch (error) {
      throw error;
    }
  }
  async lifeLineUsed(body: LifeLineUsed, response: Response) {
    try {
      const query = `
      Select playerId.*,questions.*,* from Game where id = Game:${body.gameId};
    `;
      const [game]: any = await this.db.query_raw(query);
      console.log("game.result[0]: ", game.result[0]);
      if (!game.result.length) {
        throw TypeExceptions.BadReqCommMsg("Game not found");
      }
      if (!this.validLifelines.includes(body.lifeline)) {
        throw TypeExceptions.BadReqCommMsg("Invalid lifeline");
      }
      if (game.result[0].lifelinesUsed.includes(body.lifeline)) {
        throw TypeExceptions.BadReqCommMsg("Lifeline already used");
      }
      const lifeline = game.result[0].lifelinesUsed;
      lifeline.push(body.lifeline);
      const updateQuery1 = `
      Update Game Set 
      lifelinesUsed=${JSON.stringify(lifeline)}
       where id="Game:${body.gameId}";`;

      await this.db.query(updateQuery1);
      const currentIndex = game.result
        ? game.result[0].currentQuestionIndex
        : 0;
      const currentQuestionId = game.result[0].questions[currentIndex];
      console.log("currentQuestionId: ", currentQuestionId);
      const questionDetails = `
      Select * from Question where id = Question:${currentQuestionId};
    `;
      const [question]: any = await this.db.query_raw(questionDetails);
      if (!question.result.length) {
        throw TypeExceptions.BadReqCommMsg("Question not found");
      }

      if (body.lifeline === "50-50") {
        const incorrectOptions = question.result[0].options.filter(
          (opt) => opt !== question.result[0].correctAnswer
        );
        console.log("incorrectOptions: ", incorrectOptions);
        const optionsToKeep = [
          question.result[0].correctAnswer,
          incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)],
        ];
        console.log("optionsToKeep: ", optionsToKeep);
        response.status(statusOk).json(
          successResponse(statusOk, "Lifeline used", {
            options: optionsToKeep,
          })
        );
      } else if (body.lifeline === "AskTheAI") {
        response.status(statusOk).json(
          successResponse(statusOk, "Lifeline used", {
            hint: question.result[0].correctAnswer,
          })
        );
      }
    } catch (error) {
      console.log("error: ", error);
      throw error;
    }
  }
}
