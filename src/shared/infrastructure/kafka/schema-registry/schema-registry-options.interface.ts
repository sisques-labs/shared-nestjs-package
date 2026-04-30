export interface ISchemaRegistryOptions {
  host: string;
}

export interface ISchemaRegistryAsyncOptions {
  inject?: any[];
  imports?: any[];
  useFactory: (
    ...args: any[]
  ) => ISchemaRegistryOptions | Promise<ISchemaRegistryOptions>;
}
