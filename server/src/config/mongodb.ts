import { MongoClient, Db, Collection } from 'mongodb';
import { Item } from '../models/item_model';
import { User } from '../models/user_model';
import { Token } from '../models/token_model';
import { Transaction } from '../models/transaction_model';

const uri = "mongodb+srv://admin:verleihmasters99@cluster0-58wqp.mongodb.net/test?retryWrites=true&w=majority";

export const client = new MongoClient(uri, {
    useNewUrlParser: true,
});
export let db: Db;

// ATLAS CREDENTIALS
// USERNAME: admin
// PW: verleihmasters99

// DECLARE COLLECTIONS HERE
export let itemCollection: Collection<Item>;
export let userCollection: Collection<User>;
export let tokenCollection: Collection<Token>;
export let transactionCollection: Collection<Transaction>;

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
