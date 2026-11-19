import { describe, expect, it } from 'vitest';
import { doorsPassKey } from './doorKeys';

describe('dveře mezi komnatami: klávesy', () => {
  it('zavírající se a zavřené dveře nepustí žádnou klávesu', () => {
    expect(doorsPassKey('closing', false)).toBe(false);
    expect(doorsPassKey('closing', true)).toBe(false);
  });

  it('při otevírání projde nový stisk, podržená klávesa ne', () => {
    expect(doorsPassKey('opening', false)).toBe(true);
    expect(doorsPassKey('opening', true)).toBe(false);
  });

  it('bez dveří projde všechno', () => {
    expect(doorsPassKey('idle', false)).toBe(true);
    expect(doorsPassKey('idle', true)).toBe(true);
  });
});
