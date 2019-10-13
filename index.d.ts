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
    deleteMany<FT = MongoFilter>(filter: FT, options?: any): Promise<any>
    deleteOne<FT = MongoFilter>(filter: FT, options?: any): Promise<any>
    count<FT = MongoFilter>(filter?: FT, options?: any): Promise<number>
    ObjectID(id: string): any
    findOne<RT, FT = RT | MongoFilter>(filter?: RT, options?: any): Promise<RT>
    find<RT, FT = RT | MongoFilter>(filter?: FT, options?: any): Promise<RT>
    updateOne<FT = MongoFilter>(filter: FT | MongoFilter, update: any, options?: any): Promise<any>
    updateMany<FT = MongoFilter>(filter: FT | MongoFilter, update: any, options?: any): Promise<any>
    editOne<FT = MongoFilter>(filter: FT, update: any, options?: any): Promise<any>
    editMany<FT = MongoFilter>(filter: FT, update: any, options?: any): Promise<any>
    aggregate<RT, PLT = PipelineItem[]>(pipeline: PLT, options?: any): Promise<RT>
    native(cb: Function): Promise<NativeInterface>
    findRandom<RT, FT = MongoFilter>(filter: FT, count: number, options?: any): Promise<RT>
    join<RT, FT = MongoFilter>(filter: FT, joinCollection: Collection, joinFiled: joinFiledT, project: any, options?: any): Promise<RT>
    listen(getUpdates: Function, timeout?: number): Listen
  }

  export class JMongo {
    constructor(connection: Connection, cb?: Function, setConnection?: any);
    collection(name: string): Collection;
  }

  export default JMongo;
}
