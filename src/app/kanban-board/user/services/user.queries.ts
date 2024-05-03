import { gql } from 'apollo-angular';

const AUTHENTICATE_USER = gql`
    query AUTHENTICATE_USER($authenticationRequest: AuthenticationRequest!) {
        loginUser(authenticationRequest: $authenticationRequest) {
            userId
            username
            email
            token
            expirationTimeInMilliseconds
        }
    }
`;

export { AUTHENTICATE_USER };