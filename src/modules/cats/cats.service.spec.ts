import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { CatsService } from './cats.service';
import { CatEntity } from './cat.entity';

describe('CatsService', () => {
  let service: CatsService;
  let repository: Repository<CatEntity>;

  const repositoryMock = {
    find: vi.fn(),
    save: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        { provide: getRepositoryToken(CatEntity), useValue: repositoryMock },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
    repository = module.get(getRepositoryToken(CatEntity));
  });

  it('is constructed with its repository injected', () => {
    expect(service).toBeDefined();
    expect(repository).toBe(repositoryMock);
  });

  describe('findAll', () => {
    it('returns every row the repository has', async () => {
      const rows = [{ id: 1, name: 'Mimi', age: 2, breed: 'ragdoll' }];
      repositoryMock.find.mockResolvedValue(rows);

      await expect(service.findAll()).resolves.toEqual(rows);
      expect(repositoryMock.find).toHaveBeenCalledOnce();
    });

    // Regression: the service used to `catch (err) { return err }`, so a failed
    // query reached the client as a 200 with an Error object in the body.
    it('lets a repository failure propagate', async () => {
      repositoryMock.find.mockRejectedValue(new Error('connection refused'));

      await expect(service.findAll()).rejects.toThrow('connection refused');
    });
  });

  describe('create', () => {
    it('saves the cat and returns the saved row', async () => {
      const cat = { name: 'Mimi', age: 1, breed: '' };
      repositoryMock.save.mockResolvedValue({ id: 7, ...cat });

      await expect(service.create(cat)).resolves.toEqual({ id: 7, ...cat });
      expect(repositoryMock.save).toHaveBeenCalledWith(cat);
    });

    it('lets a repository failure propagate', async () => {
      repositoryMock.save.mockRejectedValue(new Error('unique violation'));

      await expect(
        service.create({ name: 'Mimi', age: 1, breed: '' }),
      ).rejects.toThrow('unique violation');
    });
  });
});
