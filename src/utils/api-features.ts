import { Query } from 'mongoose';

export interface QueryString {
  name: object;
  sort: string;
  fields: string;
  page: number;
  limit: number;
}

export class APIFeatures {
  constructor(
    public query: Query<any, any>,
    private queryString: QueryString,
  ) {}

  filter() {
    const queryObject = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObject[el]);
    if (queryObject.name) {
      queryObject.name = { $regex: queryObject.name, $options: 'i' };
    }
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = JSON.stringify(this.queryString.sort).split(',').join(' ');
      this.query = this.query.sort(JSON.parse(sortBy));
    } else {
      this.query = this.query.sort('-createdAt'); // To sort by the newest
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = JSON.stringify(this.queryString.fields)
        .split(',')
        .join(' ');
      this.query = this.query.select(JSON.parse(fields));
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
