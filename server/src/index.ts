import * as express from 'express';
import { json, urlencoded } from 'body-parser';
import * as itemController from './controllers/item_controller';
import * as userController from './controllers/user_controller';
import { checkAuth } from './middlewares/check_auth';
import * as cors from 'cors';
import { connectMongoDB } from './config/mongodb';

const app = express();

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

// * ITEMS
app.post('/api/item', checkAuth, itemController.createItem);
app.get('/api/item/:itemID', checkAuth, itemController.getItem);
app.get('/api/items', checkAuth, itemController.getItems);
app.delete('/api/item/:itemID', checkAuth, itemController.deleteItem);

// * USERS
app.post('/api/newUser', userController.createUser);
app.post('/api/signin', userController.login);
// * TRANSACTIONS

app.get('*', () => console.log('OOOOOO'));

app.listen(app.get('port'), () => {
	console.log(`Server listening on port ${app.get('port')}!`);
});

connectMongoDB();
