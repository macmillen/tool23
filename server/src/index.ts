import * as express from 'express';
import { json, urlencoded } from 'body-parser';
import * as itemController from './controllers/item_controller';
import * as userController from './controllers/user_controller';
import * as transactionController from './controllers/transaction_controller';
import { checkAuth } from './middlewares/check_auth';
import * as cors from 'cors';
import { connectMongoDB } from './config/mongodb';

// create the server
const app = express();

// * EXPRESS CONFIG
app.set('port', process.env.PORT || 3000);
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

// * ITEMS
app.post('/api/item', checkAuth, itemController.createItem);
app.get('/api/item/:itemID', checkAuth, itemController.getItem);
app.get('/api/items/:userID', checkAuth, itemController.getItems);
app.get('/api/items/', checkAuth, itemController.getItems);
app.delete('/api/item/:itemID', checkAuth, itemController.deleteItem);
app.put('/api/item/', checkAuth, itemController.updateItem);
app.get('/api/search-items/:searchString', checkAuth, itemController.searchItems);
app.get('/api/search-items/', checkAuth, itemController.searchItems);
app.get('/api/tags', checkAuth, itemController.getTags);

// * USERS
app.post('/api/register', userController.register);
app.get('/api/user/:userID', checkAuth, userController.getUser);
app.put('/api/update-user', checkAuth, userController.updateUser);
 
// * TRANSACTIONS
app.post('/api/request-item', checkAuth, transactionController.requestItem);
app.get('/api/transactions/:userID', checkAuth, transactionController.getTransactions);
app.get('/api/transactions/', checkAuth, transactionController.getTransactions);
app.post('/api/create-token', checkAuth, transactionController.createToken);
app.post('/api/accept-transaction', checkAuth, transactionController.acceptItem);
app.post('/api/decline-transaction', checkAuth, transactionController.declineItem);
app.put('/api/mark-given-transaction', checkAuth, transactionController.markGivenTransaction);
app.put('/api/mark-taken-transaction', checkAuth, transactionController.markTakenTransaction);
app.put('/api/mark-given-back-transaction', checkAuth, transactionController.markGivenBackTransaction);
app.put('/api/mark-taken-back-transaction', checkAuth, transactionController.markTakenBackTransaction);
app.put('/api/rate-taker-transaction', checkAuth, transactionController.rateTakerTransaction);
app.put('/api/rate-giver-transaction', checkAuth, transactionController.rateGiverTransaction);
app.put('/api/revoke-transaction', checkAuth, transactionController.revokeTransaction);

app.get('*', () => console.log('OOOOOO'));
/**
 * start the server
 */
app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}!`);
});

// connect to the database
connectMongoDB();
