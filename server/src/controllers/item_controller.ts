import { Request, Response } from 'express';
import { itemCollection, userCollection } from '../config/mongodb';
import { Item } from '../models/item_model';
import { ObjectId } from 'bson';
import { getGeoLocation } from '../config/geocoder';

export const getTags = async (req: Request, res: Response) => {
    const tags = (await itemCollection.aggregate([
        {
            "$group": {
                "_id": 0,
                "tags": { "$push": "$tags" }
            }
        },
        {
            "$project": {
                "tags": {
                    "$reduce": {
                        "input": "$tags",
                        "initialValue": [],
                        "in": { "$setUnion": ["$$value", "$$this"] }
                    }
                }
            }
        }
    ]).toArray() as any[])[0].tags;

    res.json(tags);
};

export const searchItems = async (req: Request, res: Response) => {
    const userID: string = req.body.global_googleUID;
    const searchString: string = req.params.searchString;

    const user = await userCollection.findOne({ userID });

    if (!user) {
        res.status(404).send('User not found');
        return;
    }

    const items = await itemCollection.aggregate([{
        $geoNear: {
            near: user.location,
            distanceField: "distance",
            //maxDistance: 2,
            query: {
                status: "active",
                userID: { $ne: user.userID },
                $or: [
                    { title: { $regex: `.*${searchString}.*`, $options: 'i' } },
                    { tags: { $regex: `.*${searchString}.*`, $options: 'i' } }
                ]
            },
            num: 10, // limit
            spherical: true
        }
    }]).toArray();

    res.json(items);

}

export const createItem = async (req: Request, res: Response) => {
    const userID: string = req.body.global_googleUID;
    const item: Item = req.body.item;

    const resGeo = await getGeoLocation(item);

    if (!resGeo) {
        res.status(404).end('GeoCode returned no values');
        return;
    }
    item.location = { coordinates: resGeo, type: 'Point' };

    try {
        await itemCollection.insertOne({
            address: item.address,
            creationDate: new Date(),
            description: item.description,
            status: item.status,
            tags: item.tags,
            title: item.title,
            userID,
            location: item.location
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

