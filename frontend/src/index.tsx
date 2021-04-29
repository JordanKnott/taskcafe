import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

import { enableMapSet } from 'immer';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import weekday from 'dayjs/plugin/weekday';
import cache from './App/cache';
import App from './App';

// https://able.bio/AnasT/apollo-graphql-async-access-token-refresh--470t1c8

enableMapSet();

dayjs.extend(isSameOrAfter);
dayjs.extend(weekday);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  week: {
    dow: 1, // First day of week is Monday
    doy: 7, // First week of year must contain 1 January (7 + 1 - 1)
  },
});

const client = new ApolloClient({ uri: '/graphql', cache });
console.log('cloient', client);

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);
