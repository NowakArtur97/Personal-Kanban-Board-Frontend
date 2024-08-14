export default interface User {
    userId: string,
    username: string,
    email: string,
    token: string,
    expirationTimeInMilliseconds: number,
}