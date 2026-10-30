import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { AppModule } from '../src/app.module';
import { configureApplication } from '../src/app.setup';
import { PrismaService } from '../src/database/prisma.service';

const DATABASE_URL = process.env.DATABASE_URL;
const describeWithDatabase = DATABASE_URL ? describe : describe.skip;

interface GraphqlResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

/**
 * E2E against a real PostgreSQL. Needs DATABASE_URL, local run:
 *   docker compose up -d db
 *   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/business_card npm run test:e2e
 */
describeWithDatabase('Digital business card GraphQL API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();

    app = moduleRef.createNestApplication();
    configureApplication(app);
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app?.close();
  });

  async function graphql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query, variables })
      .expect(200);

    const body = response.body as GraphqlResponse<T>;

    if (body.errors?.length) {
      throw new Error(`GraphQL errors: ${JSON.stringify(body.errors)}`);
    }

    return body.data as T;
  }

  it('returns the profile with skills, experience and projects', async () => {
    const data = await graphql<{
      profile: {
        fullName: string;
        description: string;
        skills: Array<{ name: string }>;
        experience: Array<{ company: string; position: string }>;
        projects: Array<{ name: string }>;
      };
    }>(`
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
    `);

    expect(data.profile.fullName).toBeTruthy();
    expect(data.profile.description).toBeTruthy();
    expect(data.profile.skills.length).toBeGreaterThan(0);
    expect(data.profile.experience.length).toBeGreaterThan(0);
    expect(data.profile.projects.length).toBeGreaterThan(0);
  });

  it('resolves nested relations with a constant number of SQL queries', async () => {
    // Extra profiles make N+1 visible: without batching the count grows with the response.
    const extraProfiles = await Promise.all(
      ['second-profile', 'third-profile'].map((slug) =>
        prisma.profile.create({
          data: {
            slug,
            fullName: `Profile ${slug}`,
            headline: 'Test profile',
            description: 'Created by the e2e test',
          },
        }),
      ),
    );

    const statements: string[] = [];
    prisma.onQuery((event) => statements.push(event.query));

    try {
      const data = await graphql<{ profiles: Array<{ skills: Array<{ name: string }> }> }>(`
        query {
          profiles {
            fullName
            skills {
              name
            }
          }
        }
      `);

      expect(data.profiles).toHaveLength(3);

      const selectStatements = statements.filter((statement) =>
        statement.trimStart().toUpperCase().startsWith('SELECT'),
      );

      // 1 query for profiles + 1 for profile_skills + 1 for the skills they reference,
      // regardless of how many profiles are in the response.
      expect(selectStatements.length).toBeLessThanOrEqual(3);
    } finally {
      await prisma.profile.deleteMany({
        where: { id: { in: extraProfiles.map((profile) => profile.id) } },
      });
    }
  });

  it('rejects invalid input with a readable validation message', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: 'mutation { addSkill(input: { name: "", category: TOOL }) { id } }' })
      .expect(200);

    const body = response.body as GraphqlResponse<unknown>;

    expect(body.errors?.[0]?.message).toContain('name');
    expect(body.errors?.[0]?.message).toContain('should not be empty');
  });

  it('serves Apollo Sandbox and a database-aware health check', async () => {
    const landing = await request(app.getHttpServer()).get('/').expect(200);
    expect(landing.text).toContain('EmbeddedSandbox');
    expect(landing.text).toContain("initialEndpoint: window.location.origin + '/graphql'");

    const health = await request(app.getHttpServer()).get('/health').expect(200);
    expect(health.body).toMatchObject({ status: 'ok', database: 'up' });
  });
});
