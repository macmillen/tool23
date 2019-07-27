import { Request, Response } from 'express';
import { itemCollection } from '../config/mongodb';
import { Item } from '../models/item_model';
import { ObjectId, ObjectID } from 'bson';

export const createItem = async (req: Request, res: Response) => {
    const userID: string = req.body.global_googleUID;
    const item: Item = req.body.item;

    try {
        await itemCollection.insertOne({
            address: item.address,
            creationDate: new Date(),
            description: item.description,
            status: item.status,
            tags: item.tags,
            title: item.title,
            userID
        });
        res.status(201).end();
    } catch (e) {
        console.log(e);
        res.status(404).end('Error creating Item');
    }
}

export const getItems = async (req: Request, res: Response) => {
    const userID: string = req.body.global_googleUID;

    try {
        const items = await itemCollection.find({ userID }).toArray();
        res.status(200).json(items);
    } catch (e) {
        console.log(e);
        res.status(404).end('Error getting Items');
    }
}

export const getItem = async (req: Request, res: Response) => {
    const itemID: string = req.params.itemID;

    try {
        const item = await itemCollection.findOne({ _id: new ObjectId(itemID) });
        res.status(200).json(item);
    } catch (e) {
        console.log(e);
        res.status(404).end('Error getting Item');
    }
}

export const deleteItem = async (req: Request, res: Response) => {
    const userID: string = req.body.global_googleUID;
    const itemID: string = req.params.itemID;

    try {
        const item = await itemCollection.deleteOne({ userID, _id: new ObjectId(itemID) });
        res.status(200).json(item);
    } catch (e) {
        console.log(e);
        res.status(404).end('Error deleting Item');
    }
}

export const updateItem = async (req: Request, res: Response ) => {
    const userID: string = req.body.global_googleUID;
    const item: Item = req.body.item;
    const itemID = item._id;
    delete item._id
    try {
        const i = 
        await itemCollection.updateOne(
            {userID, _id: new ObjectId(itemID)},
            {$set: item}
        )
        console.log(i);
        res.end();
    } catch (e) {
        console.log(e);
        res.status(404).end('Error updating Item');
    }

}

