# Цифровая визитка на GraphQL

Небольшой backend-сервис, который отдаёт мою визитку: профиль, навыки, опыт работы и проекты.
Всё лежит в PostgreSQL, база заполняется сама при первом запуске, наружу торчит GraphQL и
Apollo Sandbox.

Стек: TypeScript, Node.js 22, NestJS 12, Prisma 7, PostgreSQL 17, Apollo Server 5, Docker.
Тесты на Vitest, линт и форматирование на ESLint + Prettier.

| Что            | Куда                                                                 |
| -------------- | -------------------------------------------------------------------- |
| Apollo Sandbox | `http://localhost:3000/`                                             |
| GraphQL        | `http://localhost:3000/graphql`                                      |
| Health check   | `http://localhost:3000/health`                                       |
| SDL            | [`schema.gql`](./schema.gql), генерируется из кода                   |
| Данные визитки | [`src/database/seed/seed-data.ts`](./src/database/seed/seed-data.ts) |

## Запуск

Docker, самый короткий путь:

```bash
git clone <repo-url> business-card
cd business-card
docker compose up --build
```

Поднимаются база и API. Entrypoint контейнера ждёт PostgreSQL, накатывает миграции
(`prisma migrate deploy`), после старта приложение проверяет, есть ли профиль, и если базы
пустая — заливает данные из seed-файла. Через полминуты всё доступно на `http://localhost:3000/`.

Без Docker:

```bash
cp .env.example .env
docker compose up -d db     # только база
npm ci                      # postinstall сам вызовет prisma generate
npm run db:migrate
npm run start:dev
```

Команды, которыми пользуюсь чаще всего:

```bash
npm run db:seed             # заполнить пустую базу
npm run db:seed -- --force  # пересоздать данные визитки
npm run db:studio           # Prisma Studio
npm run test                # unit
npm run test:e2e            # e2e, нужен DATABASE_URL
npm run lint && npm run format:check
LOG_LEVEL=debug npm run start:dev   # в лог попадают SQL-запросы
```

## API

Запросы: `profile` (основной профиль), `profiles` (все, если визитка когда-нибудь станет
командной), `skills(filter: SkillFilterInput)`.

Мутации: `updateProfile`, `addSkill`, `addExperience`, `addProject`.

Запрос из тестового задания:

```graphql
query {
  profile {
    fullName
    description
    skills {
      name
    }
    experience {
      company
      position
    }
    projects {
      name
    }
  }
}
```

А так выглядит карточка целиком:

```graphql
query FullCard {
  profile {
    fullName
    headline
    description
    location
    avatarUrl
    links {
      type
      url
    }
    skills {
      name
      category
      level
      yearsOfExperience
    }
    experience {
      company
      position
      startDate
      endDate
      isCurrent
      summary
      achievements
    }
    projects {
      name
      slug
      repositoryUrl
      featured
      technologies {
        name
        category
      }
    }
  }
}
```

Пример мутации:

```graphql
mutation {
  addProject(
    input: {
      name: "Journal"
      repositoryUrl: "https://github.com/Siles9/Journal"
      startDate: "2026-10-01T00:00:00Z"
      technologies: ["HTML", "CSS"]
    }
  ) {
    slug
    technologies {
      name
    }
  }
}
```

Ошибки. Входные типы описаны классами с `class-validator`, глобальный `ValidationPipe` работает
с `whitelist` и `forbidNonWhitelisted`. Сообщения валидации возвращаются прямо в тексте
GraphQL-ошибки (`name: name should not be empty`), а не как голый `Bad Request Exception`.
Для этого написана фабрика исключений и небольшой `formatError`. Бизнес-правила вроде
`endDate` раньше `startDate` проверяются в сервисах и отвечают так же.

## Как устроено

```
резолверы + input/object типы   src/modules/*/…resolver.ts, dto/, entities/
        ↓
сервисы (правила, транзакции)   src/modules/*/…service.ts
        ↓
репозитории (Prisma)            src/modules/*/…repository.ts
        ↓
PostgreSQL
```

Резолверы не знают про Prisma: приняли аргументы, позвали сервис, вернули результат. Связи
(`Profile.skills`, `Profile.experience`, `Profile.projects`, `Project.technologies`) вынесены в
отдельные `@ResolveField` и идут через DataLoader.

Сервисы держат логику: пустой `updateProfile` отклоняется, проект с занятым слагом получает
суффикс `-2`, навык и запись в каталоге создаются в одной транзакции.

Репозитории спрятаны за интерфейсами с DI-токенами (`PROFILE_REPOSITORY`, `SKILL_REPOSITORY` и
т.д.). Prisma-реализация лежит рядом, поэтому unit-тесты подменяют репозиторий и не требуют базы.

Схема GraphQL собирается из декораторов (code-first). `schema.gql` генерируется приложением и
лежит в репозитории как контракт, чтобы было видно, что изменилось в API.

```
src/
├── main.ts                  bootstrap, helmet, cors, ValidationPipe
├── app.setup.ts             HTTP-настройка, общая для main.ts и e2e
├── config/environment.ts    валидация переменных окружения
├── common/                  guard для мутаций, slugify, ошибки валидации
├── database/                PrismaService, PrismaModule, seed
├── graphql/                 настройка Apollo, контекст, фабрика DataLoader
├── modules/                 profile, skills, experience, projects
├── health/                  /health
└── landing/                 / (Apollo Sandbox)
prisma/                      схема и миграции
test/                        e2e
```

Почему так, а не иначе:

- **Репозитории поверх Prisma.** Хотелось, чтобы бизнес-логику можно было тестировать без базы,
  и чтобы модели Prisma не расползались по сервисам.
- **Code-first GraphQL.** Типы, описания и валидация в одном месте, нет отдельной SDL, которую
  надо синхронизировать руками.
- **Модуль на домен.** Профиль, навыки, опыт и проекты живут отдельно; связь резолвится в том
  модуле, который ею владеет (`Profile.skills` — в модуле навыков).
- **Prisma 7 с драйвером `pg`.** Пул соединений у `pg`, движок Prisma в WASM, в образе нет
  бинарников движка.

## Модель данных

```mermaid
erDiagram
    Profile ||--o{ ProfileSkill : ""
    Skill   ||--o{ ProfileSkill : ""
    Profile ||--o{ Experience : ""
    Profile ||--o{ Project : ""
    Project ||--o{ ProjectSkill : ""
    Skill   ||--o{ ProjectSkill : ""

    Profile {
        uuid id PK
        string slug UK
        string full_name
        string headline
        string description
        string location
        string email
        string github_url
        string linkedin_url
        string telegram_url
        string website_url
        boolean is_primary
        timestamptz created_at
        timestamptz updated_at
    }
    Skill {
        uuid id PK
        string name UK
        enum category
    }
    ProfileSkill {
        uuid profile_id FK
        uuid skill_id FK
        enum level
        int years_of_experience
        int sort_order
    }
    Experience {
        uuid id PK
        uuid profile_id FK
        string company
        string position
        date start_date
        date end_date
        string summary
        string_array achievements
    }
    Project {
        uuid id PK
        uuid profile_id FK
        string slug UK
        string name
        string repository_url
        boolean featured
    }
    ProjectSkill {
        uuid project_id FK
        uuid skill_id FK
    }
```

Навык лежит в общем каталоге и привязывается к профилям и проектам через join-таблицы. Личные
данные (уровень, стаж) хранятся в `profile_skills`. Пустой `end_date` значит «работаю до сих
пор», отдельный флаг `is_current` не нужен — `Experience.isCurrent` считается в резолвере.
Удаление профиля каскадом чистит связи. В БД snake_case, в TypeScript camelCase, мост через
`@map`/`@@map`.

## Запросы к базе

Обычная проблема GraphQL — N+1: резолвер поля вызывается на каждый объект, и на каждый профиль,
проект и навык улетает отдельный запрос.

У меня по одному `DataLoader` на связь, фабрика создаёт их на каждый HTTP-запрос
(`src/graphql/data-loaders.factory.ts`). Внутри одной операции все обращения собираются в пакет
и уходят одним `WHERE ... IN (...)`.

Замерял по логу SQL (`LOG_LEVEL=debug`):

| Запрос                                 | SQL |
| -------------------------------------- | --- |
| `profile { fullName headline }`        | 1   |
| `profile` со всеми связями             | 7   |
| `profiles { skills }`, 1 профиль       | 3   |
| `profiles { skills }`, 3 профиля       | 3   |
| `profiles` со всеми связями, 3 профиля | 7   |

Число запросов не зависит от количества объектов в ответе, а если клиент просит только скаляры,
таблицы связей вообще не читаются. Чтобы это не сломали случайно, есть e2e-тест: он падает,
если вложенный запрос к трём профилям сделает больше трёх `SELECT`.

Что можно добавить дальше: пагинацию в стиле Relay, кэш на уровне HTTP, ограничение сложности
запроса. Пока данных мало, не стал усложнять.

## База и сидинг

Миграции лежат в `prisma/migrations` и накатываются в entrypoint контейнера с ретраями, пока
база не поднимется. Схема БД всегда соответствует `schema.prisma`, руками ничего не создаётся.

Данные заливает `SeedService` при старте:

- смотрит, есть ли профиль с `slug = 'zakhar'`, и если есть — ничего не трогает, чтобы правки
  через API не затирались рестартом;
- работает в транзакции и берёт `pg_advisory_xact_lock`, так что несколько реплик одновременно
  ничего не задублируют;
- id детерминированные, вставка через `ON CONFLICT DO NOTHING` — повторный запуск безопасен;
- отключается переменной `SEED_ON_START=false`.

`npm run db:seed -- --force` удаляет профиль (связи уходят каскадом) и создаёт заново.

Сам контент — обычный объект в [`src/database/seed/seed-data.ts`](./src/database/seed/seed-data.ts).
Там моё резюме: Unity-разработка в ООО «ИНТЕГРА-ИТ», игра Land Farm в Steam, учебные и пет-проекты
на C#, ASP.NET и Node.js, ну и эта визитка. Правится руками либо через мутации.

## Тесты

```bash
npm run test
npm run test:e2e
```

Unit (11 штук, база не нужна): правила сервиса профиля, сборка ссылок, slugify.

E2E (4 штуки, нужен PostgreSQL):

- запрос из задания возвращает профиль со связями;
- вложенный запрос к трём профилям делает не больше трёх `SELECT`;
- ошибки валидации приходят с нормальным текстом;
- `/` отдаёт Apollo Sandbox, `/health` проверяет базу.

```bash
docker compose up -d db
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/business_card?schema=public" npm run test:e2e
```

GitHub Actions на каждый PR гоняет форматирование, линтер, сборку, unit и e2e на сервисном
PostgreSQL, отдельным job'ом собирает Docker-образ.

## Конфигурация

| Переменная         | Обязательна | По умолчанию  | Зачем                                             |
| ------------------ | ----------- | ------------- | ------------------------------------------------- |
| `DATABASE_URL`     | да          | —             | подключение к PostgreSQL                          |
| `PORT`             | нет         | `3000`        | порт HTTP                                         |
| `NODE_ENV`         | нет         | `development` | в `production` из ошибок убирается stacktrace     |
| `MUTATION_API_KEY` | нет         | пусто         | если задан, мутации требуют заголовок `x-api-key` |
| `CORS_ORIGINS`     | нет         | любые         | список origin'ов через запятую                    |
| `SEED_ON_START`    | нет         | `true`        | заливать данные в пустую базу                     |
| `LOG_LEVEL`        | нет         | `log`         | `debug` включает SQL в лог                        |

Всё проверяется на старте (`src/config/environment.ts`): без `DATABASE_URL` или с кривым `PORT`
приложение не поднимется и скажет, что не так.

## Безопасность

Чтение публичное. Мутации закрываются `x-api-key`, если задан `MUTATION_API_KEY`; ключ
сравнивается через `timingSafeEqual`. Плюс `helmet`, настраиваемый CORS, `whitelist` в
`ValidationPipe` и отсутствие stacktrace в ответах на проде. Контейнер крутится от пользователя
`node` под `tini`. Секретов в репозитории нет, только `.env.example`.

`X-Frame-Options` отключил специально: страницу с Sandbox можно встраивать в дашборды.

## Деплой

VPS или любой хост с Docker: `docker compose up -d --build`. HTTPS — Caddy/Nginx/Traefik перед
контейнером.

Render: в репозитории лежит `render.yaml` (Blueprint, web-сервис из Dockerfile плюс managed
PostgreSQL). Дальше New + → Blueprint → выбрать репозиторий. Healthcheck — `/health`. На
бесплатном тарифе сервис засыпает, база живёт ограниченное время, но для демо хватает.

Railway: New Project → Deploy from GitHub (Dockerfile подхватится сам), потом добавить
PostgreSQL и прописать `DATABASE_URL` из плагина. Healthcheck тоже `/health`.

Vercel не брал: приложению нужен живой пул соединений и шаг миграций при деплое, с контейнером
это проще. Если понадобится serverless, миграции можно вынести в отдельный job.

## Что можно докрутить

- S3 в задании не требовался, но поле `Profile.avatarUrl` уже есть. Загрузка аватара — это
  мутация с presigned URL и ключ в этом поле.
- Аутентификация: сейчас чтение публичное, запись прикрыта ключом. Логичный следующий шаг —
  JWT/OAuth для владельца и роли.
- Пагинация коллекций, когда данных станет больше.
- OpenTelemetry и метрики, если сервис будет жить долго.

## Контакты

Захар, Unity/C#-разработчик, учусь на «Разработчик программного обеспечения» в Академии ТОП.

- GitHub: <https://github.com/Siles9>
- Остальное — запросом `profile` в Sandbox на этом же сервисе.
