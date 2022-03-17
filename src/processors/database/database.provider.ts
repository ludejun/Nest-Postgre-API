import { createConnection } from 'typeorm';
import { DB } from '@app/app.config';

export const databaseProvider = {
  provide: 'DbConnectionToken',
  useFactory: async () =>
    await createConnection({
      type: 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // 扫描本项目中.entity.ts或者.entity.js的文件
      synchronize: true, // DEV only, do not use on PROD! // 定义数据库表结构与实体类字段同步(这里一旦数据库少了字段就会自动加入,根据需要来使用)
    }),
};
