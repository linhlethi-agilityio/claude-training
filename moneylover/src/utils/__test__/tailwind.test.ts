// Utils
import { cn } from '@/utils/tailwind';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('text-sm', 'font-bold')).toBe('text-sm font-bold');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('deduplicates conflicting tailwind classes (last wins)', () => {
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });

  it('handles undefined and null values', () => {
    expect(cn('base', undefined, null, 'extra')).toBe('base extra');
  });

  it('handles object syntax', () => {
    expect(cn({ 'text-red-500': true, 'text-green-500': false })).toBe('text-red-500');
  });

  it('returns empty string when no args', () => {
    expect(cn()).toBe('');
  });
});
