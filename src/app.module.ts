/**
 * App module.
 * @file App 主模块
 * @module app/module
 */

import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 中间件
import { CorsMiddleware } from '@app/middlewares/cors.middleware';
import { OriginMiddleware } from '@app/middlewares/origin.middleware';

// 公共模块
// import { DatabaseModule } from '@app/processors/database/database.module'
// import { CacheModule } from '@app/processors/cache/cache.module'
import { HelperModule } from '@app/processors/helper/helper.module';

// 业务模块（核心）
import { AuthModule } from '@app/modules/auth/auth.module';
import { CatsModule } from '@app/modules/cats/cats.module';
import { DB } from './app.config';
// import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    HelperModule,

    // 加载连接数据库
    TypeOrmModule.forRoot({
      ...DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // 扫描本项目中.entity.ts或者.entity.js的文件
    }),
    CatsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware, OriginMiddleware).forRoutes('*');
  }
}
