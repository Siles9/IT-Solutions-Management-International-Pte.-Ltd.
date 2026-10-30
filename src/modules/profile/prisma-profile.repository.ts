import { Injectable } from '@nestjs/common';

import type { ProfileModel } from '../../database/prisma-client';
import { PrismaService } from '../../database/prisma.service';
import type { ProfileRepository, ProfileUpdateData } from './profile.repository';

@Injectable()
export class PrismaProfileRepository implements ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  findPrimary(): Promise<ProfileModel | null> {
    return this.prisma.profile.findFirst({
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
    });
  }

  findMany(): Promise<ProfileModel[]> {
    return this.prisma.profile.findMany({
      orderBy: [{ isPrimary: 'desc' }, { fullName: 'asc' }],
    });
  }

  update(id: string, data: ProfileUpdateData): Promise<ProfileModel> {
    return this.prisma.profile.update({ where: { id }, data });
  }
}
