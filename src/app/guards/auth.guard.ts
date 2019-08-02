
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { NavController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
/**
 * Guard to check if user is authenticated and allowed to use app
 */
export class AuthGuard implements CanActivate {

    constructor(private navController: NavController, private userService: UserService) { }

    /**
     * Checks if user is authenticated and allowed to use app, or if he needs to register
     */
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.userService.isAuthenticated().pipe(map((isAuth) => {
            if (isAuth) {
                return true;
            } else {
                this.navController.navigateRoot('/signup');
                return false;
            }
        }));
    }

}