/**
 * App config.
 * @file 应用运行配置
 * @module app/config
 */

import path from 'path';
import { ConnectionOptions } from 'typeorm';
import { environment } from './app.environment';

const APP_ROOT_PATH = __dirname;
const PROJECT_ROOT_PATH = path.join(APP_ROOT_PATH, '..');
const FE_PATH = path.join(PROJECT_ROOT_PATH, '..', 'surmon.me');
const FE_PUBLIC_PATH = path.join(FE_PATH, 'public');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJSON = require(path.resolve(PROJECT_ROOT_PATH, 'package.json'));

export const APP = {
  LIMIT: 16,
  PORT: 8000,
  MASTER: 'ludejun',
  NAME: 'ludejun',
  URL: 'https://demo',
  FRONT_END_PATH: FE_PATH,
  FRONT_END_PUBLIC_PATH: FE_PUBLIC_PATH,
  ROOT_PATH: APP_ROOT_PATH,
  PROJECT_ROOT_PATH,
};

export const PROJECT = {
  name: packageJSON.name,
  version: packageJSON.version,
  author: packageJSON.author,
  site: APP.URL,
  homepage: packageJSON.homepage,
  // issues: packageJSON.bugs.url,
};

export const CROSS_DOMAIN = {
  allowedOrigins: [
    'https://surmon.me',
    'https://cdn.surmon.me',
    'https://admin.surmon.me',
  ],
  allowedReferer: 'surmon.me',
};

export const AUTH = {
  expiresIn: 3600,
  data: { user: 'root' },
  jwtTokenSecret: '!!important',
  defaultPassword: 'root',
};

export const DB = {
  type: 'postgres', // 数据库类型
  host: 'localhost', // 数据库ip地址
  port: 5432, // 端口
  username: 'postgres', // 登录名
  password: 'test', // 密码
  database: 'Nest_API', // 数据库名称
  ...{
    production: {
      host: '***',
      port: 5432,
      username: 'postgres',
      password: '***',
    },
    test: {
      host: '***',
      password: '***',
    },
    development: {
      dropSchema: false, // 每次建立连接时是否删除架构，不要在生产环境中使用它，否则将丢失所有生产数据
      logging: true, // 是否启用日志记录
      synchronize: true, // 定义数据库表结构与实体类字段同步(这里一旦数据库少了字段就会自动加入,根据需要来使用)
    },
  }[environment],
} as ConnectionOptions;

export const EMAIL = {
  account: 'your email address, e.g. i@surmon.me',
  password: 'your email password',
  from: '"Surmon" <i@surmon.me>',
  admin: 'surmon@foxmail.com',
};

export const COMMON_SERVICE = {
  aliyunIPAuth: 'aliyun_ip_auth',
  juheIPAuth: 'juhe_ip_auth',
};
