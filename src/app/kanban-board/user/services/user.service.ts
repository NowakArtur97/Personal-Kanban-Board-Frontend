import { Injectable, inject, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AUTHENTICATE_USER, REGISTER_USER } from './user.queries';
import AuthenticationRequest from '../models/authentication-request.dto';
import User from '../models/user.model';
import UserDTO from '../models/user.dto';
import { ApolloError } from '@apollo/client';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly ERROR_MESSAGE_DIVIDER = "\n";

    private apollo = inject(Apollo);

    #user = signal<User>({
        userId: "",
        username: "",
        email: "",
        token: "",
        expirationTimeInMilliseconds: 0
    });
    #errors = signal<string[]>([]);

    user = this.#user.asReadonly();
    errors = this.#errors.asReadonly();

    loginUser(authenticationRequest: AuthenticationRequest): void {
        this.apollo.watchQuery({
            query: AUTHENTICATE_USER,
            variables: {
                authenticationRequest,
            },
        }).valueChanges.subscribe(({ data }: any) => {
            this.#user.set(data.loginUser);
            console.log(this.#user());
        }, (error: ApolloError) =>
            this.#errors.set(error.message.split(this.ERROR_MESSAGE_DIVIDER))
        );
    }

    registerUser(userDTO: UserDTO): void {
        this.apollo.mutate({
            mutation: REGISTER_USER,
            variables: {
                userDTO,
            },
        }).subscribe(({ data }: any) => {
            this.#user.set(data.registerUser);
            console.log(this.#user());
        }, (error: ApolloError) =>
            this.#errors.set(error.message.split(this.ERROR_MESSAGE_DIVIDER))
        );
    }
}