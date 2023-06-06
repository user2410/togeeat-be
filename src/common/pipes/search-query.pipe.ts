import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";

export class SearchQueryDto {
	constructor(
		public limit?: number,
		public offset?: number,
		public sort?: string,
		public order?: string,
		public rest?: object
	) { }
}

@Injectable()
export class SearchQueryPipe implements PipeTransform<any, SearchQueryDto> {
	transform(value: any): SearchQueryDto {
		const { limit, offset, sort, order, ...rest } = value;

		const dto = new SearchQueryDto();

		dto.limit = limit ? parseInt(limit, 10) : undefined;
		dto.offset = offset ? parseInt(offset, 10) : undefined;
		if (
			Number.isNaN(dto.limit) ||
			Number.isNaN(!dto.offset) ||
			dto.limit as number < 0 ||
			dto.offset as number < 0
		) {
			throw new BadRequestException(`invalid pagination query: limit=${limit}, offset=${offset}`);
		}

		if (order && !/^(asc|desc)$/.test(order)) {
			throw new BadRequestException("order must be 'asc' or 'desc'");
		}
		if ((order && !sort) || (!order && sort)) {
			throw new BadRequestException("sort field is required when order field is present");
		}
		dto.sort = sort;
		dto.order = order;

		delete rest['rest'];
		dto.rest = rest;

		return dto;
	}
}
