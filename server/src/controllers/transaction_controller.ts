import { Request, Response } from 'express';
import { tokenCollection, transactionCollection, userCollection, itemCollection } from '../config/mongodb';
import { Transaction } from '../models/transaction_model';
import { fireMessaging } from '../config/firebase';
import { ObjectId } from 'bson';
import { TransactionRequest } from '../models/transaction_request';
import { User } from '../models/user_model';
import { Item } from '../models/item_model';

export const getTransactions = async (req: Request, res: Response) => {
    const userID: string = req.body.global_googleUID;

    try {
        const transactions = await transactionCollection.find({
            $or: [{ giverID: userID }, { takerID: userID }]
        }).toArray();

        const userIDs = new Set<string>();
        const itemIDs = new Set<ObjectId>();

        for (const t of transactions) {
            if (!t.giverID || !t.takerID) { continue; }
            userIDs.add(t.giverID);
            userIDs.add(t.takerID);
            itemIDs.add(new ObjectId(t.itemID));
        }

        const usersPromise = userCollection.find({ userID: { $in: Array.from(userIDs) } }).toArray();
        const itemsPromise = itemCollection.find({ _id: { $in: Array.from(itemIDs) } }).toArray();

        const promiseResult: (User[] | Item[])[] = [];

        for await (const subResult of [usersPromise, itemsPromise]) {
            promiseResult.push(subResult);
        }

        const users = promiseResult[0] as User[];
        const items = promiseResult[1] as Item[];

        const transactionRequests: TransactionRequest[] = [];

        for (const t of transactions) {
            const user = users.find(u => u.userID === t.takerID || u.userID === t.giverID);
            const item = items.find(i => i._id ? i._id.toString() === t.itemID : null);

            if (!user || !item) { continue; }
            transactionRequests.push({ ...t, user, item });
        }

        res.json(transactionRequests);
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
        const tokensObj = await tokenCollection.find({ userID: transaction.giverID }).toArray();
        const tokens = tokensObj.map(t => t.token);

        if (tokens.length) {
            const payload = {
                notification: {
                    title: 'Neue Anfrage',
                    body: `${transaction.message}`,
                    icon: 'https://goo.gl/Fz9nrQ'
                }
            }
            await fireMessaging.sendToDevice(tokens, payload);
        }

        await transactionCollection.insertOne({
            itemID,
            startDate: transaction.startDate,
            endDate: transaction.endDate,
            takerID: userID,
            giverID: transaction.giverID,
            message: transaction.message,
            markedAsGiven: false,
            markedAsGivenBack: false,
            markedAsTaken: false,
            markedAsTakenBack: false,
            review: {},
            status: 'pending'
        });
        res.end();
    } catch (e) {
        console.log(e);
        res.status(404).send('Error requesting Item');
    }
}

export const acceptItem = async (req: Request, res: Response) => {
    const userID: string = req.body.global_googleUID;
    const transactionID: string = req.body.transactionID;
    const takerID: string = req.body.takerID;

    try {
        await transactionCollection.updateOne({ _id: new ObjectId(transactionID), giverID: userID }, { $set: { status: 'accepted' } });

        const tokensObj = await tokenCollection.find({ userID: takerID }).toArray();
        const tokens = tokensObj.map(t => t.token);

        if (tokens.length) {
            const payload = {
                notification: {
                    title: 'Deine Anfrage wurde akzeptiert',
                    icon: 'https://goo.gl/Fz9nrQ'
                }
            }
            await fireMessaging.sendToDevice(tokens, payload);
        }

        res.end();
    } catch (e) {
        console.log(e);
        res.status(404).send('Error accepting Item');
    }
}

export const declineItem = async (req: Request, res: Response) => {
    const userID: string = req.body.global_googleUID;
    const transactionID: string = req.body.transactionID;
    const takerID: string = req.body.takerID;

    try {
        await transactionCollection.updateOne({ _id: new ObjectId(transactionID), giverID: userID }, { $set: { status: 'declined' } });

        const tokensObj = await tokenCollection.find({ userID: takerID }).toArray();
        const tokens = tokensObj.map(t => t.token);

        if (tokens.length) {
            const payload = {
                notification: {
                    title: 'Deine Anfrage wurde abgelehnt',
                    icon: 'https://goo.gl/Fz9nrQ'
                }
            }
            await fireMessaging.sendToDevice(tokens, payload);
        }

        res.end();
    } catch (e) {
        console.log(e);
        res.status(404).send('Error declining Item');
    }
}

const makeStateTransitionTransfered = async (userID: string, transactionID: string) => {
    return await transactionCollection.updateOne(
        {
            _id: new ObjectId(transactionID), $or: [{ takerID: userID }, { giverID: userID }],
            status: 'accepted', markedAsGiven: true, markedAsTaken: true
        },
        { $set: { status: 'transfered' } });
}

const makeStateTransitionFinished = async (userID: string, transactionID: string) => {
    return await transactionCollection.updateOne(
        {
            _id: new ObjectId(transactionID), $or: [{ takerID: userID }, { giverID: userID }],
            status: 'transfered', markedAsGivenBack: true, markedAsTakenBack: true
        },
        { $set: { status: 'finished' } });
}

export const markGivenTransaction = async (req: Request, res: Response) => {
    const userID: string = req.body.global_googleUID;
    const transactionID: string = req.body.transactionID;

    try {
        const info = await transactionCollection.updateOne(
            { _id: new ObjectId(transactionID), giverID: userID, status: 'accepted' },
            { $set: { markedAsGiven: true } });

        const stateChange = await makeStateTransitionTransfered(userID, transactionID);

        if (!info.modifiedCount) { throw Error('Transaction was not modified'); }

        res.end();
    } catch (e) {
        console.log(e);
        res.status(404).send('Error giving Item');
    }
}

export const markTakenTransaction = async (req: Request, res: Response) => {
    const userID: string = req.body.global_googleUID;
    const transactionID: string = req.body.transactionID;

    try {
        const info = await transactionCollection.updateOne(
            { _id: new ObjectId(transactionID), takerID: userID, status: 'accepted' },
            { $set: { markedAsTaken: true } });

        const stateChange = await makeStateTransitionTransfered(userID, transactionID);

        if (!info.modifiedCount) { throw Error('Transaction was not modified'); }

        res.end();
    } catch (e) {
        console.log(e);
        res.status(404).send('Error taking Item');
    }
}

export const markGivenBackTransaction = async (req: Request, res: Response) => {
    const userID: string = req.body.global_googleUID;
    const transactionID: string = req.body.transactionID;

    try {
        const info = await transactionCollection.updateOne(
            { _id: new ObjectId(transactionID), takerID: userID, status: 'transfered' },
            { $set: { markedAsGivenBack: true } });

        const stateChange = await makeStateTransitionFinished(userID, transactionID);

        if (!info.modifiedCount) { throw Error('Transaction was not modified'); }

        res.end();
    } catch (e) {
        console.log(e);
        res.status(404).send('Error giving back Item');
    }
}

export const markTakenBackTransaction = async (req: Request, res: Response) => {
    const userID: string = req.body.global_googleUID;
    const transactionID: string = req.body.transactionID;

    try {
        const info = await transactionCollection.updateOne(
            { _id: new ObjectId(transactionID), giverID: userID, status: 'transfered' },
            { $set: { markedAsTakenBack: true } });

        const stateChange = await makeStateTransitionFinished(userID, transactionID);

        if (!info.modifiedCount) { throw Error('Transaction was not modified'); }

        res.end();
    } catch (e) {
        console.log(e);
        res.status(404).send('Error taking back Item');
    }
}

export const revokeTransaction = async (req: Request, res: Response) => {
    const userID: string = req.body.global_googleUID;
    const transactionID: string = req.body.transactionID;

console.log(userID);
console.log(transactionID);


    try {
        const info = await transactionCollection.updateOne(
            { _id: new ObjectId(transactionID), takerID: userID, status: 'pending' },
            { $set: { status: 'revoked' } });

        if (!info.modifiedCount) {
            throw Error('No transaction was modified');
        }

        res.end();
    } catch (e) {
        console.log(e);
        res.status(404).send('Error revoking Item');
    }
}

export const rateTakerTransaction = async (req: Request, res: Response) => {
    const userID: string = req.body.global_googleUID;
    const transactionID: string = req.body.transactionID;
    const takerRating: string = req.body.takerRating;
    const takerComment: string = req.body.takerComment;

    try {
        const info = await transactionCollection.updateOne(
            { _id: new ObjectId(transactionID), takerID: userID, status: 'finished', "review.takerRating": 0 },
            { $set: { review: { takerRating, takerComment } } });

        if (!info.modifiedCount) {
            throw Error('No transaction was modified');
        }

        res.end();
    } catch (e) {
        console.log(e);
        res.status(404).send('Error rating Item');
    }
}

export const rateGiverTransaction = async (req: Request, res: Response) => {
    const userID: string = req.body.global_googleUID;
    const transactionID: string = req.body.transactionID;
    const giverRating: string = req.body.giverRating;
    const giverComment: string = req.body.giverComment;

    try {
        const info = await transactionCollection.updateOne(
            { _id: new ObjectId(transactionID), giverID: userID, status: 'finished', "review.takerRating": 0 },
            { $set: { review: { giverRating, giverComment } } });

        if (!info.modifiedCount) {
            throw Error('No transaction was modified');
        }

        res.end();
    } catch (e) {
        console.log(e);
        res.status(404).send('Error rating Item');
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
