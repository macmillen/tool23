import { Request, Response } from 'express';
import { tokenCollection, transactionCollection } from '../config/mongodb';
import { Transaction } from '../models/transaction_model';
import { fireMessaging } from '../config/firebase';
import { ObjectId } from 'bson';

export const getTransactions = async (req: Request, res: Response) => {
	const userID: string = req.body.global_googleUID;

	try {
		const transactions = await transactionCollection
			.find({
				$or: [{ giverID: userID }, { takerID: userID }]
			})
			.toArray();
		res.json(transactions);
	} catch (e) {
		console.log(e);
		res.status(404).send('Error creating Token');
	}
};

export const requestItem = async (req: Request, res: Response) => {
	const userID: string = req.body.global_googleUID; // takerID
	const itemID: string = req.body.itemID;
	const transaction: Transaction = req.body.transaction;

	try {
		const tokensObj = await tokenCollection
			.find({ userID: transaction.giverID })
			.toArray();
		const tokens = tokensObj.map(t => t.token);

		if (tokens.length) {
			const payload = {
				notification: {
					title: 'Neue Anfrage',
					body: `${transaction.message}`,
					icon: 'https://goo.gl/Fz9nrQ'
				}
			};
			await fireMessaging.sendToDevice(tokens, payload);
		}

		await transactionCollection.insertOne({
			itemID,
			startDate: transaction.startDate,
			endDate: transaction.endDate,
			takerID: userID,
			giverID: transaction.giverID,
			message: transaction.message,
			review: {},
			status: 'pending'
		});
		res.end();
	} catch (e) {
		console.log(e);
		res.status(404).send('Error requesting Item');
	}
};

export const acceptItem = async (req: Request, res: Response) => {
	const userID: string = req.body.global_googleUID;
	const transaction: Transaction = req.body.transaction;

	try {
		await transactionCollection.updateOne(
			{ _id: new ObjectId(transaction._id), giverID: userID },
			{ $set: { status: 'accepted' } }
		);

		const tokensObj = await tokenCollection
			.find({ userID: transaction.takerID })
			.toArray();
		const tokens = tokensObj.map(t => t.token);

		if (tokens.length) {
			const payload = {
				notification: {
					title: 'Deine Anfrage wurde akzeptiert',
					icon: 'https://goo.gl/Fz9nrQ'
				}
			};
			await fireMessaging.sendToDevice(tokens, payload);
		}

		res.end();
	} catch (e) {
		console.log(e);
		res.status(404).send('Error accepting Item');
	}
};

export const declineItem = async (req: Request, res: Response) => {
	const userID: string = req.body.global_googleUID;
	const transaction: Transaction = req.body.transaction;

	try {
		await transactionCollection.updateOne(
			{ _id: new ObjectId(transaction._id), giverID: userID },
			{ $set: { status: 'declined' } }
		);

		const tokensObj = await tokenCollection
			.find({ userID: transaction.takerID })
			.toArray();
		const tokens = tokensObj.map(t => t.token);

		if (tokens.length) {
			const payload = {
				notification: {
					title: 'Deine Anfrage wurde abgelehnt',
					icon: 'https://goo.gl/Fz9nrQ'
				}
			};
			await fireMessaging.sendToDevice(tokens, payload);
		}

		res.end();
	} catch (e) {
		console.log(e);
		res.status(404).send('Error declining Item');
	}
};

export const createToken = async (req: Request, res: Response) => {
	const userID: string = req.body.global_googleUID;
	const token: string = req.body.token;

	try {
		await tokenCollection.updateOne(
			{ token, userID },
			{ $set: { token, userID } },
			{ upsert: true }
		);
		res.end();
	} catch (e) {
		console.log(e);
		res.status(404).end('Error creating Token');
	}
};
