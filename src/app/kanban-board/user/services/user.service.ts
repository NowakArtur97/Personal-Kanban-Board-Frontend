import { Injectable, inject, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AUTHENTICATE_USER } from './user.queries';
import AuthenticationRequest from '../models/authentication-request.dto';
import User from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private apollo = inject(Apollo);

    #user = signal<User>({
        userId: "",
        username: "",
        email: "",
        token: "",
        expirationTimeInMilliseconds: 0
    });

    user = this.#user.asReadonly();

    loginUser(authenticationRequest: AuthenticationRequest): void {
        this.apollo.watchQuery({
            query: AUTHENTICATE_USER,
            variables: {
                authenticationRequest,
            },
        }).valueChanges.subscribe(({ data, error }: any) => {
            this.#user.set(data.loginUser);
            console.log(this.#user());
        });
    }
}