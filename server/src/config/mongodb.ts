import { MongoClient, Db, Collection } from 'mongodb';
import { Item } from '../models/item_model';
import { User } from '../models/user_model';
import { Token } from '../models/token_model';
import { Transaction } from '../models/transaction_model';
import { mongodbURI } from '../../env';

const uri = mongodbURI;

/**
 * create the mongo db client
 */
export const client = new MongoClient(uri, {
    useNewUrlParser: true,
});
export let db: Db;

// DECLARE COLLECTIONS HERE
export let itemCollection: Collection<Item>;
export let userCollection: Collection<User>;
export let tokenCollection: Collection<Token>;
export let transactionCollection: Collection<Transaction>;

/**
 * connect to the database 
 * get the different collections
 */
export const connectMongoDB = async () => {
    try {
        await client.connect();
        db = client.db();

        // INIT COLLECTIONS HERE
        itemCollection = db.collection('items');
        userCollection = db.collection('users');
        tokenCollection = db.collection('tokens');
        transactionCollection = db.collection('transactions');

        console.log('Connected successfully to server');
    } catch (e) {
        console.log('Error connecting to MongoDB');
        console.log(e);

    }
};
