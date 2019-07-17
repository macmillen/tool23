import { Request, Response } from 'express';
import { tokenCollection, transactionCollection } from '../config/mongodb';
import { Transaction } from '../models/transaction_model';
import { fireMessaging } from '../config/firebase';

export const getTransactions = async (req: Request, res: Response) => {
    const userID: string = req.body.global_googleUID;

    try {
        const transactions = await transactionCollection.find({
            $or: [{ giverID: userID }, { takerID: userID }]
        }).toArray();
        res.json(transactions);
    } catch (e) {
        console.log(e);
        res.status(404).send('Error creating Token');
    }
}

export const requestItem = async (req: Request, res: Response) => {
    const userID: string = req.body.global_googleUID; // takerID
    const itemID: string = req.body.itemID;
    const transaction: Transaction = req.body.transaction;

    try {

        const payload = {
            notification: {
                title: 'Neue Anfrage',
                body: `Hello`,
                icon: 'https://goo.gl/Fz9nrQ'
            }
          }

        const tokensObj = await tokenCollection.find({ userID: transaction.giverID }).toArray();
        const tokens = tokensObj.map(t => t.token);
        await fireMessaging.sendToDevice(tokens, payload);

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
}

export const createToken = async (req: Request, res: Response) => {
    const userID: string = req.body.global_googleUID;
    const token: string = req.body.token;

    try {
        await tokenCollection.updateOne({ token, userID }, { $set: { token, userID } }, { upsert: true });
        res.end();
    } catch (e) {
        console.log(e);
        res.status(404).end('Error creating Token');
    }
}
