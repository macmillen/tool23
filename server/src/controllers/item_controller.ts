import { Request, Response } from 'express';
import { itemCollection } from '../config/mongodb';
import { Item } from '../models/item_model';
import { ObjectId } from 'bson';
import { geocoder } from '../config/geocoder';

export const createItem = async (req: Request, res: Response) => {
    const userID: string = req.body.global_googleUID;
    const item: Item = req.body.item;

    //Generating Address-String for geoCoder
//Generating Address-String for geoCoder
    const address_string = 
            item.address.street + ' '
            + item.address.houseNumber + ', '
            + item.address.zip + ', '
            + item.address.city;
    console.log(address_string);
    geocoder.geocode(address_string, function(err: any, resGeo:any[]) {
        resGeo.sort((a ,b) => a.extra.confidence - b.extra.confidence)
        console.log(resGeo);

        if (resGeo.length === 0) {
            console.log("geocode returned 0-Array");
            res.status(522).end('Developer sober\nGeoCode return no values');
            return;
        }
        item.address.longitude = resGeo[0]["longitude"];
        item.address.latitude = resGeo[0]["latitude"];
    });

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

