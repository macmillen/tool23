import { Request, Response } from 'express';
import { fireAuth } from '../config/firebase';
import { User } from '../models/user_model';
import { userCollection } from '../config/mongodb';
import { getGeoLocation } from '../config/geocoder';

export const register = async (req: Request, res: Response) => {
    const user: User = req.body.user;
    const password: string = req.body.password;

    const resGeo = await getGeoLocation(user);

    if (resGeo.length === 0) {
        console.log("geocode returned 0-Array");
        res.status(404).end('Developer sober\nGeoCode return no values');
        return;
    }
    user.address.longitude = resGeo[0]["longitude"];
    user.address.latitude = resGeo[0]["latitude"];


    try {
        const newUser = await fireAuth.createUser({
            email: user.email,
            password,
            emailVerified: false
        });
        await userCollection.insertOne({
            ...user,
            reviewScore: 0,
            userID: newUser.uid
        });

        res.end();
    } catch (e) {
        console.log(e);
        res.status(400).end('Error registering User');
    }

};

export const getUser = async (req: Request, res: Response) => {
    let userID: string = req.params.userID;
    if (userID === '0') {
        userID = req.body.global_googleUID;
    }

    try {
        const user = await userCollection.findOne({ userID });

        res.json(user);
    } catch (e) {
        console.log(e);
        res.status(400).end('Error registering User');
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const user: User = req.body.user;
    const userID = req.body.global_googleUID;
    const updatedData = {
        username: user.username,
        address: user.address
    };

    try {
        await userCollection.updateOne({ userID }, { $set: updatedData });
        res.end();
    } catch (e) {
        console.log(e);
        res.status(400).end('Error updating User');
    }
};
