//------------------------------------------------------------//
//                   Copyright (c) MidSpike                   //
//------------------------------------------------------------//

import {
    AggregateOptions,
    BulkWriteOptions,
    CountDocumentsOptions,
    DeleteOptions,
    Document,
    Filter,
    FindOptions,
    MongoClient,
    MongoClientOptions,
    OptionalId,
    UpdateFilter,
    UpdateOptions,
} from 'mongodb';

//------------------------------------------------------------//

export class GoMongoDb {
    private _is_connected: boolean = false;

    private _is_destroyed: boolean = false;

    public readonly client: MongoClient;

    /**
     * Provides a simplified interface for interacting with MongoDB.
     * Most methods will throw when an error occurs.
     */
    constructor(
        /** @example `mongodb://{username}:{password}@{hostname}:{port}/` */
        connection_url: string,
        client_options?: MongoClientOptions,
    ) {
        this.client = new MongoClient(connection_url, client_options);
    }

    /**
     * Used internally to throw if the instance has been destroyed.
     * Otherwise it will return void.
     */
    public ensureNotDestroyed(): void {
        if (this._is_destroyed) throw new Error('GoMongoDb instance has been destroyed and cannot be used');
    }

    /**
     * Used internally to ensure a connection is established before performing an action.
     * The majority of GoMongoDb methods will call this method automatically.
     */
    public async ensureConnection(): Promise<this> {
        this.ensureNotDestroyed();

        if (!this._is_connected) {
            await this.client.connect();
            this._is_connected = true;
        }

        return this;
    }

    /**
     * Forcibly terminates the connection to the database with no way to reconnect.
     * After calling, all methods will throw when an attempt to call is made.
     */
    public async destroy() {
        this._is_destroyed = true;
        this._is_connected = false;

        return this.client.close();
    }

    /**
     * Used internally to choose a specified database for further operations.
     * When using children of this method directly, you must call `ensureConnection` first.
     */
    public database(
        database_name: string,
    ) {
        this.ensureNotDestroyed();

        return this.client.db(database_name);
    }

    /**
     * Used internally to choose a specified collection for further operations.
     * When using children of this method directly, you must call `ensureConnection` first.
     */
    public collection(
        database_name: string,
        collection_name: string,
    ) {
        this.ensureNotDestroyed();

        return this.database(database_name).collection(collection_name);
    }

    /**
     * Counts the number of documents matching the filter.
     * Specify an empty filter to count all documents.
     */
    public async count(
        database_name: string,
        collection_name: string,
        filter: Filter<Document>,
        options: CountDocumentsOptions = {},
    ) {
        await this.ensureConnection();

        return await this.collection(database_name, collection_name).countDocuments(filter, options);
    }

    /**
     * Finds all documents matching the filter.
     * Specify an empty filter to find all documents.
     */
    public async find(
        database_name: string,
        collection_name: string,
        filter: Filter<Document>,
        options: FindOptions<Document> = {},
    ) {
        await this.ensureConnection();

        return this.collection(database_name, collection_name).find(filter, options);
    }

    /**
     * Adds documents to a specified collection.
     * If the documents do not have an `_id` field, one will be generated automatically.
     */
    public async add(
        database_name: string,
        collection_name: string,
        items: OptionalId<Document>[],
        options: BulkWriteOptions = {},
    ) {
        await this.ensureConnection();

        return await this.collection(database_name, collection_name).insertMany(items, options);
    }

    /**
     * Updates all documents matching the filter.
     * Specify an empty filter to update all documents.
     */
    public async update(
        database_name: string,
        collection_name: string,
        filter: Filter<Document>,
        update: UpdateFilter<Document>,
        options: UpdateOptions = {},
    ) {
        await this.ensureConnection();

        return await this.collection(database_name, collection_name).updateMany(filter, update, options);
    }

    /**
     * Performs an aggregation on the specified collection.
     * The pipeline is an array of aggregation stages.
     * Each stage is represented by a document of operations to perform on the collection.
     * The pipeline is executed in order while pipelining the results of each stage to the next.
     */
    public async aggregate(
        database_name: string,
        collection_name: string,
        pipeline: Document[],
        options: AggregateOptions,
    ) {
        await this.ensureConnection();

        return this.collection(database_name, collection_name).aggregate(pipeline, options);
    }

    /**
     * Removes documents matching the filter.
     * Specify an empty filter to remove all documents.
     */
    public async remove(
        database_name: string,
        collection_name: string,
        filter: Filter<Document>,
        options: DeleteOptions = {},
    ) {
        await this.ensureConnection();

        return await this.collection(database_name, collection_name).deleteMany(filter, options);
    }
}

//------------------------------------------------------------//

export * as MongoDb from 'mongodb';
