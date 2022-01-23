//------------------------------------------------------------//
//    Copyright (c) Inertia Lighting, Some Rights Reserved    //
//------------------------------------------------------------//

import * as MongoDB from 'mongodb';

//------------------------------------------------------------//

export class GoMongoDB {
    #client: MongoDB.MongoClient;
    #isConnected: boolean = false;

    /**
     * Provides a simplistic method of interacting with MongoDB servers
     */
    constructor(
        connection_url: string
    ) {
        this.#client = new MongoDB.MongoClient(connection_url);
    }

    /**
     * The MongoDB client instance
     */
    get client() {
        return this.#client;
    }

    /**
     * Used to connect to the database (this must be done ONCE before all other methods)
     */
    async connect() {
        if (!this.#isConnected) {
            await this.client.connect();
            this.#isConnected = true;
        }

        return this;
    }

    /**
     * Destroys the connection to the database with no way to re-connect
     */
    async destroy() {
        return this.client.close();
    }

    /**
     * Fetches the specified database
     */
    database(
        database_name: string
    ) {
        return this.#client.db(database_name);
    }

    /**
     * Fetches the specified collection from the database
     */
    collection(
        database_name: string,
        collection_name: string
    ) {
        return this.database(database_name).collection(collection_name);
    }

    /**
     * Finds all documents matching the filter
     */
    async find(
        database_name: string,
        collection_name: string,
        filter: MongoDB.Filter<MongoDB.WithId<MongoDB.Document>>,
        options: MongoDB.FindOptions={}
    ) {
        await this.connect();
        return await this.collection(database_name, collection_name).find(filter, options).toArray();
    }

    /**
     * Adds documents to a specified collection
     */
    async add(
        database_name: string,
        collection_name: string,
        items: MongoDB.OptionalId<MongoDB.Document>[],
        options: MongoDB.BulkWriteOptions={}
    ) {
        await this.connect();
        return await this.collection(database_name, collection_name).insertMany(items, options);
    }

    /**
     * Updates all documents matching the filter
     */
    async update(
        database_name: string,
        collection_name: string,
        filter: MongoDB.Filter<MongoDB.Document>,
        update: MongoDB.UpdateFilter<MongoDB.Document>,
        options: MongoDB.UpdateOptions={}
    ) {
        await this.connect();
        return await this.collection(database_name, collection_name).updateMany(filter, update, options);
    }

    /**
     * Removes documents matching the filter
     */
    async remove(
        database_name: string,
        collection_name: string,
        filter: MongoDB.Filter<MongoDB.Document>,
        options: MongoDB.DeleteOptions={}
    ) {
        await this.connect();
        return await this.collection(database_name, collection_name).deleteMany(filter, options);
    }
}
