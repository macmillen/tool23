import { Request, Response } from 'express';
import { itemCollection } from '../config/mongodb';

export const createItem = async (req: Request, res: Response) => {
    console.log("test");
    res.send('success');
    await itemCollection.insertOne({address:{city:'',houseNumber:'',street:'',zip:''},
    creationDate:new Date(),description:'',imageUrl:'',tags:[],title:'',userID:'penner'});
    
    throw Error('TODO');

    // const userID: string = req.body.global_googleUID;

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

