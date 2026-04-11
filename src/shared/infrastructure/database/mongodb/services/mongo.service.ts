import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Db, MongoClient } from 'mongodb';

@Injectable()
export class MongoService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MongoService.name);
  private client: MongoClient;
  private db: Db;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.logger.log(`Initializing MongoDB`);

    const mongoUrl = this.configService.get<string>('MONGODB_URI');
    const dbName = this.configService.get<string>('MONGODB_DATABASE');

    try {
      this.client = new MongoClient(mongoUrl, {
        authSource: 'admin',
      });

      await this.client.connect();
      this.db = this.client.db(dbName);
      this.logger.log(`MongoDB connected successfully`);
    } catch (error) {
      this.logger.error(`Error connecting to MongoDB: ${error}`);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.client.close();
    this.logger.log(`MongoDB connection closed`);
  }

  getDatabase(): Db {
    this.logger.log(`Getting MongoDB database`);
    return this.db;
  }

  getCollection(collectionName: string) {
    this.logger.log(`Getting MongoDB collection ${collectionName}`);
    return this.db.collection(collectionName);
  }
}
