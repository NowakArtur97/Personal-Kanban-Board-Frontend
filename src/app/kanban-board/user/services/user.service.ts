import { Injectable, signal } from '@angular/core';
import User from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    #user = signal<User>({
        userId: "01f1a70a-8cf7-400c-9661-355f47ec6af5",
        username: "user",
        email: "user@domain.com"
    });

    user = this.#user.asReadonly();
}