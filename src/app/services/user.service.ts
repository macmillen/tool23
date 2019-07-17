import { Injectable } from '@angular/core';
import { SERVER_URL } from '../../environments/environment';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
	constructor(private http: HttpClient, private fireAuth: AngularFireAuth) {}

	register(user: User, password: string) {
		return this.http.post(SERVER_URL + '/api/register', { user, password });
	}

	signin(email: string, password: string) {
		return from(this.fireAuth.auth.signInWithEmailAndPassword(email, password));
	}

	signOut() {
		return from(this.fireAuth.auth.signOut());
	}

	getUser(userID: string) {
		return this.http.get<User>(SERVER_URL + '/api/user/' + userID);
	}

	getIdToken() {
		if (this.fireAuth.auth.currentUser) {
			return from(this.fireAuth.auth.currentUser.getIdToken());
		} else {
			return of(null);
		}
	}

	isAuthenticated() {
		return this.fireAuth.authState.pipe(map(user => (user ? true : false)));
	}

	updateUser(user: User) {
		return this.http.put(SERVER_URL + '/api/update-user', { user });
	}
}
