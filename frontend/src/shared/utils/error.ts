import { ApolloError } from '@apollo/client';

export default function hasNotFoundError(...errors: Array<ApolloError | undefined>) {
  for (const error of errors) {
    if (error && error.graphQLErrors.length !== 0) {
      const notFound = error.graphQLErrors.find(e => e.extensions && e.extensions.code === '404');
      if (notFound) {
        return true;
      }
    }
  }
  return false;
}
