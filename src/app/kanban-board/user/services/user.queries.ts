import { gql } from 'apollo-angular';

const AUTHENTICATE_USER = gql`
    query AUTHENTICATE_USER($authenticationRequest: AuthenticationRequest!) {
        loginUser(authenticationRequest: $authenticationRequest) {
            userId
            username
            email
            token
            expirationTimeInMilliseconds
            role
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
            role
        }
    }
`;

const FIND_ALL_USERS = gql`
    query FIND_ALL_USERS {
        users {
            userId
            username
        }
    }
`;

export { AUTHENTICATE_USER, REGISTER_USER, FIND_ALL_USERS };