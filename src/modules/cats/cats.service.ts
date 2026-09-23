import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatEntity } from './cat.entity';
import { Cat } from './cat.interface';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(CatEntity)
    private readonly catRepository: Repository<CatEntity>,
  ) {}

  // Errors are left to propagate: the previous `catch (err) { return err; }`
  // handed the Error back as if it were data, so a failed query reached the
  // client as a 200 with an Error object in the body.
  async findAll(): Promise<CatEntity[]> {
    return this.catRepository.find();
  }

  async create(cat: Cat): Promise<CatEntity> {
    return this.catRepository.save(cat);
  }
}
