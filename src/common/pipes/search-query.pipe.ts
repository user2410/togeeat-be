import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";

export class SearchQueryDto {
	constructor(
		public limit?: number,
		public offset?: number,
		public sort?: string,
		public order?: string,
		public origQueries?: object
	) { }
}

@Injectable()
export class SearchQueryPipe implements PipeTransform<any> {
	transform(value: any): SearchQueryDto {
		const { _limit, _offset, _sort, _order, ...rest } = value;
		const __limit = parseInt(_limit);
		const __offset = parseInt(_offset);

		if (_limit && _offset &&
			(Number.isNaN(__limit) || __limit < 0 ||
				Number.isNaN(__offset) || __offset < 0)) {
			throw new BadRequestException(`Invalid pagination query offset=${_limit}, offset=${_offset}`);
		}

		if (_order && !/^(asc|desc)$/.test(_order)) {
			throw new BadRequestException("_order must be 'asc' or 'desc'");
		}

		if ((_order && !_sort) || (!_order && _sort)) {
			throw new BadRequestException("Sort field is required when order field is present");
		}

		return new SearchQueryDto(__limit, __offset, _sort, _order, rest);
	}
}
