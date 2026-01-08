import { Injectable, Injector, inject, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  AUTHENTICATE_USER,
  FIND_ALL_USERS,
  REGISTER_USER,
} from './user.queries';
import AuthenticationRequest from '../models/authentication-request.dto';
import User from '../models/user.model';
import UserDTO from '../models/user.dto';
import { ApolloError } from '@apollo/client';
import { Router } from '@angular/router';
import { PATHS } from '../../../app.routes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, EMPTY, Observable } from 'rxjs';
import UserRole from '../models/user-role.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly ERROR_MESSAGE_DIVIDER = '\n';

  private apollo: Apollo | undefined;
  private injector = inject(Injector);
  private router = inject(Router);
  private httpClient = inject(HttpClient);

  #user = signal<User>({
    userId: '',
    username: '',
    email: '',
    token: '',
    expirationTimeInMilliseconds: 0,
    role: UserRole.ANONYMOUS,
  });
  #users = signal<User[]>([]);
  #errors = signal<string[]>([]);

  user = this.#user.asReadonly();
  users = this.#users.asReadonly();
  errors = this.#errors.asReadonly();

  loginUser(authenticationRequest: AuthenticationRequest): void {
    this.getApollo()
      .use('public')
      .query({
        query: AUTHENTICATE_USER,
        variables: {
          authenticationRequest,
        },
        context: {
          clientName: 'public',
        },
        fetchPolicy: 'network-only',
      })
      .pipe(catchError((error: ApolloError) => this.handleErrors(error)))
      .subscribe(({ data }: any) => this.handleUserResponse(data.loginUser));
  }

  registerUser(userDTO: UserDTO): void {
    this.getApollo()
      .use('public')
      .mutate({
        mutation: REGISTER_USER,
        variables: {
          userDTO,
        },
        context: {
          clientName: 'public',
        },
      })
      .pipe(catchError((error: ApolloError) => this.handleErrors(error)))
      .subscribe(({ data }: any) => this.handleUserResponse(data.registerUser));
  }

  findAllUsers(): void {
    this.getApollo()
      .query({
        query: FIND_ALL_USERS,
        context: {
          headers: this.createAuthorizationHeader(),
        },
        fetchPolicy: 'network-only',
      })
      .subscribe(({ data }: any) => this.handleUsersResponse(data.users));
  }

  private handleUserResponse(userData: User): void {
    this.#user.set(userData);
    this.router.navigate([PATHS.KANBAN_BOARD]);
  }

  private handleUsersResponse = (usersData: User[]): void =>
    this.#users.set(usersData);

  private getApollo(): Apollo {
    if (!this.apollo) {
      this.apollo = this.injector.get(Apollo);
    }
    return this.apollo;
  }

  isUsernameAndEmailAvailable = (
    username: string,
    email: string
  ): Observable<boolean> =>
    this.httpClient.get<boolean>(
      `${environment.backendURL}/api/v1/user-data-validator`,
      { params: { username, email } }
    );

  resetErrorMessages = (): void => this.#errors.set([]);

  addError(error: string): void {
    if (!this.#errors().includes(error)) {
      this.#errors.set([...this.#errors(), error]);
    }
  }

  removeError(error: string): void {
    if (this.#errors().includes(error)) {
      this.#errors.set(this.#errors().filter((e) => e !== error));
    }
  }

  createAuthorizationHeader = (): HttpHeaders =>
    new HttpHeaders().set('Authorization', 'Bearer ' + this.user().token);

  private handleErrors(error: ApolloError): any {
    this.#errors.set(error.message.split(this.ERROR_MESSAGE_DIVIDER));
    return EMPTY;
  }
}
