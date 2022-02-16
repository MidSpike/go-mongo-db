//------------------------------------------------------------//
//    Copyright (c) Inertia Lighting, Some Rights Reserved    //
//------------------------------------------------------------//

import {
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

export class GoMongoDB {
    public client: MongoClient;

    private _is_connected: boolean = false;

    /**
     * Provides a simplistic method of interacting with MongoDB
     */
    constructor(
        /** @example `mongodb://username:password@hostname:port/` */
        connection_url: string,
        client_options?: MongoClientOptions
    ) {
        this.client = new MongoClient(connection_url, client_options);
    }

    /**
     * Used internally to initiate the connection to the database
     */
    private async _connect() {
        if (!this._is_connected) {
            await this.client.connect();
            this._is_connected = true;
        }

        return this;
    }

    /**
     * Forcibly terminates the connection to the database with no way to reconnect
     */
    async destroy() {
        return this.client.close();
    }

    /**
     * Uses the specified database
     */
    database(
        database_name: string
    ) {
        return this.client.db(database_name);
    }

    /**
     * Uses the specified collection from the database
     */
    collection(
        database_name: string,
        collection_name: string
    ) {
        return this.database(database_name).collection(collection_name);
    }

    /**
     * Counts the documents matching the filter
     */
    async count(
        database_name: string,
        collection_name: string,
        filter: Filter<Document>,
        options: CountDocumentsOptions={}
    ) {
        await this._connect();
        return await this.collection(database_name, collection_name).countDocuments(filter, options);
    }

    /**
     * Finds all documents matching the filter
     */
    async find(
        database_name: string,
        collection_name: string,
        filter: Filter<Document>,
        options: FindOptions<Document>={}
    ) {
        await this._connect();
        return await this.collection(database_name, collection_name).find(filter, options).toArray();
    }

    /**
     * Adds documents to a specified collection
     */
    async add(
        database_name: string,
        collection_name: string,
        items: OptionalId<Document>[],
        options: BulkWriteOptions={}
    ) {
        await this._connect();
        return await this.collection(database_name, collection_name).insertMany(items, options);
    }

    /**
     * Updates all documents matching the filter
     */
    async update(
        database_name: string,
        collection_name: string,
        filter: Filter<Document>,
        update: UpdateFilter<Document>,
        options: UpdateOptions={}
    ) {
        await this._connect();
        return await this.collection(database_name, collection_name).updateMany(filter, update, options);
    }

    /**
     * Removes documents matching the filter
     */
    async remove(
        database_name: string,
        collection_name: string,
        filter: Filter<Document>,
        options: DeleteOptions={}
    ) {
        await this._connect();
        return await this.collection(database_name, collection_name).deleteMany(filter, options);
    }
}
