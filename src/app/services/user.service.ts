import { Injectable } from '@angular/core';
import { SERVER_URL } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })

export class UserService {

    constructor(private http){}

    register(userIn: User) {
        const res = this.http.post(SERVER_URL + '/api/newUser', {
            user: userIn
        });
        // TODO Validate Data
        return res;
    }

    login(emailIn: string, passwordIn: string) {
        const res = this.http.post(SERVER_URL + '/api/signin', {
            email: emailIn,
            password: passwordIn
        });
        // TODO Validate Data
        return res;
    }

    getUser(id: string) {
        const res = this.http.get(SERVER_URL + '/api/getUser/' + id );
        // TODO Validate Data to be User
        return res;
    }
}