import { Request, Response } from 'express';
import { fireAuth } from '../config/firebase';
import { User } from '../models/user_model';
import { userCollection } from '../config/mongodb';
import { geocoder } from '../config/geocoder';

export const register = async (req: Request, res: Response) => {
    const user: User = req.body.user;
    const password: string = req.body.password;

    //GeoCoder Usage
    //Generating Address-String for geoCoder
    const address_string =
        user.address.street + ' '
        + user.address.houseNumber + ', '
        + user.address.zip + ', '
        + user.address.city;
    geocoder.geocode(address_string, async (err: any, resGeo: any[]) =>{
        resGeo.sort((a, b) => b.extra.confidence - a.extra.confidence)
        console.log(resGeo);

        if (resGeo.length === 0) {
            console.log("geocode returned 0-Array");
            res.status(522).end('Developer sober\nGeoCode return no values');
            return;
        }
        user.address.latitude = resGeo[0]["latitude"];
        user.address.longitude = resGeo[0]["longitude"];
        
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
    });

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
