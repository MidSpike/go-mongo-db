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

    /* do cool stuff with `go_mongo_db` here */

    /**
     * Generally speaking, whenever possible, you should consider
     * destroying the connection when you're finished with it.
     *
     * However for an application such as a web server, where the
     * connection will be used frequently, and for a long time,
     * it may be better to keep the connection alive.
     *
     * In these examples, the connection is destroyed after
     * usage to quickly free up resources and avoid memory leaks.
     *
     * If you're using GoMongoDb for a web server or similar
     * on-demand application, you should keep the connection alive.
     */
    await go_mongo_db.destroy();
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
            'color': 'blue',
        }, {
            'user_id': '34561234213412'
            'name': 'Jane Doe',
            'gender': 'female',
            'color': 'red',
        }, {
            'user_id': '34561212231424',
            'name': 'Billy Doe',
            'gender': 'male',
            'color': 'green',
        }, {
            'user_id': '34561252352355',
            'name': 'Emily Doe',
            'gender': 'female',
            'color': 'yellow',
        },
    ];

    const operation_result = await go_mongo_db.add(database_name, collection_name, documents_to_add);

    await go_mongo_db.destroy(); // destroy the connection since we're finished with it
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

    await go_mongo_db.destroy(); // destroy the connection since we're finished with it
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
    const go_mongo_db = new GoMongoDb(connection_url, {
        autoReconnect: true,
    });

    const find_filter = {
        'gender': 'male',
    };

    const matching_documents_cursor = await go_mongo_db.find(database_name, collection_name, find_filter);

    //- only get the first matching document ---------------------//
    const first_matching_document = await matching_documents_cursor.next();
    //- alternatively, get all matching documents ----------------//
    const all_matching_documents = await matching_documents_cursor.toArray();
    //------------------------------------------------------------//

    await go_mongo_db.destroy(); // destroy the connection since we're finished with it
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
            'color': 'purple',
        },
    };

    const update_options = {
        upsert: true, // used to create a new document if it doesn't already exist
    };

    const operation_result = await go_mongo_db.update(database_name, collection_name, update_filter, update_operations, update_options);

    await go_mongo_db.destroy(); // destroy the connection since we're finished with it
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

    const operation_result = await go_mongo_db.remove(database_name, collection_name, remove_filter);

    await go_mongo_db.destroy(); // destroy the connection since we're finished with it
}

main();
```
</details>

<details>
<summary>Aggregating documents</summary>

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

    const aggregate_pipeline = [
        {
            $match: {
                'color': 'purple',
            },
        }, {
            $set: {
                'name' 'John Likes Purple Doe',
            },
        }, {
            $project: {
                'name': 1,
                'color': 1,
            },
        },
    ];

    const aggregate_cursor = await go_mongo_db.aggregate(database_name, collection_name, aggregate_pipeline);

    const modified_documents = await aggregate_cursor.toArray();

    await go_mongo_db.destroy(); // destroy the connection since we're finished with it
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

This is useful for accessing features of MongoDB that are not exposed by GoMongoDb, such as TypeScript definitions and advanced database manipulation methods.
</details>
