# go-mongo-db

## Installation

```
npm i github:Inertia-Lighting/go-mongo-db#v0.0.1-beta
```

## Usage

### Adding documents

```js
/* Importing GoMongoDB */
const GoMongoDB = require('go-mongo-db');

async function main() {
    /* Creating a GoMongoDB instance */
    // set environment variable 'MONGO_CONNECTION_URL' to 'mongodb://username:password@hostname:port/'
    const connection_url = process.env.MONGO_CONNECTION_URL;
    const go_mongo_db = new GoMongoDB(connection_url);

    /* Set relevant database info */
    const database_name = process.env.MONGO_DATABASE_NAME;
    const collection_name = process.env.MONGO_USERS_COLLECTION_NAME;

    /* Adding documents to a database collection */
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

### Finding documents

```js
/* Importing GoMongoDB */
const GoMongoDB = require('go-mongo-db');

async function main() {
    /* Creating a GoMongoDB instance */
    // set environment variable 'MONGO_CONNECTION_URL' to 'mongodb://username:password@hostname:port/'
    const connection_url = process.env.MONGO_CONNECTION_URL;
    const go_mongo_db = new GoMongoDB(connection_url);

    /* Set relevant database info */
    const database_name = process.env.MONGO_DATABASE_NAME;
    const collection_name = process.env.MONGO_USERS_COLLECTION_NAME;

     /* Finding documents in a database collection */
    const find_filter = {
        'gender': 'male',
    };
    const all_matching_documents = await go_mongo_db.find(database_name, collection_name, find_filter);
    const [ first_matching_document ] = await go_mongo_db.find(database_name, collection_name, find_filter);
}

main();
```

### Updating documents

```js
/* Importing GoMongoDB */
const GoMongoDB = require('go-mongo-db');

async function main() {
    /* Creating a GoMongoDB instance */
    // set environment variable 'MONGO_CONNECTION_URL' to 'mongodb://username:password@hostname:port/'
    const connection_url = process.env.MONGO_CONNECTION_URL;
    const go_mongo_db = new GoMongoDB(connection_url);

    /* Set relevant database info */
    const database_name = process.env.MONGO_DATABASE_NAME;
    const collection_name = process.env.MONGO_USERS_COLLECTION_NAME;

    /* Updating documents in a database collection */
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

### Removing documents

```js
/* Importing GoMongoDB */
const GoMongoDB = require('go-mongo-db');

async function main() {
    /* Creating a GoMongoDB instance */
    // set environment variable 'MONGO_CONNECTION_URL' to 'mongodb://username:password@hostname:port/'
    const connection_url = process.env.MONGO_CONNECTION_URL;
    const go_mongo_db = new GoMongoDB(connection_url);

    /* Set relevant database info */
    const database_name = process.env.MONGO_DATABASE_NAME;
    const collection_name = process.env.MONGO_USERS_COLLECTION_NAME;

    /* Removing documents from a database collection */
    const remove_filter = {
        'user_id': '34561234213412',
    };
    await go_mongo_db.remove(database_name, collection_name, remove_filter);
}

main();
```
