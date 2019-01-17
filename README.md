# @warchant/ts-elasticsearch

[![Build Status](https://travis-ci.org/Warchant/node-ts-elasticsearch.svg?branch=master)](https://travis-ci.org/Warchant/node-ts-elasticsearch)
[![codecov](https://codecov.io/gh/Warchant/node-ts-elasticsearch/branch/master/graph/badge.svg)](https://codecov.io/gh/Warchant/node-ts-elasticsearch)

## Fork Information

This repository is a fork of https://github.com/gojob-1337/node-ts-elasticsearch. 

**Changelog**:
- bump versions in package.json
- fix linting errors
- add integration test

This library is guaranteed to work with `docker.elastic.co/elasticsearch/elasticsearch:6.5.4` version.



## Description

The purpose of this library is to provide a decorated class approch to use the [elasticsearch](https://www.npmjs.com/package/elasticsearch) module.

## Installation

```
yarn add @warchant/ts-elasticsearch
```

## Usage example

```typescript
import { Index, Field, Elasticsearch, Primary } from '@warchant/ts-elasticsearch';

@Index()
class User {
  @Primary()
  @Field({ enabled: false})
  id: string;

  @Field('text') name: string;
  @Field('integer') age: number;
}

// ...
const elasticsearch = new Elasticsearch({ host: 'http://192.168.99.100:9200' });

await elasticsearch.indices.create(User);
await elasticsearch.indices.putMapping(User);

const user = new User();
user.id = 'agent-1122';
user.name = 'Smith';
user.age = 33;

await elasticsearch.index(user);

await elasticsearch.indices.refresh(User);

const { documents } = await elasticsearch.search(User, { body: { query: { match_all: {} } } });


```

## Documentation

### Decorators

#### decorator `@Index`

Keep in mind that index [types are scheduled to be removed in Elasticsearch 8](https://www.elastic.co/guide/en/elasticsearch/reference/master/indices-put-mapping.html#_skipping_types_2).

This class decorator factory declares a new Elasticsearch index.

By default, it uses the class name as index (and type), but it can be overwritten.

Index settings may be added in the `settings` optional parameter.

```typescript
@Index({index: 'twt', settings: { number_of_shards: 3 } })
class Tweeter {}
```


#### decorator `@Primary`

This property decorator factory declares the class primary key which will be used as `_id` in Elasticsearch index.
When not provided, Elasticsearch generates ids by it own.

```typescript
@Index()
class User {
  @Primary()
  @Field({ enabled: false})
  id: string;

  @Field('text') name: string;
  @Field('integer') age: number;
}
```


#### decorator `@Field`

This property decorator factory declares a new property in the current class.

It takes either a simple type as string or an elasticsearch mapping setting.

```typescript
@Index()
class User {
  @Field('keyword') id: string;
  @Field({ type: 'text', boost: 2 })name: string;
  @Field('integer') age: number;
}
```

##### Special case of object or nested (array of object)

When dealing with object or nested, you have to declare a class with some fields declared.
Notice in this case, the class in not decorated with `@Index`.

Object example:

```typescript
class Country {
  @Field('text') name: string;
}

@Index()
class City {
  @Field('text') name: string;
  @Field({ object: Country })
  country: Country;
}
```

Nested example:

```typescript
class Follower {
  @Field({ enabled: false}) name: string;
  @Field({ enabled: false}) popularity: number;
}

@Index()
class User {
  @Primary()
  @Field({ enabled: false})
  id: string;

  @Field('text') name: string;

  @Field({ nested: Follower })
  followers: Follower[];
}
```

### Elasticsearch class

This class provides main elasticsearch features directly usable with indexed classes.

__The purpose of this library is not to override all official plugin features, but only those that are relevant for managing documents using classes.__

When dealing with documents, you can either uses indexed class instances or literal object associated to their indexed class.

The examples presents in this chapter are based on this setup.

```typescript
import { Field, Elasticsearch, Primary } from '@gojob/ts-elasticsearch';

const elasticsearch = new Elasticsearch({ host: 'http://192.168.99.100:9200' });

@Index()
class User {
  @Primary()
  @Field({ enabled: false})
  id: string;

  @Field('text') name: string;
  @Field('integer') age: number;
}
```

#### Elasticsearch core

Instanciate this class with an [IConfigOptions](#iconfigoptions) or an [official elasticsearch.Client](https://github.com/elastic/elasticsearch-js/blob/14.x/docs/configuration.asciidoc) instance.

#### IConfigOptions

IConfigOptions extends the official [client configuration option](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/configuration.html).

Extended options provided by IConfigOptions:

|     Name    |                                                    Type                                                   | Optional | Description                     |
|:-----------:|:---------------------------------------------------------------------------------------------------------:|:--------:|---------------------------------|
| client      | [elasticsearch.Client](https://github.com/elastic/elasticsearch-js/blob/15.x/docs/configuration.asciidoc) |     X    | Official client instance to use |
| indexPrefix |                                                   string                                                  |     X    | Prefix to set to all indices    |

#### Core functions

The main class provides the main part of the [document API](https://www.elastic.co/guide/en/elasticsearch/reference/6.2/docs.html) functions.

- bulkIndex: Index an arary or a stream of documents ([bulk api](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-bulk)
- count: Count documents in the index ([count api](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-count))
- create: Add a new document to the index [create api](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-create))
- delete: Delete a document from the index [delete api](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-delete))
- get: Retrieve a document by its id [get api](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-get))
- getIndices: Return all Indexed classes
- index: Add or update a document in the index [index api](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-index))
- search: Search documents in the index [search api](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-search))
- update: Update a document [update api](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-update))

#### Elasticsearch.indices

The indices provides the main part of the [document API](https://www.elastic.co/guide/en/elasticsearch/reference/6.2/indices.html) functions.

- create: Create an Index ([indice create api](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-indices-create))
- delete: Delete an Index ([indice delete api](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-indices-delete))
- exists: Check if an Index exists ([indice exists api](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-indices-exists))
- flush: Flush an Index ([indice flush api](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-indices-flush))
- putMapping: Put mapping of an Index ([indice putmapping api](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-indices-putmapping))
- refresh: Refresh an Index ([indice refresh api](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-indices-refresh))
