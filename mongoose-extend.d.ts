import * as mongoose from 'mongoose';

declare module 'mongoose' {
  interface Query<ResultType, DocType, THelpers = {}, RawDocType = DocType> {
    cache(opts?: { key?: string; expiryTime?: number }): this;
    shouldCached?: boolean;
    primaryKey?: string;
    expiryTime?: number;
  }
}
