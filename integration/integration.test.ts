import { Elasticsearch, Field, Index, Primary } from '../src';

@Index({ index: 'user' })
class User {
  @Primary()
  @Field({ enabled: false })
  id?: number;

  @Field('text')
  name?: string;

  @Field({ type: 'integer', boost: 2 })
  age?: number;
}

const doTest = async (apiVersion: string) => {
  const es = new Elasticsearch({
    apiVersion,
    host: 'http://127.0.0.1:9200',
  });

  // try to delete index User
  try {
    await es.indices.delete(User);
  } finally {
    // ignore, if it did not exist
  }

  await es.indices.create(User);
  await es.indices.putMapping(User);

  const user = new User();
  user.id = 1;
  user.name = 'Smith';
  user.age = 33;

  await es.index(user);
  await es.indices.refresh(User);

  const { response, documents } = await es.search(User, { body: { query: { match_all: {} } } });
  const hits = response.hits.total;

  expect(hits).toBe(1);
  expect(documents).toBeDefined();
  expect(documents.length).toEqual(1);
  expect(documents[0]).toEqual(user);
};

describe('works with ES', () => {
  ['6.6', '6.5', '6.4', '6.3', '6.2', '6.1', '6.0', '6.x', '5.6', '5.5', '5.4', '5.3', '5.2', '5.1', '5.0'].forEach((apiVersion: string) => {
    it(`apiVersion: ${apiVersion}`, async () => {
      await doTest(apiVersion);
    });
  });
});
