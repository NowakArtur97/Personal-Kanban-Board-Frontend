import { Injectable, inject, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AUTHENTICATE_USER, REGISTER_USER } from './user.queries';
import AuthenticationRequest from '../models/authentication-request.dto';
import User from '../models/user.model';
import UserDTO from '../models/user.dto';
import { ApolloError } from '@apollo/client';
import { Router } from '@angular/router';
import { PATHS } from '../../../app.routes';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly ERROR_MESSAGE_DIVIDER = "\n";

    private apollo = inject(Apollo);
    private router = inject(Router);

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
        }).valueChanges.subscribe(({ data }: any) =>
            this.handleUserResponse(data.loginUser),
            (error: ApolloError) =>
                this.#errors.set(error.message.split(this.ERROR_MESSAGE_DIVIDER))
        );
    }

    registerUser(userDTO: UserDTO): void {
        this.apollo.mutate({
            mutation: REGISTER_USER,
            variables: {
                userDTO,
            },
        }).subscribe(({ data }: any) => this.handleUserResponse(data.registerForm), (error: ApolloError) =>
            this.#errors.set(error.message.split(this.ERROR_MESSAGE_DIVIDER))
        );
    }

    private handleUserResponse(userData: User) {
        this.#user.set(userData);
        this.router.navigate([PATHS.KANBAN_BOARD]);
        console.log(this.#user());
    }

    resetErrorMessages = (): void => this.#errors.set([]);
}