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
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import log from 'loglevel';
import remote from 'loglevel-plugin-remote';
import cache from './App/cache';
import App from './App';

if (process.env.REACT_APP_NODE_ENV === 'production') {
  remote.apply(log, { format: remote.json });
  switch (process.env.REACT_APP_LOG_LEVEL) {
    case 'info':
      log.setLevel(log.levels.INFO);
      break;
    case 'debug':
      log.setLevel(log.levels.DEBUG);
      break;
    default:
      log.setLevel(log.levels.ERROR);
  }
}

enableMapSet();

dayjs.extend(isSameOrAfter);
dayjs.extend(weekday);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);
dayjs.extend(updateLocale);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.updateLocale('en', {
  week: {
    dow: 1, // First day of week is Monday
    doy: 7, // First week of year must contain 1 January (7 + 1 - 1)
  },
});

const client = new ApolloClient({ uri: '/graphql', cache });

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);
