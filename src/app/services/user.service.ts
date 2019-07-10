import { Injectable } from '@angular/core';
import { SERVER_URL } from '../../environments/environment';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })

export class UserService {

    constructor(private http: HttpClient) {}

    register(userIn: User) {
        return this.http.post(SERVER_URL + '/api/newUser', {
            user: userIn
        });
    }

    login(emailIn: string, passwordIn: string) {
        return this.http.post(SERVER_URL + '/api/signin', {
            email: emailIn,
            password: passwordIn
        });
    }

    getUser(id: string) {
        return this.http.get<User>(SERVER_URL + '/api/getUser/' + id );
    }
}