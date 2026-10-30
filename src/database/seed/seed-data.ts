import { SkillCategory, SkillLevel } from '../prisma-client';

/**
 * Content of the business card. Facts are from my CV, links point to public repos.
 * After editing run `npm run db:seed -- --force`.
 */
export const PRIMARY_PROFILE_SLUG = 'zakhar';

export interface SeedProfile {
  id: string;
  slug: string;
  fullName: string;
  headline: string;
  description: string;
  location: string | null;
  email: string | null;
  avatarUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  telegramUrl: string | null;
  websiteUrl: string | null;
}

export const seedProfile: SeedProfile = {
  id: '4f2f9d18-6a0b-4f47-a1a5-1f3a0b5a5101',
  slug: PRIMARY_PROFILE_SLUG,
  fullName: 'Захар',
  headline: 'Unity-разработчик (C#) · backend на TypeScript / NestJS',
  description:
    'Разрабатываю игры на Unity (C#) в ООО «ИНТЕГРА-ИТ»: игровые механики, UI, интеграции с API и мультиплеер. ' +
    'Учусь в Академии ТОП на специальности «Разработчик программного обеспечения» (выпуск 2027). ' +
    'Параллельно развиваюсь в backend — TypeScript, NestJS, SQL, GraphQL, Docker; эта визитка написана ' +
    'на NestJS, Prisma и GraphQL и упакована в Docker.',
  location: 'Михайловск, Ставропольский край',
  email: null,
  avatarUrl: 'https://avatars.githubusercontent.com/u/195898379?v=4',
  githubUrl: 'https://github.com/Siles9',
  linkedinUrl: null,
  telegramUrl: null,
  websiteUrl: null,
};

export interface SeedSkill {
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  yearsOfExperience: number;
}

export const seedSkills: SeedSkill[] = [
  // Game development
  {
    name: 'C#',
    category: SkillCategory.LANGUAGE,
    level: SkillLevel.ADVANCED,
    yearsOfExperience: 2,
  },
  {
    name: 'Unity',
    category: SkillCategory.FRAMEWORK,
    level: SkillLevel.ADVANCED,
    yearsOfExperience: 2,
  },
  // Backend
  {
    name: 'TypeScript',
    category: SkillCategory.LANGUAGE,
    level: SkillLevel.INTERMEDIATE,
    yearsOfExperience: 1,
  },
  {
    name: 'JavaScript',
    category: SkillCategory.LANGUAGE,
    level: SkillLevel.INTERMEDIATE,
    yearsOfExperience: 1,
  },
  {
    name: 'Node.js',
    category: SkillCategory.FRAMEWORK,
    level: SkillLevel.INTERMEDIATE,
    yearsOfExperience: 1,
  },
  {
    name: 'NestJS',
    category: SkillCategory.FRAMEWORK,
    level: SkillLevel.INTERMEDIATE,
    yearsOfExperience: 1,
  },
  {
    name: 'ASP.NET Core',
    category: SkillCategory.FRAMEWORK,
    level: SkillLevel.INTERMEDIATE,
    yearsOfExperience: 1,
  },
  {
    name: 'GraphQL',
    category: SkillCategory.FRAMEWORK,
    level: SkillLevel.BEGINNER,
    yearsOfExperience: 1,
  },
  // Databases
  {
    name: 'SQL',
    category: SkillCategory.DATABASE,
    level: SkillLevel.INTERMEDIATE,
    yearsOfExperience: 2,
  },
  {
    name: 'PostgreSQL',
    category: SkillCategory.DATABASE,
    level: SkillLevel.BEGINNER,
    yearsOfExperience: 1,
  },
  {
    name: 'Prisma',
    category: SkillCategory.DATABASE,
    level: SkillLevel.BEGINNER,
    yearsOfExperience: 1,
  },
  // Frontend
  {
    name: 'React',
    category: SkillCategory.FRAMEWORK,
    level: SkillLevel.BEGINNER,
    yearsOfExperience: 1,
  },
  {
    name: 'Angular',
    category: SkillCategory.FRAMEWORK,
    level: SkillLevel.BEGINNER,
    yearsOfExperience: 1,
  },
  {
    name: 'HTML/CSS',
    category: SkillCategory.TOOL,
    level: SkillLevel.INTERMEDIATE,
    yearsOfExperience: 2,
  },
  // Tooling and process
  {
    name: 'Docker',
    category: SkillCategory.DEVOPS,
    level: SkillLevel.BEGINNER,
    yearsOfExperience: 1,
  },
  {
    name: 'Git',
    category: SkillCategory.TOOL,
    level: SkillLevel.INTERMEDIATE,
    yearsOfExperience: 2,
  },
  {
    name: 'Visual Studio',
    category: SkillCategory.TOOL,
    level: SkillLevel.INTERMEDIATE,
    yearsOfExperience: 2,
  },
  { name: 'UML', category: SkillCategory.TOOL, level: SkillLevel.BEGINNER, yearsOfExperience: 1 },
  {
    name: 'C++',
    category: SkillCategory.LANGUAGE,
    level: SkillLevel.BEGINNER,
    yearsOfExperience: 1,
  },
  {
    name: 'English',
    category: SkillCategory.SOFT_SKILL,
    level: SkillLevel.INTERMEDIATE,
    yearsOfExperience: 3,
  },
];

export interface SeedExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  summary: string;
  achievements: string[];
}

export const seedExperience: SeedExperience[] = [
  {
    id: 'a1b2c3d4-0001-4000-8000-000000000001',
    company: 'ООО «ИНТЕГРА-ИТ»',
    position: 'Unity-разработчик',
    startDate: '2025-06-01',
    endDate: null,
    summary:
      'Разработка и сопровождение игровых сегментов на Unity: механики, UI, интеграция с серверной ' +
      'частью, тестирование и геймдизайн.',
    achievements: [
      'Реализовал игровые механики по ТЗ: инвентарь (слоты, drag-and-drop), диалоговая система, прототип боя, рыбалка, крафт-станции, заправочная станция',
      'Интегрировал клиент с API: прогресс и профили игроков, обработка ошибок, кэширование данных',
      'Собирал сцены и префабы, оптимизировал draw calls, настраивал слои и коллизии',
      'Тестировал сегменты продукта, вёл задачи в трекере и сдавал итерации по чек-листам',
    ],
  },
];

export interface SeedProject {
  id: string;
  slug: string;
  name: string;
  description: string;
  url: string | null;
  repositoryUrl: string | null;
  startDate: string;
  endDate: string | null;
  featured: boolean;
  technologies: string[];
}

export const seedProjects: SeedProject[] = [
  {
    id: 'b1b2c3d4-0001-4000-8000-000000000001',
    slug: 'land-farm',
    name: 'Land Farm',
    description:
      'Игра на Unity, опубликованная в Steam: мультиплеер, инструменты, рыбалка, заправочная станция, ' +
      'крафт-станции, работа с UI, светом и звуком.',
    url: 'https://store.steampowered.com/app/4904190/Land_Farm/',
    repositoryUrl: null,
    startDate: '2025-06-01',
    endDate: null,
    featured: true,
    technologies: ['Unity', 'C#', 'Git'],
  },
  {
    id: 'b1b2c3d4-0001-4000-8000-000000000002',
    slug: 'business-card-api',
    name: 'Digital Business Card API',
    description:
      'GraphQL-бэкенд этой визитки: NestJS, Prisma, PostgreSQL, Docker и батчинг вложенных ' +
      'запросов через DataLoader.',
    url: null,
    repositoryUrl: 'https://github.com/Siles9/IT-Solutions-Management-International-Pte.-Ltd.',
    startDate: '2026-10-01',
    endDate: null,
    featured: true,
    technologies: ['TypeScript', 'NestJS', 'GraphQL', 'Prisma', 'PostgreSQL', 'Docker', 'Git'],
  },
  {
    id: 'b1b2c3d4-0001-4000-8000-000000000003',
    slug: 'tycoon',
    name: 'Tycoon',
    description: 'Unity-прототип экономической игры: игрок, магнат-система, конвейеры.',
    url: null,
    repositoryUrl: 'https://github.com/Siles9/Tycoon',
    startDate: '2026-05-07',
    endDate: null,
    featured: false,
    technologies: ['Unity', 'C#'],
  },
  {
    id: 'b1b2c3d4-0001-4000-8000-000000000004',
    slug: 'aspnet',
    name: 'Авторизация и каталог товаров',
    description:
      'Веб-приложение с регистрацией и входом, ролями и CRUD каталога: ASP.NET MVC, SQL Server, ' +
      'AJAX-запросы и валидация форм.',
    url: null,
    repositoryUrl: 'https://github.com/Siles9/ASP.NET',
    startDate: '2026-10-08',
    endDate: null,
    featured: false,
    technologies: ['C#', 'ASP.NET Core', 'SQL'],
  },
  {
    id: 'b1b2c3d4-0001-4000-8000-000000000005',
    slug: 'taskriver',
    name: 'TaskRiver',
    description:
      'Биржа фриланса с живым потоком заказов: исполнители видят новые задачи в реальном ' +
      'времени, а заказчики быстро находят специалистов.',
    url: null,
    repositoryUrl: 'https://github.com/Siles9/TaskRiver',
    startDate: '2026-04-15',
    endDate: null,
    featured: false,
    technologies: ['JavaScript', 'Node.js'],
  },
  {
    id: 'b1b2c3d4-0001-4000-8000-000000000006',
    slug: 'pcraft',
    name: 'PCraft',
    description:
      'Помощь в сборке ПК: поиск комплектующих на маркетплейсах, сравнение цен и проверка ' +
      'совместимости.',
    url: null,
    repositoryUrl: 'https://github.com/Siles9/PCraft---',
    startDate: '2026-03-31',
    endDate: null,
    featured: false,
    technologies: ['JavaScript', 'HTML/CSS'],
  },
];
