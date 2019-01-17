import * as es from 'elasticsearch';

import { Index } from './decorators/index.decorator';
import * as library from './index';
import { Elasticsearch } from './lib/elasticsearch';

describe('Main structure', () => {
  it('exposes official Client', () => {
    expect(library.Client).toEqual(expect.any(Function));
    expect(library.Client).toBe(es.Client);
  });

  it('exposes Elasticsearch class', () => {
    expect(library.Elasticsearch).toBe(Elasticsearch);
  });

  it('exposes Index decorator', () => {
    expect(library.Index).toBe(Index);
  });

  it('exposes Primary decorator', () => {
    expect(library.Primary).toBe(library.Primary);
  });

  it('exposes Field decorator', () => {
    expect(library.Field).toBe(library.Field);
  });
});
