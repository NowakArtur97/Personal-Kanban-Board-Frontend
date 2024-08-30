import UserRole from "./user-role.model";

export default interface User {
    userId: string,
    username: string,
    email: string,
    token: string,
    expirationTimeInMilliseconds: number,
    role: UserRole;
}