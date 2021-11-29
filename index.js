'use strict';

//---------------------------------------------------------------------------------------------------------------//

const MongoDB = require('mongodb');

//---------------------------------------------------------------------------------------------------------------//

class GoMongoDB {
    #client;
    #isConnected = false;

    /**
     * Provides a simplistic method of interacting with MongoDB servers
     * @param {String} connection_url the entire connection url
     */
    constructor(connection_url) {
        this.#client = new MongoDB.MongoClient(connection_url);
    }

    /**
     * @returns {MongoDB.MongoClient} the MongoDB client instance
     */
    get client() {
        return this.#client;
    }

    /**
     * Used to connect to the database (must be done ONCE before all other methods)
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
     * @param {String} database_name 
     */
    database(database_name) {
        return this.#client.db(database_name);
    }

    /**
     * Fetches the specified collection from the database
     * @param {String} database_name 
     * @param {String} collection_name 
     */
    collection(database_name, collection_name) {
        return this.database(database_name).collection(collection_name);
    }

    /**
     * [Finds all documents matching the filter](https://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#find)
     * @param {String} database_name 
     * @param {String} collection_name 
     * @param {MongoDB.FilterQuery} filter (see url)
     * @param {MongoDB.FindOneOptions} options (see url)
     * @returns {Promise<any[]>} 
     */
    async find(database_name, collection_name, filter={}, options={}) {
        try {
            await this.connect();
            return await this.collection(database_name, collection_name).find(filter, options).toArray();
        } catch (error) {
            throw error;
        }
    }

    /**
     * [Adds documents to a specified collection](https://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#insertMany)
     * @param {String} database_name 
     * @param {String} collection_name 
     * @param {any[]} items (see url)
     * @param {MongoDB.CollectionInsertManyOptions} options (see url)
     * @returns {Promise<MongoDB.InsertWriteOpResult>} 
     */
    async add(database_name, collection_name, items=[], options={}) {
        try {
            await this.connect();
            return await this.collection(database_name, collection_name).insertMany(items, options);
        } catch (error) {
            throw error;
        }
    }

    /**
     * [Updates all documents matching the filter](https://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#updateMany)
     * @param {String} database_name 
     * @param {String} collection_name 
     * @param {MongoDB.FilterQuery} filter (see url)
     * @param {MongoDB.UpdateQuery} update (see url)
     * @param {MongoDB.UpdateManyOptions} options (see url)
     * @returns {Promise<MongoDB.UpdateWriteOpResult>} 
     */
    async update(database_name, collection_name, filter={}, update={}, options={}) {
        try {
            await this.connect();
            return await this.collection(database_name, collection_name).updateMany(filter, update, options);
        } catch (error) {
            throw error;
        }
    }

    /**
     * [Removes documents in a specified collection](https://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#deleteMany)
     * @param {String} database_name 
     * @param {String} collection_name 
     * @param {MongoDB.FilterQuery} filter (see url)
     * @param {MongoDB.CommonOptions} options (see url)
     * @returns {Promise<MongoDB.DeleteWriteOpResultObject>} 
     */
    async remove(database_name, collection_name, filter={}, options={}) {
        try {
            await this.connect();
            return await this.collection(database_name, collection_name).deleteMany(filter, options);
        } catch (error) {
            throw error;
        }
    }
}

//---------------------------------------------------------------------------------------------------------------//

module.exports = {
    GoMongoDB,
};
