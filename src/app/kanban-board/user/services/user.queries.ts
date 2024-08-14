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

const REGISTER_USER = gql`
    mutation REGISTER_USER($userDTO: UserDTO!) {
       registerUser(userDTO: $userDTO) {
            userId
            username
            email
            token
            expirationTimeInMilliseconds
        }
    }
`;

export { AUTHENTICATE_USER, REGISTER_USER };