import { MongoClient, Db, Collection } from 'mongodb';
import { Item } from '../models/item_model';
import { User } from '../models/user_model';

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

export const connectMongoDB = async () => {
    try {
        await client.connect();
        db = client.db();


        // INIT COLLECTIONS HERE
        itemCollection = db.collection('items');
        userCollection = db.collection('users');

        console.log('Connected successfully to server');
    } catch (e) {
        console.log('Error connecting to MongoDB');
        console.log(e);

    }
};
