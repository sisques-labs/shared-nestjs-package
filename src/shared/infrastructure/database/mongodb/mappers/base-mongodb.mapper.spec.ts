import { BaseMongoDto } from '@/shared/infrastructure/database/mongodb/dtos/base-mongo.dto';
import { BaseMongoDBMapper } from '@/shared/infrastructure/database/mongodb/mappers/base-mongodb.mapper';

type StubViewModel = { id: string; createdAt: Date };

type StubMongoDto = BaseMongoDto & { label: string };

type StubAggregate = { id: string; createdAt: Date };

class StubMongoMapper extends BaseMongoDBMapper<
  StubViewModel,
  StubMongoDto,
  StubAggregate
> {
  toAggregate(doc: StubMongoDto): StubAggregate {
    return {
      id: doc.id,
      createdAt: this.normalizeMongoDate(doc.createdAt),
    };
  }

  toViewModel(doc: StubMongoDto): StubViewModel {
    return {
      id: doc.id,
      createdAt: this.normalizeMongoDate(doc.createdAt),
    };
  }

  toMongoData(viewModel: StubViewModel): StubMongoDto {
    const now = new Date();
    return {
      id: viewModel.id,
      label: 'stub',
      createdAt: viewModel.createdAt,
      updatedAt: now,
    };
  }
}

describe('BaseMongoDBMapper', () => {
  const mapper = new StubMongoMapper();

  it('implements toViewModel and toMongoData (including string dates from driver)', () => {
    const doc = {
      id: '1',
      label: 'x',
      createdAt: '2019-01-01T00:00:00.000Z',
      updatedAt: new Date(),
    } as unknown as StubMongoDto;
    const vm = mapper.toViewModel(doc);
    expect(vm.id).toBe('1');
    expect(vm.createdAt).toBeInstanceOf(Date);

    const back = mapper.toMongoData(vm);
    expect(back.id).toBe('1');
    expect(back.label).toBe('stub');
  });
});
