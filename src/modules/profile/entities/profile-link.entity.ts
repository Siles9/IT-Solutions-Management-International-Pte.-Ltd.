import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum ProfileLinkType {
  GITHUB = 'GITHUB',
  LINKEDIN = 'LINKEDIN',
  TELEGRAM = 'TELEGRAM',
  WEBSITE = 'WEBSITE',
  EMAIL = 'EMAIL',
}

registerEnumType(ProfileLinkType, {
  name: 'ProfileLinkType',
  description: 'Kind of professional resource behind a link.',
});

@ObjectType({ description: 'A professional resource the profile owner can be reached at.' })
export class ProfileLink {
  @Field(() => ProfileLinkType)
  type: ProfileLinkType;

  @Field()
  url: string;
}
