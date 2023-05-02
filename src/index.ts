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
    protected _is_connected: boolean = false;

    protected _is_destroyed: boolean = false;

    /**
     * The underlying MongoDB client instance.
     * You can use this to access the MongoDB instance directly.
     * However that defeats the purpose of this library ;).
     */
    public readonly client: MongoClient;

    /**
     * Provides a simplified interface for interacting with MongoDB.
     * Most methods will throw when an error occurs.
     */
    public constructor(
        /** @example `mongodb://{username}:{password}@{hostname}:{port}/` */
        connection_url: string,
        client_options?: MongoClientOptions,
    ) {
        this.client = new MongoClient(connection_url, client_options);
    }

    /**
     * Ensures the instance is not destroyed before performing any operations.
     * This method is called automatically by other methods.
     *
     * @throws {Error} if the instance is destroyed.
     *
     * @internal intended for internal use only.
     */
    public ensureNotDestroyed(): void {
        if (this._is_destroyed) throw new Error('GoMongoDb instance is destroyed and cannot be used anymore');
    }

    /**
     * Ensures a connection is established before performing any operations.
     * This method is called automatically by other methods.
     *
     * @throws {Error} if the instance is destroyed.
     *
     * @internal intended for internal use only.
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
     * Forcibly terminates the connection to the database with no way to reconnect again.
     * After calling, all methods will throw when an attempt to call is made.
     *
     * You should only call this method when you are sure you will not need to use the instance anymore.
     * If you need to reconnect, you should create a new instance instead.
     *
     * For applications that require frequent database access, you should avoid calling this method.
     */
    public async destroy() {
        this._is_destroyed = true;
        this._is_connected = false;

        return this.client.close();
    }

    /**
     * Used internally to choose a specified database for further operations.
     * When using children of this method directly, you must call `ensureConnection` first.
     *
     * @internal intended for internal use only.
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
     *
     * @internal intended for internal use only.
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
     * Removes all documents matching the filter.
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

    /**
     * Performs an aggregation on the specified collection.
     * The pipeline is an array of aggregation stages.
     * Each stage is represented by a document of operations to perform on the collection.
     * The pipeline is executed in order and modifies the collection as it goes.
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
}

//------------------------------------------------------------//

export * as MongoDb from 'mongodb';
