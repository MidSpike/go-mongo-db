# go-mongo-db

## Installation (master branch)

```
npm i github:MidSpike/go-mongo-db
```

## Important

All examples assume that [`dotenv`](https://www.npmjs.com/package/dotenv) is being used to load environment variables.

When using `dotenv`, add `--require dotenv/config` to the `start` script in `package.json`:
```json5
{
    /* ... */
    "scripts": {
        /* ... */
        "start": "node --require dotenv/config ./dist/index.js",
        /* ... */
    },
    /* ... */
}
```

## Getting started

<details open>
<summary>Initializing</summary>

```ts
import { GoMongoDb } from 'go-mongo-db';

const connection_url = process.env.MONGO_CONNECTION_URL; // mongodb://username:password@hostname:port/
if (!connection_url?.length) throw new Error('MONGO_CONNECTION_URL is undefined or empty');

async function main() {
    const go_mongo_db = new GoMongoDb(connection_url);
}
```
</details>

<details>
<summary>Adding documents</summary>

```ts
import { GoMongoDb } from 'go-mongo-db';

const connection_url = process.env.MONGO_CONNECTION_URL; // mongodb://username:password@hostname:port/
if (!connection_url?.length) throw new Error('MONGO_CONNECTION_URL is undefined or empty');

const database_name = process.env.MONGO_DATABASE_NAME;
if (!database_name?.length) throw new Error('MONGO_DATABASE_NAME is undefined or empty');

const collection_name = process.env.MONGO_USERS_COLLECTION_NAME;
if (!collection_name?.length) throw new Error('MONGO_USERS_COLLECTION_NAME is undefined or empty');

async function main() {
    const go_mongo_db = new GoMongoDb(connection_url);

    const documents_to_add = [
        {
            'user_id': '34565232141264',
            'name': 'John Doe',
            'gender': 'male',
            'age': 26,
        }, {
            'user_id': '34561234213412'
            'name': 'Jane Doe',
            'gender': 'female',
            'age': 43,
        },
    ];

    await go_mongo_db.add(database_name, collection_name, documents_to_add);
}

main();
```
</details>

<details>
<summary>Counting documents</summary>

```ts
import { GoMongoDb } from 'go-mongo-db';

const connection_url = process.env.MONGO_CONNECTION_URL; // mongodb://username:password@hostname:port/
if (!connection_url?.length) throw new Error('MONGO_CONNECTION_URL is undefined or empty');

const database_name = process.env.MONGO_DATABASE_NAME;
if (!database_name?.length) throw new Error('MONGO_DATABASE_NAME is undefined or empty');

const collection_name = process.env.MONGO_USERS_COLLECTION_NAME;
if (!collection_name?.length) throw new Error('MONGO_USERS_COLLECTION_NAME is undefined or empty');

async function main() {
    const go_mongo_db = new GoMongoDb(connection_url);

    const find_filter = {
        'gender': 'female',
    };

    const num_documents_matching_filter = await go_mongo_db.count(database_name, collection_name, find_filter);
}

main();
```
</details>

<details>
<summary>Finding documents</summary>

```ts
import { GoMongoDb } from 'go-mongo-db';

const connection_url = process.env.MONGO_CONNECTION_URL; // mongodb://username:password@hostname:port/
if (!connection_url?.length) throw new Error('MONGO_CONNECTION_URL is undefined or empty');

const database_name = process.env.MONGO_DATABASE_NAME;
if (!database_name?.length) throw new Error('MONGO_DATABASE_NAME is undefined or empty');

const collection_name = process.env.MONGO_USERS_COLLECTION_NAME;
if (!collection_name?.length) throw new Error('MONGO_USERS_COLLECTION_NAME is undefined or empty');

async function main() {
    const go_mongo_db = new GoMongoDb(connection_url);

    const find_filter = {
        'gender': 'male',
    };

    const all_matching_documents = await go_mongo_db.find(database_name, collection_name, find_filter);

    const [ first_matching_document ] = await go_mongo_db.find(database_name, collection_name, find_filter);
}

main();
```
</details>

<details>
<summary>Updating documents</summary>

```ts
import { GoMongoDb } from 'go-mongo-db';

const connection_url = process.env.MONGO_CONNECTION_URL; // mongodb://username:password@hostname:port/
if (!connection_url?.length) throw new Error('MONGO_CONNECTION_URL is undefined or empty');

const database_name = process.env.MONGO_DATABASE_NAME;
if (!database_name?.length) throw new Error('MONGO_DATABASE_NAME is undefined or empty');

const collection_name = process.env.MONGO_USERS_COLLECTION_NAME;
if (!collection_name?.length) throw new Error('MONGO_USERS_COLLECTION_NAME is undefined or empty');

async function main() {
    const go_mongo_db = new GoMongoDb(connection_url);

    const update_filter = {
        'user_id': '34565232141264',
    };

    const update_operations = {
        $set: {
            'age': 27,
        },
    };

    const update_options = {
        upsert: true, // used to create a new document if it doesn't already exist
    };

    await go_mongo_db.update(database_name, collection_name, update_filter, update_operations, update_options);
}

main();
```
</details>

<details>
<summary>Removing documents</summary>

```ts
import { GoMongoDb } from 'go-mongo-db';

const connection_url = process.env.MONGO_CONNECTION_URL; // mongodb://username:password@hostname:port/
if (!connection_url?.length) throw new Error('MONGO_CONNECTION_URL is undefined or empty');

const database_name = process.env.MONGO_DATABASE_NAME;
if (!database_name?.length) throw new Error('MONGO_DATABASE_NAME is undefined or empty');

const collection_name = process.env.MONGO_USERS_COLLECTION_NAME;
if (!collection_name?.length) throw new Error('MONGO_USERS_COLLECTION_NAME is undefined or empty');

async function main() {
    const go_mongo_db = new GoMongoDb(connection_url);

    const remove_filter = {
        'user_id': '34561234213412',
    };

    await go_mongo_db.remove(database_name, collection_name, remove_filter);
}

main();
```
</details>

## Advanced usage

<details>
<summary>Import MongoDB</summary>

The following example shows how to import the underlying MongoDB library used by GoMongoDb.

```ts
import { MongoDb } from 'go-mongo-db';
```

This is useful for accessing features of MongoDB that are not normally exposed by GoMongoDb, such as TypeScript definitions and advanced methods of database manipulation.
</details>
