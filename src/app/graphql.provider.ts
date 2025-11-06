import { APOLLO_OPTIONS, APOLLO_NAMED_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, split } from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { inject } from '@angular/core';
import { environment } from '../environments/environment';
import { UserService } from './kanban-board/user/services/user.service';

const uri = `${environment.backendURL}/graphql`;
const wsURL = environment.wsURL;

export const APOLLO_PROVIDERS = [
  {
    provide: APOLLO_OPTIONS,
    useFactory: () => {
      const userService = inject(UserService);
      const httpLink = inject(HttpLink);

      const baseHttp = httpLink.create({
        uri,
      });

      const authLink = setContext(() => {
        const token = userService.user().token;
        return {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        };
      });

      const wsLink = new GraphQLWsLink(
        createClient({
          url: wsURL,
          lazy: true,
          retryAttempts: Infinity,
          connectionParams: () => {
            const token = userService.user().token;
            return token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {};
          },
        })
      );

      // --- Split link: subscriptions → WS, otherwise → HTTP
      const splitLink = split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return (
            def.kind === 'OperationDefinition' &&
            def.operation === 'subscription'
          );
        },
        wsLink,
        authLink.concat(baseHttp)
      );

      return {
        link: splitLink,
        cache: new InMemoryCache(),
      };
    },
  },
  {
    provide: APOLLO_NAMED_OPTIONS,
    useFactory: () => {
      const httpLink = inject(HttpLink);
      const publicHttp = httpLink.create({
        uri,
      });
      return {
        public: {
          link: publicHttp,
          cache: new InMemoryCache(),
        },
      };
    },
  },
];
