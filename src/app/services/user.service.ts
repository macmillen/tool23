import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
	constructor(private http: HttpClient, private fireAuth: AngularFireAuth) {}


	/**
    * Registers a user
    * @param user User to register
	* @param password Password string to register with
    * @returns Observable of POST-Method; Error 404 if failed.
    */
	register(user: User, password: string) {
		return this.http.post(environment.SERVER_URL + '/api/register', { user, password });
	}
	/**
    * Signing of a user
    * @param email Email to signin with
	* @param password Password string to signin with
    * @returns Void.
    */
	signin(email: string, password: string) {
		return from(this.fireAuth.auth.signInWithEmailAndPassword(email, password));
	}
	/**
    * Signs out the current user
    * @returns void.
    */
	signOut() {
		return from(this.fireAuth.auth.signOut());
	}

	/**
    * Fetch User from Server
    * @param userID ID of User to search for
	* @returns Observable with user; Error 404 if failed.
    */
	getUser(userID: string) {
		return this.http.get<User>(environment.SERVER_URL + '/api/user/' + userID);
	}

	/**
    * Fetch the current IDToken of user
	* @returns Observable of IT-Token; Null if not registert.
    */
	getIdToken() {
		if (this.fireAuth.auth.currentUser) {
			return from(this.fireAuth.auth.currentUser.getIdToken());
		} else {
			return of(null);
		}
	}

	/**
    * Check if user is authenticated
    * @returns True, if user is authenticated, false if not.
    */
	isAuthenticated() {
		return this.fireAuth.authState.pipe(map(user => (user ? true : false)));
	}

	/**
    * Updates a user
    * @param user User with updated values
    * @returns Observable of PUT-Method; Error 404 if failed.
    */
	updateUser(user: User) {
		return this.http.put(environment.SERVER_URL + '/api/update-user', { user });
	}
}
