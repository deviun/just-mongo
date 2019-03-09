declare module "just-mongo" {
  export interface Connection {
    models?: any,
    log?: string,
    db?: string,
    host?: string,
    user?: string,
    password?: string,
    port?: number,
  }

  export interface MongoFilter {

  }

  export interface MongoResponse {

  }

  export interface PipelineItem {

  }

  export interface NativeInterface {

  }

  export class Listen {
    addListener(cb: Function): Listen;
    removeListener(cb: Function): Listen;
    close(): void;
    error(cb: Function): Listen;
  }

  export class Collection {
    insert<T>(list: object[] | object): Promise<object>
    deleteMany(filter: MongoFilter, options?: object): Promise<object>
    deleteOne(filter: MongoFilter, options?: object): Promise<object>
    count(filter?: MongoFilter, options?: object): Promise<number>
    ObjectID(id: string): object
    findOne(filter?: MongoFilter): Promise<object>
    find(filter?: MongoFilter): Promise<object>
    updateOne(filter: MongoFilter, update: object, options?: object): Promise<object>
    updateMany(filter: MongoFilter, update: object, options?: object): Promise<object>
    editOne(filter: MongoFilter, update: object, options?: object): Promise<object>
    editMany(filter: MongoFilter, update: object, options?: object): Promise<object>
    aggregate(pipeline: PipelineItem[], options?: object): Promise<object>
    native(cb: Function): Promise<NativeInterface>
    findRandom(filter: MongoFilter, count: number, options?: object): Promise<object>
    join(filter: MongoFilter, joinCollection: Collection, joinFiled: string, project: object, options?: object): Promise<object>
    listen(getUpdates: Function, timeout?: number): Listen
  }

  export class JMongo {
    constructor(connection: Connection, cb?: Function, setConnection?: any);
    collection(name: string): Collection;
  }

  export default JMongo;
}
