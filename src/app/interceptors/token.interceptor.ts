import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(public userService: UserService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.userService.getIdToken().pipe(switchMap((token: string) => {
            if (token) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            return next.handle(request);
        }));
    }
}