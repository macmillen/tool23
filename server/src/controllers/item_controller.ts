import { Request, Response } from 'express';
import { itemCollection } from '../config/mongodb';
import { Item } from '../models/item_model';

export const createItem = async (req: Request, res: Response) => {
    console.log("test");


    res.send('success');
    const userID: string = req.body.global_googleUID;
    await itemCollection.insertOne({
        address:{
            city:'',
            houseNumber:'',
            street:'',
            zip:''
        },
        creationDate:new Date(),
        description:'',
        imageUrl:'',
        tags:[],
        title:'',
        userID: userID});
    
    throw Error('TODO');

    

    // try {
    //     await itemCollection.insertOne({ /* TODO */ });
    //     res.status(201).json({ /* TODO */ });
    // } catch (e) { console.log(e); }
}

export const getItems = async (req: Request, res: Response) => {
    throw Error('TODO');
    
}

export const getItem = async (req: Request, res: Response) => {
    throw Error('TODO');
   
}

export const deleteItem = async (req: Request, res: Response) => {
    throw Error('TODO');
}

