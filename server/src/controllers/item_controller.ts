import { Request, Response } from 'express';
import { itemCollection } from '../config/mongodb';
import { Item } from '../models/item_model';
import { ObjectId } from 'bson';

export const createItem = async (req: Request, res: Response) => {
    const userID: string = req.body.global_googleUID;
    let item: Item = req.body.item;
    
    //GeoCoder Usage
    let NodeGeocoder = require('node-geocoder');
    let geocoder = NodeGeocoder({
        provider: 'opencage',
        apiKey: 'a48917e616164965be4cb14a9d3bd734'
      });
    //Generating Address-String for geoCoder
    const   address_string = 
              item.address.street + ' '
            + item.address.houseNumber + ', '
            + item.address.zip + ', '
            + item.address.city;
    geocoder.geocode(address_string, function(err: any, res: any) {
        let geocode = JSON.parse(res);
        console.log(res);
        item.address.latitude = res[0]["latitude"];
		item.address.longitude = res[0]["longitude"];
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

