import { Request, Response, NextFunction } from 'express';
import { fireAuth } from '../config/firebase';

/**
 * takes the auth cookie from header
 * sets user ID and email on req object
 * @param req authorization cookie
 * @param res 
 * @param next 
 */
export let checkAuth = async (req: Request, res: Response, next: NextFunction) => {

    try {
        if (!req.headers.authorization) { return res.status(401).send('You did not send a valid cookie'); }
        const token = req.headers.authorization.split(' ')[1]; // [0] is just the word "Bearer" (convention)
        const decodedToken = await fireAuth.verifyIdToken(token);
        const emailVerified = decodedToken.email_verified;

        if (!emailVerified) {
            // return res.status(401).send('Your must verify your email');
        }

        req.body.global_googleUID = decodedToken.uid;
        req.body.global_email = decodedToken.email;





        // decodedToken:
        // { iss: 'https://securetoken.google.com/mymdb-d5846',
        // aud: 'mymdb-d5846',
        // auth_time: 1556892710,
        // user_id: 'P2FnZy2MA7RBrHgr0pTmXHa1sGq2',
        // sub: 'P2FnZy2MA7RBrHgr0pTmXHa1sGq2',
        // iat: 1556892710,
        // exp: 1556896310,
        // email: 'asd@asd.de',
        // email_verified: false,
        // firebase:
        // { identities: { email: [Array] }, sign_in_provider: 'password' },
        // uid: 'P2FnZy2MA7RBrHgr0pTmXHa1sGq2' }


        return next();
    } catch (error) {
        console.log(error);

        console.log('Auth failed');
        res.status(401).json({ message: 'Auth failed' });
    }
};