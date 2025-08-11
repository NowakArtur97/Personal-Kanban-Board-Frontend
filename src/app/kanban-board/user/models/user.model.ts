import UserRole from './user-role.model';

export default interface User {
  readonly userId: string;
  readonly username: string;
  readonly email: string;
  readonly token: string;
  readonly expirationTimeInMilliseconds: number;
  readonly role: UserRole;
}
