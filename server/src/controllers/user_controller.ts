import { Request, Response } from 'express';
import { fireAuth } from '../config/firebase';
import { User } from '../models/user_model';
import { userCollection, transactionCollection } from '../config/mongodb';
import { getGeoLocation } from '../config/geocoder';

export const register = async (req: Request, res: Response) => {
    const user: User = req.body.user;
    const password: string = req.body.password;

    const resGeo = await getGeoLocation(user);

    if (!resGeo) {
        res.status(404).end('GeoCode returned no values');
        return;
    }
    user.location = { coordinates: resGeo, type: 'Point' };

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
        if (!user) { throw Error('User not found'); }

        const transactionsGiver = await transactionCollection.find({ giverID: userID }).toArray();
        const transactionsTaker = await transactionCollection.find({ takerID: userID }).toArray();

        let ratingTotalScore = 0;
        let ratingsCount = 0;

        for (const t of transactionsGiver) {
            if (!t.review || !t.review.takerRating) { continue; }
            ratingsCount++;
            ratingTotalScore += t.review.takerRating;
        }
        for (const t of transactionsTaker) {
            if (!t.review || !t.review.giverRating) { continue; }
            ratingsCount++;
            ratingTotalScore += t.review.giverRating;
        }

        const ratingScore = ratingTotalScore / ratingsCount;
        user.reviewScore = ratingScore;
        
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
