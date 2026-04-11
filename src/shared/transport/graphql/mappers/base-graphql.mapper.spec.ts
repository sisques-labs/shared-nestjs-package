import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses/base-paginated-result/base-paginated-result.dto';
import { BaseGraphQLMapper } from '@/shared/transport/graphql/mappers/base-graphql.mapper';

type StubViewModel = { id: string; name: string };
type StubResponseDto = { id: string; name: string };

class StubPaginatedResponseDto extends BasePaginatedResultDto {
  items: StubResponseDto[];
}

class StubGraphQLMapper extends BaseGraphQLMapper<
  StubViewModel,
  StubResponseDto,
  StubPaginatedResponseDto
> {
  toResponseDto(viewModel: StubViewModel): StubResponseDto {
    return { id: viewModel.id, name: viewModel.name };
  }

  toPaginatedResponseDto(
    paginatedResult: PaginatedResult<StubViewModel>,
  ): StubPaginatedResponseDto {
    return {
      items: paginatedResult.items.map((vm) => this.toResponseDto(vm)),
      total: paginatedResult.total,
      page: paginatedResult.page,
      perPage: paginatedResult.perPage,
      totalPages: paginatedResult.totalPages,
    };
  }
}

function makeViewModel(id: string, name: string): StubViewModel {
  return { id, name };
}

function makePaginatedResult(
  items: StubViewModel[],
  overrides: Partial<Omit<PaginatedResult<StubViewModel>, 'items'>> = {},
): PaginatedResult<StubViewModel> {
  return {
    items,
    total: items.length,
    page: 1,
    perPage: 10,
    totalPages: 1,
    ...overrides,
  };
}

describe('BaseGraphQLMapper', () => {
  let mapper: StubGraphQLMapper;

  beforeEach(() => {
    mapper = new StubGraphQLMapper();
  });

  describe('toResponseDto', () => {
    it('maps a view model to a response DTO', () => {
      const vm = makeViewModel('1', 'Foo');
      const dto = mapper.toResponseDto(vm);

      expect(dto.id).toBe('1');
      expect(dto.name).toBe('Foo');
    });

    it('preserves all fields from the view model', () => {
      const vm = makeViewModel('abc', 'Bar');
      const dto = mapper.toResponseDto(vm);

      expect(dto).toEqual({ id: 'abc', name: 'Bar' });
    });
  });

  describe('toPaginatedResponseDto', () => {
    it('maps each item via toResponseDto', () => {
      const vms = [makeViewModel('1', 'A'), makeViewModel('2', 'B')];
      const result = makePaginatedResult(vms);
      const dto = mapper.toPaginatedResponseDto(result);

      expect(dto.items).toHaveLength(2);
      expect(dto.items[0]).toEqual({ id: '1', name: 'A' });
      expect(dto.items[1]).toEqual({ id: '2', name: 'B' });
    });

    it('forwards pagination metadata', () => {
      const result = makePaginatedResult([], {
        total: 50,
        page: 3,
        perPage: 10,
        totalPages: 5,
      });
      const dto = mapper.toPaginatedResponseDto(result);

      expect(dto.total).toBe(50);
      expect(dto.page).toBe(3);
      expect(dto.perPage).toBe(10);
      expect(dto.totalPages).toBe(5);
    });

    it('returns empty items array when paginated result is empty', () => {
      const dto = mapper.toPaginatedResponseDto(makePaginatedResult([]));

      expect(dto.items).toEqual([]);
    });
  });

  describe('round-trip', () => {
    it('single item paginated → items match direct toResponseDto call', () => {
      const vm = makeViewModel('rt-1', 'RoundTrip');
      const dto = mapper.toResponseDto(vm);
      const paginated = mapper.toPaginatedResponseDto(
        makePaginatedResult([vm]),
      );

      expect(paginated.items[0]).toEqual(dto);
    });
  });
});
