import { Request, Response } from 'express';
import { itemCollection, userCollection } from '../config/mongodb';
import { Item } from '../models/item_model';
import { ObjectId } from 'bson';
import { getGeoLocation } from '../config/geocoder';

const calculateDistance = (lat1: number, lat2: number, long1: number, long2: number): number => {
    const p = 0.017453292519943295;    // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat1 - lat2) * p) / 2 + c(lat2 * p) * c((lat1) * p) * (1 - c(((long1 - long2) * p))) / 2;
    const dist = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    return dist;
}

export const searchItems = async (req: Request, res: Response) => {
    const userID: string = req.body.global_googleUID;
    const searchString: string = req.body.searchString;

    const user = await userCollection.findOne({ userID });

    if (!user || !user.address.latitude || !user.address.longitude) {
        res.status(404).send('User not found');
        return;
    }

    const items = await itemCollection.aggregate([
        { $addFields: { dist: calculateDistance(user.address.latitude, 1, 1, 1) } },
        // { $match: {} }
    ]);

    console.log(items);
    

}

export const createItem = async (req: Request, res: Response) => {
    const userID: string = req.body.global_googleUID;
    const item: Item = req.body.item;

    const resGeo = await getGeoLocation(item);

    if (resGeo.length === 0) {
        console.log("geocode returned 0-Array");
        res.status(404).end('Developer sober\nGeoCode return no values');
        return;
    }
    item.address.longitude = resGeo[0]["longitude"];
    item.address.latitude = resGeo[0]["latitude"];

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

