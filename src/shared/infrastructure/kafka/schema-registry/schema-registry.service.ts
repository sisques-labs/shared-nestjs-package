import { SchemaRegistry, SchemaType } from '@kafkajs/confluent-schema-registry';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ISchemaRegistryOptions } from './schema-registry-options.interface';
import { SCHEMA_REGISTRY_OPTIONS } from './schema-registry.constants';

export interface IAvroSchema {
  type: string;
  name: string;
  namespace?: string;
  fields: Array<{ name: string; type: unknown; default?: unknown }>;
}

@Injectable()
export class SchemaRegistryService implements OnModuleInit {
  private readonly logger = new Logger(SchemaRegistryService.name);
  private registry: SchemaRegistry;

  constructor(
    @Inject(SCHEMA_REGISTRY_OPTIONS)
    private readonly options: ISchemaRegistryOptions,
    private readonly httpService: HttpService,
  ) {
    this.registry = new SchemaRegistry({ host: options.host });
  }

  async onModuleInit(): Promise<void> {
    this.logger.log(`Schema Registry connected: ${this.options.host}`);
  }

  /**
   * Register an Avro schema for a subject.
   * Subject naming convention: {topic}-value
   * Returns the schema ID to use for encoding.
   */
  async registerSchema(
    subject: string,
    schema: IAvroSchema,
  ): Promise<{ id: number }> {
    try {
      const { id } = await this.registry.register(
        { type: SchemaType.AVRO, schema: JSON.stringify(schema) },
        { subject },
      );
      this.logger.log(`Schema registered: subject="${subject}" id=${id}`);
      return { id };
    } catch (error) {
      this.logger.error(
        `Failed to register schema for subject "${subject}"`,
        error,
      );
      throw error;
    }
  }

  /**
   * Encode data using a schema ID (obtained from registerSchema).
   * Embeds the schema ID in the returned Buffer so consumers can decode without
   * knowing the schema upfront.
   */
  async encodeById(
    registryId: number,
    data: Record<string, unknown>,
  ): Promise<Buffer> {
    try {
      return await this.registry.encode(registryId, data);
    } catch (error) {
      this.logger.error(
        `Failed to encode data with schema ID ${registryId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Encode data by resolving the latest schema ID for a subject first.
   * Convenience wrapper around encodeById.
   */
  async encodeBySubject(
    subject: string,
    data: Record<string, unknown>,
  ): Promise<Buffer> {
    try {
      const id = await this.registry.getLatestSchemaId(subject);
      return await this.registry.encode(id, data);
    } catch (error) {
      this.logger.error(
        `Failed to encode data for subject "${subject}"`,
        error,
      );
      throw error;
    }
  }

  /**
   * Decode an Avro-encoded buffer.
   * The schema ID is embedded in the buffer by the producer — the registry
   * fetches the schema automatically.
   */
  async decode<T = Record<string, unknown>>(buffer: Buffer): Promise<T> {
    try {
      return (await this.registry.decode(buffer)) as T;
    } catch (error) {
      this.logger.error('Failed to decode Avro message', error);
      throw error;
    }
  }

  async getLatestSchemaId(subject: string): Promise<number> {
    return this.registry.getLatestSchemaId(subject);
  }

  /** Lists all registered subjects via the Schema Registry REST API. */
  async getAllSubjects(): Promise<string[]> {
    const { data } = await firstValueFrom<{ data: string[] }>(
      this.httpService.get<string[]>(`${this.options.host}/subjects`),
    );
    return data;
  }

  /** Lists all versions for a subject via the Schema Registry REST API. */
  async getVersions(subject: string): Promise<number[]> {
    const { data } = await firstValueFrom<{ data: number[] }>(
      this.httpService.get<number[]>(
        `${this.options.host}/subjects/${encodeURIComponent(subject)}/versions`,
      ),
    );
    return data;
  }
}
