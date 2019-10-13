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
    deleteMany<FT>(filter: FT | MongoFilter, options?: any): Promise<any>
    deleteOne<FT>(filter: FT | MongoFilter, options?: any): Promise<any>
    count(filter?: MongoFilter, options?: any): Promise<number>
    ObjectID(id: string): any
    findOne<RT, FT>(filter?: RT | FT | MongoFilter, options?: any): Promise<RT>
    find<RT, FT>(filter?: RT | FT | MongoFilter, options?: any): Promise<RT>
    updateOne<FT>(filter: FT | MongoFilter, update: any, options?: any): Promise<any>
    updateMany<FT>(filter: FT | MongoFilter, update: any, options?: any): Promise<any>
    editOne<FT>(filter: FT | MongoFilter, update: any, options?: any): Promise<any>
    editMany<FT>(filter: FT | MongoFilter, update: any, options?: any): Promise<any>
    aggregate<RT, PLT>(pipeline: PLT | PipelineItem[], options?: any): Promise<RT>
    native(cb: Function): Promise<NativeInterface>
    findRandom<RT, FT>(filter: FT | MongoFilter, count: number, options?: any): Promise<RT>
    join<RT, FT>(filter: FT | MongoFilter, joinCollection: Collection, joinFiled: joinFiledT, project: any, options?: any): Promise<RT>
    listen(getUpdates: Function, timeout?: number): Listen
  }

  export class JMongo {
    constructor(connection: Connection, cb?: Function, setConnection?: any);
    collection(name: string): Collection;
  }

  export default JMongo;
}
