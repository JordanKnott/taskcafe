import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { enableMapSet } from 'immer';
import { ApolloLink, Observable, fromPromise } from 'apollo-link';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import weekday from 'dayjs/plugin/weekday';
import { getAccessToken, getNewToken, setAccessToken } from 'shared/utils/accessToken';
import cache from './App/cache';
import App from './App';

// https://able.bio/AnasT/apollo-graphql-async-access-token-refresh--470t1c8

dayjs.extend(isSameOrAfter);

dayjs.extend(weekday);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);
enableMapSet();

dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  week: {
    dow: 1, // First day of week is Monday
    doy: 7, // First week of year must contain 1 January (7 + 1 - 1)
  },
});

let forward$;
let isRefreshing = false;
let pendingRequests: any = [];

const refreshAuthLogic = (failedRequest: any) =>
  axios.post('/auth/refresh_token', {}, { withCredentials: true }).then(tokenRefreshResponse => {
    setAccessToken(tokenRefreshResponse.data.accessToken);
    failedRequest.response.config.headers.Authorization = `Bearer ${tokenRefreshResponse.data.accessToken}`;
    return Promise.resolve();
  });

createAuthRefreshInterceptor(axios, refreshAuthLogic);

const resolvePendingRequests = () => {
  pendingRequests.map((callback: any) => callback());
  pendingRequests = [];
};

const resolvePromise = (resolve: () => void) => {
  pendingRequests.push(() => resolve());
};

const resetPendingRequests = () => {
  pendingRequests = [];
};

const setRefreshing = (newVal: boolean) => {
  isRefreshing = newVal;
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions && err.extensions.code) {
        switch (err.extensions.code) {
          case 'UNAUTHENTICATED':
            if (!isRefreshing) {
              setRefreshing(true);
              forward$ = fromPromise(
                getNewToken()
                  .then((response: any) => {
                    setAccessToken(response.accessToken);
                    resolvePendingRequests();
                    return response.accessToken;
                  })
                  .catch(() => {
                    resetPendingRequests();
                    // TODO
                    // Handle token refresh errors e.g clear stored tokens, redirect to login, ...
                    return undefined;
                  })
                  .finally(() => {
                    setRefreshing(false);
                  }),
              ).filter(value => Boolean(value));
            } else {
              forward$ = fromPromise(new Promise(resolvePromise));
            }
            return forward$.flatMap(() => forward(operation));
          default:
          // pass
        }
      }
    }
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`); // eslint-disable-line no-console
  }
  return undefined;
});

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer: any) => {
      let handle: any;
      Promise.resolve(operation)
        .then((op: any) => {
          const accessToken = getAccessToken();
          if (accessToken) {
            op.setContext({
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
        if (handle) {
          handle.unsubscribe();
        }
      };
    }),
);

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(
          ({ message, locations, path }) =>
            console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`), // eslint-disable-line no-console
        );
      }
      if (networkError) {
        console.log(`[Network error]: ${networkError}`); // eslint-disable-line no-console
      }
    }),
    errorLink,
    requestLink,
    new HttpLink({
      uri: '/graphql',
      credentials: 'same-origin',
    }),
  ]),
  cache,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);
