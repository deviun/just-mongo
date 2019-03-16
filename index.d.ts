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

  export interface joinFiledT {
    [property: string]: string;
  }

  export class Collection {
    insert(list: any[] | any, options?: any): Promise<any>
    deleteMany(filter: MongoFilter, options?: any): Promise<any>
    deleteOne(filter: MongoFilter, options?: any): Promise<any>
    count(filter?: MongoFilter, options?: any): Promise<number>
    ObjectID(id: string): any
    findOne(filter?: MongoFilter, options?: any): Promise<any>
    find(filter?: MongoFilter, options?: any): Promise<any>
    updateOne(filter: MongoFilter, update: any, options?: any): Promise<any>
    updateMany(filter: MongoFilter, update: any, options?: any): Promise<any>
    editOne(filter: MongoFilter, update: any, options?: any): Promise<any>
    editMany(filter: MongoFilter, update: any, options?: any): Promise<any>
    aggregate(pipeline: PipelineItem[], options?: any): Promise<any>
    native(cb: Function): Promise<NativeInterface>
    findRandom(filter: MongoFilter, count: number, options?: any): Promise<any>
    join(filter: MongoFilter, joinCollection: Collection, joinFiled: joinFiledT, project: any, options?: any): Promise<any>
    listen(getUpdates: Function, timeout?: number): Listen
  }

  export class JMongo {
    constructor(connection: Connection, cb?: Function, setConnection?: any);
    collection(name: string): Collection;
  }

  export default JMongo;
}
