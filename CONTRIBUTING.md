# Contributing · 贡献指南

English | [中文](#中文)

Thanks for taking the time to contribute. Issues and pull requests are both welcome.

## "I don't have permission to push"

You don't need it, and you shouldn't ask for it. **Nobody outside the project can push a branch to
this repository** — that is how GitHub works for every public repo, not a restriction set up here.
The way to contribute a change is to push to _your own_ fork and open a pull request from it:

```bash
# 1. Fork the repo on GitHub (the "Fork" button, top right)

# 2. Clone YOUR fork, not this one
git clone https://github.com/<your-username>/Nest-Postgre-API.git
cd Nest-Postgre-API

# 3. Point "upstream" at this repo so you can stay in sync
git remote add upstream https://github.com/ludejun/Nest-Postgre-API.git

# 4. Branch, commit, push to your fork
git checkout -b fix/some-bug
git commit -am "fix: describe what changed"
git push origin fix/some-bug

# 5. Open the pull request from your fork's branch against ludejun/master
```

Or do the whole thing with the [GitHub CLI](https://cli.github.com/):

```bash
gh repo fork ludejun/Nest-Postgre-API --clone
cd Nest-Postgre-API
git checkout -b fix/some-bug
# ...edit, commit...
gh pr create --repo ludejun/Nest-Postgre-API
```

A couple of things that can look like a permission problem but aren't:

- **The checks on your PR sit there greyed out.** For a first-time contributor, GitHub Actions waits
  for a maintainer to click "Approve and run". Nothing is wrong; it just needs a maintainer to look.
- **`git push` to `ludejun/…` returns 403.** Expected — see above. Push to your fork's remote.

## Development setup

This project uses [pnpm](https://pnpm.io/) and needs Node >= 20. The e2e suite also needs a
reachable PostgreSQL instance; the unit tests do not.

```bash
pnpm install
pnpm start:dev   # development, watch mode
```

## Before you open the pull request

Please make sure all four pass — CI runs exactly these:

```bash
pnpm lint        # eslint, must report 0 errors
pnpm typecheck   # tsc --noEmit
pnpm test        # vitest
pnpm build       # compile to dist/
```

If you changed behaviour, add or update a test in `tests/`. If you fixed a bug, a test that fails
without your fix is the most useful thing you can include.

Run `pnpm format` before committing so Prettier settles the formatting; CI does not reformat for you.

## A few conventions

- **Commit messages** follow [Conventional Commits](https://www.conventionalcommits.org/):
  `fix:`, `feat:`, `docs:`, `chore:`, `refactor:`, `test:`.
- **Both READMEs.** If a change affects the documented API, update `README.md` _and_ `README_CN.md`.
- **Declare what you import.** Four packages were imported without ever appearing in
  `package.json`; they only resolved through hoisting. pnpm's layout catches this, so do not work
  around a missing module by reaching for a hoisted copy.
- **Do not swallow errors.** `catch (err) { return err }` sends an `Error` object to the client as a
  200 response. Let errors reach the filters, which turn them into the documented shape.
- **Keep entities and DTOs in step.** A column missing from the entity is silently dropped on write.

## Reporting a bug

Open an [issue](https://github.com/ludejun/Nest-Postgre-API/issues) with:

- the Node and PostgreSQL versions,
- the endpoint and the request you sent,
- what you expected and what happened instead,
- the response you got, and the server log if there is one.

---

<a id="中文"></a>

# 中文

感谢你愿意花时间参与。Issue 和 Pull Request 都非常欢迎。

## “我没有权限提交代码”

你不需要这个权限，也不用来要。**项目之外的任何人都无法直接往本仓库推送分支** —— 这是 GitHub 对所有公开仓库的默认行为，不是本项目做了什么限制。正确的做法是推到**你自己的 fork**，再从 fork 发起 Pull Request：

```bash
# 1. 在 GitHub 页面右上角点 "Fork"

# 2. clone 你自己的 fork，不是这个仓库
git clone https://github.com/<你的用户名>/Nest-Postgre-API.git
cd Nest-Postgre-API

# 3. 把 upstream 指向本仓库，方便后续同步
git remote add upstream https://github.com/ludejun/Nest-Postgre-API.git

# 4. 建分支、提交、推到你自己的 fork
git checkout -b fix/some-bug
git commit -am "fix: 描述你改了什么"
git push origin fix/some-bug

# 5. 从你 fork 的这个分支，向 ludejun/master 发起 Pull Request
```

也可以用 [GitHub CLI](https://cli.github.com/) 一条龙：

```bash
gh repo fork ludejun/Nest-Postgre-API --clone
cd Nest-Postgre-API
git checkout -b fix/some-bug
# ...改代码、提交...
gh pr create --repo ludejun/Nest-Postgre-API
```

有两种情况看着像“没权限”，其实不是：

- **PR 上的 CI 检查一直灰着不跑。** 首次贡献者的 workflow 需要维护者点一下 “Approve and run”，这是 GitHub 的默认策略，等一下即可。
- **`git push` 到 `ludejun/…` 返回 403。** 这是预期行为，推到你自己 fork 的 remote 就好。

## 本地开发

本项目使用 [pnpm](https://pnpm.io/)，需要 Node >= 20。e2e 测试还需要一个可连接的 PostgreSQL；单元测试不需要。

```bash
pnpm install
pnpm start:dev   # 开发环境，watch 模式
```

## 提 PR 之前

请确认这四条全部通过 —— CI 跑的就是这四条：

```bash
pnpm lint        # eslint，必须 0 error
pnpm typecheck   # tsc --noEmit
pnpm test        # vitest
pnpm build       # 编译到 dist/
```

如果你改了行为，请在 `tests/` 下补充或更新测试。如果你修的是 bug，**一个不打补丁就会失败的测试**是最有价值的东西。

提交前跑一下 `pnpm format` 让 Prettier 统一格式，CI 不会替你格式化。

## 一些约定

- **提交信息**遵循 [Conventional Commits](https://www.conventionalcommits.org/)：`fix:`、`feat:`、`docs:`、`chore:`、`refactor:`、`test:`。
- **两份 README。** 如果改动影响了对外 API，请同时更新 `README.md` 和 `README_CN.md`。
- **用了什么就声明什么。** 之前有四个包被 import 却从没出现在 `package.json` 里，靠依赖提升侥幸能跑。pnpm 的严格目录结构能抓到这类问题，请不要绕过去用提升出来的副本。
- **不要吞掉错误。** `catch (err) { return err }` 会把 `Error` 对象当成 200 响应发给客户端。让错误抛到 filter，由它转成文档里定义的结构。
- **entity 要和 DTO 保持一致。** entity 上缺的列，写入时会被静默丢弃。

## 反馈 Bug

到 [Issues](https://github.com/ludejun/Nest-Postgre-API/issues) 提一条，请带上：

- Node 和 PostgreSQL 版本，
- 请求的是哪个接口、发了什么，
- 你期望的行为，以及实际发生了什么，
- 拿到的响应，以及服务端日志（如果有）。
