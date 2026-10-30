import { describe, expect, it } from 'vitest';

import type { ProfileModel } from '../../database/prisma-client';
import { ProfileLinkType } from './entities/profile-link.entity';
import { buildProfileLinks } from './profile-links';

function profileWith(overrides: Partial<ProfileModel>): ProfileModel {
  return {
    id: 'profile-1',
    slug: 'zakhar',
    fullName: 'Захар',
    headline: 'Backend-разработчик',
    description: 'Описание',
    location: null,
    email: null,
    avatarUrl: null,
    githubUrl: null,
    linkedinUrl: null,
    telegramUrl: null,
    websiteUrl: null,
    isPrimary: true,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  };
}

describe('buildProfileLinks', () => {
  it('returns an empty list when no professional links are filled in', () => {
    expect(buildProfileLinks(profileWith({}))).toEqual([]);
  });

  it('maps every filled column and skips empty ones', () => {
    const links = buildProfileLinks(
      profileWith({
        githubUrl: 'https://github.com/Siles9',
        linkedinUrl: 'https://www.linkedin.com/in/example',
        email: 'hello@example.com',
      }),
    );

    expect(links).toEqual([
      { type: ProfileLinkType.GITHUB, url: 'https://github.com/Siles9' },
      { type: ProfileLinkType.LINKEDIN, url: 'https://www.linkedin.com/in/example' },
      { type: ProfileLinkType.EMAIL, url: 'mailto:hello@example.com' },
    ]);
  });
});
