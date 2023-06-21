import { SearchQueryDto } from "../pipes/search-query.pipe";

export abstract class SearchingService {
  abstract prepareFilterParam(params: object): object;

  protected prepareQuery(query: SearchQueryDto, useDefaultSort: boolean = true): {
    limit: number,
    offset: number,
    sortParam: object,
    filterParam: object,
  } {
    const limit = query.limit ? query.limit : 10;
    const offset = query.offset ? query.offset : 0;
    let sortParam = {}, filterParam = {};
    if (query.sort) {
      sortParam[query.sort] = query.order;
    } else if(useDefaultSort) {
      sortParam['createdAt'] = 'desc';
    }
    if (query.rest) {
      filterParam = this.prepareFilterParam(query.rest);
    }
    return {limit, offset, sortParam, filterParam};
  }
}