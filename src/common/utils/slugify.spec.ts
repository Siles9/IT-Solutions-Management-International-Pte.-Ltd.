import { describe, expect, it } from 'vitest';

import { slugify } from './slugify';

describe('slugify', () => {
  it('normalises latin names', () => {
    expect(slugify('Digital Business Card API')).toBe('digital-business-card-api');
  });

  it('transliterates cyrillic names instead of dropping them', () => {
    expect(slugify('Моя визитка')).toBe('moya-vizitka');
  });

  it('collapses punctuation and trims dashes', () => {
    expect(slugify('  PCraft --- сборка ПК!  ')).toBe('pcraft-sborka-pk');
  });

  it('limits the slug length', () => {
    expect(slugify('a'.repeat(120))).toHaveLength(60);
  });
});
