import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ProfileModel } from '../../database/prisma-client';
import type { ProfileRepository } from './profile.repository';
import { ProfileService } from './profile.service';

const profile: ProfileModel = {
  id: 'profile-1',
  slug: 'zakhar',
  fullName: 'Захар',
  headline: 'Backend-разработчик',
  description: 'Описание',
  location: null,
  email: null,
  avatarUrl: null,
  githubUrl: 'https://github.com/Siles9',
  linkedinUrl: null,
  telegramUrl: null,
  websiteUrl: null,
  isPrimary: true,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
};

function createRepository(): ProfileRepository {
  return {
    findPrimary: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
  };
}

describe('ProfileService', () => {
  let repository: ProfileRepository;
  let service: ProfileService;

  beforeEach(() => {
    repository = createRepository();
    service = new ProfileService(repository);
  });

  it('returns the primary profile', async () => {
    vi.mocked(repository.findPrimary).mockResolvedValue(profile);

    await expect(service.getPrimary()).resolves.toBe(profile);
  });

  it('explains how to fix an empty database instead of returning null', async () => {
    vi.mocked(repository.findPrimary).mockResolvedValue(null);

    await expect(service.getPrimary()).rejects.toBeInstanceOf(NotFoundException);
  });

  it('passes only the provided fields to the repository', async () => {
    vi.mocked(repository.findPrimary).mockResolvedValue(profile);
    vi.mocked(repository.update).mockResolvedValue({ ...profile, headline: 'New headline' });

    await service.updatePrimary({ headline: 'New headline' });

    expect(repository.update).toHaveBeenCalledWith(profile.id, { headline: 'New headline' });
  });

  it('keeps explicit nulls so a nullable field can be cleared', async () => {
    vi.mocked(repository.findPrimary).mockResolvedValue(profile);
    vi.mocked(repository.update).mockResolvedValue({ ...profile, location: null });

    await service.updatePrimary({ location: null });

    expect(repository.update).toHaveBeenCalledWith(profile.id, { location: null });
  });

  it('rejects an empty update before touching the database', async () => {
    await expect(service.updatePrimary({})).rejects.toBeInstanceOf(BadRequestException);
    expect(repository.findPrimary).not.toHaveBeenCalled();
  });
});
