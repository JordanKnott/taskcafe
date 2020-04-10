import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable, fromPromise } from 'apollo-link';

import { getAccessToken, getNewToken, setAccessToken } from 'shared/utils/accessToken';

import App from './App';

// https://able.bio/AnasT/apollo-graphql-async-access-token-refresh--470t1c8

let isRefreshing = false;
let pendingRequests: any = [];

const resolvePendingRequests = () => {
  pendingRequests.map((callback: any) => callback());
  pendingRequests = [];
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      switch (err!.extensions!.code) {
        case 'UNAUTHENTICATED':
          // error code is set to UNAUTHENTICATED
          // when AuthenticationError thrown in resolver
          let forward$;

          if (!isRefreshing) {
            isRefreshing = true;
            forward$ = fromPromise(
              getNewToken()
                .then((response: any) => {
                  // Store the new tokens for your auth link
                  setAccessToken(response.accessToken);
                  resolvePendingRequests();
                  return response.accessToken;
                })
                .catch((error: any) => {
                  pendingRequests = [];
                  // TODO
                  // Handle token refresh errors e.g clear stored tokens, redirect to login, ...
                  return;
                })
                .finally(() => {
                  isRefreshing = false;
                }),
            ).filter(value => Boolean(value));
          } else {
            // Will only emit once the Promise is resolved
            forward$ = fromPromise(
              new Promise(resolve => {
                pendingRequests.push(() => resolve());
              }),
            );
          }

          return forward$.flatMap(() => forward(operation));
        default:
        // pass
      }
    }
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
    // if you would also like to retry automatically on
    // network errors, we recommend that you use
    // apollo-link-retry
  }
});

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer: any) => {
      let handle: any;
      Promise.resolve(operation)
        .then((operation: any) => {
          const accessToken = getAccessToken();
          if (accessToken) {
            operation.setContext({
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
          }
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    }),
);

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    errorLink,
    requestLink,
    new HttpLink({
      uri: 'http://localhost:3333/graphql',
      credentials: 'same-origin',
    }),
  ]),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);
