import { Injectable } from '@angular/core';
import axios from 'axios';
import { SERVER_URL } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })

export class UserService {

    async register (userIn: User) {
        const res = await axios.post(SERVER_URL + '/api/newUser', {
            user: userIn
        });
        // TODO Validate Data
        return res;
    }

    async login (emailIn: string, passwordIn: string) {
        const res = await axios.post(SERVER_URL + '/api/signin', {
            email: emailIn,
            password: passwordIn
        });
        // TODO Validate Data
        return res;
    }

    async getUser (id: string): Promise<User>{
        const res = await axios.get(SERVER_URL + '/api/getUser/' + id );
        // TODO Validate Data to be User
        return res.data;
    }
}