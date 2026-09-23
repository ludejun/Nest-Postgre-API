import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

describe('CatsController', () => {
  let controller: CatsController;

  const serviceMock = {
    findAll: vi.fn(),
    create: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [{ provide: CatsService, useValue: serviceMock }],
    }).compile();

    controller = module.get<CatsController>(CatsController);
  });

  it('is constructed with its service injected', () => {
    expect(controller).toBeDefined();
  });

  it('GET /cats hands back whatever the service returns', async () => {
    const rows = [{ name: 'Mimi', age: 2, breed: 'ragdoll' }];
    serviceMock.findAll.mockResolvedValue(rows);

    await expect(controller.findAll()).resolves.toEqual(rows);
  });

  it('GET /cats/create/:name creates a cat from the route parameter', async () => {
    serviceMock.create.mockResolvedValue(undefined);

    await controller.create({ name: 'Mimi' });

    expect(serviceMock.create).toHaveBeenCalledWith({
      name: 'Mimi',
      age: 1,
      breed: '',
    });
  });
});
