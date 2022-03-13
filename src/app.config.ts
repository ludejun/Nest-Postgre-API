/**
 * App config.
 * @file 应用运行配置
 * @module app/config
 */

import path from 'path';

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
