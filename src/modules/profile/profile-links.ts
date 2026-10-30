import type { ProfileModel } from '../../database/prisma-client';
import { ProfileLink, ProfileLinkType } from './entities/profile-link.entity';

/**
 * Turns the flat URL columns of the profile into a list of typed links.
 * Keeping this in plain TypeScript (not in the resolver) makes it trivially unit-testable.
 */
export function buildProfileLinks(profile: ProfileModel): ProfileLink[] {
  const candidates: Array<[ProfileLinkType, string | null]> = [
    [ProfileLinkType.GITHUB, profile.githubUrl],
    [ProfileLinkType.LINKEDIN, profile.linkedinUrl],
    [ProfileLinkType.TELEGRAM, profile.telegramUrl],
    [ProfileLinkType.WEBSITE, profile.websiteUrl],
    [ProfileLinkType.EMAIL, profile.email ? `mailto:${profile.email}` : null],
  ];

  return candidates
    .filter((candidate): candidate is [ProfileLinkType, string] => Boolean(candidate[1]))
    .map(([type, url]) => ({ type, url }));
}
