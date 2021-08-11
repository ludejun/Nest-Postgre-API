## Nest-Postgre-API

*Nest + Postgre + JWT + TypeORM* 基于Nest和传统数据库Postgre的Node Restful API脚手架，适用于基础生产项目

参考https://github.com/surmon-china/nodepress

刚开始不习惯TypeORM，想使用传统sql来请求数据库，后面使用TypeORM也还习惯，原生兼容Nest、代码entity可以和数据库打通、API也还简单
### 接口概述

- HTTP 状态码（详见 [errors] ）

  - `400` 请求的业务被拒绝
  - `401` 鉴权失败
  - `403` 权限不足/请求参数需要更高的权限
  - `404` 资源不存在
  - `405` 无此方法
  - `500` 服务器挂了
  - `200` 正常
  - `201` POST 正常

- 数据特征码（详见 [http.interface.ts] ）
  - `status`：
    - `success`：正常
    - `error`：异常
  - `message`：永远返回（由 [http.decorator] 装饰）
  - `error`：一般会返回错误发生节点的 error；在 `status` 为 `error` 的时候必须返回，方便调试
  - `debug`：开发模式下为发生错误的堆栈，生产模式不返回
  - `result`：在 `status` 为 `success` 的时候必须返回
    - 列表数据：一般返回`{ pagination: {...}, data: {..} }`
    - 具体数据：例如文章，则包含直接数据如`{ title: '', content: ... }`

### 数据模型

- 通用

略，采用传统关系数据库模型

### 应用结构

- 入口

  - `main.ts`：引入配置，启动主程序，引入各种全局服务
  - `app.module.ts`：主程序根模块，负责各业务模块的聚合
  - `app.controller.ts`：主程序根控制器
  - `app.config.ts`：主程序配置，数据库、程序、第三方，一切可配置项
  - `app.environment.ts：`全局环境变量

- 请求处理流程

  1. `request`：收到请求
  2. `middleware`：中间件过滤（跨域、来源校验等处理）
  3. `guard`：守卫过滤（鉴权）
  4. `interceptor:before`：数据流拦截器（本应用为空，即：无处理）
  5. `pipe`：参数提取（校验）器
  6. `controller`：业务控制器
  7. `service`：业务服务
  8. `interceptor:after`：数据流拦截器（格式化数据、错误）
  9. `filter`：捕获以上所有流程中出现的异常，如果任何一个环节抛出异常，则返回错误

- 鉴权处理流程

  1. `guard`：[守卫] 分析请求
  2. `guard.canActivate`：继承处理
  3. `JwtStrategy.validate`：调用 [鉴权服务]
  4. `guard.handleRequest`：[根据鉴权服务返回的结果作判断处理，通行或拦截]

- 鉴权级别

  - 任何高级操作（CUD）都会校验必须的 Token（代码见 [auth.guard.ts] ）
  - 涉及表数据读取的 GET 请求会智能校验 Token，无 Token 或 Token 验证生效则通行，否则不通行（代码见 [humanized-auth.guard.ts] ）

- 参数校验逻辑（代码见 [query-params.decorator.ts] ）

  - 普通用户使用高级查询参数将被视为无权限，返回 403
  - 任何用户的请求参数不合法，将被校验器拦截，返回 400

- 错误过滤器（代码见 [error.filter.ts] ）

- 拦截器 [interceptors]

  - [缓存拦截器]：自定义这个拦截器是是要弥补框架不支持 ttl 参数的缺陷
  - [数据流转换拦截器]：当控制器所需的 Promise service 成功响应时，将在此被转换为标准的数据结构
  - [数据流异常拦截器]：当控制器所需的 Promise service 发生错误时，错误将在此被捕获
  - [日志拦截器]：代替默认的全局日志

- 装饰器扩展 [decorators]

  - [缓存装饰器]：用于配置 `cache key / cache ttl`
  - [控制器响应装饰器]：用于输出规范化的信息，如 `message` 和 翻页参数数据
  - [请求参数提取器]：用户自动校验和格式化请求参数，包括 `query/params/辅助信息`

- 守卫 [guards]

  - 默认所有非 GET 请求会使用 [Auth] 守卫鉴权
  - 所有涉及到多角色请求的 GET 接口会使用 [HumanizedJwtAuthGuard] 进行鉴权

- 中间件 [middlewares]

  - [Cors 中间件]，用于处理跨域访问
  - [Origin 中间件]，用于拦截各路不明请求

- 管道 [pipes]

  - validation.pipe 用于验证所有基于 class-validate 的验证类

- 业务模块 [modules]

  - Cats Demo

- 核心辅助模块 [processors]
  - [数据库]
    <!-- - 连接数据库和异常自动重试
  - [缓存 / Redis]
    - 基本的缓存数据 Set、Get
    - 扩展的 [Promise 工作模式](https://github.com/surmon-china/nodepress/blob/main/src/processors/cache/cache.service.ts#L99)（双向同步/被动更新）
    - 扩展的 [Interval 工作模式](https://github.com/surmon-china/nodepress/blob/main/src/processors/cache/cache.service.ts#L138)（超时更新/定时更新）
  - [辅助 / Helper](https://github.com/surmon-china/nodepress/blob/main/src/processors/helper)
    - [搜索引擎实时更新服务](https://github.com/surmon-china/nodepress/blob/main/src/processors/helper/helper.service.seo.ts)：根据入参主动提交搜索引擎收录，支持百度、Google 服务；分别会在动态数据 进行 CUD 的时候调用对应方法
    - [评论过滤服务](https://github.com/surmon-china/nodepress/blob/main/src/processors/helper/helper.service.akismet.ts)：使用 akismet 过滤 spam；暴露三个方法：校验 spam、提交 spam、提交 ham
    - [邮件服务](https://github.com/surmon-china/nodepress/blob/main/src/processors/helper/helper.service.email.ts)：根据入参发送邮件；程序启动时会自动校验客户端有效性，校验成功则根据入参发送邮件
    - [IP 地理查询服务](https://github.com/surmon-china/nodepress/blob/main/src/processors/helper/helper.service.ip.ts)：根据入参查询 IP 物理位置；控制器内优先使用阿里云 IP 查询服务，当服务无效，~~使用本地 GEO 库查询~~，使用 ip.cn 等备用方案
    - [第三方云存储服务](https://github.com/surmon-china/nodepress/blob/main/src/processors/helper/helper.service.oss.ts)：生成云存储上传 Token（目前服务为 Aliyun OSS），后期可以添加 SDK 的更多支持，比如管理文件
    - Google 证书（鉴权）服务：用于生成各 Google 应用的服务端证书 -->


#### Google Indexing API

- [完整的配置流程文档](https://developers.google.com/search/apis/indexing-api/v3/quickstart)
- 「 统计用户的所有者角色 」添加页面 [在这里](https://www.google.com/webmains/verification/details?hl=zh-CN&domain=<xxx.com>)，而非 [新版的](https://search.google.com/search-console/users?resource_id=<xxx.com>)

#### Google Auth

- OAuth 2.0 客户端 ID、服务帐号密钥 都是 OAuth 授权类型
- [Auth 申请及管理页面](https://console.developers.google.com/apis/credentials)

#### Google Analytics Embed API

- [完整文档](https://developers.google.com/analytics/devguides/reporting/embed/v1/)
- [完整示例](https://ga-dev-tools.appspot.com/embed-api/)
- [服务端签发 token 鉴权示例](https://ga-dev-tools.appspot.com/embed-api/server-side-authorization/)
- [客户端 API 文档](https://developers.google.com/analytics/devguides/reporting/embed/v1/core-methods-reference)
- [将服务账户添加为 GA 的数据阅读者操作页面](https://marketingplatform.google.com/home/accounts)

## Development Setup

```bash
# 安装
$ yarn

# 开发
$ yarn start:dev

# 测试
$ yarn lint
$ yarn test
$ yarn test:e2e
$ yarn test:cov
$ yarn test:watch

# 构建
$ yarn build

# 生产环境运行
$ yarn start:prod

# 更新 GEO IP 库数据
$ yarn update-geo-db
```
