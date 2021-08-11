import { Injectable, Inject } from '@nestjs/common';
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

  async findAll(): Promise<any[]> {
    try {
      return await this.catRepository.find();
    } catch (err) {
      return err;
    }
  }

  async create(cat: Cat) {
    try {
      return await this.catRepository.save(cat);
    } catch (err) {
      return err;
    }
  }
}
