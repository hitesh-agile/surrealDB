import { Injectable } from '@nestjs/common';
import { Surreal } from 'surrealdb.js';
import { LoggerService } from 'src/logger/logger.service';

// Database connection details (replace with your credentials)

@Injectable()
export class DatabaseService {
  private db: Surreal;
  constructor(private loggerService: LoggerService) {
    this.db = new Surreal();
    this.connect(); // Call the connect method in the constructor
  }
  async connect() {
    try {
      await this.db.connect(process.env.HOST, {
        namespace: process.env.NAMESPACE,
        database: process.env.DB,
        auth: {
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
        },
      });

      // this.loggerService.customLog('Database connected successfully.');
    } catch (error) {
      console.error('Error connecting to the database', error);
    }
  }
  getDBConn() {
    return this.db;
  }
}
